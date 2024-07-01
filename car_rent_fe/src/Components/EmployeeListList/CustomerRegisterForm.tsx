import React, { useState } from 'react';
import { Drawer, Button, TextField, Box, Typography } from '@mui/material';
import { apiService } from "../ApiService";
import { CustomerDto } from "../CustomerList/Customers";
import { UserRegisterDto } from "../users/User";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from 'notistack';

export const CustomerRegisterForm = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState<UserRegisterDto>({
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        roles: ['USER', 'CLIENT'],
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phoneNumber: string): boolean => {
        const phoneRegex = /^\d{9,15}$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateEmail(formData.email)) {
            enqueueSnackbar('Proszę wprowadzić poprawny adres e-mail', { variant: 'error' });
            return;
        }

        if (!validatePhoneNumber(formData.phoneNumber)) {
            enqueueSnackbar('Proszę wprowadzić poprawny numer telefonu', { variant: 'error' });
            return;
        }

        const formData1: CustomerDto = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            email: formData.email
        };

        try {
            await apiService.addUser(formData);
            await apiService.addCustomer(formData1);
            queryClient.invalidateQueries({ queryKey: ['customers'], type: 'active' });
            enqueueSnackbar('Użytkownik został pomyślnie zarejestrowany', { variant: 'success' });
            setDrawerOpen(false);
        } catch (error) {
            enqueueSnackbar('Wystąpił błąd podczas rejestracji użytkownika', { variant: 'error' });
        }
    };

    return (
        <>
            <Button variant="outlined" onClick={() => setDrawerOpen(true)}>Zarejestruj</Button>
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box
                    sx={{ width: 250, p: 2 }}
                    role="presentation"
                >
                    <Typography variant="h6" gutterBottom>
                        Rejestracja Użytkownika
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Nazwa użytkownika"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Imię"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Nazwisko"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Numer telefonu"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                            error={!validatePhoneNumber(formData.phoneNumber)}
                            helperText={!validatePhoneNumber(formData.phoneNumber) ? 'Proszę wprowadzić poprawny numer telefonu' : ''}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                            error={!validateEmail(formData.email)}
                            helperText={!validateEmail(formData.email) ? 'Proszę wprowadzić poprawny adres e-mail' : ''}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Zarejestruj
                        </Button>
                    </form>
                </Box>
            </Drawer>
        </>
    );
};
