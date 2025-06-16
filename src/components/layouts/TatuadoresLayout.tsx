
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  User, 
  Calendar, 
  Image, 
  BookOpen, 
  MessageCircle, 
  Settings,
  LogOut,
  Palette,
  TrendingUp,
  ShoppingBag
} from "lucide-react";

interface TatuadoresLayoutProps {
  children: ReactNode;
}

const TatuadoresLayout = ({ children }: TatuadoresLayoutProps) => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { href: "/tatuadores-da-nova-era", icon: Home, label: "Início", exact: true },
    { href: "/tatuadores-da-nova-era/perfil", icon: User, label: "Meu Perfil" },
    { href: "/tatuadores-da-nova-era/agenda", icon: Calendar, label: "Agenda" },
    { href: "/tatuadores-da-nova-era/portfolio", icon: Image, label: "Portfólio" },
    { href: "/tatuadores-da-nova-era/blog", icon: BookOpen, label: "Blog & Conteúdo" },
    { href: "/tatuadores-da-nova-era/shop", icon: ShoppingBag, label: "Loja Profissional" },
    { href: "/tatuadores-da-nova-era/evolucao", icon: TrendingUp, label: "Evolução" },
    { href: "/tatuadores-da-nova-era/mensagens", icon: MessageCircle, label: "Mensagens" },
    { href: "/tatuadores-da-nova-era/configuracoes", icon: Settings, label: "Configurações" },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 shadow-xl border-b-4 border-red-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/tatuadores-da-nova-era" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Palette className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Tatuadores da Nova Era</h1>
                <p className="text-red-100 text-xs">Digitalize sua arte</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                <p className="text-red-100 text-xs">Tatuador</p>
              </div>
              <Button
                onClick={signOut}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-600 transition-colors"
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
        <aside className="w-64 bg-white shadow-xl border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href, item.exact)
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                        : "text-gray-700 hover:bg-red-50 hover:text-red-600"
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

export default TatuadoresLayout;
