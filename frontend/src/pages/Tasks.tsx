import TaskList from "../components/TaskList";

export default function Tasks() {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Tasks</h2>

      <div className="dashboard-content">
        <TaskList />
      </div>
    </div>
  );
}