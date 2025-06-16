
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<"admin_nave_mae" | "admin_estudio" | "tatuador_da_nova_era" | "cliente">;
  redirectTo?: string;
  allowPublic?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = "/",
  allowPublic = false
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // DESENVOLVIMENTO: Permitir acesso irrestrito durante desenvolvimento
  // Remover verificações de autenticação para permitir navegação livre
  console.log("ProtectedRoute: Development mode - allowing unrestricted access");
  return <>{children}</>;

  // Código de proteção comentado para referência futura
  /*
  // Se permite acesso público, renderiza sem verificação
  if (allowPublic) {
    console.log("ProtectedRoute: Public access allowed");
    return <>{children}</>;
  }

  // Se não há usuário autenticado, redireciona para login
  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }

  // Se há roles específicos permitidos e o usuário não tem acesso
  if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
    console.log("ProtectedRoute: User role not allowed", { userRole: profile.role, allowedRoles, redirectTo });
    return <Navigate to={redirectTo} replace />;
  }

  console.log("ProtectedRoute: Access granted", { userRole: profile?.role, allowedRoles });
  return <>{children}</>;
  */
};

export default ProtectedRoute;
