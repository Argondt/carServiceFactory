import axios from 'axios';
import keycloak from '../keycloak';
import {Appointments, AvailableDate, Customer, ProjektyResponse, ServiceBeuatyDto, Test} from "../MOdel/ServiceBeuaty";
import {User, UserRegisterDto} from "./users/User";
import {AppointmentDetails, CustomersResponse, EmployeesResponse} from "../MOdel/AppointmetsModel";
import {CustomerDto, EmployeeDto} from "./CustomerList/Customers";
import {enqueueSnackbar, useSnackbar} from "notistack";

const api = axios.create({
    baseURL: process.env.BE_URL || 'http://localhost:8119/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config: any) => {
    if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
});
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Use Notistack to show error notification
        const {enqueueSnackbar} = useSnackbar();
        enqueueSnackbar(error.response?.data?.message || 'An error occurred', {variant: 'error'});
        return Promise.reject(error);
    }
);

const createService = async (beautyService: any) => {
    try {
        const response = await api.post<Response>('/services',
            beautyService
        );
        enqueueSnackbar('Usługa została utworzona pomyślnie', {variant: 'success'});
        return response.data;
    } catch (error) {
        throw error;
    }
};

interface GetAllProjectsParams {
    page?: number;
    size?: number;
}

const getAllService = async (params: GetAllProjectsParams = {}) => {
    const response = await api.get<ProjektyResponse>('/services', {
        params: {
            ...params
        }
    });
    return response.data;
};
const searchCustomerByNumber = async (phoneNumber: any) => {
    const response = await api.get<Customer>(`/customers/number/${phoneNumber}`, {});
    return response.data;
};
const getAvailableDates = async (serviceId: any, date: any) => {
    const response = await api.get<AvailableDate[]>('/available-dates', {
        params: {
            serviceId, date
        },
    });

    return response.data;
}
const addNewAppointment = async (beautyService1: any) => {
    const response = await api.post<Response>('/appointments',
        beautyService1
    );
    return response.data;
};
const addAbsence = async (beautyService1: any) => {
    const response = await api.post<Response>('/appointments/absence',
        beautyService1
    );
    return response.data;
};
const deleteUser = async (userId: string) => {
    const response = await api.delete(`/users/${userId}/delete`);
    return response.data;
};
const updateUser = async (userId: string, userDetails: User) => {
    const response = await api.put(`/users/${userId}/update`, userDetails);
    return response.data;
};
const getUsers = async () => {
    const response = await api.get<User[]>('/users'); // URL do twojego backendowego endpointu
    return response.data;
};
const getUserById = async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
};
const getEmployeeByUserId = async (userId: any) => {
    const response = await api.get(`/employees/users/${userId}`);
    return response.data;
};
const getFutureVisit = async (userId: any) => {
    const response = await api.get(`/futureAppointments/${userId}`);
    return response.data;
};
const realizeAppointment = async (id: number) => {
    const response = await api.get(`/realizeAppointment/${id}`);
    return response.data;
};
const cancelAppointment = async (id: number) => {
    const response = await api.get(`/cancelAppointment/${id}`);
    return response.data;
};
const getAppointmentsById = async (id: number) => {
    const response = await api.get<AppointmentDetails>(`/appointments/${id}`);
    return response.data;
};
const getCustomers = async () => {
    const response = await api.get<CustomersResponse>(`/customers`);
    return response.data;
};
const getEployees = async () => {
    const response = await api.get<EmployeesResponse>(`/employees`);
    return response.data;
};
const getHistoryAppointmentsById = async (id: any) => {
    const response = await api.get<Appointments[]>(`/historyAppointments/${id}`);
    return response.data;
};
const getClientAppointmentsAppointmentsById = async (id: any) => {
    const response = await api.get<Appointments[]>(`/clientAppointments/${id}`);
    return response.data;
};
const addNotesToAppointments = async (id: any, notes: any) => {
    const response = await api.patch(`/appointments/${id}`, notes);
    return response.data;
}
const addUser = async (userRegisterDto: UserRegisterDto) => {
    const response = await api.post(`/users`, userRegisterDto);
    return response.data
}
const addCustomer = async (userRegisterDto: CustomerDto) => {
    const response = await api.post(`/customers`, userRegisterDto);
    return response.data
}
const addEmployees = async (userRegisterDto: EmployeeDto) => {
    const response = await api.post(`/employees`, userRegisterDto);
    return response.data
}
const downloadReport = async (id: number) => {
    const headers = {
        responseType: 'blob',
        headers: {
            'Accept': 'application/octet-stream', // Ustaw nagłówek Accept na application/pdf
        },
    }
    const response = await api.post(`/appointments/report/${id}`, null, {
        responseType: 'blob',
        headers: {
            'Accept': 'application/octet-stream', // Ustaw nagłówek Accept na application/pdf
        },
    });
    console.log(response)
    return response.data;
};
const getEmployeeById = async (id: any) => {
    const response = await api.get(`/employees/${id}`);
    return response.data
}
const assignService = async (employeeId: any, serviceDto: any) => {
    const response = await api.put(`/employees/${employeeId}`, serviceDto);
    return response.data
}
export const apiService = {
    createService,
    getAllService,
    getAvailableDates,
    searchCustomerByNumber,
    addNewAppointment,
    getFutureVisit,
    getUsers,
    updateUser,
    deleteUser,
    getUserById,
    getAppointmentsById,
    getCustomers,
    getEployees,
    getHistoryAppointmentsById,
    getClientAppointmentsAppointmentsById,
    addNotesToAppointments,
    addUser,
    addCustomer,
    addEmployees,
    cancelAppointment,
    realizeAppointment,
    getEmployeeByUserId, addAbsence, downloadReport ,assignService, getEmployeeById

};
