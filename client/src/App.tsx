import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MonitorDetails from "./pages/MonitorDetails";

function App() {
  const token = localStorage.getItem("watchplus_token");

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      <Route
        path="/register"
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Register />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          token ? (
            <Dashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/monitor/:id"
        element={
          token ? (
            <MonitorDetails />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;