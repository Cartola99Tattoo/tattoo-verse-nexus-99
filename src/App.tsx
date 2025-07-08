import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider as LegacyCartProvider } from '@/contexts/CartContext';
import { CartProvider } from '@/contexts/ShopCartContext';
import { EcosistemaAuthProvider } from '@/contexts/EcosistemaAuthContext';
import { TattooArtistShopProvider } from '@/contexts/TattooArtistShopContext';

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

// Nave-Mãe pages - RESTAURAÇÃO COMPLETA
import NaveMaeLanding from '@/pages/nave-mae/NaveMaeLanding';
import NaveMaeDashboard from '@/pages/nave-mae/NaveMaeDashboard';
import NaveMaeStudios from '@/pages/nave-mae/NaveMaeStudios';
import NaveMaeAnalytics from '@/pages/nave-mae/NaveMaeAnalytics';
import NaveMaeArtists from '@/pages/nave-mae/NaveMaeArtists';
import NaveMaeClients from '@/pages/nave-mae/NaveMaeClients';
import NaveMaeAppointments from '@/pages/nave-mae/NaveMaeAppointments';
import NaveMaeProjects from '@/pages/nave-mae/NaveMaeProjects';
import NaveMaeLoyalty from '@/pages/nave-mae/NaveMaeLoyalty';
import NaveMaeProducts from '@/pages/nave-mae/NaveMaeProducts';
import NaveMaeStock from '@/pages/nave-mae/NaveMaeStock';
import NaveMaeFinancial from '@/pages/nave-mae/NaveMaeFinancial';
import NaveMaeReports from '@/pages/nave-mae/NaveMaeReports';
import NaveMaeEvents from '@/pages/nave-mae/NaveMaeEvents';
import NaveMaeBlog from '@/pages/nave-mae/NaveMaeBlog';
import NaveMaeSettings from '@/pages/nave-mae/NaveMaeSettings';
import NaveMaeSecurity from '@/pages/nave-mae/NaveMaeSecurity';

// Tattoo Artists pages
import TattooArtistsBlog from '@/pages/tatuadores-da-nova-era/TattooArtistsBlog';
import TattooArtistsBlogArticle from '@/pages/tatuadores-da-nova-era/TattooArtistsBlogArticle';
import TattooArtistsLanding from '@/pages/tattoo-artists/TattooArtistsLanding';
import TattooArtistsShop from '@/pages/tattoo-artists/TattooArtistsShop';
import TattooArtistsProductDetail from '@/pages/tattoo-artists/TattooArtistsProductDetail';
import TattooArtistsCart from '@/pages/tattoo-artists/TattooArtistsCart';
import TattooArtistsCheckout from '@/pages/tattoo-artists/TattooArtistsCheckout';
import TattooArtistsProfile from '@/pages/tattoo-artists/TattooArtistsProfile';
import TattooArtistsPersonalProfile from '@/pages/tattoo-artists/TattooArtistsPersonalProfile';
import TattooArtistsCostCalculator from '@/pages/tattoo-artists/TattooArtistsCostCalculator';

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
          <LegacyCartProvider>
            <CartProvider>
              <TattooArtistShopProvider>
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

                    {/* NAVE-MÃE ROUTES - RESTAURAÇÃO COMPLETA */}
                    <Route path="/nave-mae-da-tatuagem" element={<NaveMaeLanding />} />
                    <Route path="/nave-mae-da-tatuagem/dashboard" element={<NaveMaeDashboard />} />
                    <Route path="/nave-mae-da-tatuagem/studios" element={<NaveMaeStudios />} />
                    <Route path="/nave-mae-da-tatuagem/analytics" element={<NaveMaeAnalytics />} />
                    <Route path="/nave-mae-da-tatuagem/artists" element={<NaveMaeArtists />} />
                    <Route path="/nave-mae-da-tatuagem/clients" element={<NaveMaeClients />} />
                    <Route path="/nave-mae-da-tatuagem/appointments" element={<NaveMaeAppointments />} />
                    <Route path="/nave-mae-da-tatuagem/projects" element={<NaveMaeProjects />} />
                    <Route path="/nave-mae-da-tatuagem/loyalty" element={<NaveMaeLoyalty />} />
                    <Route path="/nave-mae-da-tatuagem/products" element={<NaveMaeProducts />} />
                    <Route path="/nave-mae-da-tatuagem/stock" element={<NaveMaeStock />} />
                    <Route path="/nave-mae-da-tatuagem/financial" element={<NaveMaeFinancial />} />
                    <Route path="/nave-mae-da-tatuagem/reports" element={<NaveMaeReports />} />
                    <Route path="/nave-mae-da-tatuagem/events" element={<NaveMaeEvents />} />
                    <Route path="/nave-mae-da-tatuagem/blog" element={<NaveMaeBlog />} />
                    <Route path="/nave-mae-da-tatuagem/settings" element={<NaveMaeSettings />} />
                    <Route path="/nave-mae-da-tatuagem/security" element={<NaveMaeSecurity />} />

                    {/* Tattoo Artists routes - RESTAURAÇÃO E EXPANSÃO */}
                    <Route path="/tatuadores-da-nova-era" element={<TattooArtistsLanding />} />
                    <Route path="/tatuadores-da-nova-era/shop" element={<TattooArtistsShop />} />
                    <Route path="/tatuadores-da-nova-era/produto/:id" element={<TattooArtistsProductDetail />} />
                    <Route path="/tatuadores-da-nova-era/carrinho" element={<TattooArtistsCart />} />
                    <Route path="/tatuadores-da-nova-era/checkout" element={<TattooArtistsCheckout />} />
                    <Route path="/tatuadores-da-nova-era/perfil" element={<TattooArtistsPersonalProfile />} />
                    <Route path="/tatuadores-da-nova-era/perfil/:id" element={<TattooArtistsProfile />} />
                    <Route path="/tatuadores-da-nova-era/blog" element={<TattooArtistsBlog />} />
                    <Route path="/tatuadores-da-nova-era/blog/:articleId" element={<TattooArtistsBlogArticle />} />
                    <Route path="/tatuadores-da-nova-era/calculadora-de-custos" element={<TattooArtistsCostCalculator />} />

                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </Router>
                <Toaster />
              </TattooArtistShopProvider>
            </CartProvider>
          </LegacyCartProvider>
        </AuthProvider>
      </EcosistemaAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
