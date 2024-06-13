import React, {useState} from 'react';
import moment from 'moment';
import {useNavigate} from 'react-router-dom';
import {Calendar, momentLocalizer, Views, View} from 'react-big-calendar';

import {useQuery} from "@tanstack/react-query";
import {apiService} from "../ApiService";
import './index.css'
import {Appointments} from "../../MOdel/ServiceBeuaty";
import 'moment/locale/pl';
import Absence from "../Absence/Absence";
import {getUserId} from "../../keycloak";
import {EmployeeUserDto} from "../CustomerList/Customers";
import {Alert, AlertTitle, Button} from "@mui/material";
interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resourceId: number;
}

const localizer = momentLocalizer(moment);
const CalendarView: React.FC = () => {
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [testId, setTestId] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => setIsOpen(!isOpen);
    const [textToFront, setTextToFront] = useState('');
    const id = getUserId();

    const addMinutes = (date: Date, minutes: number): Date => {
        return new Date(date.getTime() + minutes * 60000);
    };

    const getMinuteEvent = (durationt: string): number => {
        if (durationt.length === 4) {
            return parseInt(durationt[2], 10) * 60;
        }
        if (durationt.length === 7) {
            return parseInt(durationt[2], 10) * 60 + parseInt(durationt.substring(4, 6), 10);
        }
        return 0; // Handle unexpected format appropriately
    };
    const result = useQuery<EmployeeUserDto>({queryKey: ['todos'], queryFn: () => apiService.getEmployeeByUserId(getUserId())})
    console.log(result.data?.id)

    const {
        data: futureVisits,
        isLoading,
        isError,
        error,
    } = useQuery<Appointments[], Error>({queryKey: ['futureVisit'], queryFn: () => apiService.getFutureVisit(result.data?.id)});
    if (isLoading) {
        return <div>Ładowanie...</div>;
    }

    if (isError) {
        return (
            <Alert severity="error" action={
                <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                    Spróbuj ponownie
                </Button>
            }>
                <AlertTitle>Wystąpił błąd</AlertTitle>
                Wystąpił wewnętrzny problem!
            </Alert>
        );
    }


    const onSelectEvent = (event: Event) => {
        if (!event.title.includes('NIEOBECNOŚĆ')) {
            navigate(`/visitDetails/${event.id}`)
        }
    };
    const events: Event[] = futureVisits ? futureVisits.map((app: Appointments): Event => {
        const resultDate = app.date.split('-').map(Number);
        const resultHour = app.time.split(':').map(Number);
        return {
            id: app.id.toString(),
            title: app.customer?.firstName ?? 'NIEOBECNOŚĆ' + app.customer?.lastName ?? '' + app.serviceBeuaty?.name ?? '',
            start: new Date(resultDate[0], resultDate[1] - 1, resultDate[2], resultHour[0], resultHour[1], 0),
            end: addMinutes(new Date(resultDate[0], resultDate[1] - 1, resultDate[2], resultHour[0], resultHour[1], 0), getMinuteEvent(app.duration)),
            resourceId: 1,
        };
    }) : [];


    return (
        <>

            <Absence/>
            <Calendar
                localizer={localizer}
                events={events}
                defaultView={Views.DAY}
                views={['day', 'week']}
                defaultDate={new Date()}
                min={new Date(0, 0, 0, 8, 0, 0)}
                max={new Date(0, 0, 0, 16, 0, 0)}
                messages={{
                    next: "NASTĘPNY",
                    previous: "POPRZEDNI",
                    today: "DZIŚ",
                    month: "MIESIĄC",
                    week: "TYDZIEŃ",
                    day: "DZIEŃ"
                }}
                onSelectEvent={onSelectEvent}
            />
        </>
    );
};

export default CalendarView;
