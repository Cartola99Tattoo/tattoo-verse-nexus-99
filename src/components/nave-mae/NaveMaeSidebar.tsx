
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  ShoppingCart,
  BarChart,
  Lock,
  FolderKanban,
  Brush,
  ListChecks,
  Settings,
  Heart,
  DollarSign,
  TrendingUp,
  Building2,
  Activity,
  Layers
} from "lucide-react";

const NaveMaeSidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const NavItem = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => {
    const active = isActive(href);
    
    return (
      <Link
        to={href}
        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 group ${
          active 
            ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-purple-glow transform scale-[1.02]" 
            : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-purple-700/20 hover:shadow-lg hover:transform hover:scale-105"
        }`}
      >
        <Icon className={`h-5 w-5 transition-colors ${active ? "text-white" : "text-purple-400 group-hover:text-purple-300"}`} />
        <span className="transition-colors">{children}</span>
      </Link>
    );
  };

  return (
    <div className="w-64 bg-gradient-to-b from-black via-gray-900 to-black border-r border-purple-800/30 flex-col space-y-2 shadow-2xl">
      <div className="px-4 py-6">
        <div className="mb-8 px-2">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
            Nave Mãe
          </h2>
          <div className="h-0.5 bg-gradient-to-r from-purple-500 to-transparent mt-2"></div>
        </div>
        
        <div className="space-y-2">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider px-2 mb-3">
              COMANDO CENTRAL
            </h3>
            <NavItem href="/nave-mae-da-tatuagem/dashboard" icon={LayoutDashboard}>
              Dashboard
            </NavItem>
            <NavItem href="/nave-mae-da-tatuagem/studios" icon={Building2}>
              Estúdios
            </NavItem>
            <NavItem href="/nave-mae-da-tatuagem/analytics" icon={BarChart}>
              Analytics
            </NavItem>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider px-2 mb-3">
              GESTÃO INTEGRADA
            </h3>
            <NavItem href="/nave-mae-da-tatuagem/artists" icon={Brush}>
              Tatuadores
            </NavItem>
            <NavItem href="/nave-mae-da-tatuagem/clients" icon={Users}>
              Clientes
            </NavItem>
            <NavItem href="/nave-mae-da-tatuagem/appointments" icon={Calendar}>
              Agendamentos
            </NavItem>
            <NavItem href="/nave-mae-da-tatuagem/projects" icon={FolderKanban}>
              Projetos
            </NavItem>
            <NavItem href="/nave-mae-da-tatuagem/loyalty" icon={Heart}>
              Fidelidade
            </NavItem>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider px-2 mb-3">
              COMERCIAL & FINANCEIRO
            </h3>
            <NavItem href="/nave-mae-da-tatuagem/products" icon={ShoppingCart}>
              Produtos
            </NavItem>
            <NavItem href="/nave-mae-da-tatuagem/stock" icon={ListChecks}>
              Estoque
            </NavItem>
            <NavItem href="/nave-mae-da-tatuagem/financial" icon={DollarSign}>
              Financeiro
            </NavItem>
            <NavItem href="/nave-mae-da-tatuagem/reports" icon={TrendingUp}>
              Relatórios
            </NavItem>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider px-2 mb-3">
              CONFIGURAÇÕES
            </h3>
            <NavItem href="/nave-mae-da-tatuagem/events" icon={Calendar}>
              Eventos
            </NavItem>
            <NavItem href="/nave-mae-da-tatuagem/blog" icon={FileText}>
              Blog
            </NavItem>
            <NavItem href="/nave-mae-da-tatuagem/settings" icon={Settings}>
              Sistema
            </NavItem>
            <NavItem href="/nave-mae-da-tatuagem/security" icon={Lock}>
              Segurança
            </NavItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NaveMaeSidebar;
