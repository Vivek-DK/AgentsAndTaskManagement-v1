import { useState } from "react";
import {
  deleteTaskById,
  deleteAllTasksApi,
} from "../api/taskApi";
import { Task } from "../types/task";

type Props = {
  tasks_prop: Task[];
  setTasks_prop: React.Dispatch<React.SetStateAction<Task[]>>;
  onRefresh: () => void;
  refreshing: boolean;
};

export default function TaskList({
  tasks_prop,
  setTasks_prop,
  onRefresh,
  refreshing,
}: Props) {
  const [search, setSearch] = useState("");
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  // 🔥 DELETE SINGLE
  const deleteTask = async () => {
    if (!taskToDelete) return;

    try {
      setDeleting(true);

      await deleteTaskById(taskToDelete);

      // smooth remove
      setTasks_prop((prev) =>
        prev.filter((t) => t._id !== taskToDelete)
      );

      setTimeout(() => {
        setTaskToDelete(null);
      }, 200);
    } catch {
      alert("Delete failed");
    } finally {
      setDeleting(false); // ✅ FIXED
    }
  };

  // 🔥 DELETE ALL
  const deleteAllTasks = async () => {
    try {
      setDeletingAll(true);

      await deleteAllTasksApi();

      setTasks_prop([]);

      setTimeout(() => {
        setShowDeleteAllConfirm(false);
      }, 200);
    } catch {
      alert("Delete failed");
    } finally {
      setDeletingAll(false);
    }
  };

  // FILTER
  const filteredTasks = tasks_prop.filter((t) => {
    const text = search.toLowerCase();

    return (
      t.FirstName?.toLowerCase().includes(text) ||
      t.Phone?.includes(text) ||
      t.Notes?.toLowerCase().includes(text) ||
      (typeof t.agent === "object" &&
        t.agent.name?.toLowerCase().includes(text))
    );
  });

  return (
    <div className="w-full">
      {/* TOP */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">Tasks</h3>

        <div className="flex gap-2 items-center">
          {/* SEARCH */}
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* REFRESH */}
          <button
            onClick={onRefresh}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer flex items-center gap-2 active:scale-95 transition"
          >
            <span
              className={`w-4 h-4 border-2 border-white border-t-transparent rounded-full ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          {/* DELETE ALL */}
          {tasks_prop.length > 0 && (
            <button
              onClick={() => setShowDeleteAllConfirm(true)}
              disabled={deletingAll}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 justify-center cursor-pointer
                backdrop-blur-md border border-red-400/20
                ${
                  deletingAll
                    ? "bg-red-500/20 text-red-300 cursor-not-allowed"
                    : "bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-105 active:scale-95 transition"
                }`}
            >
              {deletingAll ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete All"
              )}
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_3fr_1.5fr_120px] px-6 py-4 text-xs text-gray-400 border-b border-white/10">
          <span>Name</span>
          <span>Phone</span>
          <span>Notes</span>
          <span>Agent</span>
          <span className="text-right">Action</span>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="grid grid-cols-[1fr_1fr_3fr_1.5fr_120px] px-6 py-4 border-b border-white/5 hover:bg-white/5 transition"
            >
              <span className="font-medium">{task.FirstName}</span>

              <span className="text-gray-400 text-sm">
                {task.Phone}
              </span>

              <span className="text-gray-400 text-sm pr-4">
                {task.Notes || "-"}
              </span>

              <span className="text-gray-300 text-sm">
                {typeof task.agent === "object"
                  ? task.agent.name
                  : "—"}
              </span>

              <div className="flex justify-end">
                <button
                  onClick={() => setTaskToDelete(task._id)}
                  className="px-3 py-1 rounded-lg text-sm cursor-pointer
                  bg-red-500/10 text-red-400
                  hover:bg-red-500/20 hover:scale-105
                  active:scale-95 transition backdrop-blur-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {(showDeleteAllConfirm || taskToDelete) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl text-center border border-white/10 shadow-lg animate-[fadeIn_0.2s_ease]">
            <p className="mb-4">
              {taskToDelete
                ? "Delete this task?"
                : "Delete all tasks?"}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setTaskToDelete(null);
                  setShowDeleteAllConfirm(false);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 cursor-pointer rounded-lg transition"
              >
                Cancel
              </button>

              <button
                onClick={
                  taskToDelete ? deleteTask : deleteAllTasks
                }
                disabled={deleting || deletingAll}
                className="px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2
                bg-red-500/20 text-red-400 hover:bg-red-500/30
                active:scale-95 transition"
              >
                {(deleting || deletingAll) && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}