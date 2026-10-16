import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

// Wraps a page. If the rules are not met, it sends the visitor somewhere else.
export default function ProtectedRoute({ children, adminOnly = false }) {
    const { token, isAdmin } = useAuth();
    const location = useLocation();

    // Not logged in: go to the login page, and remember where we wanted to go
    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Logged in but not an admin
    if (adminOnly && !isAdmin) {
        return <Navigate to="/students" replace />;
    }

    return children;
}
