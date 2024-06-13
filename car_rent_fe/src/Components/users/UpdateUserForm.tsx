import React, {useState} from 'react';
import {TextField, Button, Drawer, Box, InputLabel, Select, MenuItem, SelectChangeEvent} from '@mui/material';
import {Role, UpdateUserFormProps, User} from "./User";
import {isAuthorized} from "../../keycloak";
import {apiService} from "../ApiService";
import {useMutation, useQueryClient} from "@tanstack/react-query";


const UpdateUserForm: React.FC<UpdateUserFormProps> = ({user, isOpen, onClose, onUpdated}) => {
        const [updatedUser, setUpdatedUser] = useState<User>(user);


        const updateUserMutation = useMutation({
            mutationKey: ["user-mutate"],
            mutationFn: (newUserDetails: User) => apiService.updateUser(newUserDetails.id, newUserDetails),
            onSuccess: () => {
                // queryClient.invalidateQueries("user"); /FIXME poprawić nie wiadomoi czemu
                onClose();
                onUpdated();
            },
            onError: (error: Error) => {
                console.error("Błąd aktualizacji użytkownika:", error);
            }
        });

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setUpdatedUser({...updatedUser, [e.target.name]: e.target.value});
        };
        const handleRoleChange = (event: SelectChangeEvent<string[]>) => {
            const value = event.target.value;
            const newRoles = typeof value === 'string' ? value.split(',') : value;
            setUpdatedUser({...updatedUser, roles: newRoles});
        };
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            updateUserMutation.mutate(updatedUser);
        };
        const availableRoles = ['ADMIN', 'USER'];

        return (
            <Drawer anchor="right" open={isOpen} onClose={onClose}>
                <Box p={3} width="250px">
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Username"
                            name="username"
                            disabled={true}
                            value={updatedUser.username}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="First Name"
                            name="firstName"
                            value={updatedUser.firstName}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Last Name"
                            name="lastName"
                            value={updatedUser.lastName}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            name="email"
                            value={updatedUser.email}
                            onChange={handleChange}
                        />
                        {isAuthorized([Role.ADMIN]) && (
                            <>
                                <InputLabel id="roles-label">Roles</InputLabel>
                                <Select
                                    labelId="roles-label"
                                    multiple
                                    value={updatedUser.roles}
                                    onChange={handleRoleChange}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {availableRoles.map((role) => (
                                        <MenuItem key={role} value={role}>
                                            {role}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </>
                        )}
                        <Button type="submit" variant="contained" color="primary">
                            Zaktualizuj użytkownika
                        </Button>
                    </form>
                </Box>
            </Drawer>
        )
            ;
    }
;
export default UpdateUserForm;
