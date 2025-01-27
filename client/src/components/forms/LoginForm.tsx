import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth/authService';
import { resources } from '../../common/resources';
import { AuthForm } from './common/AuthForm';
import { InputField } from './common/InputField';
import { handleLoginSuccess } from '../../utils/authHelpers';
import { handleError } from '../../utils/errorHandlingHelpers';

interface LoginFormProps {
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const LoginForm = ({ setIsAuthenticated }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { formValues, toastify, errors: errorMessages } = resources;
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const data = await login(email, password);
            handleLoginSuccess(data.token, setIsAuthenticated, navigate);
        } catch (error) {
            handleError(
                error,
                setErrors,
                errorMessages.validationError,
                toastify.errors.login,
            );
        }
    };

    return (
        <AuthForm
            title={formValues.login}
            onSubmit={handleSubmit}
            submitButtonText={formValues.login}
            footerText={formValues.dontHaveAnAccount}
            footerLinkText={formValues.register}
            footerLinkPath="/register"
        >
            <InputField
                label={formValues.email}
                type="email"
                value={email}
                onChange={setEmail}
                placeholder={formValues.emailPlaceholder}
                error={errors.email}
            />
            <InputField
                label={formValues.password}
                type="password"
                value={password}
                onChange={setPassword}
                placeholder={formValues.passwordPlaceholder}
                error={errors.password}
            />
        </AuthForm>
    );
};

export default LoginForm;
