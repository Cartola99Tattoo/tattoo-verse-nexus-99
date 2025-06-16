
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<"admin_nave_mae" | "admin_estudio" | "tatuador_da_nova_era" | "cliente">;
  redirectTo?: string;
  allowPublic?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  allowPublic = true
}: ProtectedRouteProps) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // DESENVOLVIMENTO: Permitir acesso irrestrito durante desenvolvimento
  console.log("ProtectedRoute: Development mode - allowing unrestricted access");
  return <>{children}</>;
};

export default ProtectedRoute;
