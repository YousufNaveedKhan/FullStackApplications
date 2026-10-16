import { useState } from "react";

import { apiFetch } from "../api.js";

export default function LoginForm({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault(); // stop the browser from reloading the page
        setError("");
        setLoading(true);

        try {
            const data = await apiFetch("/api/auth/login", {
                method: "POST",
                body: { email, password },
            });
            onLogin(data);
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
