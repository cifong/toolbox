import React from "react";
import { useAuth } from "hooks/customhooks";
import {
    Navigate,
    useLocation
} from 'react-router-dom';
export default function Login() {
    const { token, onLogin } = useAuth();
    const location = useLocation();
    const [username, setusername] = React.useState("");
    const [password, setpassword] = React.useState("");
    const [error, setError] = React.useState("");
    
    if (token) {
        return <Navigate to={"/dashboard"} replace state={{ from: location }} />;
    }
    const testpassword = 'qqqqqq';
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== testpassword) {
            setError("The password is incorrect. Check it and try again.");
            return;
        }
        setError("");
        onLogin(username);
    };
    return (
        <div className="contentWrapper">
            <div className="login-container">
                <h3 className="login-title">Welcome</h3>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="Username">Account</label>
                        <input
                            type="text"
                            id="Username"
                            name="Username"
                            value={username}
                            required
                            onChange={(e) => setusername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="Password">Password</label>
                        <input
                            type="password"
                            id="Password"
                            name="Password"
                            onChange={(e) => setpassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <p className="form-error" role="alert">{error}</p>
                    <input type="submit" value="Sign In" className="login-button" />
                </form>
            </div>
        </div>
    );
};
