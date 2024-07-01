import React from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow,
    Typography
} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {apiService} from "../ApiService";
import {AddServiceForm} from "../Serivce/Services";

export const DetailsDictionary = () => {
    const { name } = useParams();
    const {
        data: serwisy, isPending, isError, error
    }
        = useQuery({
        queryKey: ['projekty'],
        queryFn: () => apiService.getAllService({page: 0, size: 10})
    });

    if (isPending) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress/>
                <Typography variant="h6" sx={{ml: 2}}>Ładowanie danych użytkowników...</Typography>
            </Box>
        );
    }
    if (isError) {
        return (
            <Box sx={{textAlign: 'center'}}>
                <Typography variant="h6" color="error">
                    Wystąpił błąd przy pobieraniu danych użytkowników: {error?.message}
                </Typography>
                <Button variant="contained" color="primary" sx={{mt: 2}}>
                    Spróbuj ponownie
                </Button>
            </Box>
        );
    }
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Serwisy
            </Typography>
            <AddServiceForm />
            <TableContainer component={Paper}>
                <Table  aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {serwisy.content.map((projekt) => (
                            <TableRow
                                key={projekt.id}
                            >
                                <TableCell component="th" scope="row">
                                    {projekt.id}
                                </TableCell>
                                <TableCell>{projekt.name}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        // onClick={() => handleRowClick(projekt.id)}
                                    >
                                        Usuń
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

