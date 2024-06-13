export interface User {
    id: string;
    username: string;
    firstName: string;
    email: string;
    indexNumber: string;
    lastName: string;
    phoneNumber:string;
    roles: string[];
}

export interface UpdateUserFormProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
    onUpdated: () => void;

}

export interface UserDetailsProps {
    id: string;
}
export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    CLIENT = "CLIENT",
}
export interface UserRegisterDto {
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    roles: string[]
}