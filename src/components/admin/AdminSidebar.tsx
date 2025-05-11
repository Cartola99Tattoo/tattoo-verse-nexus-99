
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  ShoppingCart, 
  FileText, 
  Users, 
  Calendar, 
  Package, 
  Settings,
  LayoutDashboard,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminSidebar() {
  const location = useLocation();
  const { profile } = useAuth();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const isAdmin = profile?.role === 'admin';
  const isArtist = profile?.role === 'artista';

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />,
      access: true, // Todos têm acesso
    },
    {
      title: 'Produtos',
      path: '/admin/products',
      icon: <Package size={20} />,
      access: isAdmin || isArtist,
    },
    {
      title: 'Pedidos',
      path: '/admin/orders',
      icon: <ShoppingCart size={20} />,
      access: isAdmin || isArtist,
    },
    {
      title: 'Clientes',
      path: '/admin/customers',
      icon: <Users size={20} />,
      access: isAdmin || isArtist,
    },
    {
      title: 'Blog',
      path: '/admin/blog',
      icon: <FileText size={20} />,
      access: isAdmin || isArtist,
    },
    {
      title: 'Agendamentos',
      path: '/admin/appointments',
      icon: <Calendar size={20} />,
      access: isAdmin || isArtist,
    },
    {
      title: 'Finanças',
      path: '/admin/finance',
      icon: <BarChart size={20} />,
      access: isAdmin, // Apenas administradores
    },
    {
      title: 'Configurações',
      path: '/admin/settings',
      icon: <Settings size={20} />,
      access: isAdmin, // Apenas administradores
    },
  ];

  return (
    <aside className="bg-black text-white w-64 min-h-screen flex flex-col overflow-y-auto">
      <div className="p-6">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-bold">99Tattoo Admin</h1>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-1">
          {menuItems
            .filter((item) => item.access)
            .map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-gray-800",
                    isActive(item.path) ? "bg-gray-800 font-medium" : ""
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            {profile?.first_name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium">{profile?.first_name || 'Usuário'} {profile?.last_name || ''}</p>
            <p className="text-xs text-gray-400 capitalize">{profile?.role || 'Sem Função'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
