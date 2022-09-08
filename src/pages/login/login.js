import React from "react";
import { useNavigate } from "react-router-dom";
export default function Login(props) {
    const navigate = useNavigate();
    const [username, setusername] = React.useState("");
    const [password, setpassword] = React.useState("");
    const users = [{ username: "cifong", password: "1234" }];
    const handleSubmit = (e) => {
        e.preventDefault();
        const account = users.find((user) => user.username === username);
        if (account && account.password === password) {
            props.handleLogin(account);
            navigate("/dashboard");
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="Username"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                />
                <input
                    type="password"
                    name="Password"
                    onChange={(e) => setpassword(e.target.value)}
                />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};