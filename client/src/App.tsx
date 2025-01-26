import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { useEffect, useState } from 'react';
import { Routes as RoutePaths } from './common/types';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path={RoutePaths.base}
                    element={
                        <Navigate
                            to={
                                isAuthenticated
                                    ? RoutePaths.dashboard
                                    : RoutePaths.login
                            }
                        />
                    }
                />
                <Route
                    path={RoutePaths.register}
                    element={
                        isAuthenticated ? (
                            <Navigate to={RoutePaths.dashboard} />
                        ) : (
                            <RegisterPage
                                setIsAuthenticated={setIsAuthenticated}
                            />
                        )
                    }
                />
                <Route
                    path={RoutePaths.login}
                    element={
                        isAuthenticated ? (
                            <Navigate to={RoutePaths.dashboard} />
                        ) : (
                            <LoginPage
                                setIsAuthenticated={setIsAuthenticated}
                            />
                        )
                    }
                />
                <Route
                    path={RoutePaths.dashboard}
                    element={
                        isAuthenticated ? (
                            <DashboardPage />
                        ) : (
                            <Navigate to={RoutePaths.login} />
                        )
                    }
                />
                <Route path="*" element={<Navigate to={RoutePaths.base} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
