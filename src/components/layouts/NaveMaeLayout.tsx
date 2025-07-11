
import React, { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import BaseLayout from "./BaseLayout";
import NaveMaeSidebar from "../nave-mae/NaveMaeSidebar";

interface NaveMaeLayoutProps {
  children?: ReactNode;
}

const NaveMaeLayout = ({ children }: NaveMaeLayoutProps) => {
  const location = useLocation();
  const [pageInfo, setPageInfo] = useState({ title: "", description: "" });

  useEffect(() => {
    const getPageInfo = (pathname: string) => {
      switch (pathname) {
        case "/nave-mae-da-tatuagem/dashboard":
          return { title: "Dashboard Central", description: "Visão geral de toda a rede 99Tattoo" };
        case "/nave-mae-da-tatuagem/studios":
          return { title: "Gestão de Estúdios", description: "Gerencie todos os estúdios parceiros" };
        case "/nave-mae-da-tatuagem/analytics":
          return { title: "Analytics Consolidado", description: "Análise de dados de toda a rede" };
        case "/nave-mae-da-tatuagem/artists":
          return { title: "Tatuadores da Rede", description: "Gerencie todos os tatuadores parceiros" };
        case "/nave-mae-da-tatuagem/clients":
          return { title: "Base de Clientes", description: "CRM consolidado de toda a rede" };
        case "/nave-mae-da-tatuagem/appointments":
          return { title: "Agendamentos Globais", description: "Visão geral de todos os agendamentos" };
        case "/nave-mae-da-tatuagem/projects":
          return { title: "Projetos Estratégicos", description: "Gerencie projetos da rede 99Tattoo" };
        case "/nave-mae-da-tatuagem/loyalty":
          return { title: "Programa de Fidelidade", description: "Gestão do programa de fidelidade da rede" };
        case "/nave-mae-da-tatuagem/products":
          return { title: "Catálogo de Produtos", description: "Gerencie produtos de toda a rede" };
        case "/nave-mae-da-tatuagem/stock":
          return { title: "Controle de Estoque", description: "Estoque consolidado da rede" };
        case "/nave-mae-da-tatuagem/financial":
          return { title: "Financeiro Consolidado", description: "Controle financeiro de toda a rede" };
        case "/nave-mae-da-tatuagem/reports":
          return { title: "Relatórios Executivos", description: "Relatórios consolidados da rede" };
        case "/nave-mae-da-tatuagem/events":
          return { title: "Eventos da Rede", description: "Gerencie eventos e convenções" };
        case "/nave-mae-da-tatuagem/blog":
          return { title: "Blog Corporativo", description: "Gerencie conteúdo do blog da rede" };
        case "/nave-mae-da-tatuagem/settings":
          return { title: "Configurações do Sistema", description: "Configurações globais da rede" };
        case "/nave-mae-da-tatuagem/security":
          return { title: "Segurança da Rede", description: "Configurações de segurança" };
        default:
          return { title: "Nave Mãe", description: "Centro de comando da 99Tattoo" };
      }
    };

    setPageInfo(getPageInfo(location.pathname));
  }, [location.pathname]);

  return (
    <BaseLayout theme="navemae">
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <NaveMaeSidebar />
        <div className="flex-1">
          {/* Header */}
          <header className="bg-black/80 backdrop-blur-sm border-b border-purple-500/20">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link to="/nave-mae-da-tatuagem" className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">99</span>
                  </div>
                  <span className="text-xl font-bold text-white">Tattoo</span>
                  <span className="text-purple-400 text-sm ml-2">Nave Mãe</span>
                </Link>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 text-purple-700 p-4 mb-4 rounded-r-lg shadow-lg">
                <p className="font-bold">Nave Mãe da Tatuagem - Comando Central</p>
                <p>Centro de controle e gestão de toda a rede 99Tattoo.</p>
              </div>

              <div className="mb-6">
                <h1 className="text-3xl font-bold text-purple-600 mb-2 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  {pageInfo.title}
                </h1>
                <p className="text-gray-600">{pageInfo.description}</p>
              </div>

              <div className="bg-white rounded-xl shadow-xl border border-gray-100 min-h-[600px] p-6 bg-gradient-to-br from-white to-gray-50">
                {children || <Outlet />}
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-black/90 border-t border-purple-500/20 text-white py-8">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-300">© 2024 99Tattoo - Nave Mãe. Centro de Comando.</p>
            </div>
          </footer>
        </div>
      </div>
    </BaseLayout>
  );
};

export default NaveMaeLayout;
