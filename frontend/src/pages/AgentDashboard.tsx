import { useEffect, useState } from "react";
import { getMyProfile } from "../api/agentApi";
import { getMyTasks } from "../api/taskApi";
import { Task } from "../types/task";
import { Agent } from "../types/agent";
import "./agentDashboard.css";

export default function AgentDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agent, setAgent] = useState<Agent | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------- FETCH ----------------

  const fetchData = async () => {
    setError("");
    setLoading(true);

    try {
      const [agentRes, taskRes] = await Promise.allSettled([
        getMyProfile(),
        getMyTasks(),
      ]);

      // agent
      if (agentRes.status === "fulfilled") {
        setAgent(agentRes.value);
      } else {
        setError("Failed to load profile");
      }

      // tasks
      if (taskRes.status === "fulfilled") {
        setTasks(taskRes.value);
      } else {
        setError((prev) =>
          prev ? prev + " & tasks failed" : "Failed to load tasks"
        );
      }

    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- UI ----------------

  return (
    <div className="agent-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>My Dashboard</h2>
        <p>
          Welcome back,{" "}
          {loading ? "Loading..." : agent?.name || "User"}
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="error-msg">
          {error}
          <button onClick={fetchData}>Retry</button>
        </div>
      )}

      {/* TOP SECTION */}
      <div className="dashboard-top">
        <div className="agent-info-card">
          <div className="avatar">
            {agent?.name?.charAt(0).toUpperCase() || "A"}
          </div>

          <div>
            <h3>{agent?.name || "-"}</h3>
            <p>{agent?.email || "-"}</p>
            <span>{agent?.mobile || "-"}</span>
          </div>
        </div>

        <div className="stats-card">
          <h4>Total Tasks</h4>
          <span>{tasks.length}</span>
        </div>
      </div>

      {/* TASKS */}
      <div className="agent-task-container">
        <h3>Assigned Tasks</h3>

        {loading ? (
          <p className="loading">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks assigned</p>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <div key={task._id} className="agent-task-card">
                <div className="task-header">
                  <strong>{task.FirstName}</strong>
                  <span>{task.Phone}</span>
                </div>
                <p>{task.Notes || "-"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}