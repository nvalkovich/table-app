import React from 'react';
import { Card } from 'react-bootstrap';
import UserTable from './UserTable';
import ActionButtons from '../buttons/ActionButtons';
import { ToastContainer } from 'react-toastify';
import useUsers from '../../hooks/useUsers';
import useUserActions from '../../hooks/useUserActions';

const Dashboard = () => {
    const { users, currentUser, setUsers } = useUsers();
    const {
        selectedIds,
        setSelectedIds,
        handleBlockUsers,
        handleUnblockUsers,
        handleDeleteUsers,
    } = useUserActions(users, setUsers);

    return (
        <div className="d-flex justify-content-center align-items-center vw-100 vh-70">
            <Card className="shadow w-100" style={{ maxWidth: '1000px' }}>
                <Card.Body>
                    <ActionButtons
                        onBlock={handleBlockUsers}
                        onUnblock={handleUnblockUsers}
                        onDelete={handleDeleteUsers}
                    />

                    <UserTable
                        users={users}
                        onSelectUsers={setSelectedIds}
                        currentUser={currentUser}
                    />
                </Card.Body>
            </Card>
            <ToastContainer />
        </div>
    );
};

export default Dashboard;
