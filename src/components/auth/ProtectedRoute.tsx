
import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  requiredRole?: "cliente" | "artista" | "admin";
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, profile, simulateAdminSession } = useAuth();
  
  useEffect(() => {
    // Simular uma sessão de administrador quando acessando rotas protegidas
    if (requiredRole === "admin") {
      simulateAdminSession();
    }
  }, [requiredRole, simulateAdminSession]);
  
  // Verificar se o usuário tem permissões para acessar a rota
  // Obs: No modo de demonstração, não bloquear o acesso
  if (!user || !profile) {
    // Redirecionando para a página inicial em vez de AccessDenied
    return <Navigate to="/" />;
  }
  
  // Se um papel específico for necessário, verificar se o usuário tem esse papel
  if (requiredRole && profile.role !== requiredRole) {
    // Exceção para artistas que podem acessar algumas páginas administrativas
    if (requiredRole === "admin" && profile.role === "artista" && 
        (window.location.pathname === "/admin" || window.location.pathname === "/admin/products")) {
      // Permitir artistas acessarem /admin e /admin/products
    } else {
      // Redirecionando para a página inicial em vez de AccessDenied
      return <Navigate to="/" />;
    }
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
