import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { apiFetch } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const emptyForm = { name: "", email: "", phone: "", course: "", marks: 0 };

// One page for two jobs: /students/new (create) and /students/:id/edit (update)
export default function StudentFormPage() {
    const { id } = useParams(); // undefined on /students/new
    const isEditing = Boolean(id);

    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState([]); // list of messages from the API

    // When editing, load the existing student into the form
    useEffect(() => {
        if (!isEditing) return;

        let ignore = false;

        async function load() {
            try {
                const student = await apiFetch(`/api/students/${id}`, { token });
                if (ignore) return;

                setForm({
                    name: student.name,
                    email: student.email,
                    phone: student.phone || "",
                    course: student.course,
                    marks: student.marks,
                });
            } catch (err) {
                if (ignore) return;
                if (err.status === 401) return logout();
                setErrors([err.message]);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        load();

        return () => {
            ignore = true;
        };
    }, [id, isEditing, token, logout]);

    // One handler for every input: the input's name tells us which field changed
    function handleChange(event) {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrors([]);
        setSaving(true);

        try {
            const body = { ...form, marks: Number(form.marks) };

            if (isEditing) {
                await apiFetch(`/api/students/${id}`, { method: "PUT", body, token });
            } else {
                await apiFetch("/api/students", { method: "POST", body, token });
            }

            navigate("/students");
        } catch (err) {
            if (err.status === 401) return logout();

            // The API sends a list for validation errors, and a single message otherwise
            setErrors(err.details || [err.message]);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p className="muted">Loading...</p>;

    return (
        <form className="card form-grid" onSubmit={handleSubmit}>
            <div className="row">
                <h2>{isEditing ? "Edit student" : "Add student"}</h2>
                <Link className="button" to="/students">
                    Back
                </Link>
            </div>

            <label>
                Name
                <input name="name" value={form.name} onChange={handleChange} required />
            </label>

            <label>
                Email
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </label>

            <label>
                Phone
                <input name="phone" value={form.phone} onChange={handleChange} />
            </label>

            <label>
                Course
                <input name="course" value={form.course} onChange={handleChange} required />
            </label>

            <label>
                Marks (0 to 100)
                <input name="marks" type="number" min="0" max="100" value={form.marks} onChange={handleChange} />
            </label>

            {errors.length > 0 && (
                <ul className="error">
                    {errors.map((message) => (
                        <li key={message}>{message}</li>
                    ))}
                </ul>
            )}

            <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
            </button>
        </form>
    );
}
