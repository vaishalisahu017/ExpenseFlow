import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout.jsx";
import Button from "../components/Button.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";
import Input from "../components/Input.jsx";
import Modal from "../components/Modal.jsx";
import Skeleton from "../components/Skeleton.jsx";
import Table from "../components/Table.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useExpenses } from "../hooks/useExpenses.js";
import api, { getApiErrorMessage } from "../services/api.js";
import { notifyExpensesChanged } from "../utils/events.js";
import { formatMoney } from "../utils/formatters.js";

const emptyEditForm = { title: "", amount: "", category: "", date: "", description: "" };
const initialFilters = { title: "", category: "", startDate: "", endDate: "" };

function Expenses() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [confirmingExpense, setConfirmingExpense] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [categories, setCategories] = useState([]);

  const { expenses, pageInfo, isLoading, error, setError, refreshExpenses } = useExpenses(
    filters,
    page,
    pageSize,
    sortField,
    sortDirection
  );

  useEffect(() => {
    if (location.state?.toast) {
      toast.success(location.state.toast);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/dashboard/categories");
        setCategories(Array.isArray(response.data) ? response.data.map((item) => item.category) : []);
      } catch {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [filters, pageSize, sortField, sortDirection]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setSortField("date");
    setSortDirection("desc");
    setPageSize(10);
    setPage(0);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setEditForm({
      title: expense.title || "",
      amount: expense.amount || "",
      category: expense.category || "",
      date: expense.date || "",
      description: expense.description || ""
    });
  };

  const closeEditModal = () => {
    setEditingExpense(null);
    setEditForm(emptyEditForm);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await api.put(`/expenses/${editingExpense.id}`, {
        ...editForm,
        amount: Number(editForm.amount),
        userId: editingExpense.userId || user?.userId
      });

      toast.success("Expense updated successfully.");
      notifyExpensesChanged();
      closeEditModal();
      await refreshExpenses();
    } catch (apiError) {
      const message = getApiErrorMessage(apiError, "Unable to update expense. Please try again.");
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmingExpense) {
      return;
    }
    setError("");

    try {
      await api.delete(`/expenses/${confirmingExpense.id}`);
      toast.success("Expense deleted successfully.");
      notifyExpensesChanged();
      setConfirmingExpense(null);
      await refreshExpenses();
    } catch (apiError) {
      const message = getApiErrorMessage(apiError, "Unable to delete expense. Please try again.");
      setError(message);
      toast.error(message);
    }
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <AppLayout eyebrow="Expenses" title="Manage expenses" subtitle="Review, edit, and delete tracked spending.">
      {error && <div className="alert alert-error dashboard-alert">{error}</div>}

      <section className="data-panel expense-list-panel">
        <div className="panel-header panel-header-row">
          <h2>All Expenses</h2>
          <Link className="secondary-button" to="/expenses/new">
            Add Expense
          </Link>
        </div>

        <div className="expense-toolbar">
          <Input
            id="titleSearch"
            label="Search title"
            name="title"
            type="search"
            value={filters.title}
            onChange={handleFilterChange}
            placeholder="Search by title"
          />

          <Input id="categoryFilter" label="Category">
            <select id="categoryFilter" name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Input>

          <Input
            id="startDate"
            label="Start date"
            name="startDate"
            type="date"
            value={filters.startDate}
            onChange={handleFilterChange}
          />

          <Input id="endDate" label="End date" name="endDate" type="date" value={filters.endDate} onChange={handleFilterChange} />

          <Input id="sortField" label="Sort by">
            <select id="sortField" value={sortField} onChange={(event) => setSortField(event.target.value)}>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="title">Title</option>
            </select>
          </Input>

          <Input id="sortDirection" label="Direction">
            <select id="sortDirection" value={sortDirection} onChange={(event) => setSortDirection(event.target.value)}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </Input>

          <Button className="toolbar-button" variant="secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>

        {isLoading ? (
          <Skeleton rows={5} />
        ) : expenses.length === 0 ? (
          <EmptyState
            title={hasFilters ? "No matching expenses" : "No expenses yet."}
            message={hasFilters ? "Try changing or clearing your filters." : "Click Add Expense to create your first expense."}
            action={
            <Link className="primary-button" to="/expenses/new">
              Add Expense
            </Link>
            }
          />
        ) : (
          <>
            <Table columns={["Title", "Category", "Amount", "Date", "Description", "Actions"]} className="expense-table">
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.title}</td>
                    <td>{expense.category}</td>
                    <td>{formatMoney(expense.amount)}</td>
                    <td>{expense.date}</td>
                    <td>{expense.description || "No description"}</td>
                    <td>
                      <div className="action-group">
                        <button className="table-action" type="button" onClick={() => openEditModal(expense)}>
                          Edit
                        </button>
                        <button className="table-action danger" type="button" onClick={() => setConfirmingExpense(expense)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </Table>

            <div className="pagination-bar">
              <Button variant="secondary" disabled={page <= 0} onClick={() => setPage((current) => Math.max(current - 1, 0))}>
                Previous
              </Button>
              <span>
                Page {pageInfo.totalPages === 0 ? 0 : pageInfo.page + 1} of {pageInfo.totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={pageInfo.last || pageInfo.totalPages === 0}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
              <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} aria-label="Rows per page">
                <option value="5">5 rows</option>
                <option value="10">10 rows</option>
                <option value="20">20 rows</option>
              </select>
            </div>
          </>
        )}
      </section>

      {editingExpense && (
        <Modal title="Edit Expense" onClose={closeEditModal}>
          <ExpenseForm
            formData={editForm}
            onChange={handleEditChange}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            submitLabel="Save Changes"
          />
        </Modal>
      )}

      {confirmingExpense && (
        <Modal title="Delete Expense" onClose={() => setConfirmingExpense(null)}>
          <p className="confirm-copy">
            Delete "{confirmingExpense.title}"? This action cannot be undone.
          </p>
          <div className="confirm-actions">
            <Button variant="secondary" onClick={() => setConfirmingExpense(null)}>
              Cancel
            </Button>
            <Button className="danger-button" onClick={handleDelete}>
              Delete Expense
            </Button>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}

export default Expenses;
