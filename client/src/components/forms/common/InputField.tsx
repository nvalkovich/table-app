import React from 'react';
import { Form } from 'react-bootstrap';

interface InputFieldProps {
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    error?: string;
    required?: boolean;
    className?: string;
    inputStyle?: React.CSSProperties;
}

export const InputField = React.memo(
    ({
        label,
        type,
        value,
        onChange,
        placeholder,
        error,
        required = true,
        className = '',
        inputStyle = {},
    }: InputFieldProps) => {
        return (
            <Form.Group className={`mb-3 ${className}`}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    required={required}
                    isInvalid={!!error}
                    style={inputStyle}
                />
                <Form.Control.Feedback type="invalid">
                    {error}
                </Form.Control.Feedback>
            </Form.Group>
        );
    },
);
