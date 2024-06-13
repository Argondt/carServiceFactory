interface ServiceBeuaty {
    name: string;
    description: string;
    duration: string; // używam typu string dla duration, ponieważ TypeScript nie ma wbudowanego typu Duration
    price: number; // BigDecimal w Javie jest często mapowany na number w TypeScript
}

export interface ServiceBeuatyDto {
    id: any;
    name: string;
    description: string;
    duration: string; // używam typu string dla duration, ponieważ TypeScript nie ma wbudowanego typu Duration
    price: number; // BigDecimal w Javie jest często mapowany na number w TypeScript
}

export interface ProjektyResponse {
    content: ServiceBeuatyDto[];
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

interface EmployeeDTO {
    id: any;
    firstName: any;
    lastName: any;
}

export interface AvailableDate {
    id: any;
    employee: EmployeeDTO;
    availableHours: any; // zakładamy że będzie to string
}

export interface AvailabelDateTO {
    date: any;
    serviceId: string;

}

export interface Test {
    available: AvailableDate[];
}

export interface Customer {
    id: number,
    firstName: string,
    lastName: string
    phoneNumber: string
}
export interface Appointments {
    id: number;
    customer: Person| null;
    employee: Employee| null;
    serviceBeuaty: ServiceBeauty | null;
    date: string;
    time: string;
    duration: string;
    status: string;
    note: string | null;
}

interface Person {
    id: number| null;
    firstName: string| null;
    lastName: string | null;
    phoneNumber: string | null;
}

interface Employee extends Person {
    serviceBeuaties: ServiceBeauty[];
}

interface ServiceBeauty {
    id: number | null;
    name: string | null;
    description: string | null;
    duration: string | null;
    price: number | null;
}

export default ServiceBeuaty;
