import React from "react";
import {
    NavLink,
} from 'react-router-dom';
import { useAuth } from "hooks/customhooks";
export default function Navigation() {
    const { token, onLogout } = useAuth();
    const brandRef = React.useRef(null);
    const menuRef = React.useRef(null);
    if (!token) {
        return (<></>);
    }
    const togglenav = () => {
        brandRef.current.classList.toggle('active');
        menuRef.current.classList.toggle('active');
    };
    return (
        <nav className="navbar">
            <div className={`navbar-brand`} ref={brandRef} onClick={togglenav}></div>
            <div className={`navbar-menu`} ref={menuRef}>
                <NavLink to="/dashboard" 
                    className={({ isActive }) => `navbar-item ${isActive && 'active'}`}
                    onClick={togglenav}
                >Dashboard</NavLink>
                <NavLink to="/habitTrack" 
                    className={({ isActive }) => `navbar-item ${isActive && 'active'}`}
                    onClick={togglenav}
                >habitTrack</NavLink>
                <NavLink to="/meals" 
                    className={({ isActive }) => `navbar-item ${isActive && 'active'}`}
                    onClick={togglenav}
                >meals</NavLink>
                <NavLink to="/worksignin" 
                    className={({ isActive }) => `navbar-item ${isActive && 'active'}`}
                    onClick={togglenav}
                >workSignIn</NavLink>
                <NavLink to="/todolist" 
                    className={({ isActive }) => `navbar-item ${isActive && 'active'}`}
                    onClick={togglenav}
                >todoList</NavLink>
                <NavLink to="/settings" 
                    className={({ isActive }) => `navbar-item ${isActive && 'active'}`}
                    onClick={togglenav}
                >settings</NavLink>
                <button type="button" onClick={onLogout}>Sign Out</button>
            </div>
        </nav>
    );
};