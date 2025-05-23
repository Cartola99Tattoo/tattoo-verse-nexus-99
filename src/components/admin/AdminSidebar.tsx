
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Calendar,
  Heart, 
  BarChart3, 
  Shield,
  Settings
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      description: "Visão geral do negócio"
    },
    {
      title: "Produtos",
      href: "/admin/products",
      icon: ShoppingBag,
      description: "Gestão de produtos e catálogo"
    },
    {
      title: "Financeiro",
      href: "/admin/finance",
      icon: DollarSign,
      description: "Controle financeiro e relatórios"
    },
    {
      title: "Clientes",
      href: "/admin/clients",
      icon: Users,
      description: "CRM e gestão de relacionamento"
    },
    {
      title: "Agendamentos",
      href: "/admin/appointments",
      icon: Calendar,
      description: "Calendário e gestão de agendamentos"
    },
    {
      title: "Fidelidade",
      href: "/admin/loyalty",
      icon: Heart,
      description: "Programa de fidelidade"
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      description: "Análises e relatórios"
    },
    {
      title: "Segurança",
      href: "/admin/security",
      icon: Shield,
      description: "Configurações de segurança"
    }
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      {/* Logo/Header */}
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <h1 className="text-xl font-bold text-red-500">99Tattoo Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-red-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                <div>{item.title}</div>
                <div className="text-xs text-gray-400 group-hover:text-gray-300">
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">admin@99tattoo.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
