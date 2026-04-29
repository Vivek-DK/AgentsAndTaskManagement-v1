import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* ALL ROUTES INSIDE LAYOUT */}
        <Route element={<Layout />}>

          {/* PUBLIC */}
          <Route path="/" element={<Landing />} />
          <Route path="/login/admin" element={<Login role="admin" />} />
          <Route path="/login/agent" element={<Login role="agent" />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* AGENT */}
          <Route
            path="/agent"
            element={
              <ProtectedRoute role="agent">
                <AgentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
          path="*"
          element={
            < PageNotFound />
          }
        />

        </Route>

      </Routes>
    </Router>
  );
}