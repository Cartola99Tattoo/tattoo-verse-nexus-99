
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import BaseLayout from "./BaseLayout";

interface NaveMaeLayoutProps {
  children: ReactNode;
}

const NaveMaeLayout = ({ children }: NaveMaeLayoutProps) => {
  return (
    <BaseLayout theme="navemae">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/nave-mae-da-tatuagem" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">99</span>
              </div>
              <span className="text-xl font-bold text-white">Tattoo</span>
              <span className="text-purple-400 text-sm ml-2">Nave Mãe</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/nave-mae-da-tatuagem" className="text-white hover:text-purple-400 transition-colors">
                Dashboard
              </Link>
              <Link to="/nave-mae-da-tatuagem/studios" className="text-white hover:text-purple-400 transition-colors">
                Estúdios
              </Link>
              <Link to="/nave-mae-da-tatuagem/analytics" className="text-white hover:text-purple-400 transition-colors">
                Analytics
              </Link>
              <Link to="/nave-mae-da-tatuagem/financial" className="text-white hover:text-purple-400 transition-colors">
                Financeiro
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
      <footer className="bg-black/90 border-t border-purple-500/20 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">© 2024 99Tattoo - Nave Mãe. Centro de Comando.</p>
        </div>
      </footer>
    </BaseLayout>
  );
};

export default NaveMaeLayout;
