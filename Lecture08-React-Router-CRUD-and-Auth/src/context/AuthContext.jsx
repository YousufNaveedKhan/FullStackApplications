import { createContext, useCallback, useContext, useMemo, useState } from "react";

// Context lets us share data with any component, without passing props through every level
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

    const login = useCallback((data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }, []);

    // useMemo: only create a new object when something really changed
    const value = useMemo(
        () => ({ token, user, isAdmin: user?.role === "admin", login, logout }),
        [token, user, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// A small custom hook, so components can write:  const { user } = useAuth();
export function useAuth() {
    return useContext(AuthContext);
}
