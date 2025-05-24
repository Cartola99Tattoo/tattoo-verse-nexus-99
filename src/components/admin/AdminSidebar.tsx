
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { BarChart3, Users, FileText, Calendar, User, Package, DollarSign, TrendingUp, Gift, Shield, Package2, FolderKanban } from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: BarChart3 },
    { name: "Tatuadores", path: "/admin/artists", icon: Users },
    { name: "Blog", path: "/admin/blog", icon: FileText },
    { name: "Agendamentos", path: "/admin/appointments", icon: Calendar },
    { name: "Clientes", path: "/admin/clients", icon: User },
    { name: "Produtos", path: "/admin/products", icon: Package },
    { name: "Estoque", path: "/admin/stock", icon: Package2 },
    { name: "Projetos", path: "/admin/projects", icon: FolderKanban },
    { name: "Financeiro", path: "/admin/financial", icon: DollarSign },
    { name: "Analytics", path: "/admin/analytics", icon: TrendingUp },
    { name: "Fidelidade", path: "/admin/loyalty", icon: Gift },
    { name: "Segurança", path: "/admin/security", icon: Shield },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-black via-gray-900 to-black border-r border-red-600 h-full py-4 px-3 shadow-2xl">
      <div className="mb-6 text-center bg-gradient-to-r from-red-600 to-red-400 p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
          99Tattoo
        </h2>
        <p className="text-red-100 text-sm font-medium">Admin Panel</p>
      </div>
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 transform ${
              location.pathname === item.path 
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold shadow-xl scale-105 border border-red-400" 
                : "text-gray-300 hover:bg-gradient-to-r hover:from-red-700 hover:to-red-600 hover:text-white hover:shadow-lg hover:scale-102 hover:border hover:border-red-500"
            }`}
          >
            <item.icon className="h-5 w-5 mr-3 drop-shadow-sm" />
            <span className="drop-shadow-sm">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
