import { useState, ChangeEvent } from "react";
import { deleteAdmin } from "../api/adminApi";

export default function DeleteAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    try {
      setLoading(true);
      const res = await deleteAdmin({ email, password });

      setMessage(res.message);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 rounded-2xl 
      bg-white/5 backdrop-blur-xl border border-red-500/20 shadow-2xl">

      <h3 className="text-xl font-semibold mb-2 text-red-400">
        Delete Admin
      </h3>

      <p className="text-xs text-gray-400 mb-6">
        This action is permanent and cannot be undone.
      </p>

      {/* ERROR */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-green-300 text-sm">
          {message}
        </div>
      )}

      {/* EMAIL */}
      <div className="relative mb-5">
        <input
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          placeholder=" "
          className="peer w-full h-12 px-4 rounded-lg bg-white/5 
          border border-white/10 text-sm outline-none 
          focus:ring-2 focus:ring-red-500 transition"
        />
       <label
          className={`absolute left-3 bg-dark px-1 text-gray-400 text-sm transition-all
          ${
            email
              ? "-top-2 text-xs text-red-400"
              : "top-3"
          }
          peer-focus:-top-2 peer-focus:text-xs peer-focus:text-red-400`}
        >
          Admin Email
        </label>
      </div>

      {/* PASSWORD */}
      <div className="relative mb-6">
        <input
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          placeholder=" "
          className="peer w-full h-12 px-4 rounded-lg bg-white/5 
          border border-white/10 text-sm outline-none 
          focus:ring-2 focus:ring-red-500 transition"
        />
        <label
          className={`absolute left-3 bg-dark px-1 text-gray-400 text-sm transition-all
          ${
            password
              ? "-top-2 text-xs text-red-400"
              : "top-3"
          }
          peer-focus:-top-2 peer-focus:text-xs peer-focus:text-red-400`}
        >
          Password
        </label>
      </div>

      {/* BUTTON */}
      <button
        onClick={submit}
        disabled={loading}
        className={`w-full h-12 rounded-xl font-semibold transition-all
        ${
          loading
            ? "bg-red-500/50 cursor-not-allowed"
            : "bg-gradient-to-r from-red-500 to-pink-500 hover:scale-[1.02] shadow-lg"
        }`}
      >
        {loading ? "Deleting..." : "Delete Admin"}
      </button>
    </div>
  );
}