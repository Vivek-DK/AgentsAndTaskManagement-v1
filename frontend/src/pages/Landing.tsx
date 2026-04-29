import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import "./landing.css";

type Role = "admin" | "agent";

export default function Landing() {
  const navigate = useNavigate();
  const { token, role, logout } = useAuth();

  const [showWarning, setShowWarning] = useState(false);
  const [targetLogin, setTargetLogin] = useState<Role | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleLoginClick = (type: Role) => {
    if (processing) return;

    if (!token || !role) {
      setProcessing(true);
      navigate(`/login/${type}`);
      return;
    }

    setTargetLogin(type);
    setShowWarning(true);
  };

  const confirmLogoutAndContinue = () => {
    if (!targetLogin) return;

    logout();
    setShowWarning(false);

    setTimeout(() => {
      navigate(`/login/${targetLogin}`);
    }, 100);
  };

  // ESC close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowWarning(false);
    };

    if (showWarning) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showWarning]);

  return (
    <>
      <div className="landing-container">
        {/* shapes */}
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>

        {/* preview */}
        <div className="dashboard-preview">
          <div className="preview-card">
            <div className="preview-header">Agents</div>
            <div className="preview-row"></div>
            <div className="preview-row short"></div>
            <div className="preview-row"></div>
          </div>
        </div>

        <div className="dashboard-preview-1">
          <div className="preview-card">
            <div className="preview-header">Tasks</div>
            <div className="preview-row"></div>
            <div className="preview-row short"></div>
            <div className="preview-row"></div>
          </div>
        </div>

        {/* hero */}
        <div className="hero">
          <h1 className="hero-title">
            Manage Agents & Tasks <span>Efficiently</span>
          </h1>

          <p className="hero-subtitle">
            Upload CSV, XLSX files, distribute tasks automatically,
            and manage your workflow with ease.
          </p>

          <div className="cta-group">
            <button
              className="cta-btn admin"
              onClick={() => handleLoginClick("admin")}
            >
              Login as Admin
            </button>

            <button
              className="cta-btn agent"
              onClick={() => handleLoginClick("agent")}
            >
              Login as Agent
            </button>
          </div>
        </div>

        {/* modal */}
        {showWarning && targetLogin && (
          <div
            className="logout-overlay"
            onClick={() => setShowWarning(false)}
          >
            <div
              className="logout-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Already Logged In</h3>
              <p>
                You are already logged in. Please logout before switching accounts.
              </p>

              <div className="logout-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowWarning(false)}
                >
                  Cancel
                </button>

                <button
                  className="confirm-btn"
                  onClick={confirmLogoutAndContinue}
                >
                  Logout & Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}