
import React, { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title = "Painel Administrativo", 
  description = "Sistema de gestão 99Tattoo" 
}) => {
  const { profile } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500">{description}</p>
        </div>

        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">Acesso Administrativo Irrestrito</p>
          <p>Este site está em modo de desenvolvimento com acesso administrativo irrestrito. Todo o conteúdo está disponível sem necessidade de login.</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
