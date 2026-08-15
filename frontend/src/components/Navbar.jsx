import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <Link className="brand" to="/dashboard">
        ExpenseFlow
      </Link>

      <nav className="nav-links">
        <button className="theme-toggle" type="button" onClick={toggleTheme}>
          {isDarkMode ? "Light" : "Dark"}
        </button>
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <span className="nav-user">{user?.fullName || user?.email || "User"}</span>
            <button className="link-button" type="button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
