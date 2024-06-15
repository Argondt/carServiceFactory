import React, { useState } from 'react';
import { Drawer, Button, TextField, Box, Typography } from '@mui/material';
import { apiService } from "../ApiService";
import { CustomerDto } from "../CustomerList/Customers";
import { UserRegisterDto } from "../users/User";
import { useQueryClient } from "@tanstack/react-query";

export const CustomerRegisterForm = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const queryClient = useQueryClient();

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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData1: CustomerDto = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            email: formData.email
        };
        apiService.addUser(formData).then(
            value => {
                apiService.addCustomer(formData1).then(value1 =>
                    queryClient.invalidateQueries({ queryKey: ['customers'], type: 'active' })
                );
            }
        )
        setDrawerOpen(false);
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
                        />
                        <TextField
                            label="Imię"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Nazwisko"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Numer telefonu"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
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
