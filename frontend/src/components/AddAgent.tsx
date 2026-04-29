import { useState, ChangeEvent } from "react";
import { createAgent } from "../api/agentApi";
import "./addAgent.css";

// ✅ form type
type AgentForm = {
  name: string;
  email: string;
  mobile: string;
  password: string;
};

export default function AddAgent() {
  // typed form state
  const [form, setForm] = useState<AgentForm>({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  // validation functions
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidMobile = (mobile: string): boolean => {
    return /^[0-9]{10}$/.test(mobile);
  };

  const isValidPassword = (password: string): boolean => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./]).{8,}$/.test(
      password
    );
  };

  // generic input handler (🔥 cleaner)
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof AgentForm
  ) => {
    let value = e.target.value;

    if (field === "name") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
    }

    if (field === "mobile") {
      value = value.replace(/\D/g, "");
    }

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async () => {
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.mobile || !form.password) {
      setError("All fields are required");
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Enter a valid email address");
      return;
    }

    if (!isValidMobile(form.mobile)) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }

    if (!isValidPassword(form.password)) {
      setError(
        "Password must contain uppercase, lowercase, number and special character (min 8 characters)"
      );
      return;
    }

    try {
      setLoading(true);

      await createAgent(form);

      setForm({
        name: "",
        email: "",
        mobile: "",
        password: "",
      });

      setSuccess("Agent added successfully");
    } catch (err: any) {
        setError(typeof err === "string" ? err : "Something went wrong"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-agent-card">
      <h3>Add Agent</h3>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      {/* NAME */}
      <div className="input-group">
        <input
          value={form.name}
          onChange={(e) => handleChange(e, "name")}
          required
        />
        <label>Name</label>
      </div>

      {/* EMAIL */}
      <div className="input-group">
        <input
          value={form.email}
          onChange={(e) => handleChange(e, "email")}
          required
        />
        <label>Email</label>
      </div>

      {/* MOBILE */}
      <div className="input-group">
        <input
          value={form.mobile}
          onChange={(e) => handleChange(e, "mobile")}
          required
        />
        <label>Mobile</label>
      </div>

      {/* PASSWORD */}
      <div className="input-group">
        <input
          type="password"
          value={form.password}
          onChange={(e) => handleChange(e, "password")}
          required
        />
        <label>Password</label>
      </div>

      <small className="password-hint">
        Must include uppercase, lowercase, number & symbol
      </small>

      <button
        className="add-agent-btn"
        onClick={submit}
        disabled={loading}
      >
        {loading ? <span className="loader"></span> : "Add Agent"}
      </button>
    </div>
  );
}