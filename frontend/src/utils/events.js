export function notifyExpensesChanged() {
  window.dispatchEvent(new Event("expenseflow:expenses-changed"));
}
