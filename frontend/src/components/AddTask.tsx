import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { uploadTasks } from "../api/taskApi";

const AddTask = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isValidFile = (file: File | null): boolean => {
    if (!file) return false;

    const allowed = [".csv", ".xlsx", ".xls"];
    const name = file.name.toLowerCase();

    if (!allowed.some((ext) => name.endsWith(ext))) {
      setError("Only CSV, XLSX, XLS allowed");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Max size 5MB");
      return false;
    }

    return true;
  };

  const handleFile = (f: File | null) => {
    setError("");
    setSuccess("");

    if (!isValidFile(f)) return;
    setFile(f);
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

    handleFile(e.dataTransfer.files?.[0] || null);
  };

  const resetAll = () => {
    setFile(null);
    setProgress(0);
    setError("");
    setSuccess("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const upload = async () => {
    setError("");
    setSuccess("");

    if (!file) {
      setError("Select a file first");
      return;
    }

    if (loading) return;

    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await uploadTasks(formData, (p) => setProgress(p));

      setSuccess("Tasks assigned successfully");
      setProgress(100);

      setTimeout(resetAll, 2000);
    } catch (err: any) {
      setError(err || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 rounded-2xl 
      bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">

      <h3 className="text-xl font-semibold mb-5">
        Upload & Assign Tasks
      </h3>

      {/* DROP ZONE */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed 
        p-8 text-center transition-all duration-300

        ${
          dragActive
            ? "border-indigo-400 bg-indigo-500/10 scale-[1.02]"
            : "border-white/10 bg-white/5 hover:bg-white/10"
        }`}
      >
        {!file ? (
          <p className="text-gray-400">
            Drag & drop or click to upload CSV / XLSX / XLS
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-gray-400">
              Ready to upload
            </p>
          </div>
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
        <div className="mt-5">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {progress}%
          </p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="mt-4 p-3 rounded-lg bg-green-500/10 text-green-300 text-sm">
          {success}
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-6 flex gap-3">

        <button
          onClick={upload}
          disabled={loading || !file}
          className={`flex-1 h-11 rounded-xl font-semibold transition-all
          ${
            loading || !file
              ? "bg-indigo-500/50 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-[1.02]"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {file && !loading && (
          <button
            onClick={resetAll}
            className="px-4 h-11 rounded-xl border border-white/10 
            text-gray-300 hover:bg-white/10 transition"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default AddTask;