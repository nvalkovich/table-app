import {
    ApiError,
    ApiRoutes,
    ErrorTypes,
    HTTPMethods,
    User,
} from '../../types/types';
import { resources } from '../../common/resources';

const toastifyErrors = resources.toastify.errors;

export const jsonHeader = {
    'Content-Type': 'application/json',
};

const fetchApi = async <T>(
    url: string,
    method: HTTPMethods = HTTPMethods.post,
    body?: object,
): Promise<T> => {
    const response = await fetch(url, {
        method,
        headers: jsonHeader,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const data: ApiError = await response.json();
        throw new Error(
            data.message === ErrorTypes.ValidationError
                ? JSON.stringify(data)
                : data.message || toastifyErrors.errorOccured,
        );
    }

    return await response.json();
};

const handleApiRequest = async <T>(
    url: string,
    method: HTTPMethods,
    body: object,
    errorMessage: string,
): Promise<T> => {
    try {
        return await fetchApi<T>(url, method, body);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : errorMessage);
    }
};

export const register = async (
    name: string,
    email: string,
    password: string,
) => {
    return handleApiRequest<{ user: User; token: string }>(
        ApiRoutes.register,
        HTTPMethods.post,
        { name, email, password },
        toastifyErrors.registration,
    );
};

export const login = async (email: string, password: string) => {
    const data = await handleApiRequest<{ user: User; token: string }>(
        ApiRoutes.login,
        HTTPMethods.post,
        { email, password },
        toastifyErrors.login,
    );
    return {
        token: data.token,
        user: data.user,
    };
};
