import { Navigate, useLocation } from "react-router-dom";
import { getRole, isAuthenticated } from "../utils/auth";

function ProtectedRoute({ children, roles = [] }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !roles.includes(getRole())) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
