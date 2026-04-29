import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

type Role = "admin" | "agent";

type Auth = {
  token: string | null;
  role: Role | null;
  login: (token: string, role: Role) => void;
  logout: () => void;
};

const AuthContext = createContext<Auth | null>(null);

// safe role parsing
const getStoredRole = (): Role | null => {
  const r = localStorage.getItem("role");
  return r === "admin" || r === "agent" ? r : null;
};

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [role, setRole] = useState<Role | null>(
    getStoredRole()
  );

  const login = (token: string, role: Role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setToken(token);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  // memoized value (performance + stability)
  const value = useMemo(
    () => ({ token, role, login, logout }),
    [token, role]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext error");
  return context;
};