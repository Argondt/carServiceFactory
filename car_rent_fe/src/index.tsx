import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthenticationProvider from "./Providers/AuthenticationProviderProps";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RouterProvider} from "react-router-dom";
import {router} from "./Components/Routes";
import {SnackbarProvider} from "notistack";
import "react-big-calendar/lib/css/react-big-calendar.css";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});
// require('dotenv').config();

root.render(
    <AuthenticationProvider>
        <StrictMode>
            <SnackbarProvider maxSnack={3}>
                {/*    <NotificationProvider>*/}
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router}/>
                </QueryClientProvider>
                {/*</NotificationProvider>*/}
            </SnackbarProvider>
        </StrictMode>
    </AuthenticationProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
