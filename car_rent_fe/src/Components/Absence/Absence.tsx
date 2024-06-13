import {
    Box,
    Button, Card, CardContent, Container, Dialog, DialogTitle,
    FormControl,
    Grid,
    InputLabel, MenuItem,
    Select, Stack, TextField, Typography, DialogActions, DialogContent, Alert, AlertTitle,
} from '@mui/material';
import React, {useState} from 'react';
import {AvailableDate} from "../../MOdel/ServiceBeuaty";
import {useQuery} from "@tanstack/react-query";
import {apiService} from "../ApiService";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import {DatePicker, DateTimePicker, StaticTimePicker, TimePicker} from "@mui/x-date-pickers";
import {Dayjs} from "dayjs";
import {AppointmentDetails} from "../../MOdel/AppointmetsModel";
import {getUserId} from "../../keycloak";
import {EmployeeUserDto} from "../CustomerList/Customers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

interface AbsenceProps {
    // Define additional props here if needed
}


const Absence: React.FC<AbsenceProps> = () => {
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>();
    const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
    const [servicesTestHOURS, setServicesTestHOURS] = useState<string>('');
    const [numberClient, setNumberClient] = useState('')
    const [selectedHours, setSelectedHours] = useState<{ [key: number]: string }>({});
    const [selectedId, setSelectedId] = useState('')
    const [selectedIdEmployee, setSelectedIdEmployee] = useState<number>()
    const [selectedHour, setSelectedHour] = useState('')
    const [open, setOpen] = useState<boolean>(false);

    function convertToDDMMYYYY(dateInput: any) {
        const dateStr = String(dateInput).replace(/\+/g, ' ');
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, +1 to correct
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }
    const formatHour = (date: Date | null): string => {
        if (!date) return '';
        const hours = date.getHours();
        return `0${hours}:00:00`;
    };
    const id = getUserId();

    const {
        data: futureVisits,
        isLoading,
        isError,
        error,
    } = useQuery<EmployeeUserDto, Error>({
        queryKey: ['getEmployeeByUserId'],
        queryFn: () => apiService.getEmployeeByUserId(id)
    });
    if (isLoading) {
        return <div>Ładowanie...</div>;
    }

    if (isError) {
        return (
            <Alert severity="error" action={
                <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                    Spróbuj ponownie
                </Button>
            }>
                <AlertTitle>Wystąpił błąd</AlertTitle>
                Wystąpił wewnętrzny problem!
            </Alert>
        );
    }

    const addReservation = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const appointmentnew = {
            employee: {
                id: futureVisits?.id,
            },
            date: convertToDDMMYYYY(selectedDate),
            duration: `${servicesTestHOURS}`,
            time: `${formatHour(selectedTime)}`,
            status: 'ABSENCE',
        }
        try {
            const response = await apiService.addAbsence(appointmentnew);

        } catch (error) {
            console.error("Błąd pobierania dostępnych dat:", error);
        }

    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (

        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Dodaj nieobecność
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Dodaj nieobecność</DialogTitle>
                <DialogContent>
                    <form>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                            <DatePicker
                                label="Data"
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                            />


                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDateFns} >
                            <StaticTimePicker
                                className='input'
                                onChange={(time) => setSelectedTime(time)}
                                value={selectedTime}
                            />
                        </LocalizationProvider>


                        <FormControl fullWidth>
                            <InputLabel id="duration-label">Duration</InputLabel>
                            <Select
                                labelId="duration-label"
                                id="duration-select"
                                value={servicesTestHOURS}
                                label="Duration"
                                onChange={(e) => setServicesTestHOURS(e.target.value as string)}
                            >
                                <MenuItem value={'PT1H'}>1 h</MenuItem>
                                <MenuItem value={'PT2H'}>2 h</MenuItem>
                                <MenuItem value={'PT3H'}>3 h</MenuItem>
                                <MenuItem value={'PT4H'}>4 h</MenuItem>
                                <MenuItem value={'PT5H'}>5 h</MenuItem>
                                <MenuItem value={'PT6H'}>6 h</MenuItem>
                                <MenuItem value={'PT7H'}>7 h</MenuItem>
                                <MenuItem value={'PT8H'}>8 h</MenuItem>
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="contained" onClick={addReservation}>
                            Dodaj
                        </Button>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Absence;
