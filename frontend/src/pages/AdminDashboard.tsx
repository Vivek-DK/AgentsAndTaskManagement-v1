import { useState, useEffect } from "react";
import Agents from "./Agents";
import TaskList from "../components/TaskList";
import AddAgent from "../components/AddAgent";
import AddTask from "../components/AddTask";
import AddAdmin from "../components/AddAdmin";
import DeleteAdmin from "../components/DeleteAdmin";

import { getMyAdmin } from "../api/adminApi";
import { getAllTasks } from "../api/taskApi";
import { getAgents } from "../api/agentApi";

import { User } from "../types/user";
import { Task } from "../types/task";
import { Agent } from "../types/agent";

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

  // ✅ TASK STATE
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [tasksRefreshing, setTasksRefreshing] = useState(false);

  // ✅ AGENT STATE
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoaded, setAgentsLoaded] = useState(false);
  const [agentsRefreshing, setAgentsRefreshing] = useState(false);

  // ---------------- ADMIN ----------------
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

  // ---------------- TASKS ----------------
  const fetchTasks = async (isRefresh = false) => {
    try {
      if (isRefresh) setTasksRefreshing(true);

      const data = await getAllTasks();
      setTasks(data);
      setTasksLoaded(true);
    } finally {
      if (isRefresh) setTasksRefreshing(false);
    }
  };

  // ---------------- AGENTS ----------------
  const fetchAgents = async (isRefresh = false) => {
    try {
      if (isRefresh) setAgentsRefreshing(true);

      const data = await getAgents();

      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setAgents(sorted);
      setAgentsLoaded(true);
    } finally {
      if (isRefresh) setAgentsRefreshing(false);
    }
  };

  // ---------------- TAB CONTROL ----------------
  useEffect(() => {
    if (activeTab === "agents" && !agentsLoaded) {
      fetchAgents();
    }

    if (activeTab === "tasks" && !tasksLoaded) {
      fetchTasks();
    }
  }, [activeTab]);

  // ---------------- RENDER ----------------
  const renderTab = () => {
    switch (activeTab) {
      case "agents":
        return (
          <Agents
            agents={agents}
            setAgents={setAgents}
            onRefresh={() => fetchAgents(true)}
            refreshing={agentsRefreshing}
          />
        );

      case "tasks":
        return (
          <TaskList
            tasks_prop={tasks}
            setTasks_prop={setTasks}
            onRefresh={() => fetchTasks(true)}
            refreshing={tasksRefreshing}
          />
        );

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

  return (
    <div className="max-w-7xl mx-auto">

      <h2 className="text-2xl font-semibold mb-6">
        Admin Dashboard
      </h2>

      {/* ADMIN CARD */}
      <div className="mb-6 flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500 font-bold">
          {admin?.email?.charAt(0).toUpperCase() || "A"}
        </div>

        <div>
          <p className="text-xs text-gray-400">Administrator</p>
          <h3>{loading ? "Loading..." : admin?.email}</h3>
        </div>
      </div>

      {/* TABS */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {["agents","tasks","addAgent","addTask","addAdmin","deleteAdmin"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t as Tab)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === t
                ? "bg-white text-black"
                : "bg-white/5"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        {renderTab()}
      </div>
    </div>
  );
}