import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {useParams, useNavigate} from 'react-router-dom';
import {Card, CardContent, Typography, Grid, Button, Box} from '@mui/material';
import {apiService} from "../ApiService";
import {Appointments} from "../../MOdel/ServiceBeuaty";
import {StatusChip} from "./StatusChip";
import {getUserId, getUserPhoneNumber} from "../../keycloak";


export const AppointmentClientVisitCustomer = () => {
    // const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const id = getUserId();
    const phoneNumber = getUserPhoneNumber();

    const {
        data: clientAppointments1,
    } = useQuery({
        queryKey: ['searchCustomerByNumber', phoneNumber],
        queryFn: () => apiService.searchCustomerByNumber(phoneNumber),
    });
    console.log(clientAppointments1)
    const {
        data: clientAppointments,
        isLoading: isLoadingClientAppointments,
        isError: isErrorClientAppointments,
        error: errorClientAppointments,
    } = useQuery({
        queryKey: ['clientAppointments', id],
        queryFn: () => apiService.getClientAppointmentsAppointmentsById(clientAppointments1?.id),
    });

    const {
        data: historyAppointments,
        isLoading: isLoadingHistoryAppointments,
        isError: isErrorHistoryAppointments,
        error: errorHistoryAppointments,
    } = useQuery({
        queryKey: ['historyAppointments', id],
        queryFn: () => apiService.getHistoryAppointmentsById(clientAppointments1?.id),
    });
    if (isLoadingClientAppointments || isLoadingHistoryAppointments) {
        return <div>Loading...</div>;
    }
    if (isErrorClientAppointments) {
        return <div>Error: {(errorClientAppointments as Error).message}</div>;
    }
    if (isErrorHistoryAppointments) {
        return <div>Error: {(errorHistoryAppointments as Error).message}</div>;
    }


    return (
        <>
            <Box sx={{flexGrow: 1, padding: 2}}>
                <Typography variant="h4" gutterBottom>Wizyty zaplanowane</Typography>
                <Grid container spacing={2}>
                    {clientAppointments?.map((appointment: Appointments) => (
                        <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        Data: {appointment.date}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        Godzina: {appointment.time}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        Czas trwania: {appointment.duration}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        Status:
                                        <StatusChip status={appointment?.status ?? 'UNKNOWN'} />
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ backgroundColor: '#1976d2' }}
                                        onClick={() => navigate(`/visitDetails/${appointment.id}`)}
                                    >
                                        Szczegóły
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Typography variant="h4" gutterBottom sx={{marginTop: 4}}>Wizyty odbyte</Typography>
                <Grid container spacing={2}>
                    {historyAppointments?.map((appointment: Appointments) => (
                        <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        Data: {appointment.date}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        Godzina: {appointment.time}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        Czas trwania: {appointment.duration}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        Status:
                                        <StatusChip status={appointment?.status ?? 'UNKNOWN'} />
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ backgroundColor: '#1976d2' }}
                                        onClick={() => navigate(`/visitDetails/${appointment.id}`)}
                                    >
                                        Szczegóły
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

