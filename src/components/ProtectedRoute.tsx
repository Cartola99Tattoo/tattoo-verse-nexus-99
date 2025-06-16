
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Component that renders children without additional layout wrapping
// Mantido para compatibilidade com o sistema existente
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // DESENVOLVIMENTO: Permitir acesso irrestrito durante desenvolvimento
  // Remover verificações de autenticação para permitir navegação livre
  console.log("ProtectedRoute (compatibility): Development mode - allowing unrestricted access");
  return <>{children}</>;

  // Código de proteção comentado para referência futura
  /*
  // Para manter compatibilidade, sempre renderiza os filhos
  // A validação real de permissões está em src/components/auth/ProtectedRoute.tsx
  return <>{children}</>;
  */
};

export default ProtectedRoute;
