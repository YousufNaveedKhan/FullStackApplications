import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <header className="topbar">
            <h1>
                <Link to="/students" style={{ color: "inherit", textDecoration: "none" }}>
                    Student Manager
                </Link>
            </h1>

            {user && (
                <div className="who">
                    <span>
                        {user.name} ({user.role})
                    </span>
                    <button className="secondary" onClick={handleLogout}>
                        Log out
                    </button>
                </div>
            )}
        </header>
    );
}
