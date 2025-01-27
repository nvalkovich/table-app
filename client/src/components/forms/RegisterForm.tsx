import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/auth/authService';
import { resources } from '../../common/resources';
import { AuthForm } from './common/AuthForm';
import { InputField } from './common/InputField';
import { handleRegistrationSuccess } from '../../utils/authHelpers';
import { handleError } from '../../utils/errorHandlingHelpers';

interface RegisterFormProps {
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const RegisterForm = ({ setIsAuthenticated }: RegisterFormProps) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { formValues, toastify, errors: errorMessages } = resources;
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await register(name, email, password);
            await handleRegistrationSuccess(
                email,
                password,
                setIsAuthenticated,
                navigate,
            );
        } catch (error) {
            handleError(
                error,
                setErrors,
                errorMessages.validationError,
                toastify.errors.registration,
            );
        }
    };

    return (
        <AuthForm
            title={formValues.registration}
            onSubmit={handleSubmit}
            submitButtonText={formValues.register}
            footerText={formValues.alreadyHaveAnAccount}
            footerLinkText={formValues.login}
            footerLinkPath="/login"
        >
            <InputField
                label={formValues.name}
                type="text"
                value={name}
                onChange={setName}
                placeholder={formValues.namePlaceholder}
                error={errors.name}
            />
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

export default RegisterForm;
