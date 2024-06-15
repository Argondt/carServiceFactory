import {Navigate, useParams} from "react-router-dom";

import EmployeeDetailsView from "./EmployeeDetailsView";

export const EmployeeDetails = () => {

    const { id } = useParams();
    if (!id) {
        return <Navigate to="../" />;
    }
    return <EmployeeDetailsView employeeId={parseInt(id)} />;
};
