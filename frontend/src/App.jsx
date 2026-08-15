import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AddExpense from "./pages/AddExpense.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Expenses from "./pages/Expenses.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <>
      <Navbar />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <PrivateRoute>
                <Expenses />
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses/new"
            element={
              <PrivateRoute>
                <AddExpense />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
