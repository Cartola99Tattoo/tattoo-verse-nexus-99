
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import BaseLayout from "./BaseLayout";

interface TattooArtistLayoutProps {
  children: ReactNode;
}

const TattooArtistLayout = ({ children }: TattooArtistLayoutProps) => {
  return (
    <BaseLayout theme="tatuadores">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-red-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/tatuadores-da-nova-era" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">99</span>
              </div>
              <span className="text-xl font-bold text-white">Tattoo</span>
              <span className="text-red-400 text-sm ml-2">Tatuadores</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/tatuadores-da-nova-era" className="text-white hover:text-red-400 transition-colors">
                Início
              </Link>
              <Link to="/tatuadores-da-nova-era/blog" className="text-white hover:text-red-400 transition-colors">
                Blog
              </Link>
              <Link to="/tatuadores-da-nova-era/shop" className="text-white hover:text-red-400 transition-colors">
                Loja
              </Link>
              <Link to="/tatuadores-da-nova-era/portfolio" className="text-white hover:text-red-400 transition-colors">
                Portfólio
              </Link>
              <Link to="/tatuadores-da-nova-era/eventos" className="text-white hover:text-red-400 transition-colors">
                Eventos
              </Link>
              <Link to="/tatuadores-da-nova-era/services" className="text-white hover:text-red-400 transition-colors">
                Serviços
              </Link>
              <Link to="/tatuadores-da-nova-era/contact" className="text-white hover:text-red-400 transition-colors">
                Contato
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black/90 border-t border-red-500/20 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">© 2024 99Tattoo - Tatuadores da Nova Era. Todos os direitos reservados.</p>
        </div>
      </footer>
    </BaseLayout>
  );
};

export default TattooArtistLayout;
