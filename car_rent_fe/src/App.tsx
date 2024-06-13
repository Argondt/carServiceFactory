import {Suspense} from "react";
import {CircularProgress} from "@mui/material";

import {Outlet} from "react-router-dom";
import {AppBarMenu} from "./Components/AppBarr/AppBarMenu";
import {SnackbarProvider} from "notistack";

export default function App() {
    return (
        <>
            <Suspense fallback={<CircularProgress size={120}/>}>
                <SnackbarProvider maxSnack={3}>

                    <AppBarMenu/>
                    <Outlet/>
                </SnackbarProvider>,

            </Suspense>
        </>
    );
}