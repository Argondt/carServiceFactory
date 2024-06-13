import React, {useState} from 'react';
import {TextField, Button, MenuItem, Select, FormControl, InputLabel, Icon} from '@mui/material';
import {apiService} from "../ApiService";
import {Spa, Timer, AttachMoney, Description} from '@mui/icons-material';

export const AddServiceForm = () => {
    const [service, setService] = useState({
        name: '',
        description: '',
        duration: 'PT1H',
        price: ''
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        apiService.createService(service)
    };

    return (
        <form onSubmit={handleSubmit} style={{backgroundColor: '#f3f0ec', padding: '20px', borderRadius: '8px'}}>
            <TextField
                label="Nazwa"
                value={service.name}
                onChange={(e) => setService({...service, name: e.target.value})}
                fullWidth
                margin="normal"
                InputProps={{
                    startAdornment: (
                        <Icon>
                            <Spa/>
                        </Icon>
                    ),
                }}
            />
            <TextField
                label="Opis"
                value={service.description}
                onChange={(e) => setService({...service, description: e.target.value})}
                fullWidth
                margin="normal"
                InputProps={{
                    startAdornment: (
                        <Icon>
                            <Description/>
                        </Icon>
                    ),
                }}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Czas trwania</InputLabel>
                <Select
                    value={service.duration}
                    label="Czas trwania"
                    onChange={(e) => setService({...service, duration: e.target.value as string})}
                    startAdornment={
                        <Icon>
                            <Timer/>
                        </Icon>
                    }
                >
                    <MenuItem value="PT1H30M">1 godzina 30 minut</MenuItem>
                    <MenuItem value="PT1H">1 godzina</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Cena"
                value={service.price}
                onChange={(e) => setService({...service, price: e.target.value})}
                fullWidth
                margin="normal"
                InputProps={{
                    startAdornment: (
                        <Icon>
                            <AttachMoney/>
                        </Icon>
                    ),
                }}
            />
            <Button type="submit" variant="contained" color="primary"
                    style={{marginTop: '20px', backgroundColor: '#a5d6a7'}}>
                Dodaj usługę
            </Button>
        </form>
    );
};
