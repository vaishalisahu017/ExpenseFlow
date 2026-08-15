import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage } from "../services/api.js";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await login(formData);
      toast.success("Logged in successfully.");
      navigate(redirectTo, { replace: true });
    } catch (apiError) {
      const message = getApiErrorMessage(apiError, "Unable to login. Please check your credentials.");
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Welcome back</p>
          <h1>Login to ExpenseFlow</h1>
          <p>Access your dashboard with your registered email and password.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner label="Logging in" /> : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
