import {
    CircularProgress, Grid, IconButton, Stack, Typography, Card,
    CardContent, useTheme, Box, Chip
} from "@mui/material";
// import {useQuery} from 'react-query';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, {useState} from "react";
import {Role, User, UserDetailsProps} from "./User";

import {useNavigate} from "react-router";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import EditIcon from "@mui/icons-material/Edit";
import {useQuery} from "@tanstack/react-query";
import {apiService} from "../ApiService";
import ErrorMessage from "../alerts/ErrorMessage";
import UpdateUserForm from "./UpdateUserForm";


const UserDetails = ({id}: UserDetailsProps) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const {
        data: user,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({queryKey: ['user'], queryFn: () => apiService.getUserById(id)})
    if (isLoading) {
        return <CircularProgress/>;
    }
    if (isError || !user) {
        return <ErrorMessage message={error?.message || "Wystąpił błąd przy pobieraniu danych użytkownika."}/>;
    }


    const handleBack = () => {
        navigate(-1);
    };
    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setIsUpdateFormOpen(true);
    };
    const handleCloseUpdateForm = () => {
        setIsUpdateFormOpen(false);
        setSelectedUser(null);
    };
    return (
        <Card elevation={1} sx={{margin: theme.spacing(3)}}>
            <CardContent>
                <Stack spacing={3}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2, marginBottom: theme.spacing(3)}}>
                        <IconButton onClick={handleBack} size="large">
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography variant="h4" gutterBottom>Szczegóły:</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom><PersonIcon/> Name</Typography>
                            <Typography variant="body2">{user.firstName} {user.lastName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom><EmailIcon/> Email</Typography>
                            <Typography variant="body2">{user.email}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom><BadgeIcon/> Username</Typography>
                            <Typography variant="body2">{user.username}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom><BadgeIcon/> User ID</Typography>
                            <Typography variant="body2">{user.id}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom><BadgeIcon/> Phone Number</Typography>
                            <Typography variant="body2">{user.phoneNumber}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom><PersonIcon/>Roles</Typography>
                            <div>
                                {user.roles && user.roles.map((role: Role, index: number) => (
                                    <Chip key={index} label={role} style={{marginRight: '5px', marginBottom: '5px'}}/>
                                ))}
                            </div>
                        </Grid>
                        <IconButton color="primary" onClick={() => handleEditClick(user)}>
                            <EditIcon/>
                        </IconButton>
                    </Grid>
                    {selectedUser && (
                        <UpdateUserForm
                            user={selectedUser}
                            isOpen={isUpdateFormOpen}
                            onClose={handleCloseUpdateForm}
                            onUpdated={refetch}
                        />
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default UserDetails;
