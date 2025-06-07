
import React, { ReactNode, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [pageInfo, setPageInfo] = useState({ title: "", description: "" });

  useEffect(() => {
    const getPageInfo = (pathname: string) => {
      switch (pathname) {
        case "/admin/dashboard":
          return { title: "Dashboard", description: "Visão geral e métricas do estúdio" };
        case "/admin/artists":
          return { title: "Tatuadores", description: "Gerencie os tatuadores e seus portfólios" };
        case "/admin/blog":
          return { title: "Blog", description: "Gerencie artigos e conteúdo do blog" };
        case "/admin/appointments":
          return { title: "Agendamentos", description: "Gerencie agendamentos e calendário" };
        case "/admin/clients":
          return { title: "Clientes", description: "Gerencie clientes e relacionamentos" };
        case "/admin/products":
          return { title: "Produtos", description: "Gerencie produtos e catálogo" };
        case "/admin/stock":
          return { title: "Estoque", description: "Controle de estoque e inventário" };
        case "/admin/projects":
          return { title: "Projetos", description: "Gerencie projetos e tarefas do estúdio" };
        case "/admin/financial":
          return { title: "Financeiro", description: "Controle financeiro e relatórios" };
        case "/admin/analytics":
          return { title: "Analytics", description: "Análise de dados e performance do estúdio" };
        case "/admin/loyalty":
          return { title: "Programa de Fidelidade", description: "Gerencie o programa de fidelidade do estúdio" };
        case "/admin/settings":
          return { title: "Configurações do Estúdio", description: "Configure informações gerais do estúdio" };
        case "/admin/security":
          return { title: "Segurança", description: "Configurações de segurança e acesso" };
        default:
          if (pathname.startsWith("/admin/clients/")) {
            return { title: "Detalhes do Cliente", description: "Informações detalhadas do cliente" };
          }
          return { title: "Admin", description: "Painel administrativo" };
      }
    };

    setPageInfo(getPageInfo(location.pathname));
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <AdminSidebar />
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-6">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-r-lg shadow-lg">
            <p className="font-bold">Acesso Administrativo Irrestrito</p>
            <p>Este site está em modo de desenvolvimento com acesso administrativo irrestrito. Todo o conteúdo está disponível sem necessidade de login.</p>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-red-600 mb-2 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              {pageInfo.title}
            </h1>
            <p className="text-gray-600">{pageInfo.description}</p>
          </div>

          <div className="bg-white rounded-xl shadow-xl border border-gray-100 min-h-[600px] p-6 bg-gradient-to-br from-white to-gray-50">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
