
import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children?: ReactNode;
  title?: string;
  description?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title = "Painel Administrativo", 
  description = "Sistema de gestão 99Tattoo" 
}) => {
  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Acesso Administrativo Irrestrito</p>
            <p>Este site está em modo de desenvolvimento com acesso administrativo irrestrito. Todo o conteúdo está disponível sem necessidade de login.</p>
          </div>

          <div className="bg-white rounded-lg shadow min-h-[600px]">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
