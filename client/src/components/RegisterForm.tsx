import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { register } from '../services/authService';
import { resources } from '../resources';

interface FormErrors {
    email?: string;
    name?: string;
    password?: string;
}

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const { formValues, toastify: toastifyMessages } = resources;

    const handleRegistrationSuccess = () => {
        setErrors({});
        toast.success('Registration successful!');
    };

    const handleValidationError = (error: Error) => {
        const errorData = JSON.parse(error.message);
        const newErrors: FormErrors = {};

        errorData.errors.forEach(
            (err: {
                property: string;
                constraints: { [key: string]: string };
            }) => {
                if (err.constraints) {
                    newErrors[err.property as keyof FormErrors] = Object.values(
                        err.constraints,
                    ).join(', ');
                }
            },
        );

        setErrors(newErrors);
    };

    const handleGenericError = (error: Error) => {
        toast.error(error.message || toastifyMessages.failed.registration);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await register(name, email, password);
            handleRegistrationSuccess();
        } catch (error) {
            if (error instanceof Error) {
                error.message.includes(resources.errors.validationError)
                    ? handleValidationError(error)
                    : handleGenericError(error);
            } else {
                toast.error(toastifyMessages.failed.registration);
            }
        }
    };

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center vh-100 vw-100"
        >
            <Card
                className="p-4 shadow-sm border-0"
                style={{ width: '100%', maxWidth: '500px' }}
            >
                <Card.Body>
                    <Card.Title className="text-center mb-4">
                        <h3>{formValues.registration}</h3>
                    </Card.Title>
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label>{formValues.email}</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={formValues.emailPlaceholder}
                                required
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{formValues.name}</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={formValues.namePlaceholder}
                                required
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{formValues.password}</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={formValues.passwordPlaceholder}
                                required
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mb-3"
                        >
                            {formValues.registerButton}
                        </Button>

                        <div className="text-center mt-3">
                            {formValues.alreadyHaveAnAccount}{' '}
                            <a href="/login">{formValues.loginButton}</a>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            <ToastContainer />
        </Container>
    );
};

export default RegisterForm;
