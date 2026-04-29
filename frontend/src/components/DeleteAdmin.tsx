import { useState, ChangeEvent } from "react";
import { deleteAdmin } from "../api/adminApi";
import "./addAdmin.css";

export default function DeleteAdmin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

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
      setError( err || "Something went wrong" );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-admin-card">
      <h3>Delete Admin</h3>

      {error && <div className="error-msg">{error}</div>}
      {message && <div className="success-msg">{message}</div>}

      <div className="input-group">
        <input
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <label>Admin Email</label>
      </div>

      <div className="input-group">
        <input
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <label>Password</label>
      </div>

      <button
        className="add-admin-btn delete"
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete Admin"}
      </button>
    </div>
  );
}