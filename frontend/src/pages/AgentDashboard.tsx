import { useEffect, useState } from "react";
import { getMyProfile } from "../api/agentApi";
import { getMyTasks } from "../api/taskApi";
import { Task } from "../types/task";
import { Agent } from "../types/agent";

export default function AgentDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agent, setAgent] = useState<Agent | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setError("");
    setLoading(true);

    try {
      const [agentRes, taskRes] = await Promise.allSettled([
        getMyProfile(),
        getMyTasks(),
      ]);

      if (agentRes.status === "fulfilled") {
        setAgent(agentRes.value);
      } else {
        setError("Failed to load profile");
      }

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

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold">
          My Dashboard
        </h2>
        <p className="text-gray-400 mt-1">
          Welcome back, {loading ? "Loading..." : agent?.name || "User"}
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-400/30 text-red-300 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={fetchData}
            className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* TOP CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        {/* PROFILE CARD */}
        <div className="md:col-span-2 p-6 rounded-2xl 
          bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg 
          flex items-center gap-5">

          <div className="w-14 h-14 rounded-full flex items-center justify-center 
            bg-gradient-to-r from-indigo-500 to-purple-500 font-bold text-lg">
            {agent?.name?.charAt(0).toUpperCase() || "A"}
          </div>

          <div>
            <h3 className="text-lg font-medium">
              {agent?.name || "-"}
            </h3>
            <p className="text-gray-400 text-sm">
              {agent?.email || "-"}
            </p>
            <span className="text-xs text-gray-500">
              {agent?.mobile || "-"}
            </span>
          </div>
        </div>

        {/* STATS CARD */}
        <div className="p-6 rounded-2xl 
          bg-gradient-to-r from-indigo-500/20 to-purple-500/20 
          border border-white/10 backdrop-blur-xl shadow-lg 
          flex flex-col justify-center items-center">

          <p className="text-sm text-gray-300 mb-1">
            Total Tasks
          </p>

          <span className="text-4xl font-bold">
            {tasks.length}
          </span>
        </div>

      </div>

      {/* TASK SECTION */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">

        <h3 className="text-lg font-semibold mb-5">
          Assigned Tasks
        </h3>

        {loading ? (
          <p className="text-gray-400">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-400">No tasks assigned</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {tasks.map((task) => (
              <div
                key={task._id}
                className="p-5 rounded-xl bg-white/5 border border-white/10 
                hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-sm">
                    {task.FirstName}
                  </strong>
                  <span className="text-xs text-gray-400">
                    {task.Phone}
                  </span>
                </div>

                <p className="text-sm text-gray-400">
                  {task.Notes || "-"}
                </p>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}