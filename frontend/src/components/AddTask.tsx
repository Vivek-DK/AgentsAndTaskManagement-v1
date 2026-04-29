import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { uploadTasks } from "../api/taskApi";
import "./addTask.css";

const AddTask = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  // ---------------- VALIDATION ----------------

  const isValidFile = (file: File | null): boolean => {
    if (!file) return false;

    const allowedExtensions = [".csv", ".xlsx", ".xls"];
    const fileName = file.name.toLowerCase();

    const isValidExt = allowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

    if (!isValidExt) {
      setError("Only CSV, XLSX or XLS files are allowed");
      return false;
    }

    if (!isValidSize) {
      setError("File size must be less than 5MB");
      return false;
    }

    return true;
  };

  // ---------------- HANDLERS ----------------

  const handleFile = (selectedFile: File | null) => {
    setError("");
    setSuccess("");

    if (!isValidFile(selectedFile)) return;

    setFile(selectedFile);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0] || null;
    handleFile(droppedFile);
  };

  const resetAll = () => {
    setFile(null);
    setProgress(0);
    setError("");
    setSuccess("");
    if (inputRef.current) inputRef.current.value = "";
  };

  // ---------------- UPLOAD ----------------

  const upload = async () => {
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select a file");
      return;
    }

    if (loading) return; // 🔥 prevent double click

    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await uploadTasks(formData, (percent) => {
        setProgress(percent);
      });

      setSuccess("Tasks assigned successfully");
      setProgress(100);

      // reset after short delay
      setTimeout(() => {
        resetAll();
      }, 2000);

    } catch (err: any) {
      setError(err || "Failed to assign tasks");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------

  return (
    <div className="upload-card">
      <h3>Upload File</h3>

      <div
        className={`drop-zone ${dragActive ? "active" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {file ? (
          <p className="file-name">{file.name}</p>
        ) : (
          <p>Drag & drop CSV / XLSX / XLS file here or click to upload</p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          hidden
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFile(e.target.files?.[0] || null)
          }
        />
      </div>

      {/* PROGRESS */}
      {loading && (
        <div className="progress-wrapper">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
          <span>{progress}%</span>
        </div>
      )}

      {/* ERROR */}
      {error && <div className="upload-error">{error}</div>}

      {/* SUCCESS */}
      {success && <div className="upload-success">{success}</div>}

      {/* ACTIONS */}
      <div className="upload-actions">
        <button
          className="upload-btn"
          onClick={upload}
          disabled={loading || !file}
        >
          {loading ? "Uploading..." : "Upload & Assign Tasks"}
        </button>

        {file && !loading && (
          <button className="reset-btn" onClick={resetAll}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default AddTask;