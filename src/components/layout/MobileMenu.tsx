
import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 md:hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-lg font-bold text-white">TattooStudio</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-red-600"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-4">
            <Link 
              to="/" 
              className="block text-white hover:text-red-500 transition-colors py-3 text-lg border-b border-gray-800"
              onClick={onClose}
            >
              Início
            </Link>
            <Link 
              to="/artists" 
              className="block text-white hover:text-red-500 transition-colors py-3 text-lg border-b border-gray-800"
              onClick={onClose}
            >
              Artistas
            </Link>
            <Link 
              to="/shop" 
              className="block text-white hover:text-red-500 transition-colors py-3 text-lg border-b border-gray-800"
              onClick={onClose}
            >
              Loja
            </Link>
            <Link 
              to="/blog" 
              className="block text-white hover:text-red-500 transition-colors py-3 text-lg border-b border-gray-800"
              onClick={onClose}
            >
              Blog
            </Link>
            <Link 
              to="/events" 
              className="block text-white hover:text-red-500 transition-colors py-3 text-lg border-b border-gray-800"
              onClick={onClose}
            >
              Eventos
            </Link>
            <Link 
              to="/contact" 
              className="block text-white hover:text-red-500 transition-colors py-3 text-lg border-b border-gray-800"
              onClick={onClose}
            >
              Contato
            </Link>
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-700">
          {user ? (
            <div className="space-y-3">
              <Link 
                to="/user-profile" 
                className="block w-full text-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-lg"
                onClick={onClose}
              >
                Meu Perfil
              </Link>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="block w-full text-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-lg"
              onClick={onClose}
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
