import { Navigate, Outlet } from "react-router-dom";
import { useAuth, type Role } from "@/lib/auth-store";

export function ProtectedRoute({ role }: { role: Role }) {
  const user = useAuth((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/voter/dashboard"} replace />;
  }
  return <Outlet />;
}
