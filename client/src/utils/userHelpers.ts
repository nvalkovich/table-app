import { User } from '../types/types';
import { fetchUsers } from '../services/user/userService';
import { toast } from 'react-toastify';

export const performAction = async (
    action: (ids: number[]) => Promise<void>,
    ids: number[],
    successMessage: string,
    errorMessage: string,
    setUsers: (users: User[]) => void,
) => {
    try {
        await action(ids);
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers || []);
        toast.success(successMessage);
    } catch {
        toast.error(errorMessage);
    }
};

export const checkSelectedIds = (
    selectedIds: number[],
    warn: { noUsersSelected: string },
) => {
    if (!selectedIds.length) {
        toast.warn(warn.noUsersSelected);
        return false;
    }
    return true;
};
