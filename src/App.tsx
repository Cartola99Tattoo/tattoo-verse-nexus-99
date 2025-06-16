import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import AdminAuth from "@/pages/AdminAuth";
import AdminSetup from "@/pages/AdminSetup";

// Admin pages (estúdio virtual)
import AdminLayout from "@/components/layout/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Clients from "@/pages/admin/Clients";
import Appointments from "@/pages/admin/Appointments";
import Artists from "@/pages/admin/Artists";
import Products from "@/pages/admin/Products";
import Finances from "@/pages/admin/Finances";
import Settings from "@/pages/admin/Settings";

// Tatuadores da Nova Era pages
import TatuadoresIndex from "@/pages/tatuadores-da-nova-era/index";
import TatuadoresBlog from "@/pages/tatuadores-da-nova-era/blog/index";
import TatuadoresBlogPost from "@/pages/tatuadores-da-nova-era/blog/[id]";
import TatuadoresShop from "@/pages/tatuadores-da-nova-era/shop/index";
import TatuadoresShopProduct from "@/pages/tatuadores-da-nova-era/shop/[id]";

// Nave-Mãe da Tatuagem pages
import NaveMaeIndex from "@/pages/nave-mae-da-tatuagem/index";
import NaveMaeClients from "@/pages/nave-mae-da-tatuagem/clients";

// Other pages
import Shop from "@/pages/Shop";
import ShopProduct from "@/pages/ShopProduct";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import AboutUs from "@/pages/AboutUs";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin-auth" element={<AdminAuth />} />
              <Route path="/admin-setup" element={<AdminSetup />} />
              
              {/* Shop routes */}
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:id" element={<ShopProduct />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              
              {/* Blog routes */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              
              {/* Other public routes */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />

              {/* Admin routes (Estúdio Virtual) */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={["admin_estudio"]} redirectTo="/admin-auth">
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/clients" 
                element={
                  <ProtectedRoute allowedRoles={["admin_estudio"]} redirectTo="/admin-auth">
                    <AdminLayout>
                      <Clients />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/appointments" 
                element={
                  <ProtectedRoute allowedRoles={["admin_estudio"]} redirectTo="/admin-auth">
                    <AdminLayout>
                      <Appointments />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/artists" 
                element={
                  <ProtectedRoute allowedRoles={["admin_estudio"]} redirectTo="/admin-auth">
                    <AdminLayout>
                      <Artists />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedRoute allowedRoles={["admin_estudio"]} redirectTo="/admin-auth">
                    <AdminLayout>
                      <Products />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/finances" 
                element={
                  <ProtectedRoute allowedRoles={["admin_estudio"]} redirectTo="/admin-auth">
                    <AdminLayout>
                      <Finances />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute allowedRoles={["admin_estudio"]} redirectTo="/admin-auth">
                    <AdminLayout>
                      <Settings />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />

              {/* Tatuadores da Nova Era routes */}
              <Route 
                path="/tatuadores-da-nova-era" 
                element={
                  <ProtectedRoute allowedRoles={["tatuador_da_nova_era"]} redirectTo="/auth">
                    <TatuadoresIndex />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tatuadores-da-nova-era/blog" 
                element={
                  <ProtectedRoute allowedRoles={["tatuador_da_nova_era"]} redirectTo="/auth">
                    <TatuadoresBlog />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tatuadores-da-nova-era/blog/:id" 
                element={
                  <ProtectedRoute allowedRoles={["tatuador_da_nova_era"]} redirectTo="/auth">
                    <TatuadoresBlogPost />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tatuadores-da-nova-era/shop" 
                element={
                  <ProtectedRoute allowedRoles={["tatuador_da_nova_era"]} redirectTo="/auth">
                    <TatuadoresShop />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tatuadores-da-nova-era/shop/:id" 
                element={
                  <ProtectedRoute allowedRoles={["tatuador_da_nova_era"]} redirectTo="/auth">
                    <TatuadoresShopProduct />
                  </ProtectedRoute>
                } 
              />

              {/* Nave-Mãe da Tatuagem routes */}
              <Route 
                path="/nave-mae-da-tatuagem" 
                element={
                  <ProtectedRoute allowedRoles={["admin_nave_mae"]} redirectTo="/admin-auth">
                    <NaveMaeIndex />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/nave-mae-da-tatuagem/clients" 
                element={
                  <ProtectedRoute allowedRoles={["admin_nave_mae"]} redirectTo="/admin-auth">
                    <NaveMaeClients />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
