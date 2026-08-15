import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "./Button.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

function QuickActions({ onRefresh, isRefreshing }) {
  const handleRefresh = async () => {
    if (isRefreshing) {
      return;
    }

    const refreshed = await onRefresh();

    if (refreshed) {
      toast.success("Dashboard refreshed.");
    } else {
      toast.error("Unable to refresh dashboard right now.");
    }
  };

  return (
    <section className="quick-actions">
      <div className="panel-header">
        <h2>Quick Actions</h2>
      </div>
      <div className="quick-action-list">
        <Link className="primary-button" to="/expenses/new">
          Add Expense
        </Link>
        <Link className="secondary-button" to="/expenses">
          View Expenses
        </Link>
        <Button variant="secondary" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? <LoadingSpinner label="Refreshing" /> : "Refresh Dashboard"}
        </Button>
      </div>
    </section>
  );
}

export default QuickActions;
