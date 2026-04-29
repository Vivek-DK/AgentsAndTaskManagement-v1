import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

type Role = "admin" | "agent";

type LoginProps = {
  role: Role;
};

export default function Login({ role }: LoginProps) {
  const navigate = useNavigate();
  const { login: authLogin, token, role: userRole } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  useEffect(() => {
    if (token) {
      navigate(userRole === "admin" ? "/admin" : "/agent");
    }
  }, [token, userRole]);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        email,
        password,
        loginAs: role,
      });

      authLogin(data.token, data.user.role);

      navigate(
        data.user.role === "admin" ? "/admin" : "/agent"
      );
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden px-4">

      {/* BACKGROUND BLOBS */}
      <div className="absolute w-72 h-72 bg-indigo-500/30 blur-[120px] rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-purple-500/30 blur-[120px] rounded-full bottom-10 right-10 animate-pulse"></div>

      {/* CARD */}
      <div
        className={`w-full max-w-md p-8 rounded-2xl border border-white/10 
        bg-white/10 backdrop-blur-xl shadow-2xl 
        transition-all duration-700 
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          {role === "admin" ? "Admin Login" : "Agent Login"}
        </h2>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm px-3 py-2 rounded-lg bg-red-500/10 border border-red-400/30 text-red-300">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <input
            placeholder="Email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value.trim().toLowerCase())
            }
            className="h-11 px-4 rounded-lg bg-white/5 border border-white/10 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 
            text-sm placeholder-gray-400 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            className="h-11 px-4 rounded-lg bg-white/5 border border-white/10 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 
            text-sm placeholder-gray-400 transition"
          />

          <button
            type="submit"
            disabled={loading || !email || !password}
            className={`h-11 rounded-lg font-semibold transition-all duration-300 
            ${
              loading || !email || !password
                ? "bg-indigo-500/50 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 hover:scale-[1.02] shadow-lg"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}