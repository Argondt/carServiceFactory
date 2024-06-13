import React, {useState} from 'react';
import {Drawer, Button, TextField, Box, Typography, Checkbox, FormControlLabel} from '@mui/material';
import {UserRegisterDto} from "./User";
import {apiService} from "../ApiService";
import {CustomerDto} from "../CustomerList/Customers";

interface UserRegisterFormProps {
    phoneNumber?: string; // Opcjonalny nr telefonu
    drawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
}

export const UserRegisterForm = ({phoneNumber, drawerOpen, setDrawerOpen}: UserRegisterFormProps) => {

    const [formData, setFormData] = useState<UserRegisterDto>({
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: phoneNumber || '',
        email: '',
        roles: ['USER'],
    });
    const [formData1] = useState<CustomerDto>({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        apiService.addUser(formData);
        apiService.createService(formData1);
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
                    sx={{width: 250, p: 2}}
                    role="presentation"
                >
                    <Typography variant="h6" gutterBottom>
                        Rejestracja użytkownika
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Phone Number"
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
