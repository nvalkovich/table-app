import RegisterForm from '../components/forms/RegisterForm';

interface RegisterFormProps {
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const RegisterPage = ({ setIsAuthenticated }: RegisterFormProps) => {
    return <RegisterForm setIsAuthenticated={setIsAuthenticated} />;
};

export default RegisterPage;
