import { useState, ChangeEvent } from "react";
import { createAgent } from "../api/agentApi";

type AgentForm = {
  name: string;
  email: string;
  mobile: string;
  password: string;
};

export default function AddAgent() {
  const [form, setForm] = useState<AgentForm>({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidMobile = (mobile: string) =>
    /^[0-9]{10}$/.test(mobile);

  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./]).{8,}$/.test(
      password
    );

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
      setError("Mobile must be 10 digits");
      return;
    }

    if (!isValidPassword(form.password)) {
      setError("Weak password");
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
    <div className="max-w-lg mx-auto mt-10 p-8 rounded-2xl 
      bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl 
      animate-[fadeUp_0.4s_ease]">

      <h3 className="text-xl font-semibold mb-6">
        Add Agent
      </h3>

      {/* FEEDBACK */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-green-300 text-sm">
          {success}
        </div>
      )}

      {/* SECTION 1 */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">
          Basic Info
        </p>

        <div className="space-y-4">

          {/* NAME */}
          <div className="relative">
            <input
              value={form.name}
              onChange={(e) => handleChange(e, "name")}
              placeholder=" "
              className="peer w-full h-12 px-4 rounded-lg bg-white/5 
              border border-white/10 text-sm outline-none 
              focus:ring-2 focus:ring-indigo-500 transition"
            />
            <label className="
              absolute left-3 px-1 bg-dark
              text-gray-400 text-sm transition-all

              top-3
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-400

              peer-[&:not(:placeholder-shown)]:-top-2
              peer-[&:not(:placeholder-shown)]:text-xs
            ">
              Name
            </label>
          </div>

          {/* EMAIL */}
          <div className="relative">
            <input
              value={form.email}
              onChange={(e) => handleChange(e, "email")}
              placeholder=" "
              className="peer w-full h-12 px-4 rounded-lg bg-white/5 
              border border-white/10 text-sm outline-none 
              focus:ring-2 focus:ring-indigo-500 transition"
            />
             <label className="
              absolute left-3 px-1 bg-dark
              text-gray-400 text-sm transition-all

              top-3
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-400

              peer-[&:not(:placeholder-shown)]:-top-2
              peer-[&:not(:placeholder-shown)]:text-xs
            ">
              Email
            </label>
          </div>

          {/* MOBILE */}
          <div className="relative">
            <input
              value={form.mobile}
              onChange={(e) => handleChange(e, "mobile")}
              maxLength={10}
              placeholder=" "
              className="peer w-full h-12 px-4 rounded-lg bg-white/5 
              border border-white/10 text-sm outline-none 
              focus:ring-2 focus:ring-indigo-500 transition"
            />
             <label className="
              absolute left-3 px-1 bg-dark
              text-gray-400 text-sm transition-all

              top-3
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-400

              peer-[&:not(:placeholder-shown)]:-top-2
              peer-[&:not(:placeholder-shown)]:text-xs
            ">
              Mobile
            </label>
          </div>

        </div>
      </div>

      {/* SECTION 2 */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">
          Security
        </p>

        <div className="relative">
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange(e, "password")}
            placeholder=" "
            className="peer w-full h-12 px-4 rounded-lg bg-white/5 
            border border-white/10 text-sm outline-none 
            focus:ring-2 focus:ring-indigo-500 transition"
          />
           <label className="
              absolute left-3 px-1 bg-dark
              text-gray-400 text-sm transition-all

              top-3
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-400

              peer-[&:not(:placeholder-shown)]:-top-2
              peer-[&:not(:placeholder-shown)]:text-xs
            ">
            Password
          </label>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Must include uppercase, lowercase, number & symbol
        </p>
      </div>

      {/* ACTION */}
      <button
        onClick={submit}
        disabled={loading}
        className={`w-full h-12 rounded-xl font-semibold mt-4 transition-all
        ${
          loading
            ? "bg-indigo-500/50 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-[1.02] shadow-lg"
        }`}
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block animate-spin"></span>
        ) : (
          "Add Agent"
        )}
      </button>
    </div>
  );
}