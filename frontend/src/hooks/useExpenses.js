import { useCallback, useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../services/api.js";
import { useDebounce } from "./useDebounce.js";

const initialPage = {
  content: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  last: true
};

export function useExpenses(filters, page, size, sortField, sortDirection) {
  const debouncedTitle = useDebounce(filters.title);
  const debouncedCategory = useDebounce(filters.category);
  const [expensePage, setExpensePage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.get("/expenses", {
        params: {
          title: debouncedTitle || undefined,
          category: debouncedCategory || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          page,
          size,
          sort: `${sortField},${sortDirection}`
        }
      });

      setExpensePage({
        ...initialPage,
        ...response.data,
        content: Array.isArray(response.data?.content) ? response.data.content : []
      });
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Unable to load expenses with the selected filters."));
    } finally {
      setIsLoading(false);
    }
  }, [debouncedTitle, debouncedCategory, filters.startDate, filters.endDate, page, size, sortField, sortDirection]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses: expensePage.content,
    pageInfo: expensePage,
    isLoading,
    error,
    setError,
    refreshExpenses: fetchExpenses
  };
}
