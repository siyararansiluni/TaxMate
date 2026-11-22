import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { homePaths } from "../auth/session";
import type { Role } from "../data/mockUsers";

/**
 * Wrap any group of routes with this.
 * - Not logged in            -> sent to /login
 * - Logged in, wrong role    -> sent to their own dashboard
 * - Logged in, allowed role  -> page is shown
 */
export default function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles: Role[];
}) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-sm font-medium text-slate-600">
          Checking your account...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const role = user.roles[0];

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={role && homePaths[role] ? homePaths[role] : "/login"} replace />;
  }

  return <Outlet />;
}