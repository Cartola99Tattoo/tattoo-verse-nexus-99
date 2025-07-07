
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import UserProfile from "@/pages/UserProfile";
import Artists from "@/pages/Artists";
import Shop from "@/pages/Shop";
import Blog from "@/pages/Blog";
import BlogArticle from "@/pages/BlogArticle";
import Events from "@/pages/Events";
import Contact from "@/pages/Contact";
import Consultoria from "@/pages/Consultoria";
import TattooArtistsHome from "@/pages/tatuadores-da-nova-era/TattooArtistsHome";
import TattooArtistsBlog from "@/pages/tatuadores-da-nova-era/TattooArtistsBlog";
import TattooArtistsBlogArticle from "@/pages/tatuadores-da-nova-era/TattooArtistsBlogArticle";
import TattooArtistsShop from "@/pages/tatuadores-da-nova-era/TattooArtistsShop";
import TattooArtistsDirectory from "@/pages/tatuadores-da-nova-era/TattooArtistsDirectory";
import TattooArtistProfile from "@/pages/tatuadores-da-nova-era/TattooArtistProfile";
import TattooArtistsBlog2 from "@/pages/tattoo-artists/TattooArtistsBlog";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                <Route path="/events" element={<Events />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/consultoria" element={<Consultoria />} />
                
                {/* Tatuadores da Nova Era Routes */}
                <Route path="/tatuadores-da-nova-era" element={<TattooArtistsHome />} />
                <Route path="/tatuadores-da-nova-era/blog" element={<TattooArtistsBlog />} />
                <Route path="/tatuadores-da-nova-era/blog/:articleId" element={<TattooArtistsBlogArticle />} />
                <Route path="/tatuadores-da-nova-era/shop" element={<TattooArtistsShop />} />
                <Route path="/tatuadores-da-nova-era/artistas" element={<TattooArtistsDirectory />} />
                <Route path="/tatuadores-da-nova-era/perfil/:artistId" element={<TattooArtistProfile />} />
                
                {/* Legacy Routes */}
                <Route path="/tattoo-artists/blog" element={<TattooArtistsBlog2 />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
