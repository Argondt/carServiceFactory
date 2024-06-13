import React, {useState} from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton, Chip
} from '@mui/material';
import {Role, User} from "./User";
import {useNavigate} from "react-router";
import SearchIcon from '@mui/icons-material/Search';
import {useQuery} from "@tanstack/react-query";
import {apiService} from "../ApiService";
import {UserRegisterEmployeeForm} from "./UserRegisterEmployeeForm";

type Props = {};


const UserList: React.FC<Props> = () => {
    const navigate = useNavigate();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);


    const {
        data: users1,
        isLoading,
        isError,
        error,
    } = useQuery({queryKey: ['user'], queryFn: () => apiService.getUsers()})


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setIsUpdateFormOpen(true);
    };

    const handleCloseUpdateForm = () => {
        setIsUpdateFormOpen(false);
        setSelectedUser(null);
    };
    // Handle change rows per page
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    if (isLoading) {
        return <div>Ładowanie...</div>;
    }

    if (isError) {
        return <div>Wystąpił błąd przy pobieraniu użytkowników: {error?.message}</div>;
    }
    const handleDeleteClick = async (userId: any) => {
        // Wywołaj funkcję usuwania użytkownika
        await apiService.deleteUser(userId);
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
    };
    const handleUserClick = (id: any) => {
        navigate(`/users/${id}`); // Przekierowanie do szczegółowej strony
    };
    const rolesToRemove = ["default-roles-studia", "offline_access","uma_authorization"];
    return (
        <Card sx={{margin: 4}}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <UserRegisterEmployeeForm/>
                    <Typography variant="h5">Lista użytkowników</Typography>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Profile</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {Array.isArray(users1) && users1.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>

                                        <div>
                                            {user.roles
                                                .flatMap(roleString => roleString.replace(/\[|\]/g, '').split(', '))
                                                .filter((role: string) => !rolesToRemove.includes(role))
                                                .map((role: string, index: number) => (
                                                    <Chip key={index} label={role}
                                                          style={{marginRight: '5px', marginBottom: '5px'}}/>
                                                ))}
                                        </div>


                                    </TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleUserClick(user.id)}>
                                            <SearchIcon/>
                                        </IconButton>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={users?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </CardContent>
        </Card>
    );
};

export default UserList;
