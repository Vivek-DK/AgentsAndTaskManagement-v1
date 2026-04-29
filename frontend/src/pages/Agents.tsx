import { useEffect, useState } from "react";
import {
  getAgents,
  getTasksByAgentId,
  deactivateAgent as deactivateAgentApi,
} from "../api/agentApi";
import { useAuth } from "../context/AuthContext";
import { FaChevronRight } from "react-icons/fa";
import { Agent } from "../types/agent";
import { Task } from "../types/task";
import "./agents.css";

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const [agentTasks, setAgentTasks] = useState<Record<string, Task[]>>({});
  const [taskLoading, setTaskLoading] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { role } = useAuth();

  // ---------------- FETCH AGENTS ----------------

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await getAgents();

      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setAgents(sorted);
    } catch (err: any) {
      setError(err || "Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // ---------------- TOGGLE AGENT ----------------

  const toggleAgent = async (id: string) => {
    if (expandedAgent === id) {
      setExpandedAgent(null);
      return;
    }

    setExpandedAgent(id);

    if (!agentTasks[id]) {
      try {
        setTaskLoading((prev) => ({ ...prev, [id]: true }));

        const tasks = await getTasksByAgentId(id);

        setAgentTasks((prev) => ({
          ...prev,
          [id]: tasks,
        }));
      } catch {
        setError("Failed to load tasks");
      } finally {
        setTaskLoading((prev) => ({ ...prev, [id]: false }));
      }
    }
  };

  // ---------------- DEACTIVATE ----------------

  const deactivateAgent = async () => {
    if (!confirmDelete) return;

    try {
      await deactivateAgentApi(confirmDelete);
      setSuccess("Agent deactivated successfully");
      await fetchAgents();
      setConfirmDelete(null);

      setTimeout(() => setSuccess(""), 2000);
    } catch (err: any) {
      setError(err || "Deactivation failed");
    }
  };

  // ---------------- UI ----------------

  return (
    <div className="agentscontainer">
      <h2 className="agents-title">Agents</h2>

      {/* FEEDBACK */}
      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      {loading ? (
        <div className="loading">Loading agents...</div>
      ) : agents.length === 0 ? (
        <div className="empty-state">No agents added yet</div>
      ) : (
        <>
          {/* HEADER */}
          <div className="agent-header">
            <span>Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span></span>
          </div>

          {/* LIST */}
          <div className="agents-scroll">
            {agents.map((agent) => (
              <div key={agent._id} className="agent-row-wrapper">
                <div className="agent-row">
                  <span className="agent-name">{agent.name}</span>
                  <span>{agent.email}</span>
                  <span>{agent.mobile}</span>

                  {/* expand */}
                  <button
                    className={`expand-btn ${
                      expandedAgent === agent._id ? "open" : ""
                    }`}
                    onClick={() => toggleAgent(agent._id)}
                  >
                    <FaChevronRight />
                  </button>

                  {/* admin only */}
                  {role === "admin" && (
                    <button
                      className="delete-agent-btn"
                      onClick={() => setConfirmDelete(agent._id)}
                    >
                      Deactivate
                    </button>
                  )}
                </div>

                {/* TASKS */}
                <div
                  className={`agent-expand ${
                    expandedAgent === agent._id ? "show" : ""
                  }`}
                >
                  <div className="task-panel">
                    <p>
                      <strong>Assigned Tasks:</strong>
                    </p>

                    {taskLoading[agent._id] ? (
                      <p>Loading tasks...</p>
                    ) : agentTasks[agent._id]?.length > 0 ? (
                      <>
                        <div className="task-scroll">
                          {agentTasks[agent._id].map((task) => (
                            <div
                              key={task._id}
                              className="agent-task-item"
                            >
                              <strong>{task.FirstName}</strong>
                              <span> • {task.Phone}</span>
                              <p>{task.Notes || "-"}</p>
                            </div>
                          ))}
                        </div>

                        <p className="task-count">
                          Total: {agentTasks[agent._id].length}
                        </p>
                      </>
                    ) : (
                      <p>No tasks assigned</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* SINGLE GLOBAL MODAL */}
      {confirmDelete && (
        <div
          className="logout-overlay"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="logout-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Deactivate Agent</h3>
            <p>Are you sure?</p>

            <div className="logout-actions">
              <button
                className="cancel-btn"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={deactivateAgent}
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}