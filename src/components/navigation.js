import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "hooks/customhooks";

const navigationItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/habittrack", label: "Habit Track" },
    { to: "/meals", label: "Meals" },
    { to: "/worksignin", label: "Work Sign In" },
    { to: "/workouttimer", label: "Workout Timer" },
    { to: "/settings", label: "Settings" }
];

function getCurrentPage(pathname) {
    const currentItem = navigationItems.find(({ to }) => {
        return pathname.toLowerCase() === to.toLowerCase()
            || pathname.toLowerCase().startsWith(`${to.toLowerCase()}/`);
    });
    return currentItem ? currentItem.label : "Dashboard";
}

export default function Navigation() {
    const { token, onLogout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    if (!token) {
        return null;
    }

    return (
        <nav className="navbar" aria-label="Primary navigation">
            <button
                type="button"
                className="navbar-toggle"
                aria-expanded={isOpen}
                aria-controls="primary-navigation"
                onClick={() => setIsOpen(open => !open)}
            >
                <span className="navbar-logo" aria-hidden="true" />
                <span>Menu</span>
                <span className="navbar-current-page">{getCurrentPage(location.pathname)}</span>
                <span className="navbar-chevron" aria-hidden="true">{isOpen ? "▴" : "▾"}</span>
            </button>
            <div
                className={`navbar-menu${isOpen ? " is-open" : ""}`}
                id="primary-navigation"
                hidden={!isOpen}
            >
                {navigationItems.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `navbar-item${isActive ? " active" : ""}`}
                        onClick={() => setIsOpen(false)}
                    >
                        {label}
                    </NavLink>
                ))}
                <button
                    type="button"
                    className="navbar-logout"
                    onClick={() => {
                        setIsOpen(false);
                        onLogout();
                    }}
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
}
