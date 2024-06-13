import {Navigate, useParams} from "react-router-dom";
import UserDetails from "../users/UserDetails";
import {AppointmentDetailsView} from "./AppointmentDetailsView";

export const AppointmentDetails = () => {

    const { id } = useParams();
    if (!id) {
        return <Navigate to="../" />;
    }
    return <AppointmentDetailsView id={parseInt(id)} />;
};
