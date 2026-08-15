import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage } from "../services/api.js";

function Register() {
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "USER"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

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
    setSuccess("");
    setIsLoading(true);

    try {
      await register(formData);
      toast.success("Registration successful. Please login.");
      setSuccess("Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 700);
    } catch (apiError) {
      const message = getApiErrorMessage(apiError, "Unable to register. Please try again.");
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
          <p className="eyebrow">Get started</p>
          <h1>Create your account</h1>
          <p>Register once, then login to access your protected ExpenseFlow dashboard.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Varun Sharma"
            required
          />

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
            placeholder="Minimum 6 characters"
            minLength="6"
            required
          />

          <label htmlFor="role">Role</label>
          <input
            id="role"
            name="role"
            type="text"
            value={formData.role}
            onChange={handleChange}
            required
          />

          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner label="Creating account" /> : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
