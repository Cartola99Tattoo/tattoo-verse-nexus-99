
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Users, ShoppingCart, Calendar, Award, User } from "lucide-react";
import { useState } from 'react';
import ShopCartButton from "@/components/shop/ShopCartButton";

interface TattooArtistLayoutProps {
  children: React.ReactNode;
}

const TattooArtistLayout: React.FC<TattooArtistLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Simulação de tatuador logado - na implementação real, viria do contexto de autenticação
  const isLoggedIn = true; // Simula que há um tatuador logado
  const loggedTattooArtistId = "1"; // ID do primeiro tatuador mock

  const navItems = [
    { path: '/tatuadores-da-nova-era', label: 'Início', icon: Home },
    { path: '/tatuadores-da-nova-era/artistas', label: 'Artistas', icon: Users },
    { path: '/tatuadores-da-nova-era/shop', label: 'Loja', icon: ShoppingCart },
    { path: '/sobre', label: 'Sobre', icon: Award },
    { path: '/contato', label: 'Contato', icon: Calendar },
  ];

  const handleProfileClick = () => {
    if (isLoggedIn) {
      // Redireciona para o perfil do tatuador logado
      window.location.href = `/tatuadores-da-nova-era/perfil/${loggedTattooArtistId}`;
    } else {
      // Redireciona para login/cadastro (implementação futura)
      window.location.href = '/auth';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-red-900/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/tatuadores-da-nova-era" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">99</span>
              </div>
              <span className="text-white font-bold text-xl">Tattoo</span>
              <span className="text-red-400 font-bold text-sm">Pro</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-white hover:text-red-400 transition-colors font-medium ${
                    location.pathname === item.path ? 'text-red-400' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ShopCartButton />
              
              {/* Profile Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleProfileClick}
                className="text-white hover:bg-red-600/20 hover:text-red-400 transition-colors"
                title={isLoggedIn ? "Meu Perfil" : "Fazer Login"}
              >
                <User className="h-5 w-5" />
              </Button>
              
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                Entrar
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ShopCartButton />
              
              {/* Mobile Profile Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleProfileClick}
                className="text-white hover:bg-red-600/20 hover:text-red-400 transition-colors"
              >
                <User className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:bg-white/10"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-red-900/20 py-4">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 text-white hover:text-red-400 transition-colors font-medium ${
                      location.pathname === item.path ? 'text-red-400' : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white mt-4">
                  Entrar
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black/80 border-t border-red-900/20 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">99</span>
                </div>
                <span className="text-white font-bold text-xl">Tattoo Pro</span>
              </div>
              <p className="text-gray-300">
                Plataforma profissional para tatuadores da nova era.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Navegação</h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-gray-300 hover:text-red-400 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/contato" className="hover:text-red-400 transition-colors">Contato</Link></li>
                <li><Link to="/sobre" className="hover:text-red-400 transition-colors">Sobre Nós</Link></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Contato</h3>
              <ul className="space-y-2 text-gray-300">
                <li>contato@99tattoo.com.br</li>
                <li>(11) 9999-9999</li>
                <li>São Paulo, SP</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-red-900/20 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 99Tattoo Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TattooArtistLayout;
