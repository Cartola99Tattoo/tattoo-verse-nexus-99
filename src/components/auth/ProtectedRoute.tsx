
import { Outlet } from "react-router-dom";

// Modified to remove all authentication checks
const ProtectedRoute = () => {
  // Removing all authentication checks
  // Always render the child routes regardless of authentication state
  return <Outlet />;
};

export default ProtectedRoute;
