import React, {useState} from 'react';
import {Drawer, Button, TextField, Box, Typography} from '@mui/material';
import {apiService} from "../ApiService";
import {UserRegisterDto} from "./User";
import {EmployeeDto} from "../CustomerList/Customers";

export const UserRegisterEmployeeForm = () => {
    const [drawerOpen, setDrawerOpen] = useState(false); // Stan określający, czy szuflada jest otwarta

    const [formData, setFormData] = useState<UserRegisterDto>({
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        roles: ['USER', "CLIENT"],
    });

    const [formData1, setFormData1] = useState<EmployeeDto>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        userId: ''
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setFormData1({
            ...formData1,
            [name]: value,
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        apiService.addUser(formData)
            .then(value => {
                console.log(value)
                setFormData1(prevState => ({
                    ...prevState,
                    userId: 'nowyId'
                }));
                return apiService.addEmployees(formData1);
            })
            .then(() => {
                console.log('Usługa utworzona pomyślnie');
                setDrawerOpen(false); // Zamknij szufladę po sukcesie
            })
            .catch(error => console.error('Błąd podczas rejestracji użytkownika lub tworzenia usługi:', error));
    };

    return (
        <>
            <Button variant="outlined" onClick={() => setDrawerOpen(true)}> Zarejestruj Pracownika
            </Button>
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
                        Rejestracja Pracownika
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
                            Zarejestruj Pracownika
                        </Button>
                    </form>
                </Box>
            </Drawer>
        </>
    );
};
