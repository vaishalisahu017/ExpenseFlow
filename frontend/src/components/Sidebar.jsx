import { NavLink } from "react-router-dom";

function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div>
        <p className="sidebar-label">Workspace</p>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/expenses" end>
            Expenses
          </NavLink>
          <NavLink to="/expenses/new">Add Expense</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
      </div>

      <button className="sidebar-logout" type="button" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
