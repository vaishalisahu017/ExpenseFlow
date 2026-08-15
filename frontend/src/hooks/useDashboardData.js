import { useCallback, useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../services/api.js";

const emptySummary = {
  totalExpenses: 0,
  totalSpending: 0,
  averageExpense: 0,
  highestExpense: 0
};

export function useDashboardData() {
  const [summary, setSummary] = useState(emptySummary);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [categorySpending, setCategorySpending] = useState([]);
  const [monthlySpending, setMonthlySpending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError("");

    try {
      const [summaryResponse, recentResponse, categoryResponse, monthlyResponse] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/dashboard/recent"),
        api.get("/dashboard/categories"),
        api.get("/dashboard/monthly")
      ]);

      setSummary(summaryResponse.data || emptySummary);
      setRecentExpenses(Array.isArray(recentResponse.data) ? recentResponse.data : []);
      setCategorySpending(Array.isArray(categoryResponse.data) ? categoryResponse.data : []);
      setMonthlySpending(Array.isArray(monthlyResponse.data) ? monthlyResponse.data : []);
      return true;
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Unable to load dashboard data right now."));
      return false;
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    const refreshDashboard = () => fetchDashboardData(false);
    window.addEventListener("expenseflow:expenses-changed", refreshDashboard);
    window.addEventListener("focus", refreshDashboard);

    return () => {
      window.removeEventListener("expenseflow:expenses-changed", refreshDashboard);
      window.removeEventListener("focus", refreshDashboard);
    };
  }, [fetchDashboardData]);

  return {
    summary,
    recentExpenses,
    categorySpending,
    monthlySpending,
    isLoading,
    isRefreshing,
    error,
    refreshDashboard: fetchDashboardData
  };
}
