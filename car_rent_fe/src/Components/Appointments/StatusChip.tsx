import React from "react";
import {Chip} from "@mui/material";
interface StatusChipProps {
    status: 'APPOINTED' | 'DONE' | 'REJECTED' | string; // Define the expected types of status
}
export const StatusChip: React.FC<StatusChipProps> =({status}) => {
    let label, color;

    switch (status) {
        case 'APPOINTED':
            label = 'Umówiona';
            color = "#FFBF00"; // Custom color you provided
            break;
        case 'DONE':
            label = 'Zrealizowana';
            color = "#4caf50"; // Green color for done
            break;
        case 'REJECTED':
            label = 'Anulowana';
            color = "#f44336"; // Red color for rejected
            break;
        default:
            label = status ?? 'Status Unknown'; // Provide a default label for undefined status
            color = "#9e9e9e";  // Grey for default or unknown status
    }

    return (
        <Chip
            label={label}
            style={{backgroundColor: color, color: 'white'}}
            size="medium"
        />
    );
};