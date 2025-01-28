import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { resources } from '../common/resources';
import {
    blockUsers,
    unblockUsers,
    deleteUsers,
    fetchCurrentUser,
} from '../services/user/userService';
import { UserStatus, User } from '../types/types';
import { logoutWithRedirect } from '../utils/authHelpers';
import { performAction, checkSelectedIds } from '../utils/userHelpers';

const useUserActions = (users: User[], setUsers: (users: User[]) => void) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const { errors, success, warn } = resources.toastify;

    const checkUserStatus = useCallback(async () => {
        const currentUserData = await fetchCurrentUser();
        if (!currentUserData || currentUserData.status === UserStatus.blocked) {
            logoutWithRedirect();
            return false;
        }
        return true;
    }, []);

    const handleUserAction = useCallback(
        async (
            action: (ids: number[]) => Promise<void>,
            successMessage: string,
            errorMessage: string,
            targetStatus?: UserStatus,
        ) => {
            if (!(await checkUserStatus())) return;

            if (!checkSelectedIds(selectedIds, warn)) return;

            if (targetStatus !== undefined) {
                const selectedUsers = users.filter((user) =>
                    selectedIds.includes(user.id),
                );

                const hasUsersToProcess = selectedUsers.some(
                    (user) => user.status !== targetStatus,
                );

                if (!hasUsersToProcess) {
                    toast.warn(
                        targetStatus === UserStatus.blocked
                            ? warn.usersAlreadyBlocked
                            : warn.usersAlreadyActive,
                    );
                    return;
                }
            }

            await performAction(
                action,
                selectedIds,
                successMessage,
                errorMessage,
                setUsers,
            );
        },
        [selectedIds, users, warn, setUsers, checkUserStatus],
    );

    const handleBlockUsers = useCallback(
        () =>
            handleUserAction(
                blockUsers,
                success.blockUsers,
                errors.blockUsers,
                UserStatus.blocked,
            ),
        [handleUserAction],
    );

    const handleUnblockUsers = useCallback(
        () =>
            handleUserAction(
                unblockUsers,
                success.unblockUsers,
                errors.unblockUsers,
                UserStatus.active,
            ),
        [handleUserAction],
    );

    const handleDeleteUsers = useCallback(
        () =>
            handleUserAction(
                deleteUsers,
                success.deleteUsers,
                errors.deleteUsers,
            ),
        [handleUserAction],
    );

    return {
        selectedIds,
        setSelectedIds,
        handleBlockUsers,
        handleUnblockUsers,
        handleDeleteUsers,
    };
};

export default useUserActions;
