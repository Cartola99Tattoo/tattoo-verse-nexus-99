
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, User, LogOut, Home, BookOpen, ShoppingBag, Calendar, Phone, Users } from "lucide-react";
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

  const navLinks = [
    { name: "Início", path: "/", icon: <Home className="h-4 w-4 mr-1" /> },
    { name: "Tatuadores", path: "/artists", icon: <Users className="h-4 w-4 mr-1" /> },
    { name: "Blog", path: "/blog", icon: <BookOpen className="h-4 w-4 mr-1" /> },
    { name: "Loja", path: "/shop", icon: <ShoppingBag className="h-4 w-4 mr-1" /> },
    { name: "Eventos", path: "/events", icon: <Calendar className="h-4 w-4 mr-1" /> },
    { name: "Contato", path: "/contact", icon: <Phone className="h-4 w-4 mr-1" /> },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || location.pathname !== "/"
          ? "bg-black text-white shadow-md py-3"
          : "bg-black text-white py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-red-500">99</span>
          <span className="text-white">Tattoo</span>
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors flex items-center ${
                isActive(link.path)
                  ? "font-medium text-white bg-red-500 px-4 py-2 rounded-md bg-gradient-to-b from-red-400 to-red-600 shadow-md"
                  : "text-white hover:text-red-300"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          
          <CartButton />
          
          {user && (
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
          )}
          
          <Button 
            asChild 
            size="sm" 
            className="bg-red-500 hover:bg-red-600 text-white hidden lg:flex"
          >
            <Link to="/contact">Agende sua Tatuagem</Link>
          </Button>
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
            className="p-1 text-white"
            aria-label="Abrir menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu móvel expansível */}
      {isMenuOpen && (
        <div className="md:hidden bg-black shadow-lg animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`p-2 flex items-center ${
                  isActive(link.path) 
                    ? "font-medium text-white bg-red-500 px-4 py-2 rounded-md bg-gradient-to-b from-red-400 to-red-600 shadow-md" 
                    : "text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Button
              asChild
              className="bg-red-500 hover:bg-red-600 text-white w-full"
            >
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                Agende sua Tatuagem
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
