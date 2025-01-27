import LoginForm from '../components/forms/LoginForm';

interface LoginPageProps {
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const LoginPage = ({ setIsAuthenticated }: LoginPageProps) => {
    return <LoginForm setIsAuthenticated={setIsAuthenticated} />;
};

export default LoginPage;
