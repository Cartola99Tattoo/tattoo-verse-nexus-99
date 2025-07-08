import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ShopCartProvider } from '@/contexts/ShopCartContext';
import { EcosistemaAuthProvider } from '@/contexts/EcosistemaAuthContext';

// Main pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Contact from '@/pages/Contact';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Checkout from '@/pages/Checkout';
import Artists from '@/pages/Artists';
import ArtistDetail from '@/pages/ArtistDetail';
import Events from '@/pages/Events';
import TattooEvents from '@/pages/TattooEvents';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import BlogArticle from '@/pages/BlogArticle';
import TattooConsultancy from '@/pages/TattooConsultancy';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import UserProfile from '@/pages/UserProfile';
import Ecosistema from '@/pages/Ecosistema';
import NotFound from '@/pages/NotFound';

// Admin pages
import AdminAuth from '@/pages/AdminAuth';
import AdminUserSetup from '@/pages/AdminUserSetup';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminClients from '@/pages/admin/Clients';
import AdminAppointments from '@/pages/admin/Appointments';
import AdminProducts from '@/pages/admin/Products';
import AdminFinancial from '@/pages/admin/Financial';
import AdminBlog from '@/pages/admin/Blog';
import AdminEvents from '@/pages/admin/Events';
import AdminSettings from '@/pages/admin/Settings';
import AdminArtists from '@/pages/admin/AdminArtists';
import AdminAnalytics from '@/pages/admin/Analytics';
import AdminStock from '@/pages/admin/Stock';
import AdminLoyalty from '@/pages/admin/Loyalty';
import AdminSecurity from '@/pages/admin/Security';
import AdminProjects from '@/pages/admin/Projects';

// Tattoo Artists pages
import TattooArtists from '@/pages/tatuadores-da-nova-era/TattooArtists';
import TattooArtistsBlog from '@/pages/tatuadores-da-nova-era/TattooArtistsBlog';
import TattooArtistsBlogArticle from '@/pages/tatuadores-da-nova-era/TattooArtistsBlogArticle';

// Nave Mae routes
import NaveMaeHome from '@/pages/nave-mae/NaveMaeHome';

// Login routes
import Login from '@/pages/Login';

// Register routes
import Register from '@/pages/Register';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EcosistemaAuthProvider>
        <AuthProvider>
          <CartProvider>
            <ShopCartProvider>
              <Router>
                <div className="App">
                  <Routes>
                    {/* Main Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/:id" element={<ProductDetail />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/artists" element={<Artists />} />
                    <Route path="/artists/:id" element={<ArtistDetail />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/tattoo-events" element={<TattooEvents />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/blog-article/:id" element={<BlogArticle />} />
                    <Route path="/tattoo-consultancy" element={<TattooConsultancy />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/user-profile" element={<UserProfile />} />
                    <Route path="/ecosistema" element={<Ecosistema />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminAuth />} />
                    <Route path="/admin/setup" element={<AdminUserSetup />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/clients" element={<AdminClients />} />
                    <Route path="/admin/appointments" element={<AdminAppointments />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/financial" element={<AdminFinancial />} />
                    <Route path="/admin/blog" element={<AdminBlog />} />
                    <Route path="/admin/events" element={<AdminEvents />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                    <Route path="/admin/artists" element={<AdminArtists />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    <Route path="/admin/stock" element={<AdminStock />} />
                    <Route path="/admin/loyalty" element={<AdminLoyalty />} />
                    <Route path="/admin/security" element={<AdminSecurity />} />
                    <Route path="/admin/projects" element={<AdminProjects />} />

                    {/* Tattoo Artists routes */}
                    <Route path="/tatuadores-da-nova-era" element={<TattooArtists />} />
                    <Route path="/tatuadores-da-nova-era/blog" element={<TattooArtistsBlog />} />
                    <Route path="/tatuadores-da-nova-era/blog/:articleId" element={<TattooArtistsBlogArticle />} />

                    {/* Nave Mae routes */}
                    <Route path="/nave-mae" element={<NaveMaeHome />} />

                    {/* Login routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Register routes */}
                    <Route path="/register" element={<Register />} />

                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </Router>
              <Toaster />
            </ShopCartProvider>
          </CartProvider>
        </AuthProvider>
      </EcosistemaAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
