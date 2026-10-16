import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <section className="card">
            <h2>Page not found</h2>
            <p className="muted">The page you are looking for does not exist.</p>
            <Link className="button" to="/students">
                Go to students
            </Link>
        </section>
    );
}
