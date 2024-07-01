import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {
    List,
    ListItem,
    ListItemText, Paper,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import {useQuery} from "@tanstack/react-query";
import {apiService} from "../ApiService";

export interface Dictionary {
    name: string;
}

const DictionaryList: React.FC = () => {
    const navigate = useNavigate();
    const {data: dictionary, isLoading, isError, error} =
        useQuery({queryKey: ['dictionary'], queryFn: () => apiService.getDictionary()});

    if (isLoading) {
        return <div>Ładowanie...</div>;
    }
    if (isError) {
        return <div>Błąd: {(error as Error).message}</div>;
    }

    const handleListItemClick = (name: string) => {
        navigate(`/service/${name}`);
    };
    {
        console.log(dictionary)
    }
    // eslint-disable-next-line array-callback-return
    const dictionaryEntries = dictionary ? Object.entries(dictionary) : [];

    return (

        <div>
            <Typography variant="h4" gutterBottom>
                Dictionaries
            </Typography>
            <TableContainer component={Paper}>
                <Table  aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dictionaryEntries.map(([key, value]) => (
                            <TableRow
                                key={key}
                                onClick={() => handleListItemClick(key)}
                            >
                                <TableCell component="th" scope="row">
                                    {key}
                                </TableCell>
                                <TableCell align="right">{value.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default DictionaryList;
