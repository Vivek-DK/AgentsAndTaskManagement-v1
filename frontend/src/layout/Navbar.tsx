import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, role, logout } = useAuth();

  const [showConfirm, setShowConfirm] = useState(false);

  const getDashboardRoute = () => {
    if (role === "admin") return "/admin";
    if (role === "agent") return "/agent";
    return "/";
  };

  const handleLogout = () => {
    logout();
    setShowConfirm(false);
    navigate("/");
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 
        bg-white/5 backdrop-blur-xl border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <p
            onClick={() => navigateTo("/")}
            className="text-lg md:text-xl font-bold cursor-pointer 
            bg-gradient-to-r from-indigo-400 to-purple-500 
            bg-clip-text text-transparent hover:scale-105 transition"
          >
            AgentTask Manager
          </p>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => navigateTo("/")}
              className="px-4 py-2 rounded-lg text-sm text-gray-300 
              hover:bg-white/10 hover:text-white transition"
            >
              Home
            </button>

            {token ? (
              <>
                <button
                  onClick={() => navigate(getDashboardRoute())}
                  disabled={!role}
                  className="px-4 py-2 rounded-lg text-sm font-medium 
                  bg-gradient-to-r from-indigo-500 to-purple-500 
                  hover:opacity-90 transition shadow-md disabled:opacity-50"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-4 py-2 rounded-lg text-sm text-red-400 
                  hover:bg-red-500/10 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigateTo("/login/admin")}
                  className="px-4 py-2 rounded-lg text-sm text-gray-300 
                  hover:bg-white/10 hover:text-white transition"
                >
                  Admin Login
                </button>

                <button
                  onClick={() => navigateTo("/login/agent")}
                  className="px-4 py-2 rounded-lg text-sm text-gray-300 
                  hover:bg-white/10 hover:text-white transition"
                >
                  Agent Login
                </button>
              </>
            )}

          </div>
        </div>
      </nav>

      {/* LOGOUT MODAL */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white/10 backdrop-blur-xl border border-white/10 
            rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-2xl 
            animate-[fadeUp_0.3s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">Logout?</h3>
            <p className="text-gray-300 text-sm mb-5">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-center gap-3">

              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-white/20 
                text-gray-300 hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-gradient-to-r 
                from-red-500 to-pink-500 hover:opacity-90 transition 
                text-white font-medium shadow-md"
              >
                Logout
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}