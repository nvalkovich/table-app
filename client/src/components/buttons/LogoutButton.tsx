import React from 'react';
import { Button } from 'react-bootstrap';
import { resources } from '../../common/resources';

interface LogoutButtonProps {
    onClick: () => void;
}

const LogoutButton = ({ onClick }: LogoutButtonProps) => {
    return (
        <Button onClick={onClick} className="position-fixed bottom-0 end-0 m-3">
            {resources.logout}
        </Button>
    );
};

export default LogoutButton;
