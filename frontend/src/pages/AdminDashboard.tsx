import { useState, useEffect } from "react";
import Agents from "./Agents";
import TaskList from "../components/TaskList";
import AddAgent from "../components/AddAgent";
import AddTask from "../components/AddTask";
import AddAdmin from "../components/AddAdmin";
import DeleteAdmin from "../components/DeleteAdmin";
import { getMyAdmin } from "../api/adminApi";
import { User } from "../types/user";
import "./adminDashboard.css";

type Tab =
  | "agents"
  | "tasks"
  | "addAgent"
  | "addTask"
  | "addAdmin"
  | "deleteAdmin";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("agents");

  // ---------------- FETCH ----------------

  const fetchAdmin = async () => {
    try {
      setLoading(true);
      const data = await getMyAdmin();
      setAdmin(data);
    } catch (err: any) {
      setError(err || "Failed to load admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  // ---------------- TAB RENDER ----------------

  const renderTab = () => {
    switch (activeTab) {
      case "agents":
        return <Agents />;
      case "tasks":
        return <TaskList />;
      case "addAgent":
        return <AddAgent />;
      case "addTask":
        return <AddTask />;
      case "addAdmin":
        return <AddAdmin />;
      case "deleteAdmin":
        return <DeleteAdmin />;
      default:
        return null;
    }
  };

  // ---------------- UI ----------------

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* ERROR */}
      {error && (
        <div className="error-msg">
          {error}
          <button onClick={fetchAdmin}>Retry</button>
        </div>
      )}

      {/* ADMIN INFO */}
      <div className="admin-info-card">
        <div className="admin-avatar">
          {admin?.email?.charAt(0).toUpperCase() || "A"}
        </div>

        <div className="admin-details">
          <p className="admin-role">Administrator</p>

          <h3 className="admin-name">
            {loading
              ? "Loading..."
              : admin?.email || "Unavailable"}
          </h3>

          <span className="admin-phone">
            {loading
              ? "..."
              : admin?.mobile || "No phone number"}
          </span>
        </div>
      </div>

      {/* TABS */}
      <div className="dashboard-top">
        <div className="dashboard-tabs">
          <div className="tab-group">
            <button
              className={activeTab === "agents" ? "tab active" : "tab"}
              onClick={() => setActiveTab("agents")}
            >
              Agents
            </button>

            <button
              className={activeTab === "tasks" ? "tab active" : "tab"}
              onClick={() => setActiveTab("tasks")}
            >
              Tasks
            </button>

            <button
              className={activeTab === "addAgent" ? "tab active" : "tab"}
              onClick={() => setActiveTab("addAgent")}
            >
              + Agent
            </button>

            <button
              className={activeTab === "addTask" ? "tab active" : "tab"}
              onClick={() => setActiveTab("addTask")}
            >
              + Task
            </button>

            <button
              className={
                activeTab === "addAdmin"
                  ? "tab admin active"
                  : "tab admin"
              }
              onClick={() => setActiveTab("addAdmin")}
            >
              + Admin
            </button>

            <button
              className={
                activeTab === "deleteAdmin"
                  ? "tab danger active"
                  : "tab danger"
              }
              onClick={() => setActiveTab("deleteAdmin")}
            >
              Delete Admin
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="dashboard-content">
        <div className="fade-in">{renderTab()}</div>
      </div>
    </div>
  );
}