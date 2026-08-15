import { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("expenseflow_token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("expenseflow_user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("expenseflow_user");
      return null;
    }
  });

  const register = async (formData) => {
    const response = await api.post("/auth/register", formData);
    return response.data;
  };

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const loginData = response.data;

    localStorage.setItem("expenseflow_token", loginData.token);
    localStorage.setItem("expenseflow_user", JSON.stringify(loginData));
    setToken(loginData.token);
    setUser(loginData);

    return loginData;
  };

  const logout = () => {
    localStorage.removeItem("expenseflow_token");
    localStorage.removeItem("expenseflow_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      register,
      login,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
