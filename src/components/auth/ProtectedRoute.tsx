
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Updated ProtectedRoute component to accept children
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Always render the child routes regardless of authentication state
  return <>{children}</>;
};

export default ProtectedRoute;
