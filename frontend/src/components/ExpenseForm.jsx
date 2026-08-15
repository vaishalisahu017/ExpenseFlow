import LoadingSpinner from "./LoadingSpinner.jsx";
import Input from "./Input.jsx";

function ExpenseForm({ formData, onChange, onSubmit, isSubmitting, submitLabel }) {
  return (
    <form className="expense-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <Input id="title" label="Title" name="title" type="text" value={formData.title} onChange={onChange} placeholder="Lunch" required />

        <Input
          id="amount"
          label="Amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={formData.amount}
          onChange={onChange}
          placeholder="250.75"
          required
        />

        <Input id="category" label="Category" name="category" type="text" value={formData.category} onChange={onChange} placeholder="Food" required />

        <Input id="date" label="Date" name="date" type="date" value={formData.date} onChange={onChange} required />
      </div>

      <Input id="description" label="Description" multiline name="description" value={formData.description} onChange={onChange} placeholder="Optional note about this expense" rows="4" />

      <button className="primary-button form-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoadingSpinner label="Saving" /> : submitLabel}
      </button>
    </form>
  );
}

export default ExpenseForm;
