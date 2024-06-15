import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import { apiService } from "../ApiService";
import { CustomerRegisterForm } from "./CustomerRegisterForm";

export const EmployeeList = () => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // Dodaj stan do wartości wyszukiwania

    const handleUserRegistrationClose = (isRegistered: boolean) => {
        if (!isRegistered) {
            setDrawerOpen(false);
        } else {
            setDrawerOpen(false);
        }
    };

    const { data: users1, isLoading, isError, error } = useQuery({ queryKey: ['employees'], queryFn: () => apiService.getEployees() });

    if (isLoading) {
        return <div>Ładowanie...</div>;
    }
    if (isError) {
        return <div>Błąd: {(error as Error).message}</div>;
    }

    const filteredCustomers = users1?.content?.filter((customer) =>
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(searchTerm)
    ) || [];

    return (
        <TableContainer component={Paper}>
            <CustomerRegisterForm />
            <TextField
                label="Szukaj"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Imię</TableCell>
                        <TableCell>Nazwisko</TableCell>
                        <TableCell>Numer telefonu</TableCell>
                        <TableCell>Akcje</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                            <TableCell>{customer.id}</TableCell>
                            <TableCell>{customer.firstName}</TableCell>
                            <TableCell>{customer.lastName}</TableCell>
                            <TableCell>{customer.phoneNumber}</TableCell>
                            <TableCell>
                                <Button variant="contained" onClick={() => navigate(`/appointmentClientsVisit/${customer.id}`)}>
                                    Zobacz
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
