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
        <div className="login-form">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="Username"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    autoComplete="off"
                />
                <input
                    type="password"
                    name="Password"
                    onChange={(e) => setpassword(e.target.value)}
                    autoComplete="off"
                />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};