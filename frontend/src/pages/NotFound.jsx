import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="not-found-page">
      <div className="not-found-card">
        <p className="eyebrow">ExpenseFlow</p>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or may have moved.</p>
        <Link className="primary-button" to="/dashboard">
          Return to Dashboard
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
