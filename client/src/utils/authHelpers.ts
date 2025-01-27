import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth/authService';
import { resources } from '../common/resources';
import { Routes } from '../types/types';
import { TIMEOUT_VALUE, AUTH_TOKEN_KEY } from '../common/constants';
import { handleGenericError } from './errorHandlingHelpers';

const toastifyErrors = resources.toastify.errors;

export const setTokenToLS = (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeTokenFromLS = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getTokenFromLS = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const logoutWithRedirect = (route: Routes) => {
    removeTokenFromLS();
    window.location.href = route;
};

export const handleLoginSuccess = (
    token: string,
    setIsAuthenticated: (isAuthenticated: boolean) => void,
    navigate: ReturnType<typeof useNavigate>,
) => {
    setTokenToLS(token);
    setIsAuthenticated(true);
    setTimeout(() => navigate(Routes.dashboard), TIMEOUT_VALUE);
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
    } catch (error) {
        handleGenericError(error, toastifyErrors.automaticLogin);
    }
};
