import React from "react";
import { AuthContext } from "context/authContext";
import {
    Navigate,
    Outlet,
    useNavigate,
    useLocation,
} from 'react-router-dom';
import { useAuth } from "hooks/customhooks";
const fakeAuth = (username) =>
    new Promise((resolve) => {
        setTimeout(() => resolve(username), 250);
    });
const AuthProvider = ({ children }) => {
    const [token, setToken] = React.useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogin = async (username) => {
        const token = await fakeAuth(username);
        setToken(token);
        const origin = location.state?.from?.pathname || '/dashboard';
        navigate(origin);
    };

    const handleLogout = () => {
        setToken(null);
    };

    const value = {
        token,
        onLogin: handleLogin,
        onLogout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
const ProtectedRoute = ({ redirectPath = '/login' }) => {
    const { token } = useAuth();
    const location = useLocation();
    if (!token) {
        return <Navigate to={redirectPath} replace state={{ from: location }} />;
    }

    return <Outlet />;
};
export { AuthProvider, ProtectedRoute };