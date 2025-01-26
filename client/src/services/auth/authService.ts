import { ApiRoutes, ErrorTypes, HTTPMethods } from '../../common/types';
import { resources } from '../../common/resources';
const toastifyErrors = resources.toastify.errors;

export const register = async (
    name: string,
    email: string,
    password: string,
) => {
    const response = await fetch(ApiRoutes.register, {
        method: HTTPMethods.post,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(
            data.message === ErrorTypes.ValidationError
                ? JSON.stringify(data)
                : data.message || toastifyErrors.registration,
        );
    }

    return await response.json();
};

export const login = async (email: string, password: string) => {
    const response = await fetch(ApiRoutes.login, {
        method: HTTPMethods.post,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(
            data.message === ErrorTypes.ValidationError
                ? JSON.stringify(data)
                : data.message || toastifyErrors.login,
        );
    }

    return await response.json();
};
