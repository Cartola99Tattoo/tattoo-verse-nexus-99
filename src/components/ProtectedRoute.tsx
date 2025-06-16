
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

  // Para manter compatibilidade, sempre renderiza os filhos
  // A validação real de permissões está em src/components/auth/ProtectedRoute.tsx
  return <>{children}</>;
};

export default ProtectedRoute;
