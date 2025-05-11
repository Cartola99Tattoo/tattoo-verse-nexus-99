
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  requiredRole?: "cliente" | "artista" | "admin";
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  // Se ainda estiver carregando, exibir nada ou um componente de carregamento
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  // Se o usuário não estiver autenticado, redirecionar para a página de login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Se uma função específica for necessária e o usuário não a tiver, redirecionar para acesso negado
  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/access-denied" replace />;
  }

  // Se o usuário estiver autenticado (e tiver a função necessária, se especificada), renderizar a rota
  return <Outlet />;
};

export default ProtectedRoute;
