import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

type Role = "admin" | "agent";

export default function Landing() {
  const navigate = useNavigate();
  const { token, role, logout } = useAuth();

  const [showWarning, setShowWarning] = useState(false);
  const [targetLogin, setTargetLogin] = useState<Role | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleLoginClick = (type: Role) => {
    if (processing) return;

    if (!token || !role) {
      setProcessing(true);
      navigate(`/login/${type}`);
      return;
    }

    setTargetLogin(type);
    setShowWarning(true);
  };

  const confirmLogoutAndContinue = () => {
    if (!targetLogin) return;

    logout();
    setShowWarning(false);

    setTimeout(() => {
      navigate(`/login/${targetLogin}`);
    }, 100);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowWarning(false);
    };

    if (showWarning) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showWarning]);

  return (
    <>
      <div className="min-h-screen bg-dark text-white relative overflow-hidden">

        {/* BACKGROUND BLOBS */}
        <div className="absolute z-0 w-72 h-72 bg-indigo-500/30 blur-[120px] rounded-full top-10 left-10 animate-pulse"></div>
        <div className="absolute z-0 w-72 h-72 bg-purple-500/30 blur-[120px] rounded-full bottom-10 right-10 animate-pulse"></div>
        <div className="absolute z-0 w-60 h-60 bg-emerald-400/20 blur-[120px] rounded-full top-[60%] left-[40%] animate-pulse"></div>

        {/* FLOATING CARDS (FIXED) */}
        <div className="hidden lg:block absolute z-10 top-32 right-10 rotate-[-8deg] animate-[float_6s_ease-in-out_infinite] pointer-events-none">
          <div className="w-64 p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl">
            <div className="h-5 w-2/3 bg-indigo-500 rounded mb-3 mx-auto"></div>
            <div className="h-2 bg-white/30 rounded mb-2"></div>
            <div className="h-2 w-2/3 bg-white/30 rounded mb-2"></div>
            <div className="h-2 bg-white/30 rounded"></div>
          </div>
        </div>

        <div className="hidden lg:block absolute z-10 top-[420px] left-10 rotate-[12deg] animate-[float_6s_ease-in-out_infinite] pointer-events-none">
          <div className="w-64 p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl">
            <div className="h-5 w-2/3 bg-purple-500 rounded mb-3 mx-auto"></div>
            <div className="h-2 bg-white/30 rounded mb-2"></div>
            <div className="h-2 w-2/3 bg-white/30 rounded mb-2"></div>
            <div className="h-2 bg-white/30 rounded"></div>
          </div>
        </div>

        {/* HERO (ALWAYS ABOVE) */}
        <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-6 pt-40 pb-20 animate-[fadeUp_1s_ease]">

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Manage Agents & Tasks{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Efficiently
            </span>
          </h1>

          <p className="text-gray-400 max-w-xl text-base md:text-lg mb-10">
            Upload CSV, XLSX files, distribute tasks automatically,
            and manage your workflow with precision and speed.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">

            <button
              onClick={() => handleLoginClick("admin")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 
              hover:from-indigo-600 hover:to-indigo-700 
              transition-all duration-300 font-semibold shadow-lg hover:shadow-indigo-500/30 hover:scale-105"
            >
              Login as Admin
            </button>

            <button
              onClick={() => handleLoginClick("agent")}
              className="px-6 py-3 rounded-xl border border-indigo-400 text-indigo-300 
              hover:bg-indigo-500/10 transition-all duration-300 font-semibold hover:scale-105"
            >
              Login as Agent
            </button>

          </div>
        </div>

        {/* MODAL */}
        {showWarning && targetLogin && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
            onClick={() => setShowWarning(false)}
          >
            <div
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-[90%] max-w-md text-center shadow-2xl animate-[fadeUp_0.3s_ease]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-3">
                Already Logged In
              </h3>

              <p className="text-gray-300 text-sm mb-6">
                You are already logged in. Please logout before switching accounts.
              </p>

              <div className="flex justify-center gap-4">

                <button
                  onClick={() => setShowWarning(false)}
                  className="px-4 py-2 rounded-lg border border-white/20 text-gray-300 
                  hover:bg-white/10 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmLogoutAndContinue}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 
                  hover:opacity-90 transition font-medium shadow-lg"
                >
                  Logout & Continue
                </button>

              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}