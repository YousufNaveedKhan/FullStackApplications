import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { apiFetch } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
    const { token, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Where did the visitor want to go before we sent them here?
    const goBackTo = location.state?.from?.pathname || "/students";

    // Already logged in? No need to see the login page.
    if (token) return <Navigate to={goBackTo} replace />;

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await apiFetch("/api/auth/login", { method: "POST", body: { email, password } });
            login(data);
            navigate(goBackTo, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="card login" onSubmit={handleSubmit}>
            <h2>Log in</h2>

            <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>

            <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
            </button>
        </form>
    );
}
