import React from "react";
import { useAuth } from "hooks/customhooks";
export default function Header() {
    const { token } = useAuth();
    return (
        <header className="header">
            {token && <div className="header-inner">Welcome! {token}</div>}
        </header>
    );
}
