// import React, {useState} from 'react';
// import {useQuery} from '@tanstack/react-query';
// import {useNavigate} from 'react-router-dom';
// import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button} from '@mui/material';
// import {Customer} from "../../MOdel/ServiceBeuaty";
// import {apiService} from "../ApiService";
// import {UserRegisterForm} from "../users/UserRegisterForm";
// import {CustomerRegisterForm} from "./CustomerRegisterForm";
//
//
// export const CustomerList = () => {
//     const navigate = useNavigate();
//     const [drawerOpen, setDrawerOpen] = useState(false);
//     const handleUserRegistrationClose = (isRegistered: boolean) => {
//         if (!isRegistered) {
//             setDrawerOpen(false);
//         } else {
//             // setCustomerNotFound(false);
//             setDrawerOpen(false);
//             // setInputDisabled(true); // Disable input after successful registration
//             // setSearchButtonVisible(true); // Optionally show the button again if needed
//         }
//     };
//
//     const {
//         data: users1,
//         isLoading,
//         isError,
//         error,
//     } = useQuery({queryKey: ['customers'], queryFn: () => apiService.getCustomers()})
//     if (isLoading) {
//         return <div>Loading...</div>;
//     }
//     if (isError) {
//         return <div>Error: {(error as Error).message}</div>;
//     }
//
//     const changeStatus = (status: string): string => {
//         switch (status) {
//             case 'APPOINTED':
//                 return 'Umówiona';
//             case 'DONE':
//                 return 'Zrealizowana';
//             case 'REJECTED':
//                 return 'Anulowana';
//             default:
//                 return '';
//         }
//     };
//
//     return (
//         <TableContainer component={Paper}>
//             <CustomerRegisterForm />
//             <Table aria-label="simple table">
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>ID</TableCell>
//                         <TableCell>First Name</TableCell>
//                         <TableCell>Last Name</TableCell>
//                         <TableCell>Phone Number</TableCell>
//                         <TableCell>Actions</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {users1?.content.map((customer) =>
//                         <TableRow key={customer.id}>
//                             <TableCell>{customer.id}</TableCell>
//                             <TableCell>{customer.firstName}</TableCell>
//                             <TableCell>{customer.lastName}</TableCell>
//                             <TableCell>{customer.phoneNumber}</TableCell>
//                             <TableCell>
//                                 <Button variant="contained"
//                                         onClick={() => navigate(`/appointmentClientsVisit/${customer.id}`)}>
//                                     Click
//                                 </Button>
//                             </TableCell>
//                         </TableRow>
//                     )}
//                 </TableBody>
//
//             </Table>
//         </TableContainer>
//     );
// };
//
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import { apiService } from "../ApiService";
import { CustomerRegisterForm } from "./CustomerRegisterForm";

export const CustomerList = () => {
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

    const { data: users1, isLoading, isError, error } = useQuery({ queryKey: ['customers'], queryFn: () => apiService.getCustomers() });

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error: {(error as Error).message}</div>;
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
                label="Search"
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
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>Actions</TableCell>
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
                                    Click
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
