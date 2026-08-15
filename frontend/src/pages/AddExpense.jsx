import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout.jsx";
import Card from "../components/Card.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api, { getApiErrorMessage } from "../services/api.js";
import { notifyExpensesChanged } from "../utils/events.js";

const initialFormData = {
  title: "",
  amount: "",
  category: "",
  date: "",
  description: ""
};

function AddExpense() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await api.post("/expenses", {
        ...formData,
        amount: Number(formData.amount),
        userId: user?.userId
      });

      notifyExpensesChanged();
      setFormData(initialFormData);
      toast.success("Expense created successfully.");
      setTimeout(() => navigate("/expenses", { state: { toast: "Expense created successfully." } }), 800);
    } catch (apiError) {
      const message = getApiErrorMessage(apiError, "Unable to create expense. Please try again.");
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout eyebrow="Add Expense" title="Create a new expense" subtitle="Track spending with a clear, simple form.">
      {error && <div className="alert alert-error dashboard-alert">{error}</div>}

      <Card className="form-card">
        <ExpenseForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Create Expense"
        />
      </Card>
    </AppLayout>
  );
}

export default AddExpense;
