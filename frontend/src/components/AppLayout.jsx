import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "./Sidebar.jsx";

function AppLayout({ eyebrow, title, subtitle, children }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <section className="dashboard-layout">
      <Sidebar onLogout={handleLogout} />

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1>{title}</h1>
            {subtitle && <p className="dashboard-message">{subtitle}</p>}
          </div>

          <div className="user-chip">
            <span>{user?.fullName?.charAt(0) || "U"}</span>
            <div>
              <small>Signed in as</small>
              <strong>{user?.fullName || user?.email || "User"}</strong>
            </div>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}

export default AppLayout;
