import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, role, logout } = useAuth();

  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ safe dashboard route
  const getDashboardRoute = () => {
    if (role === "admin") return "/admin-dashboard";
    if (role === "agent") return "/agent-dashboard";
    return "/";
  };

  const handleLogout = () => {
    logout();
    setShowConfirm(false);
    navigate("/");
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <p onClick={() => navigateTo("/")} className="logo">
        AgentTask Manager
      </p>

      {/* ACTIONS */}
      <div className="nav-actions">
        <button
          className="nav-btn"
          onClick={() => navigateTo("/")}
        >
          Home
        </button>

        {token ? (
          <>
            <button
              className="nav-btn primary"
              onClick={() => navigate(getDashboardRoute())}
              disabled={!role}
            >
              Dashboard
            </button>

            <button
              className="nav-btn logout"
              onClick={() => setShowConfirm(true)}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="nav-btn"
              onClick={() => navigateTo("/login/admin")}
            >
              Admin Login
            </button>

            <button
              className="nav-btn"
              onClick={() => navigateTo("/login/agent")}
            >
              Agent Login
            </button>
          </>
        )}
      </div>

      {/* LOGOUT CONFIRM MODAL */}
      {showConfirm && (
        <div
          className="logout-overlay"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="logout-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Logout?</h3>
            <p>Are you sure you want to logout?</p>

            <div className="logout-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}