// Vite exposes variables that start with VITE_ through import.meta.env
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// One small function that every request goes through.
// It adds the token, sends/reads JSON and turns server errors into JavaScript errors.
export async function apiFetch(path, { method = "GET", body, token } = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    // Some answers may have no JSON body, so we do not let that crash us
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data.message || "Something went wrong");
        error.status = response.status;
        error.details = data.errors;
        throw error;
    }

    return data;
}
