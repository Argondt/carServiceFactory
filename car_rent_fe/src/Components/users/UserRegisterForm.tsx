// import React, {useState} from 'react';
// import {Drawer, Button, TextField, Box, Typography, Checkbox, FormControlLabel} from '@mui/material';
// import {UserRegisterDto} from "./User";
// import {apiService} from "../ApiService";
// import {CustomerDto} from "../CustomerList/Customers";
//
// interface UserRegisterFormProps {
//     phoneNumber?: string; // Opcjonalny nr telefonu
//     drawerOpen: boolean;
//     setDrawerOpen: (open: boolean) => void;
// }
//
// export const UserRegisterForm = ({phoneNumber, drawerOpen, setDrawerOpen}: UserRegisterFormProps) => {
//
//     const [formData, setFormData] = useState<UserRegisterDto>({
//         username: '',
//         firstName: '',
//         lastName: '',
//         phoneNumber: phoneNumber || '',
//         email: '',
//         roles: ['USER'],
//     });
//     const [formData1] = useState<CustomerDto>({
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         phoneNumber: formData.phoneNumber,
//         email: formData.email
//     });
//
//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const {name, value} = event.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };
//
//
//     const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         apiService.addUser(formData);
//         apiService.createService(formData1);
//         setDrawerOpen(false);
//     };
//
//     return (
//         <>
//             <Button variant="outlined" onClick={() => setDrawerOpen(true)}>Zarejestruj</Button>
//             <Drawer
//                 anchor="right"
//                 open={drawerOpen}
//                 onClose={() => setDrawerOpen(false)}
//             >
//                 <Box
//                     sx={{width: 250, p: 2}}
//                     role="presentation"
//                 >
//                     <Typography variant="h6" gutterBottom>
//                         Rejestracja użytkownika
//                     </Typography>
//                     <form onSubmit={handleSubmit}>
//                         <TextField
//                             label="Username"
//                             name="username"
//                             value={formData.username}
//                             onChange={handleInputChange}
//                             fullWidth
//                             margin="normal"
//                         />
//                         <TextField
//                             label="First Name"
//                             name="firstName"
//                             value={formData.firstName}
//                             onChange={handleInputChange}
//                             fullWidth
//                             margin="normal"
//                         />
//                         <TextField
//                             label="Last Name"
//                             name="lastName"
//                             value={formData.lastName}
//                             onChange={handleInputChange}
//                             fullWidth
//                             margin="normal"
//                         />
//                         <TextField
//                             label="Phone Number"
//                             name="phoneNumber"
//                             value={formData.phoneNumber}
//                             onChange={handleInputChange}
//                             fullWidth
//                             margin="normal"
//                         />
//                         <TextField
//                             label="Email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleInputChange}
//                             fullWidth
//                             margin="normal"
//                         />
//                         <Button type="submit" variant="contained" color="primary" fullWidth>
//                             Zarejestruj
//                         </Button>
//                     </form>
//                 </Box>
//             </Drawer>
//         </>
//     );
// };
import React, { useState } from 'react';
import { Drawer, Button, TextField, Box, Typography } from '@mui/material';
import { UserRegisterDto } from "./User";
import { apiService } from "../ApiService";
import { CustomerDto } from "../CustomerList/Customers";
import { useSnackbar } from 'notistack';

interface UserRegisterFormProps {
    phoneNumber?: string; // Opcjonalny nr telefonu
    drawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
}

export const UserRegisterForm = ({ phoneNumber, drawerOpen, setDrawerOpen }: UserRegisterFormProps) => {
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState<UserRegisterDto>({
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: phoneNumber || '',
        email: '',
        roles: ['USER'],
    });

    const [formData1, setFormData1] = useState<CustomerDto>({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Update formData1 whenever formData changes
        setFormData1({
            ...formData1,
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

        try {
            await apiService.addUser(formData);
            await apiService.addCustomer(formData1);
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
                            required
                        />
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Phone Number"
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
