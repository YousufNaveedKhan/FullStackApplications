import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import StudentFormPage from "./pages/StudentFormPage.jsx";
import StudentsPage from "./pages/StudentsPage.jsx";

export default function App() {
    return (
        <div className="container">
            <Navbar />

            <Routes>
                <Route path="/" element={<Navigate to="/students" replace />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Any logged-in user */}
                <Route
                    path="/students"
                    element={
                        <ProtectedRoute>
                            <StudentsPage />
                        </ProtectedRoute>
                    }
                />

                {/* Admins only */}
                <Route
                    path="/students/new"
                    element={
                        <ProtectedRoute adminOnly>
                            <StudentFormPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/students/:id/edit"
                    element={
                        <ProtectedRoute adminOnly>
                            <StudentFormPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    );
}
