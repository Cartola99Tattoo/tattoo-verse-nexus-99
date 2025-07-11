
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!isOpen) return null;

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const getMobileLinkClass = (path: string) => {
    const isActive = isActiveRoute(path);
    
    if (isActive) {
      return "text-white font-bold py-2 px-3 bg-gradient-to-r from-red-600 to-red-800 rounded-md shadow-lg";
    }
    
    return "text-white hover:text-red-300 hover:bg-red-600/20 transition-all duration-300 py-2 px-3 rounded-md";
  };

  return (
    <div className="md:hidden py-4 border-t border-gray-700 bg-gradient-to-b from-black to-gray-900">
      <nav className="flex flex-col space-y-4">
        <Link 
          to="/" 
          className={getMobileLinkClass('/')}
          onClick={onClose}
        >
          Início
        </Link>
        <Link 
          to="/consultoria" 
          className={getMobileLinkClass('/consultoria')}
          onClick={onClose}
        >
          Consultoria
        </Link>
        <Link 
          to="/artists" 
          className={getMobileLinkClass('/artists')}
          onClick={onClose}
        >
          Artistas
        </Link>
        <Link 
          to="/shop" 
          className={getMobileLinkClass('/shop')}
          onClick={onClose}
        >
          Loja
        </Link>
        <Link 
          to="/blog" 
          className={getMobileLinkClass('/blog')}
          onClick={onClose}
        >
          Blog
        </Link>
        <Link 
          to="/events" 
          className={getMobileLinkClass('/events')}
          onClick={onClose}
        >
          Eventos
        </Link>
        <Link 
          to="/contact" 
          className={getMobileLinkClass('/contact')}
          onClick={onClose}
        >
          Contato
        </Link>
        {!user && (
          <Link 
            to="/auth" 
            className="text-red-300 font-medium py-2 px-3 bg-red-600/20 rounded-md hover:bg-red-600/30 transition-all duration-300"
            onClick={onClose}
          >
            Entrar
          </Link>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
