
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  requiredRole?: "cliente" | "artista" | "admin";
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  // No modo de demonstração, todas as rotas são acessíveis
  const { simulateAdminSession } = useAuth();
  
  useEffect(() => {
    // Simular uma sessão de administrador quando acessando rotas protegidas
    if (requiredRole === "admin") {
      simulateAdminSession();
    }
  }, [requiredRole, simulateAdminSession]);
  
  return <Outlet />;
};

export default ProtectedRoute;
