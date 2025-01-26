import React from 'react';
import { Card, Button, Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

interface AuthFormProps {
    title: string;
    submitButtonText: string;
    footerText: string;
    footerLinkText: string;
    footerLinkPath: string;
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    className?: string;
    cardStyle?: React.CSSProperties;
}

export const AuthForm = ({
    title,
    submitButtonText,
    footerText,
    footerLinkText,
    footerLinkPath,
    children,
    onSubmit,
    className = '',
    cardStyle = {},
}: AuthFormProps) => {
    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center vh-100 vw-100"
        >
            <Card
                className={`p-4 shadow-sm border-0 ${className}`}
                style={{ width: '100%', maxWidth: '500px', ...cardStyle }}
            >
                <Card.Body>
                    <Card.Title className="text-center mb-4">
                        <h3>{title}</h3>
                    </Card.Title>
                    <form onSubmit={onSubmit} noValidate>
                        {children}
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mb-3"
                        >
                            {submitButtonText}
                        </Button>
                        <div className="text-center mt-3">
                            {footerText}{' '}
                            <a href={footerLinkPath}>{footerLinkText}</a>
                        </div>
                    </form>
                </Card.Body>
            </Card>
            <ToastContainer />
        </Container>
    );
};
