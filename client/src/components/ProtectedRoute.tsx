import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function ProtectedRoute() {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
