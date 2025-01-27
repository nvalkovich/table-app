export enum ErrorTypes {
    ValidationError = 'Validation error',
}

export enum ApiRoutes {
    register = '/api/register',
    login = '/api/login',
    users = '/api/users',
    currentUser = '/api/users/current',
    blockUsers = '/api/users/block',
    unblockUsers = '/api/users/unblock',
    deleteUsers = '/api/users/delete',
}

export enum Routes {
    base = '/',
    register = '/register',
    login = '/login',
    dashboard = '/dashboard',
}

export enum HTTPMethods {
    post = 'POST',
    patch = 'PATCH',
    get = 'GET',
}

export interface User {
    id: number;
    name: string;
    email: string;
    status: UserStatus;
    lastLoginAt: Date | null;
    createdAt: Date;
}

export enum UserStatus {
    active = 'active',
    blocked = 'blocked',
}

export interface CurrentUser {
    id: number;
    status: UserStatus;
}

export interface ApiError {
    message: string;
    errors?: Array<{
        property: string;
        constraints: { [key: string]: string };
    }>;
}

export enum StatusCodes {
    unauthorized = 401,
    notFound = 404,
}
