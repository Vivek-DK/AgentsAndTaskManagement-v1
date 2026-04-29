import { useState, ChangeEvent } from "react";
import { createAdmin } from "../api/adminApi";
import "./addAdmin.css";

type AdminForm = {
  email: string;
  password: string;
  mobile: string;
};

const initialForm: AdminForm = {
  email: "",
  password: "",
  mobile: "",
};

export default function AddAdmin() {
  const [form, setForm] = useState<AdminForm>(initialForm);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // ---------------- VALIDATION ----------------

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./]).{8,}$/.test(
      password
    );

  const isValidPhone = (mobile: string) =>
    /^[6-9]\d{9}$/.test(mobile);

  const validate = (): boolean => {
    const email = form.email.trim();
    const password = form.password;
    const mobile = form.mobile;

    if (!email || !password || !mobile) {
      setError("All fields are required");
      return false;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email format");
      return false;
    }

    if (!isValidPhone(mobile)) {
      setError("Enter valid 10 digit mobile number");
      return false;
    }

    if (!isValidPassword(password)) {
      setError(
        "Password must contain uppercase, lowercase, number and special character"
      );
      return false;
    }

    return true;
  };

  // ---------------- HANDLERS ----------------

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof AdminForm
  ) => {
    let value = e.target.value;

    if (field === "mobile") {
      value = value.replace(/\D/g, "")
    }

    if (field === "email") {
      value = value.toLowerCase().trimStart();
    }

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  // ---------------- SUBMIT ----------------

  const submit = async () => {
    console.log(form);
    setError("");
    setSuccess("");

    if (!validate()) return;

    setLoading(true);

    try {
      await createAdmin(form);

      setSuccess("Admin created successfully");
      resetForm();

      // auto clear success
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------

  return (
    <div className="add-admin-card">
      <h3>Create Admin</h3>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

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
          maxLength={10}
          onChange={(e) => handleChange(e, "mobile")}
          required
        />
        <label>Mobile Number</label>
      </div>

      {/* PASSWORD */}
      <div className="input-group">
        <input
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => handleChange(e, "password")}
          required
        />
        <label>Password</label>
      </div>

      <button
        className="add-admin-btn"
        onClick={submit}
        disabled={
          loading ||
          !form.email ||
          !form.password ||
          !form.mobile
        }
      >
        {loading ? <span className="loader"></span> : "Create Admin"}
      </button>
    </div>
  );
}