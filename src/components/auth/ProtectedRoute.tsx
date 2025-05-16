
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  requiredRole?: "cliente" | "artista" | "admin";
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  // No modo de demonstração, todas as rotas são acessíveis
  // Exibir aviso de que é modo de demonstração
  const { simulateAdminSession } = useAuth();
  
  useEffect(() => {
    // Simular uma sessão de administrador quando acessando rotas protegidas
    if (requiredRole === "admin") {
      simulateAdminSession();
    }
  }, [requiredRole, simulateAdminSession]);
  
  return (
    <>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
        <p className="font-bold">Acesso Administrativo Irrestrito</p>
        <p>Este site está em modo de desenvolvimento com acesso administrativo irrestrito. Todo o conteúdo está disponível sem necessidade de login.</p>
      </div>
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
