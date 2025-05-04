
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-tattoo-black/80 backdrop-blur-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-tattoo-white">
              <span className="text-tattoo-red">99</span>Tattoo
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {['Home', 'Blog', 'Loja', 'Artistas', 'Contato'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-tattoo-white hover:text-tattoo-red transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tattoo-red group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
            <button className="bg-tattoo-red px-5 py-2 rounded futuristic-border hover:bg-tattoo-red/80 transition-all duration-300 clip-diagonal">
              Login
            </button>
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-tattoo-white hover:text-tattoo-red"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-tattoo-black/95 p-4 tech-pattern">
          <nav className="flex flex-col space-y-4">
            {['Home', 'Blog', 'Loja', 'Artistas', 'Contato'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-tattoo-white hover:text-tattoo-red transition-colors duration-300 py-2 border-b border-tattoo-darkgray"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button className="bg-tattoo-red py-2 rounded futuristic-border hover:bg-tattoo-red/80 transition-all duration-300">
              Login
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
