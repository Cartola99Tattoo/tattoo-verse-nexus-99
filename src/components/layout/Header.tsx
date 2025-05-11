
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartButton from "@/components/shop/CartButton";

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Verifica se o link está ativo
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Efeito para detectar rolagem
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || location.pathname !== "/"
          ? "bg-white text-black shadow-md py-4"
          : "bg-transparent text-white py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          <span className={isScrolled || location.pathname !== "/" ? "text-red-500" : "text-red-500"}>
            99
          </span>
          Tattoo
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden md:flex space-x-8 items-center">
          <Link
            to="/"
            className={`transition-colors ${
              isActive("/")
                ? "font-medium text-red-500"
                : isScrolled || location.pathname !== "/"
                ? "text-gray-800 hover:text-red-500"
                : "text-white hover:text-red-300"
            }`}
          >
            Início
          </Link>
          <Link
            to="/shop"
            className={`transition-colors ${
              isActive("/shop")
                ? "font-medium text-red-500"
                : isScrolled || location.pathname !== "/"
                ? "text-gray-800 hover:text-red-500"
                : "text-white hover:text-red-300"
            }`}
          >
            Tatuagens
          </Link>
          <Link
            to="/blog"
            className={`transition-colors ${
              isActive("/blog")
                ? "font-medium text-red-500"
                : isScrolled || location.pathname !== "/"
                ? "text-gray-800 hover:text-red-500"
                : "text-white hover:text-red-300"
            }`}
          >
            Blog
          </Link>
          <Link
            to="/contact"
            className={`transition-colors ${
              isActive("/contact")
                ? "font-medium text-red-500"
                : isScrolled || location.pathname !== "/"
                ? "text-gray-800 hover:text-red-500"
                : "text-white hover:text-red-300"
            }`}
          >
            Contato
          </Link>
          
          <CartButton />
          
          <Button
            asChild
            className="bg-red-500 hover:bg-red-600 text-white"
            size="sm"
          >
            <Link to="/contact">Agendar Consulta</Link>
          </Button>
        </nav>

        {/* Menu móvel - toggle button */}
        <div className="md:hidden flex items-center space-x-4">
          <CartButton />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-1 ${
              isScrolled || location.pathname !== "/"
                ? "text-black"
                : "text-white"
            }`}
            aria-label="Abrir menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu móvel expansível */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className={`p-2 ${
                isActive("/") ? "font-medium text-red-500" : "text-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/shop"
              className={`p-2 ${
                isActive("/shop") ? "font-medium text-red-500" : "text-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tatuagens
            </Link>
            <Link
              to="/blog"
              className={`p-2 ${
                isActive("/blog") ? "font-medium text-red-500" : "text-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className={`p-2 ${
                isActive("/contact") ? "font-medium text-red-500" : "text-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            <Button
              asChild
              className="bg-red-500 hover:bg-red-600 text-white w-full"
            >
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                Agendar Consulta
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
