import ServiceBeuaty, {Customer, ServiceBeuatyDto} from "./ServiceBeuaty";

// export interface Customer {
//     id: number;
//     firstName: string;
//     lastName: string;
//     phoneNumber: string;
// }


export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    serviceBeuaties: ServiceBeuaty[];
}

export interface AppointmentDetails {
    id: number;
    customer: Customer;
    employee: Employee;
    serviceBeuaty: ServiceBeuaty;
    date: string;
    time: string;
    duration: string;
    status: string;
    note: string | null;
}

export interface AppointmentProps {
    id: number; // ID wizyty
}
export interface CustomersResponse {
    content: Customer[];
    pageable: {
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        pageSize: number;
        pageNumber: number;
        unpaged: boolean;
        paged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
export interface EmployeesResponse {
    content: Employee[];
    pageable: {
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        pageSize: number;
        pageNumber: number;
        unpaged: boolean;
        paged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}