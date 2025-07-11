
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
import CartButton from "@/components/shop/CartButton";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/user-profile");
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const getNavLinkClass = (path: string) => {
    const isActive = isActiveRoute(path);
    
    if (isActive) {
      return "px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-900 transition-all duration-300 transform hover:scale-105";
    }
    
    return "relative px-4 py-2 rounded-md transition-all duration-300 text-white hover:text-red-300 hover:bg-red-600/20";
  };

  return (
    <header className="bg-gradient-to-r from-black to-gray-900 shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 tattoo-hover-lift">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg tattoo-hover-glow">
              <span className="text-white font-bold text-xl">99</span>
            </div>
            <span className="text-xl font-bold text-white">Tattoo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className={getNavLinkClass('/')}>
              Início
            </Link>
            <Link to="/consultoria" className={getNavLinkClass('/consultoria')}>
              Consultoria
            </Link>
            <Link to="/artists" className={getNavLinkClass('/artists')}>
              Artistas
            </Link>
            <Link to="/shop" className={getNavLinkClass('/shop')}>
              Loja
            </Link>
            <Link to="/blog" className={getNavLinkClass('/blog')}>
              Blog
            </Link>
            <Link to="/events" className={getNavLinkClass('/events')}>
              Eventos
            </Link>
            <Link to="/contact" className={getNavLinkClass('/contact')}>
              Contato
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <CartButton />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-red-600 transition-all duration-300">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.first_name || 'User'} />
                      <AvatarFallback className="bg-red-600 text-white">
                        {profile?.first_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-xl z-60" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-gray-900">{profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : 'Usuário'}</p>
                      <p className="w-[200px] truncate text-sm text-gray-600">
                        {profile?.email || user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer hover:bg-red-50 transition-colors">
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-red-50 transition-colors">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="tattoo-button-primary shadow-lg">
                  Entrar
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="md:hidden text-white hover:bg-red-600 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    </header>
  );
};

export default Header;
