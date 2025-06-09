
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 border-t border-gray-700 bg-black">
      <nav className="flex flex-col space-y-4">
        <Link 
          to="/" 
          className="text-white hover:text-red-500 transition-colors py-2"
          onClick={onClose}
        >
          Início
        </Link>
        <Link 
          to="/consultoria" 
          className="text-white hover:text-red-500 transition-colors py-2"
          onClick={onClose}
        >
          Consultoria
        </Link>
        <Link 
          to="/artists" 
          className="text-white hover:text-red-500 transition-colors py-2"
          onClick={onClose}
        >
          Artistas
        </Link>
        <Link 
          to="/shop" 
          className="text-white hover:text-red-500 transition-colors py-2"
          onClick={onClose}
        >
          Loja
        </Link>
        <Link 
          to="/blog" 
          className="text-white hover:text-red-500 transition-colors py-2"
          onClick={onClose}
        >
          Blog
        </Link>
        <Link 
          to="/events" 
          className="text-white hover:text-red-500 transition-colors py-2"
          onClick={onClose}
        >
          Eventos
        </Link>
        <Link 
          to="/contact" 
          className="text-white hover:text-red-500 transition-colors py-2"
          onClick={onClose}
        >
          Contato
        </Link>
        {!user && (
          <Link 
            to="/auth" 
            className="text-red-500 font-medium py-2"
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
