import {
    User,
    ApiRoutes,
    StatusCodes,
    HTTPMethods,
    CurrentUser,
} from '../../types/types';
import { getTokenFromLS } from '../../utils/authHelpers';
import { resources } from '../../common/resources';
import { jsonHeader } from '../auth/authService';

const toastifyErrors = resources.toastify.errors;

const getAuthHeaders = () => ({
    ...jsonHeader,
    Authorization: `Bearer ${getTokenFromLS()}`,
});

const fetchApi = async <T>(
    url: string,
    method: string = HTTPMethods.get,
    body?: object,
): Promise<T | null> => {
    const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === StatusCodes.notFound) {
        return null;
    }
    if (!response.ok) {
        throw new Error(
            `${toastifyErrors.errorOccured}: ${response.statusText}`,
        );
    }

    return (await response.json()) as T;
};

const handlefetchDataRequest = async <T>(
    url: string,
    method: string = HTTPMethods.get,
    body?: object,
): Promise<T | null> => {
    return fetchApi<T>(url, method, body);
};

export const fetchUsers = async (): Promise<User[] | null> => {
    return handlefetchDataRequest<User[]>(ApiRoutes.users);
};

export const fetchCurrentUser = async (): Promise<CurrentUser | null> => {
    return handlefetchDataRequest<CurrentUser>(ApiRoutes.currentUser);
};

const handleUserAction = async (
    endpoint: string,
    method: HTTPMethods,
    data: { ids: number[] },
    errorMessage: string,
): Promise<void> => {
    try {
        await fetchApi<void>(endpoint, method, data);
    } catch {
        throw new Error(errorMessage);
    }
};

export const blockUsers = async (ids: number[]): Promise<void> => {
    await handleUserAction(
        ApiRoutes.blockUsers,
        HTTPMethods.patch,
        { ids },
        toastifyErrors.blockUsers,
    );
};

export const unblockUsers = async (ids: number[]): Promise<void> => {
    await handleUserAction(
        ApiRoutes.unblockUsers,
        HTTPMethods.patch,
        { ids },
        toastifyErrors.unblockUsers,
    );
};

export const deleteUsers = async (ids: number[]): Promise<void> => {
    await handleUserAction(
        ApiRoutes.deleteUsers,
        HTTPMethods.post,
        { ids },
        toastifyErrors.deleteUsers,
    );
};
