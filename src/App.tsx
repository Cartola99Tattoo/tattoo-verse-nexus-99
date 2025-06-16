
import React, { lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LazyLoader from './components/common/LazyLoader';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from '@/components/ui/toaster';
import InviteAcceptance from "./pages/InviteAcceptance";

const queryClient = new QueryClient();

// Lazy load páginas públicas
const Home = lazy(() => import('./pages/Home'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Artists = lazy(() => import('./pages/Artists'));
const ArtistDetail = lazy(() => import('./pages/ArtistDetail'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const TattooEvents = lazy(() => import('./pages/TattooEvents'));
const Contact = lazy(() => import('./pages/Contact'));
const Auth = lazy(() => import('./pages/Auth'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Checkout = lazy(() => import('./pages/Checkout'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const TattooConsultancy = lazy(() => import('./pages/TattooConsultancy'));

// Lazy load páginas dos tatuadores
const TattooArtistsLanding = lazy(() => import('./pages/tattoo-artists/TattooArtistsLanding'));
const TattooArtistsBlog = lazy(() => import('./pages/tattoo-artists/TattooArtistsBlog'));
const TattooArtistsShop = lazy(() => import('./pages/tattoo-artists/TattooArtistsShop'));
const TattooArtistsServices = lazy(() => import('./pages/tattoo-artists/TattooArtistsServices'));
const TattooArtistsPortfolio = lazy(() => import('./pages/tattoo-artists/TattooArtistsPortfolio'));
const TattooArtistsContact = lazy(() => import('./pages/tattoo-artists/TattooArtistsContact'));

// Lazy load páginas da nave mãe
const NaveMaeLanding = lazy(() => import('./pages/nave-mae/NaveMaeLanding'));

// Lazy load páginas administrativas
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminArtists = lazy(() => import('./pages/admin/AdminArtists'));
const Appointments = lazy(() => import('./pages/admin/Appointments'));
const Clients = lazy(() => import('./pages/admin/Clients'));
const ClientDetail = lazy(() => import('./pages/admin/ClientDetail'));
const Products = lazy(() => import('./pages/admin/Products'));
const Stock = lazy(() => import('./pages/admin/Stock'));
const Financial = lazy(() => import('./pages/admin/Financial'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const Loyalty = lazy(() => import('./pages/admin/Loyalty'));
const Security = lazy(() => import('./pages/admin/Security'));
const AdminBlog = lazy(() => import('./pages/admin/Blog'));
const AdminAuth = lazy(() => import('./pages/AdminAuth'));
const AdminUserSetup = lazy(() => import('./pages/AdminUserSetup'));
const Projects = lazy(() => import('./pages/admin/Projects'));
const AdminEvents = lazy(() => import('./pages/admin/Events'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Public routes with Layout wrapper */}
                <Route path="/" element={<Layout><LazyLoader><Home /></LazyLoader></Layout>} />
                <Route path="/blog" element={<Layout><LazyLoader><Blog /></LazyLoader></Layout>} />
                <Route path="/blog/:slug" element={<Layout><LazyLoader><BlogPost /></LazyLoader></Layout>} />
                <Route path="/artists" element={<Layout><LazyLoader><Artists /></LazyLoader></Layout>} />
                <Route path="/artists/:id" element={<Layout><LazyLoader><ArtistDetail /></LazyLoader></Layout>} />
                <Route path="/shop" element={<Layout><LazyLoader><Shop /></LazyLoader></Layout>} />
                <Route path="/shop/:id" element={<Layout><LazyLoader><ProductDetail /></LazyLoader></Layout>} />
                <Route path="/events" element={<Layout><LazyLoader><TattooEvents /></LazyLoader></Layout>} />
                <Route path="/contact" element={<Layout><LazyLoader><Contact /></LazyLoader></Layout>} />
                <Route path="/consultoria" element={<Layout><LazyLoader><TattooConsultancy /></LazyLoader></Layout>} />
                <Route path="/auth" element={<Layout><LazyLoader><Auth /></LazyLoader></Layout>} />
                <Route path="/reset-password" element={<Layout><LazyLoader><ResetPassword /></LazyLoader></Layout>} />
                <Route path="/checkout" element={<Layout><LazyLoader><Checkout /></LazyLoader></Layout>} />
                <Route path="/user-profile" element={<Layout><LazyLoader><UserProfile /></LazyLoader></Layout>} />
                <Route path="/invite" element={<InviteAcceptance />} />

                {/* Tatuadores da Nova Era routes */}
                <Route path="/tatuadores-da-nova-era" element={<LazyLoader><TattooArtistsLanding /></LazyLoader>} />
                <Route path="/tatuadores-da-nova-era/blog" element={<LazyLoader><TattooArtistsBlog /></LazyLoader>} />
                <Route path="/tatuadores-da-nova-era/shop" element={<LazyLoader><TattooArtistsShop /></LazyLoader>} />
                <Route path="/tatuadores-da-nova-era/services" element={<LazyLoader><TattooArtistsServices /></LazyLoader>} />
                <Route path="/tatuadores-da-nova-era/portfolio" element={<LazyLoader><TattooArtistsPortfolio /></LazyLoader>} />
                <Route path="/tatuadores-da-nova-era/contact" element={<LazyLoader><TattooArtistsContact /></LazyLoader>} />

                {/* Nave Mãe routes */}
                <Route path="/nave-mae-da-tatuagem" element={<LazyLoader><NaveMaeLanding /></LazyLoader>} />

                {/* Admin routes with AdminLayout */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <LazyLoader>
                        <AdminLayout />
                      </LazyLoader>
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<LazyLoader><Dashboard /></LazyLoader>} />
                  <Route path="artists" element={<LazyLoader><AdminArtists /></LazyLoader>} />
                  <Route path="blog" element={<LazyLoader><AdminBlog /></LazyLoader>} />
                  <Route path="appointments" element={<LazyLoader><Appointments /></LazyLoader>} />
                  <Route path="clients" element={<LazyLoader><Clients /></LazyLoader>} />
                  <Route path="clients/:id" element={<LazyLoader><ClientDetail /></LazyLoader>} />
                  <Route path="products" element={<LazyLoader><Products /></LazyLoader>} />
                  <Route path="stock" element={<LazyLoader><Stock /></LazyLoader>} />
                  <Route path="projects" element={<LazyLoader><Projects /></LazyLoader>} />
                  <Route path="events" element={<LazyLoader><AdminEvents /></LazyLoader>} />
                  <Route path="financial" element={<LazyLoader><Financial /></LazyLoader>} />
                  <Route path="analytics" element={<LazyLoader><Analytics /></LazyLoader>} />
                  <Route path="loyalty" element={<LazyLoader><Loyalty /></LazyLoader>} />
                  <Route path="settings" element={<LazyLoader><Settings /></LazyLoader>} />
                  <Route path="security" element={<LazyLoader><Security /></LazyLoader>} />
                </Route>

                {/* Standalone admin auth routes */}
                <Route path="/admin/auth" element={<LazyLoader><AdminAuth /></LazyLoader>} />
                <Route path="/admin/setup" element={<LazyLoader><AdminUserSetup /></LazyLoader>} />

                {/* 404 - Commented out to avoid redirects during development */}
                {/* <Route path="*" element={<Layout><LazyLoader><NotFound /></LazyLoader></Layout>} /> */}
              </Routes>
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
