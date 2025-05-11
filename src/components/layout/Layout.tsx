
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { profile } = useAuth();
  
  // Verificar se o usuário é admin ou editor
  const isAdminOrEditor = profile?.role === 'admin' || profile?.role === 'editor';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {isAdminOrEditor && (
        <div className="bg-black text-white py-2">
          <div className="container mx-auto px-4 flex justify-end">
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-red-800" asChild>
              <Link to="/blog/admin">Administração do Blog</Link>
            </Button>
          </div>
        </div>
      )}
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
