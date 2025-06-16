
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Users, 
  Building, 
  BarChart3, 
  Settings,
  LogOut,
  Rocket,
  Globe,
  Shield,
  Zap,
  UserCheck
} from "lucide-react";

interface NaveMaeLayoutProps {
  children: ReactNode;
}

const NaveMaeLayout = ({ children }: NaveMaeLayoutProps) => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { href: "/nave-mae-da-tatuagem", icon: Home, label: "Central de Comando", exact: true },
    { href: "/nave-mae-da-tatuagem/clients", icon: UserCheck, label: "CRM Central" },
    { href: "/nave-mae-da-tatuagem/estudios", icon: Building, label: "Gestão de Estúdios" },
    { href: "/nave-mae-da-tatuagem/tatuadores", icon: Users, label: "Rede de Tatuadores" },
    { href: "/nave-mae-da-tatuagem/plataformas", icon: Globe, label: "Plataformas Digitais" },
    { href: "/nave-mae-da-tatuagem/analytics", icon: BarChart3, label: "Analytics Global" },
    { href: "/nave-mae-da-tatuagem/automacao", icon: Zap, label: "Automações" },
    { href: "/nave-mae-da-tatuagem/seguranca", icon: Shield, label: "Segurança" },
    { href: "/nave-mae-da-tatuagem/configuracoes", icon: Settings, label: "Configurações" },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-red-900 to-red-800 shadow-2xl border-b-4 border-red-600">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/nave-mae-da-tatuagem" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Nave-Mãe da Tatuagem</h1>
                <p className="text-red-200 text-xs">Central de Comando 99Tattoo</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                <p className="text-red-200 text-xs">Administrador Nave-Mãe</p>
              </div>
              <Button
                onClick={signOut}
                variant="outline"
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-gray-900 to-black shadow-2xl border-r border-red-800 min-h-[calc(100vh-4rem)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href, item.exact)
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                        : "text-gray-300 hover:bg-red-900/30 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default NaveMaeLayout;
