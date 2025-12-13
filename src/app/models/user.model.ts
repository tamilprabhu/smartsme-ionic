export interface User {
    username: string;
    userType: string;
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    address: string;
    password?: string;
    gstin?: string;
    createdDate?: string;
    updatedDate?: string;
}