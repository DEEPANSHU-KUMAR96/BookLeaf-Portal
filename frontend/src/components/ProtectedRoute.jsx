import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hook/useAuth";
import Spinner from "./Spinner";

/** Guards a group of routes. Pass `role` to restrict it to authors or admins. */
export default function ProtectedRoute({ role }) {
  const { user, status } = useAuth();

  // Wait for the session restore on page load, otherwise logged-in users flash the login page
  if (status === "initializing") return <Spinner fullPage />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />; // "/" sends them to their own portal

  return <Outlet />;
}