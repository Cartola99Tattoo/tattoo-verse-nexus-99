
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Artists from "./pages/Artists";
import ArtistDetail from "./pages/ArtistDetail";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Checkout from "./pages/Checkout";
import AdminUserSetup from "./pages/AdminUserSetup";
import Events from "./pages/Events";

// Dashboard do Admin
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Loyalty from "./pages/admin/Loyalty";
import Analytics from "./pages/admin/Analytics";
import Security from "./pages/admin/Security";

// Configuração do React Query com configurações otimizadas
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HelmetProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:id" element={<ProductDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/artists/:id" element={<ArtistDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/events" element={<Events />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin-auth" element={<AdminAuth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/access-denied" element={<AccessDenied />} />
              <Route path="/admin-setup" element={<AdminUserSetup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/checkout" element={<Checkout />} />

              {/* Rotas administrativas com ProtectedRoute - usando "admin" como required role */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/products" element={<Products />} />
                <Route path="/admin/loyalty" element={<Loyalty />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/security" element={<Security />} />
              </Route>

              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </HelmetProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
