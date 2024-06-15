import React from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {List, ListItem, ListItemText, Checkbox, Typography, Box, Button} from '@mui/material';
import {apiService} from "../ApiService";

interface Service {
    id: number;
    name: string;
    description: string;
}

interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    serviceBeuaties: Service[];
}

interface EmployeeDetailsProps {
    employeeId: number;
}


const EmployeeDetailsView: React.FC<EmployeeDetailsProps> = ({employeeId}) => {
    const queryClient = useQueryClient();


    const {
        data: futureVisits,
        isLoading,
        isError,
        error,
    } = useQuery<Employee, Error>({
        queryKey: ['getEmployeeById'],
        queryFn: () => apiService.getEmployeeById(employeeId)
    });
    const {
        data: projekty
    }
        = useQuery({
        queryKey: ['projekty'],
        queryFn: () => apiService.getAllService({page: 0, size: 10})
    });
    if (isLoading) {
        return <div>Ładowanie...</div>;
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
        <Box sx={{p: 3}}>
            <Typography variant="h5" gutterBottom>
                Szczegóły Pracownika: {futureVisits?.firstName} {futureVisits?.lastName}
            </Typography>
            <Typography variant="h6" gutterBottom>
                Przypisane Usługi
            </Typography>
            <List>
                {projekty?.content.map(service => (
                    <ListItem key={service.id} sx={{display: 'flex', alignItems: 'center'}}>
                        <Checkbox
                            checked={futureVisits?.serviceBeuaties.some(s => s.id === service.id)}
                            disabled
                        />
                        <ListItemText
                            primary={service.name}
                            sx={{ml: 2}}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
export default EmployeeDetailsView;
