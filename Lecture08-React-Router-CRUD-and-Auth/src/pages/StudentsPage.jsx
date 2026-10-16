import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiFetch } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function StudentsPage() {
    const { token, isAdmin, logout } = useAuth();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Changing this number makes the effect below run again (used after a delete)
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let ignore = false;

        async function load() {
            setLoading(true);
            setError("");

            try {
                const query = new URLSearchParams({ page, limit: 5, search });
                const data = await apiFetch(`/api/students?${query}`, { token });

                if (ignore) return;

                // If we deleted the last student on a page, go back one page
                if (data.data.length === 0 && page > 1) return setPage(page - 1);

                setResult(data);
            } catch (err) {
                if (ignore) return;
                if (err.status === 401) return logout(); // token expired
                setError(err.message);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        load();

        return () => {
            ignore = true;
        };
    }, [token, search, page, reloadKey, logout]);

    function handleSearch(event) {
        event.preventDefault();
        setPage(1);
        setSearch(searchText);
    }

    async function handleDelete(student) {
        if (!window.confirm(`Delete ${student.name}?`)) return;

        try {
            await apiFetch(`/api/students/${student._id}`, { method: "DELETE", token });
            setReloadKey((n) => n + 1); // load the list again
        } catch (err) {
            if (err.status === 401) return logout();
            setError(err.message);
        }
    }

    return (
        <section className="card">
            <div className="row">
                <h2>Students</h2>
                {/* Only admins see the Add button. The API checks the role too. */}
                {isAdmin && (
                    <Link className="button" to="/students/new">
                        Add student
                    </Link>
                )}
            </div>

            <form className="search" onSubmit={handleSearch}>
                <input
                    placeholder="Search by name or email"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {error && <p className="error">{error}</p>}
            {loading && <p className="muted">Loading...</p>}

            {result && (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Course</th>
                                <th>Marks</th>
                                {isAdmin && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {result.data.map((student) => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.course}</td>
                                    <td>{student.marks}</td>
                                    {isAdmin && (
                                        <td>
                                            <div className="actions">
                                                <Link className="button" to={`/students/${student._id}/edit`}>
                                                    Edit
                                                </Link>
                                                <button className="danger" onClick={() => handleDelete(student)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {result.data.length === 0 && !loading && <p className="muted">No students found.</p>}

                    <div className="pager">
                        <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
                            Previous
                        </button>
                        <span>
                            Page {result.page} of {Math.max(result.totalPages, 1)} ({result.total} students)
                        </span>
                        <button onClick={() => setPage(page + 1)} disabled={page >= result.totalPages}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}
