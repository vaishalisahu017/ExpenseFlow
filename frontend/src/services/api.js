import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8080" : "");

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("expenseflow_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthRequest = error.config?.url?.startsWith("/auth/");

    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem("expenseflow_token");
      localStorage.removeItem("expenseflow_user");

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error, fallbackMessage) {
  if (!error.response) {
    return "Unable to reach the backend. Please check that the server is running and try again.";
  }

  if (error.response.status === 401) {
    return "Your session has expired. Please login again.";
  }

  if (error.response.status >= 500) {
    return "The server had a problem. Please try again in a moment.";
  }

  return error.response.data?.message || fallbackMessage;
}

export default api;
