import { toast } from 'react-toastify';
import { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../authService';
import { resources } from '../../../common/resources';
import { Routes } from '../../../common/types';

const toastifyErrors = resources.toastify.errors;

export const handleValidationError = (
    error: Error,
    setErrors: Dispatch<SetStateAction<Record<string, string>>>,
) => {
    const errorData = JSON.parse(error.message);
    const newErrors: Record<string, string> = {};

    errorData.errors.forEach(
        (err: { property: string; constraints: { [key: string]: string } }) => {
            if (err.constraints) {
                newErrors[err.property] = Object.values(err.constraints).join(
                    ', ',
                );
            }
        },
    );

    setErrors(newErrors);
};

export const handleGenericError = (error: Error, toastMessage: string) => {
    toast.error(error.message || toastMessage);
};

export const handleError = (
    error: unknown,
    setErrors: Dispatch<SetStateAction<Record<string, string>>>,
    validationErrorKey: string,
    genericErrorMessage: string,
) => {
    if (error instanceof Error) {
        if (error.message.includes(validationErrorKey)) {
            handleValidationError(error, setErrors);
        } else {
            handleGenericError(error, genericErrorMessage);
        }
    } else {
        toast.error(genericErrorMessage);
    }
};

export const handleLoginSuccess = (
    token: string,
    setIsAuthenticated: (isAuthenticated: boolean) => void,
    navigate: ReturnType<typeof useNavigate>,
) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setTimeout(() => navigate(Routes.dashboard), 2000);
};

export const handleRegistrationSuccess = async (
    email: string,
    password: string,
    setIsAuthenticated: (isAuthenticated: boolean) => void,
    navigate: ReturnType<typeof useNavigate>,
) => {
    try {
        const loginData = await login(email, password);
        handleLoginSuccess(loginData.token, setIsAuthenticated, navigate);
    } catch {
        toast.error(toastifyErrors.automaticLogin);
    }
};
