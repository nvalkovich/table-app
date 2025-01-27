import { Dispatch, SetStateAction } from 'react';
import { ApiError } from '../types/types';
import { toast } from 'react-toastify';
import { resources } from '../common/resources';

const toastifyErrors = resources.toastify.errors;

export const handleError = (
    error: unknown,
    setErrors: Dispatch<SetStateAction<Record<string, string>>>,
    validationErrorKey: string,
    genericErrorMessage: string,
) => {
    if (error instanceof Error && error.message.includes(validationErrorKey)) {
        handleValidationError(error, setErrors);
    } else {
        handleGenericError(error, genericErrorMessage);
    }
};

export const handleValidationError = (
    error: Error,
    setErrors: Dispatch<SetStateAction<Record<string, string>>>,
) => {
    try {
        const errorData: ApiError = JSON.parse(error.message);
        const newErrors: Record<string, string> = {};

        errorData.errors?.forEach((err) => {
            if (err.constraints) {
                newErrors[err.property] = Object.values(err.constraints).join(
                    ', ',
                );
            }
        });

        setErrors(newErrors);
    } catch {
        toast.error(toastifyErrors.validationError);
    }
};

export const handleGenericError = (error: unknown, fallbackMessage: string) => {
    if (error instanceof Error) {
        toast.error(error.message || fallbackMessage);
    } else {
        toast.error(fallbackMessage);
    }
};
