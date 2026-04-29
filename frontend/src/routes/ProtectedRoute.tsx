import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Role = "admin" | "agent";

type ProtectedRouteProps = {
  children: ReactNode;
  role?: Role;
};

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
  const { token, role: userRole } = useAuth();
  const location = useLocation();

  // no token → redirect to login (preserve route)
  if (!token) {
    return (
      <Navigate
        to="/login/admin"
        replace
        state={{ from: location }}
      />
    );
  }

  // role mismatch or missing role
  if (role && (!userRole || role !== userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}