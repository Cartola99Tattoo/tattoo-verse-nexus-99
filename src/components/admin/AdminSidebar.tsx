
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { BarChart3, Users, FileText, Calendar, User, Package, DollarSign, TrendingUp, Gift, Shield, Package2 } from "lucide-react";

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
    { name: "Financeiro", path: "/admin/financial", icon: DollarSign },
    { name: "Analytics", path: "/admin/analytics", icon: TrendingUp },
    { name: "Fidelidade", path: "/admin/loyalty", icon: Gift },
    { name: "Segurança", path: "/admin/security", icon: Shield },
  ];

  return (
    <div className="w-64 bg-black border-r border-red-600 h-full py-4 px-3">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-red-500">99Tattoo</h2>
        <p className="text-red-300 text-sm">Admin Panel</p>
      </div>
      <nav className="flex flex-col space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${
              location.pathname === item.path 
                ? "bg-red-600 text-white font-semibold shadow-md" 
                : "text-gray-300 hover:bg-red-700 hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
