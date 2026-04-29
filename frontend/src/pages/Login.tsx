import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import "./login.css";

type Role = "admin" | "agent";

type LoginProps = {
  role: Role;
};

export default function Login({ role }: LoginProps) {
  const navigate = useNavigate();
  const { login: authLogin, token, role: userRole  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // animation
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
    <div className="login-page">
      <div className="login-shape shape1"></div>
      <div className="login-shape shape2"></div>

      <div className={`login-card ${show ? "show" : ""}`}>
        <h2>
          {role === "admin" ? "Admin Login" : "Agent Login"}
        </h2>

        {error && <div className="login-error">{error}</div>}

        <form
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
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading || !email || !password}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}