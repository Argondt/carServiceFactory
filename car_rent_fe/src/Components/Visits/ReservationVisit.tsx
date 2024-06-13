import {
    Box,
    Button, Card, CardContent, CircularProgress,
    FormControl,
    Grid,
    InputLabel, MenuItem,
    Select, Stack, TextField, Typography
} from '@mui/material';
import React, {useState} from 'react';
import {AvailableDate} from "../../MOdel/ServiceBeuaty";
import {useQuery} from "@tanstack/react-query";
import {apiService} from "../ApiService";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import {DatePicker} from "@mui/x-date-pickers";
import {Dayjs} from "dayjs";
import {UserRegisterForm} from "../users/UserRegisterForm";

// import any = jasmine.any;

interface CreateTaskParams {
    selectedDate1: any; // Replace 'any' with a more specific type if possible
    selectedId1: any;   // Replace 'any' with a more specific type if possible
}

interface EmployeeDTO {
    id: number;
    firstName: string;
    lastName: string;
}

const ReservationVisit = () => {
    const [servicesTest, setServicesTest] = useState('')
    const [servicesTestHOURS, setServicesTestHOURS] = useState<string | null>(null);
    type EmployeeState = EmployeeDTO | string | number | null;
    const [servicesTestEmployee, setServicesTestEmployee] = useState<EmployeeDTO | null>(null);
    const [selectedHours, setSelectedHours] = useState<{ [key: number]: string }>({});

    const [serviceDates, setServiceDates] = useState<AvailableDate[]>([]); // Ustawienie początkowe jako pusta tablica
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>();
    const [selectedId, setSelectedId] = useState('')
    const [selectedIdEmployee, setSelectedIdEmployee] = useState<number>()
    const [selectedHour, setSelectedHour] = useState('')
    const [isHourSelected, setHourSelected] = useState(false);
    const [numberClient, setNumberClient] = useState('')
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [searchButtonVisible, setSearchButtonVisible] = useState(true); // For controlling the visibility of the search button

    const {
        data: projekty, isPending, isError, error
    }
        = useQuery({
        queryKey: ['projekty'],
        queryFn: () => apiService.getAllService({page: 0, size: 10})
    });

    function convertToDDMMYYYY(dateInput: any) {
        // Convert to string if it's not already a string
        const dateStr = String(dateInput).replace(/\+/g, ' ');

        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, +1 to correct
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }


    const fetchClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const response = await apiService.getAvailableDates(selectedId, convertToDDMMYYYY(selectedDate));
            setServiceDates(response);
        } catch (error) {
            console.error("Error fetching available dates:", error);
        }
    };
    const [customerNotFound, setCustomerNotFound] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const searchCustomerByNumber = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const response = await apiService.searchCustomerByNumber(numberClient);
            if (!response.id) {
                setCustomerNotFound(true);
                setSnackbarMessage("Customer not found, please add.");
                setSnackbarOpen(true);
            } else {
                setCustomerNotFound(false);
                setSnackbarMessage("Customer found.");
                setSnackbarOpen(true);
                setInputDisabled(true); // Disable input after successful registration
                setSearchButtonVisible(true);
            }
        } catch (error) {
            setCustomerNotFound(true);
            setDrawerOpen(true);

            console.error("Error fetching customer:", error);
        }
    };

    if (isPending) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress/>
                <Typography variant="h6" sx={{ml: 2}}>Ładowanie danych użytkowników...</Typography>
            </Box>
        );
    }
    if (isError) {
        return (
            <Box sx={{textAlign: 'center'}}>
                <Typography variant="h6" color="error">
                    Wystąpił błąd przy pobieraniu danych użytkowników: {error?.message}
                </Typography>
                <Button variant="contained" color="primary" sx={{mt: 2}}>
                    Spróbuj ponownie
                </Button>
            </Box>
        );
    }


    const handleHourChange = (employeeId: number, selectedHour: string) => {
        setSelectedHours(prevHours => ({...prevHours, [employeeId]: selectedHour}));
        setSelectedIdEmployee(employeeId)
        setSelectedHour(selectedHour)
        setHourSelected(Object.values({...selectedHours, [employeeId]: selectedHour}).some(h => h !== ''));
    };
    const addReservation = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const appointmentnew = {

            customerId: numberClient,
            employeeId: selectedIdEmployee,
            serviceId: selectedId,
            date: convertToDDMMYYYY(selectedDate),
            time: selectedHour,
            appointmentStatus:"APPOINTED"
        }
        try {
            const response = await apiService.addNewAppointment(appointmentnew);
        } catch (error) {
            console.error("Error fetching available dates:", error);
        }

    }
    const handleUserRegistrationClose = (isRegistered: boolean) => {
        if (isRegistered) {
            setCustomerNotFound(false);
            setDrawerOpen(false);
            setInputDisabled(true); // Disable input after successful registration
            setSearchButtonVisible(true); // Optionally show the button again if needed
        } else {
            setDrawerOpen(false);
        }
    };
    return (
        <>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{
                    backgroundColor: '#f3f0ec',
                    padding: '20px',
                    borderRadius: '8px',
                    minHeight: '100vh',
                }}
            >
                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <Box
                        className="form"
                        sx={{
                            margin: 'auto',
                            padding: '20px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            maxWidth: '500px',
                        }}
                    >
                        <Typography variant="h2" align="center" sx={{mb: 2}}>Rezerwacja</Typography>

                        {/* Service selection */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="service-label">Usługa</InputLabel>
                            <Select
                                labelId="service-label"
                                label="Usługa"
                                value={selectedId}
                                onChange={(e) => {
                                    setSelectedId(e.target.value as string)
                                }}
                            >
                                <MenuItem value=""><em>Usługa</em></MenuItem>
                                {projekty.content.map((projekt) => (
                                    <MenuItem key={projekt.id} value={projekt.id}>{projekt.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Date picker */}
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                            <DatePicker
                                label="Data"
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                            />
                        </LocalizationProvider>

                        {/* Search button */}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={fetchClick}
                            sx={{mt: 2, width: '100%'}}
                        >
                            Szukaj
                        </Button>

                        {/* Service dates */}
                        {serviceDates.map((date, index) => (
                            <Card key={index} variant="outlined" sx={{mt: 2, mb: 2}}>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        Pracownik: {date.employee.firstName} {date.employee.lastName}
                                    </Typography>
                                    <FormControl fullWidth sx={{mt: 2}}>
                                        <Select
                                            labelId={`hour-label-${index}`}
                                            value={selectedHours[date.employee.id] || ''}
                                            onChange={(e) => {
                                                handleHourChange(date.employee.id, e.target.value)
                                            }}
                                            displayEmpty
                                            inputProps={{'aria-label': 'Wybierz godzinę'}}
                                        >
                                            <MenuItem value="" disabled>Wybierz godzinę</MenuItem>
                                            {date.availableHours.map((hour: string, hourIndex: number) => (
                                                <MenuItem key={hourIndex} value={hour}>{hour}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </CardContent>
                            </Card>
                        ))}
                        {isHourSelected && (
                            <>
                                <TextField
                                    label="Numer Telefonu"
                                    type="text"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    variant="outlined"
                                    fullWidth
                                    onChange={e => setNumberClient(e.target.value)}
                                    margin="normal"
                                    disabled={inputDisabled}

                                />
                                <Stack spacing={2} direction="column" sx={{mt: 2}}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={searchCustomerByNumber}
                                        disabled={inputDisabled}
                                    >
                                        Szukaj
                                    </Button>

                                </Stack>
                            </>
                        )}
                        {customerNotFound && <UserRegisterForm phoneNumber={numberClient} drawerOpen={drawerOpen}
                                                               setDrawerOpen={handleUserRegistrationClose}/>}

                        <Stack spacing={2} direction="column" sx={{mt: 2}}>
                            {inputDisabled ? (<Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                onClick={addReservation}
                            >
                                Rezerwuj
                            </Button>) : null}
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </>
    );

};

export default ReservationVisit;