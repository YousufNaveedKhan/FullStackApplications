import { useEffect, useState } from "react";

import { apiFetch } from "../api.js";

export default function StudentList({ token, onLogout }) {
    const [result, setResult] = useState(null); // { data, page, total, totalPages ... }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchText, setSearchText] = useState(""); // what is typed in the box
    const [search, setSearch] = useState(""); // what we actually search for
    const [page, setPage] = useState(1);

    // Runs after the first render, and again whenever `search` or `page` changes
    useEffect(() => {
        let ignore = false; // protects us from an old answer arriving late

        async function load() {
            setLoading(true);
            setError("");

            try {
                const query = new URLSearchParams({ page, limit: 5, search });
                const data = await apiFetch(`/api/students?${query}`, { token });

                if (!ignore) setResult(data);
            } catch (err) {
                if (ignore) return;

                // An expired or invalid token means we must log in again
                if (err.status === 401) return onLogout();

                setError(err.message);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        load();

        return () => {
            ignore = true;
        };
    }, [token, search, page, onLogout]);

    function handleSearch(event) {
        event.preventDefault();
        setPage(1); // a new search always starts from page 1
        setSearch(searchText);
    }

    return (
        <section className="card">
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
                            </tr>
                        </thead>
                        <tbody>
                            {result.data.map((student) => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.course}</td>
                                    <td>{student.marks}</td>
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
