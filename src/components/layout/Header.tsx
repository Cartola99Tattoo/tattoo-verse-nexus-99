
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-black text-white shadow-md w-full">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-red-500">99</span>
          <span className="text-2xl font-bold text-white">Tattoo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-red-500 transition-colors">Loja</Link>
          <Link to="/blog" className="hover:text-red-500 transition-colors">Blog</Link>
          <Link to="/about" className="hover:text-red-500 transition-colors">Sobre</Link>
          <Link to="/contact" className="hover:text-red-500 transition-colors">Contato</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {/* Search bar */}
          <div className="hidden md:flex items-center bg-white rounded-md">
            <Input 
              type="search" 
              placeholder="Procurar tatuagens..." 
              className="border-none focus-visible:ring-0 text-black" 
            />
            <Button variant="ghost" size="icon" className="text-black">
              <Search size={20} />
            </Button>
          </div>

          {/* Cart icon */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 hover:text-red-500 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMenu} aria-label="Menu">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link to="/" className="hover:text-red-500 transition-colors" onClick={toggleMenu}>Home</Link>
            <Link to="/shop" className="hover:text-red-500 transition-colors" onClick={toggleMenu}>Loja</Link>
            <Link to="/blog" className="hover:text-red-500 transition-colors" onClick={toggleMenu}>Blog</Link>
            <Link to="/about" className="hover:text-red-500 transition-colors" onClick={toggleMenu}>Sobre</Link>
            <Link to="/contact" className="hover:text-red-500 transition-colors" onClick={toggleMenu}>Contato</Link>
            
            <div className="flex items-center bg-white rounded-md mt-4">
              <Input 
                type="search" 
                placeholder="Procurar tatuagens..." 
                className="border-none focus-visible:ring-0 text-black" 
              />
              <Button variant="ghost" size="icon" className="text-black">
                <Search size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
