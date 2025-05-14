
import { Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRole?: "cliente" | "artista" | "admin";
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  // No modo de demonstração, todas as rotas são acessíveis
  // Exibir aviso de que é modo de demonstração
  
  return (
    <>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
        <p className="font-bold">Modo de Demonstração</p>
        <p>Este site está em modo de demonstração. Todas as funcionalidades estão disponíveis sem necessidade de login.</p>
      </div>
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
