import React from 'react';
import { Container } from 'react-bootstrap';
import Dashboard from '../components/dashboard/Dashboard';
import LogoutButton from '../components/buttons/LogoutButton';
import { logoutWithRedirect } from '../utils/authHelpers';

const DashboardPage = () => {
    const handleLogout = () => {
        logoutWithRedirect();
    };

    return (
        <Container
            className="vw-100 vh-100 d-flex flex-column justify-content-center align-items-center p-0"
            fluid
        >
            <div
                className="d-flex flex-column align-items-center"
                style={{ gap: '50px', width: '100%' }}
            >
                <div className="w-60 d-flex justify-content-center">
                    <Dashboard />
                </div>

                <div className="vw-100 d-flex justify-content-end">
                    <LogoutButton onClick={handleLogout} />
                </div>
            </div>
        </Container>
    );
};

export default DashboardPage;
