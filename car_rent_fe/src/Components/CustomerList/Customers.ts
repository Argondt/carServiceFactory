import ServiceBeuaty, {ServiceBeuatyDto} from "../../MOdel/ServiceBeuaty";

export interface CustomerDto {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
}

export interface EmployeeDto {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    userId: string;
}

export interface EmployeeUserDto {
    id: any;
    serviceId: any;
};