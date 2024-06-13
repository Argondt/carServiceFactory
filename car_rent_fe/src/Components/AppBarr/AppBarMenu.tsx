import {AppBar, Button, Icon, Toolbar, Typography} from "@mui/material";
import {useKeycloak} from "@react-keycloak/web";
import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import {Link} from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
import {isAuthorized} from "../../keycloak";
import {Role} from "../users/User";
import {Logout} from '@mui/icons-material';

export const AppBarMenu = () => {
    const {keycloak} = useKeycloak();


    return (
        <AppBar position="static" style={{backgroundColor: "#003366"}}>
            <Toolbar>
                <Typography variant="h6" style={{flexGrow: 1, color: "#a2836e"}}>
                    Car Factory
                </Typography>

                {/* Inne przyciski mogą być dodane tutaj */}
                {isAuthorized([Role.ADMIN]) && (
                    <Button
                        variant="outlined"
                        component={Link}
                        startIcon={<PeopleIcon/>}
                        style={{border: 'none', color: "#a2836e", marginLeft: "10px"}}
                        to="/service" // Ścieżka do UserList
                    >
                        Serwis
                    </Button>)}
                {isAuthorized([Role.ADMIN]) && (
                    <Button
                        variant="outlined"
                        component={Link}
                        startIcon={<PeopleIcon/>}
                        style={{border: 'none', color: "#a2836e", marginLeft: "10px"}}
                        to="/reservation" // Ścieżka do UserList
                    >
                        Dodaj wizytę
                    </Button>)}
                {isAuthorized([Role.CLIENT]) && (
                <Button
                    variant="outlined"
                    component={Link}
                    startIcon={<PeopleIcon/>}
                    style={{border: 'none', color: "#a2836e", marginLeft: "10px"}}
                    to="/reservationCustomer" // Ścieżka do UserList
                >
                    Dodaj wizytę
                </Button>)}  
                {isAuthorized([Role.CLIENT]) && (
                <Button
                    variant="outlined"
                    component={Link}
                    startIcon={<PeopleIcon/>}
                    style={{border: 'none', color: "#a2836e", marginLeft: "10px"}}
                    to="/appointmentClientVisitCustomer" // Ścieżka do UserList
                >
                    Wizyty
                </Button>)}
                {isAuthorized([Role.ADMIN]) && (
                <Button
                    variant="outlined"
                    component={Link}
                    startIcon={<PeopleIcon/>}
                    style={{border: 'none', color: "#a2836e", marginLeft: "10px"}}
                    to="/customers" // Ścieżka do UserList
                >
                    Lista klientów
                </Button>)}
                {isAuthorized([Role.ADMIN]) && (
                    <Button
                        variant="outlined"
                        component={Link}
                        startIcon={<PeopleIcon/>}
                        style={{border: 'none', color: "#a2836e", marginLeft: "10px"}}
                        to="/users" // Ścieżka do UserList
                    >
                        Użytkownicy
                    </Button>)}
                {isAuthorized([Role.ADMIN]) && (
                <Button
                    variant="outlined"
                    component={Link}
                    startIcon={<PeopleIcon/>}
                    style={{border: 'none', color: "#a2836e", marginLeft: "10px"}}
                    to="/calendar" // Ścieżka do UserList
                >
                    Kalendarz
                </Button>)}
                <Button
                    variant="outlined"
                    startIcon={<Icon><Logout/></Icon>}
                    onClick={() => keycloak.logout()}
                    style={{border: 'none', color: "#a2836e", marginLeft: "10px"}}
                >
                    Wyloguj się
                </Button>
            </Toolbar>
        </AppBar>
    );
};