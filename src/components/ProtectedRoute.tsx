
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  children?: ReactNode;
}

// Completely removed authentication checks component
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Always render the child routes regardless of authentication state
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
