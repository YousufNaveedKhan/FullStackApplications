import { useState } from "react";

import LoginForm from "./components/LoginForm.jsx";
import StudentList from "./components/StudentList.jsx";

export default function App() {
    // Start from localStorage so a page refresh does not log the user out
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

    function handleLogin(data) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }

    return (
        <div className="container">
            <header className="topbar">
                <h1>Student Manager</h1>
                {user && (
                    <div className="who">
                        <span>
                            {user.name} ({user.role})
                        </span>
                        <button onClick={handleLogout}>Log out</button>
                    </div>
                )}
            </header>

            {/* Conditional rendering: show one screen or the other */}
            {token ? <StudentList token={token} onLogout={handleLogout} /> : <LoginForm onLogin={handleLogin} />}
        </div>
    );
}
