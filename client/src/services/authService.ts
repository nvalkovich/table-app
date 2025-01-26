export const register = async (
    name: string,
    email: string,
    password: string,
) => {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(
            data.message === 'Validation error'
                ? JSON.stringify(data)
                : data.message || 'Registration failed',
        );
    }

    return await response.json();
};
