import React from "react";
import { useLocation, Link } from "react-router-dom";
import { BarChart3, Users, FileText, Calendar, User, Package, DollarSign, TrendingUp, Gift, Shield } from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: BarChart3 },
    { name: "Tatuadores", path: "/admin/artists", icon: Users },
    { name: "Blog", path: "/admin/blog", icon: FileText },
    { name: "Agendamentos", path: "/admin/appointments", icon: Calendar },
    { name: "Clientes", path: "/admin/clients", icon: User },
    { name: "Produtos", path: "/admin/products", icon: Package },
    { name: "Financeiro", path: "/admin/financial", icon: DollarSign },
    { name: "Analytics", path: "/admin/analytics", icon: TrendingUp },
    { name: "Fidelidade", path: "/admin/loyalty", icon: Gift },
    { name: "Segurança", path: "/admin/security", icon: Shield },
  ];

  return (
    <div className="w-64 bg-gray-100 h-full py-4 px-3">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-200 ${
              location.pathname === item.path ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            <item.icon className="h-5 w-5 mr-2" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
