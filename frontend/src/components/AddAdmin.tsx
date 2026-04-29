import { useState, ChangeEvent } from "react";
import { createAdmin } from "../api/adminApi";

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof AdminForm
  ) => {
    let value = e.target.value;

    if (field === "mobile") {
      value = value.replace(/\D/g, "");
    }

    if (field === "email") {
      value = value.toLowerCase().trimStart();
    }

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => setForm(initialForm);

  const submit = async () => {
    setError("");
    setSuccess("");

    if (!validate()) return;

    setLoading(true);

    try {
      await createAdmin(form);
      setSuccess("Admin created successfully");
      resetForm();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 rounded-2xl 
      bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl 
      animate-[fadeUp_0.4s_ease]">

      <h3 className="text-xl font-semibold text-center mb-6">
        Create Admin
      </h3>

      {/* FEEDBACK */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-300 text-sm animate-pulse">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-green-300 text-sm">
          {success}
        </div>
      )}

      {/* FORM */}
      <div className="space-y-5">

        {/* EMAIL */}
        <div className="relative group">
          <input
            value={form.email}
            onChange={(e) => handleChange(e, "email")}
            className="peer w-full h-12 px-4 rounded-lg bg-white/5 
            border border-white/10 outline-none text-sm 
            focus:ring-2 focus:ring-indigo-500 transition"
            placeholder=" "
            autoComplete="off"
          />
          <label
            className={`absolute left-3 px-1 bg-dark text-gray-400 text-sm transition-all
            ${
              form.email
                ? "-top-2 text-xs text-indigo-400"
                : "top-3"
            }
            peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-400`}
          >
            Email
          </label>
        </div>

        {/* MOBILE */}
        <div className="relative group">
          <input
            value={form.mobile}
            maxLength={10}
            onChange={(e) => handleChange(e, "mobile")}
            className="peer w-full h-12 px-4 rounded-lg bg-white/5 
            border border-white/10 outline-none text-sm 
            focus:ring-2 focus:ring-indigo-500 transition"
            placeholder=" "
            autoComplete="off"
          />
          <label className={`
              absolute left-3 px-1 bg-dark
              text-black-400 text-sm transition-all

               ${
                  form.mobile
                    ? "-top-2 text-xs text-indigo-400"
                    : "top-3"
                }

              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-400
            `}>
            Mobile Number
          </label>
        </div>

        {/* PASSWORD */}
        <div className="relative group">
          <input
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => handleChange(e, "password")}
            className="peer w-full h-12 px-4 rounded-lg bg-white/5 
            border border-white/10 outline-none text-sm 
            focus:ring-2 focus:ring-indigo-500 transition"
            placeholder=" "
          />
          <label className={`
              absolute left-3 px-1 bg-dark
              text-black-400 text-sm transition-all

               ${
                  form.password
                    ? "-top-2 text-xs text-indigo-400"
                    : "top-3"
                }

              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-400
            `}>
            Password
          </label>
        </div>

      </div>

      {/* BUTTON */}
      <button
        onClick={submit}
        disabled={
          loading ||
          !form.email ||
          !form.password ||
          !form.mobile
        }
        className={`mt-6 w-full h-12 rounded-xl font-semibold 
        transition-all duration-300
        ${
          loading || !form.email || !form.password || !form.mobile
            ? "bg-indigo-500/50 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-[1.02] shadow-lg"
        }`}
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block animate-spin"></span>
        ) : (
          "Create Admin"
        )}
      </button>
    </div>
  );
}