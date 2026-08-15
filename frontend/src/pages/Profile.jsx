import { useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout.jsx";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useDashboardData } from "../hooks/useDashboardData.js";
import { formatMoney } from "../utils/formatters.js";

function Profile() {
  const { user } = useAuth();
  const { summary, isLoading } = useDashboardData();
  const [profileForm, setProfileForm] = useState({ fullName: user?.fullName || "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });

  const handleProfileChange = (event) => {
    setProfileForm({ fullName: event.target.value });
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  };

  const handleNameSubmit = (event) => {
    event.preventDefault();
    toast("Backend TODO: add an update profile endpoint before saving name changes.");
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    toast("Backend TODO: add a change password endpoint before saving password changes.");
  };

  return (
    <AppLayout eyebrow="Profile" title="Your account" subtitle="Review account details and planned profile updates.">
      <div className="profile-grid">
        <Card className="profile-card">
          <h2>Account Details</h2>
          <div className="profile-detail-list">
            <div>
              <span>Full Name</span>
              <strong>{user?.fullName || "Not available"}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{user?.email || "Not available"}</strong>
            </div>
            <div>
              <span>Role</span>
              <strong>{user?.role || "USER"}</strong>
            </div>
            <div>
              <span>Account ID</span>
              <strong>{user?.userId || "Not available"}</strong>
            </div>
          </div>
        </Card>

        <Card className="profile-card">
          <h2>Expense Summary</h2>
          <div className="profile-detail-list">
            <div>
              <span>Total Expenses</span>
              <strong>{isLoading ? "Loading..." : summary.totalExpenses ?? 0}</strong>
            </div>
            <div>
              <span>Total Spending</span>
              <strong>{isLoading ? "Loading..." : formatMoney(summary.totalSpending)}</strong>
            </div>
          </div>
        </Card>

        <Card className="profile-card">
          <h2>Change Full Name</h2>
          <p className="todo-note">Backend endpoint TODO: profile update is not available yet.</p>
          <form className="expense-form" onSubmit={handleNameSubmit}>
            <Input
              id="profileFullName"
              label="Full name"
              name="fullName"
              type="text"
              value={profileForm.fullName}
              onChange={handleProfileChange}
              placeholder="Enter full name"
            />
            <Button type="submit">Save Name</Button>
          </form>
        </Card>

        <Card className="profile-card">
          <h2>Change Password</h2>
          <p className="todo-note">Backend endpoint TODO: password change is not available yet.</p>
          <form className="expense-form" onSubmit={handlePasswordSubmit}>
            <Input
              id="currentPassword"
              label="Current password"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Current password"
            />
            <Input
              id="newPassword"
              label="New password"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="New password"
            />
            <Button type="submit">Save Password</Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}

export default Profile;
