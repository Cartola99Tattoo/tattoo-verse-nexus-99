
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UserRoleSimulator from "@/components/dev/UserRoleSimulator";

// Public pages
import Index from "@/pages/index";
import Auth from "@/pages/Auth";
import AdminAuth from "@/pages/AdminAuth";
import AdminSetup from "@/pages/AdminUserSetup";

// Admin pages (estúdio virtual)
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Clients from "@/pages/admin/Clients";
import Appointments from "@/pages/admin/Appointments";
import AdminArtists from "@/pages/admin/AdminArtists";
import Products from "@/pages/admin/Products";
import Financial from "@/pages/admin/Financial";
import Settings from "@/pages/admin/Settings";

// Tatuadores da Nova Era pages
import TatuadoresIndex from "@/pages/tatuadores-da-nova-era/index";
import TatuadoresBlog from "@/pages/tatuadores-da-nova-era/blog/index";
import TatuadoresBlogPost from "@/pages/tatuadores-da-nova-era/blog/[id]";
import TatuadoresShop from "@/pages/tatuadores-da-nova-era/shop/index";
import TatuadoresShopProduct from "@/pages/tatuadores-da-nova-era/shop/[id]";
import TatuadoresEventos from "@/pages/tatuadores-da-nova-era/eventos";
import TatuadoresEventDetail from "@/pages/tatuadores-da-nova-era/eventos/[id]";
import TatuadoresPortfolio from "@/pages/tatuadores-da-nova-era/portfolio";

// Nave-Mãe da Tatuagem pages
import NaveMaeIndex from "@/pages/nave-mae-da-tatuagem/index";
import NaveMaeClients from "@/pages/nave-mae-da-tatuagem/clients";
import NaveMaeAppointments from "@/pages/nave-mae-da-tatuagem/appointments";
import NaveMaeArtists from "@/pages/nave-mae-da-tatuagem/artists";
import NaveMaeProducts from "@/pages/nave-mae-da-tatuagem/products";
import NaveMaeFinancial from "@/pages/nave-mae-da-tatuagem/financial";
import NaveMaeSettings from "@/pages/nave-mae-da-tatuagem/settings";

// Other pages
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";

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
              <Route path="/shop/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              
              {/* Blog routes */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              
              {/* Other public routes */}
              <Route path="/contact" element={<Contact />} />

              {/* Admin routes (Estúdio Virtual) - DESENVOLVIMENTO: ACESSO IRRESTRITO */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/clients" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <AdminLayout>
                      <Clients />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/appointments" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <AdminLayout>
                      <Appointments />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/artists" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <AdminLayout>
                      <AdminArtists />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <AdminLayout>
                      <Products />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/finances" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <AdminLayout>
                      <Financial />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <AdminLayout>
                      <Settings />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />

              {/* Tatuadores da Nova Era routes - DESENVOLVIMENTO: ACESSO IRRESTRITO */}
              <Route 
                path="/tatuadores-da-nova-era" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <TatuadoresIndex />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tatuadores-da-nova-era/blog" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <TatuadoresBlog />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tatuadores-da-nova-era/blog/:id" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <TatuadoresBlogPost />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tatuadores-da-nova-era/shop" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <TatuadoresShop />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tatuadores-da-nova-era/shop/:id" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <TatuadoresShopProduct />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tatuadores-da-nova-era/eventos" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <TatuadoresEventos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tatuadores-da-nova-era/eventos/:id" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <TatuadoresEventDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tatuadores-da-nova-era/portfolio" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <TatuadoresPortfolio />
                  </ProtectedRoute>
                } 
              />

              {/* Nave-Mãe da Tatuagem routes - DESENVOLVIMENTO: ACESSO IRRESTRITO */}
              <Route 
                path="/nave-mae-da-tatuagem" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <NaveMaeIndex />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/nave-mae-da-tatuagem/clients" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <NaveMaeClients />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/nave-mae-da-tatuagem/appointments" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <NaveMaeAppointments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/nave-mae-da-tatuagem/artists" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <NaveMaeArtists />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/nave-mae-da-tatuagem/products" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <NaveMaeProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/nave-mae-da-tatuagem/financial" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <NaveMaeFinancial />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/nave-mae-da-tatuagem/settings" 
                element={
                  <ProtectedRoute allowPublic={true}>
                    <NaveMaeSettings />
                  </ProtectedRoute>
                } 
              />

              {/* DESENVOLVIMENTO: Rota fallback comentada para evitar redirecionamentos indevidos */}
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Routes>
            <Toaster />
            {/* Simulador de usuário apenas em desenvolvimento */}
            {process.env.NODE_ENV === 'development' && <UserRoleSimulator />}
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
