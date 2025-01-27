import { useState, useEffect } from 'react';
import { User, CurrentUser } from '../types/types';
import { fetchUsers, fetchCurrentUser } from '../services/user/userService';
import { toast } from 'react-toastify';
import { resources } from '../common/resources';

const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>();
    const { errors: toastifyErrors } = resources.toastify;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, currentUserData] = await Promise.all([
                    fetchUsers(),
                    fetchCurrentUser(),
                ]);
                setUsers(usersData || []);
                setCurrentUser(currentUserData || undefined);
            } catch {
                toast.error(toastifyErrors.loadingUsers);
                setUsers([]);
                setCurrentUser(undefined);
            }
        };

        fetchData();
        // eslint-disable-next-line
    }, []);

    return { users, currentUser, setUsers };
};

export default useUsers;
