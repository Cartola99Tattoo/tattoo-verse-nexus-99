
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

// Dashboard do Admin
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="/admin-setup" element={<AdminUserSetup />} />

            {/* Rotas protegidas (requer login) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* Rotas específicas para administração */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/loyalty" element={<Dashboard />} /> {/* Placeholder - usar Dashboard temporariamente */}
              <Route path="/admin/analytics" element={<Dashboard />} /> {/* Placeholder - usar Dashboard temporariamente */}
              <Route path="/admin/security" element={<Dashboard />} /> {/* Placeholder - usar Dashboard temporariamente */}
            </Route>

            {/* Rotas específicas para artistas */}
            <Route element={<ProtectedRoute requiredRole="artista" />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<Products />} />
            </Route>

            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
