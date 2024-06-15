import React, {useState} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {Container, Typography, Card, CardContent, Grid, Chip, Button, Box, IconButton, TextField} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {Appointments} from "../../MOdel/ServiceBeuaty";
import {apiService} from "../ApiService";
import {AppointmentDetails, AppointmentProps} from "../../MOdel/AppointmetsModel";
import {Role, UserDetailsProps} from "../users/User";
import {StatusChip} from "./StatusChip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {isAuthorized} from "../../keycloak";

export const AppointmentDetailsView = ({id}: AppointmentProps) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [notes, setNotes] = useState('')

    const {
        data: futureVisits,
        isLoading,
        isError,
        error,
    } = useQuery<AppointmentDetails, Error>({
        queryKey: ['appointmentDetails'],
        queryFn: () => apiService.getAppointmentsById(id)
    });
    if (isLoading) {
        return <div>Ładowanie...</div>;
    }
    const handleBack = () => {
        navigate(-1);
    };


    const fetchClickClient = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const noteaa = {
            note: notes,
        }
        try {
            // Assuming the return type of getAvailableDates is Test
            const response = await apiService.addNotesToAppointments(id, noteaa)

        } catch (error) {
            console.error("Błąd pobierania dostępnych dat:", error);
        }
    }
    const cancelVisit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
            const response = await apiService.cancelAppointment(id);
            if (response.status === "REJECTED") {
                await queryClient.invalidateQueries({queryKey: ['appointmentDetails'], type: 'active'})
            }
        } catch (error) {
            console.error("Błąd pobierania dostępnych dat:", error);
        }
    }
    const completeVisit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        try {
            const response = await apiService.realizeAppointment(id);
            if (response.status === "DONE") {
                await queryClient.invalidateQueries({queryKey: ['appointmentDetails'], type: 'active'})
            }
        } catch (error) {
            console.error("Błąd pobierania dostępnych dat:", error);
        }
    }
    if (isLoading) return <Typography>Ładowanie...</Typography>;
    if (isError) return <Typography>Błąd pobierania szczegółów wizyty.</Typography>;
    const isDisabled = futureVisits?.status === 'DONE' || futureVisits?.status === 'REJECTED';

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom component="div" sx={{mt: 4, mb: 2}}>
                Szczegóły wizyty
            </Typography>

            <Card variant="outlined" sx={{mb: 3}}>
                <IconButton onClick={handleBack} size="large">
                    <ArrowBackIcon/>
                </IconButton>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => apiService.downloadReport(id).then(value => {
                        const file = new Blob([value], { type: 'application/pdf' })
                        const fileURL = URL.createObjectURL(file)
                        window.open(fileURL)

                    })}
                    style={{marginLeft: '10px'}}
                >
                    Pobierz potwierdzenie
                </Button>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Order ID: #{futureVisits?.id}</Typography>
                        <StatusChip status={futureVisits?.status ?? 'UNKNOWN'}/>
                    </Box>
                    <Typography color="textSecondary" mb={2}>{futureVisits?.date}</Typography>

                    <Grid container spacing={3} mb={2}>
                        <Grid item xs={12} md={6}>
                            <Card elevation={0} variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>Klient</Typography>
                                    <Typography
                                        variant="body2">{`${futureVisits?.customer?.firstName} ${futureVisits?.customer?.lastName}`}</Typography>
                                    <Typography variant="body2">{futureVisits?.customer?.phoneNumber}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card elevation={0} variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>Informacje o usłudze</Typography>
                                    <Typography variant="body2">{futureVisits?.serviceBeuaty?.name}</Typography>
                                    <Typography
                                        variant="body2">Duration: {futureVisits?.serviceBeuaty?.duration}</Typography>
                                    <Typography variant="body2">Czas: {futureVisits?.time}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        {isAuthorized([Role.ADMIN]) && (
                            <Grid item xs={12}>
                                <Card elevation={0} variant="outlined">
                                    <CardContent sx={{border: '2px solid', borderColor: 'primary.main', p: 2}}>

                                        <Typography variant="subtitle1" gutterBottom sx={{mt: 2}}>Dodaj
                                            notatkę</Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            variant="outlined"
                                            label="Wprowadź notatkę"
                                            id="notatka"
                                            name="notatka"
                                            defaultValue={futureVisits?.note}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={4}
                                        />
                                        <Button variant="contained" color="primary" sx={{mt: 2}}
                                                onClick={fetchClickClient}>
                                            Edytuj notatkę
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>)}
                    </Grid>

                    <Box display="flex" justifyContent="space-between">
                        <Button variant="contained"
                                onClick={(e) => cancelVisit(e)}
                                disabled={isDisabled}

                        >
                            Anuluj wizytę
                        </Button>
                        {isAuthorized([Role.ADMIN]) && (
                            <Button variant="contained"
                                    onClick={(e) => completeVisit(e)}
                                    disabled={isDisabled}
                            >
                                Dokończ wizytę
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

