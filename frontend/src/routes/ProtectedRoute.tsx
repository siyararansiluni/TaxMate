import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getSession, homePaths } from "../auth/session";
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
  const session = getSession();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles.includes(session.role)) {
    return <Navigate to={homePaths[session.role]} replace />;
  }

  return <Outlet />;
}