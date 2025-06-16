
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowPublic?: boolean;
}

// Component that renders children without additional layout wrapping
// Mantido para compatibilidade com o sistema existente
const ProtectedRoute = ({ children, allowPublic = true }: ProtectedRouteProps) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // DESENVOLVIMENTO: Permitir acesso irrestrito durante desenvolvimento
  console.log("ProtectedRoute (compatibility): Development mode - allowing unrestricted access");
  return <>{children}</>;
};

export default ProtectedRoute;
