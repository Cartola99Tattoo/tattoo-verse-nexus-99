
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Component that renders children without additional layout wrapping
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Always render the child routes directly without any wrapper
  return <>{children}</>;
};

export default ProtectedRoute;
