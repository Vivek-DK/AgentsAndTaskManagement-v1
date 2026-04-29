import { useState, useEffect } from "react";
import {
  getTasksByAgentId,
  deactivateAgent as deactivateAgentApi,
} from "../api/agentApi";

import { FaChevronRight } from "react-icons/fa";
import { Agent } from "../types/agent";
import { Task } from "../types/task";

type Props = {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  onRefresh: () => void;
  refreshing: boolean;
};

export default function Agents({
  agents,
  setAgents,
  onRefresh,
  refreshing,
}: Props) {

  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [agentTasks, setAgentTasks] = useState<Record<string, Task[]>>({});
  const [taskLoading, setTaskLoading] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false); // ✅ NEW

  // EXPAND
  const toggleAgent = async (id: string) => {
    if (expandedAgent === id) {
      setExpandedAgent(null);
      return;
    }

    setExpandedAgent(id);

    if (!agentTasks[id]) {
      setTaskLoading((p) => ({ ...p, [id]: true }));

      const tasks = await getTasksByAgentId(id);

      setAgentTasks((p) => ({ ...p, [id]: tasks }));
      setTaskLoading((p) => ({ ...p, [id]: false }));
    }
  };

  // DELETE
  const deactivateAgent = async () => {
    if (!confirmDelete || deleting) return;

    try {
      setDeleting(true);

      await deactivateAgentApi(confirmDelete);

      setAgents((prev) =>
        prev.filter((a) => a._id !== confirmDelete)
      );

      setConfirmDelete(null);
    } catch {
      alert("Failed to deactivate agent");
    } finally {
      setDeleting(false);
    }
  };

  // ESC close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !deleting) {
        setConfirmDelete(null);
      }
    };

    if (confirmDelete) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [confirmDelete, deleting]);

  return (
    <div className="w-full">

      {/* TOP BAR */}
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-xl font-semibold">Agents</h2>

        <button
          onClick={onRefresh}
          className="px-3 py-2 bg-white/10 rounded-lg flex items-center gap-2 active:scale-95 transition"
        >
          <span
            className={`inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* LIST */}
      {agents.length === 0 ? (
        <p className="text-gray-400">No agents</p>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => {
            const isOpen = expandedAgent === agent._id;

            return (
              <div
                key={agent._id}
                className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
              >
                <div
                  className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition cursor-pointer"
                  onClick={() => toggleAgent(agent._id)}
                >
                  <div className="flex items-center gap-4">
                    <button
                      className={`transition-transform ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    >
                      <FaChevronRight />
                    </button>

                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-gray-400">
                        {agent.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(agent._id);
                    }}
                    className="px-3 py-1 text-xs rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    Deactivate
                  </button>
                </div>

                {/* EXPAND */}
                {isOpen && (
                  <div className="px-6 pb-5 pt-2 border-t border-white/10 bg-white/5">

                    {taskLoading[agent._id] ? (
                      <p className="text-gray-400">Loading tasks...</p>
                    ) : agentTasks[agent._id]?.length > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {agentTasks[agent._id].map((task) => (
                          <div
                            key={task._id}
                            className="p-3 rounded-lg bg-white/5 border border-white/10"
                          >
                            <div className="flex justify-between text-sm">
                              <strong>{task.FirstName}</strong>
                              <span className="text-gray-400">
                                {task.Phone}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {task.Notes || "-"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No tasks assigned</p>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white/10 p-6 rounded-xl text-center border border-white/10 shadow-xl">

            <p className="mb-4 text-sm text-gray-300">
              Are you sure you want to deactivate this agent?
            </p>

            <div className="flex gap-3 justify-center">

              {/* CANCEL */}
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition disabled:opacity-50"
              >
                Cancel
              </button>

              {/* CONFIRM */}
              <button
                onClick={deactivateAgent}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50"
              >
                {deleting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {deleting ? "Deactivating..." : "Deactivate"}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}