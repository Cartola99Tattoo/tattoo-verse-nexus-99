
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CartButton from "@/components/shop/CartButton";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
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

  // Função para obter as iniciais para o Avatar fallback
  const getInitials = () => {
    if (!profile) return "U";
    
    const first = profile.first_name?.charAt(0) || "";
    const last = profile.last_name?.charAt(0) || "";
    
    return (first + last).toUpperCase();
  };

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
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="bg-red-500 hover:bg-red-600 text-white"
              size="sm"
            >
              <Link to="/auth">Entrar</Link>
            </Button>
          )}
        </nav>

        {/* Menu móvel - toggle button */}
        <div className="md:hidden flex items-center space-x-4">
          <CartButton />
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
            {!user && (
              <Button
                asChild
                className="bg-red-500 hover:bg-red-600 text-white w-full"
              >
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  Entrar / Cadastrar
                </Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
