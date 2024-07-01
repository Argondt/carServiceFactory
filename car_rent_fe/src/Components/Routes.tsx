import {createBrowserRouter} from "react-router-dom";
import React from "react";
import App from "../App";
import {AddServiceForm} from "./Serivce/Services";
import ReservationVisit from "./Visits/ReservationVisit";
import UserList from "./users/UserList";
import UserDetailsView from "./users/UserDetailsView";
import CalendarView from "./calendar/Calendarview";
import {AppointmentDetails} from "./Appointments/AppointmentDetails";
import {CustomerList} from "./CustomerList/CustomerList";
import {AppointmentClientVisit} from "./Appointments/AppointmentClientVisit";
import {AppointmentClientVisitCustomer} from "./Appointments/AppointmentClientVisitCustomer";
import ReservationVisitCustomer from "./Visits/ReservationVisitCustomer";
import {EmployeeList} from "./EmployeeListList/EmployeeList";
import {EmployeeDetails} from "./EmployeeListList/EmployeeDetailss";
import DictionaryList from "./DictionaryList/DictionaryList";
import {DetailsDictionary} from "./DictionaryList/DetailsDictionary";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <CalendarView/>},
            {path: "reservation", element: <ReservationVisit/>},
            {path: "reservationCustomer", element: <ReservationVisitCustomer/>},
            {path: "service", element: <DictionaryList/>},
            {path: "service/:name", element: <DetailsDictionary/>},
            {path: "users", element: <UserList/>},
            {path: "users/:id", element: <UserDetailsView/>},
            {path: "calendar", element: <CalendarView/>},
            {path: "visitDetails/:id", element: <AppointmentDetails/>},
            {path: "appointmentClientsVisit/:id", element: <AppointmentClientVisit/>},
            {path: "appointmentClientVisitCustomer", element: <AppointmentClientVisitCustomer/>},
            {path: "customers", element: <CustomerList/>},
            {path: "employees", element: <EmployeeList/>},
            {path: "employeeDetails/:id", element: <EmployeeDetails/>},
        ],
    },
]);
