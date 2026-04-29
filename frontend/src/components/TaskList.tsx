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
  refreshing: boolean; // ✅ added
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

  // DELETE SINGLE
  const deleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTaskById(taskToDelete);

      setTasks_prop((prev) =>
        prev.filter((t) => t._id !== taskToDelete)
      );

      setTaskToDelete(null);
    } catch {
      alert("Delete failed");
    }
  };

  // DELETE ALL
  const deleteAllTasks = async () => {
    try {
      await deleteAllTasksApi();
      setTasks_prop([]);
      setShowDeleteAllConfirm(false);
    } catch {
      alert("Delete failed");
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

      {/* TOP BAR */}
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

          {/* REFRESH BUTTON (FIXED) */}
          <button
            onClick={onRefresh}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 flex items-center gap-2 active:scale-95 transition"
          >
            <span
              className={`inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          {/* DELETE ALL */}
          {tasks_prop.length > 0 && (
            <button
              onClick={() => setShowDeleteAllConfirm(true)}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              Delete All
            </button>
          )}

        </div>
      </div>

      {/* EMPTY STATE */}
      {tasks_prop.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No tasks available
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No matching tasks found
        </div>
      ) : (

        /* TABLE */
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">

          {/* HEADER */}
          <div className="grid grid-cols-[1fr_1fr_3fr_1.5fr_100px] px-6 py-4 text-xs text-gray-400 border-b border-white/10">
            <span>Name</span>
            <span>Phone</span>
            <span>Notes</span>
            <span>Agent</span>
            <span className="text-right">Action</span>
          </div>

          {/* BODY */}
          <div className="max-h-[420px] overflow-y-auto">

            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="grid grid-cols-[1fr_1fr_3fr_1.5fr_100px] px-6 py-4 border-b border-white/5 hover:bg-white/5 transition"
              >
                <span className="font-medium">
                  {task.FirstName}
                </span>

                <span className="text-gray-400 text-sm">
                  {task.Phone}
                </span>

                <span className="text-gray-400 text-sm break-words pr-4">
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
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* DELETE ALL MODAL */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white/10 p-6 rounded-xl text-center">
            <p className="mb-4">Delete all tasks?</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteAllConfirm(false)}
                className="px-4 py-2 bg-white/10 rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteAllTasks}
                className="px-4 py-2 bg-red-500 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE DELETE MODAL */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white/10 p-6 rounded-xl text-center">
            <p className="mb-4">Delete this task?</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 bg-white/10 rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteTask}
                className="px-4 py-2 bg-red-500 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}