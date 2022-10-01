import React from "react";
import { useAuth } from "hooks/customhooks";
export default function Login() {
    const { onLogin } = useAuth();
    const [username, setusername] = React.useState("");
    const [password, setpassword] = React.useState("");
    const testpassword = 'qqqqqq';
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== testpassword) {
            return;
        }
        onLogin(username);
    };
    return (
        <div className="contentWrapper">
            <div className="login-container">
                <h3 className="login-title">Welcome</h3>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="Username">account</label>
                        <input
                            type="text"
                            id="Username"
                            name="Username"
                            value={username}
                            onChange={(e) => setusername(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="Password">password</label>
                        <input
                            type="password"
                            id="Password"
                            name="Password"
                            onChange={(e) => setpassword(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <input type="submit" value="Sign In" className="login-button" />
                </form>
            </div>
        </div>
    );
};