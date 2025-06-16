
import { Outlet } from "react-router-dom";

// Completely removed authentication checks component
const ProtectedRoute = () => {
  // Always render the child routes regardless of authentication state
  return <Outlet />;
};

export default ProtectedRoute;
