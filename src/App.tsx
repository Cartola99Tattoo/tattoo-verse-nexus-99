
import React, { lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LazyLoader from './components/common/LazyLoader';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

// Lazy load páginas públicas
const Home = lazy(() => import('./pages/Home'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Artists = lazy(() => import('./pages/Artists'));
const ArtistDetail = lazy(() => import('./pages/ArtistDetail'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Events = lazy(() => import('./pages/Events'));
const Contact = lazy(() => import('./pages/Contact'));
const Auth = lazy(() => import('./pages/Auth'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

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
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes wrapped with Layout */}
        <Route path="/" element={
          <Layout>
            <LazyLoader>
              <Home />
            </LazyLoader>
          </Layout>
        } />
        <Route path="/blog" element={
          <Layout>
            <LazyLoader>
              <Blog />
            </LazyLoader>
          </Layout>
        } />
        <Route path="/blog/:slug" element={
          <Layout>
            <LazyLoader>
              <BlogPost />
            </LazyLoader>
          </Layout>
        } />
        <Route path="/artists" element={
          <Layout>
            <LazyLoader>
              <Artists />
            </LazyLoader>
          </Layout>
        } />
        <Route path="/artists/:id" element={
          <Layout>
            <LazyLoader>
              <ArtistDetail />
            </LazyLoader>
          </Layout>
        } />
        <Route path="/shop" element={
          <Layout>
            <LazyLoader>
              <Shop />
            </LazyLoader>
          </Layout>
        } />
        <Route path="/shop/:id" element={
          <Layout>
            <LazyLoader>
              <ProductDetail />
            </LazyLoader>
          </Layout>
        } />
        <Route path="/events" element={
          <Layout>
            <LazyLoader>
              <Events />
            </LazyLoader>
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <LazyLoader>
              <Contact />
            </LazyLoader>
          </Layout>
        } />
        <Route path="/auth" element={
          <Layout>
            <LazyLoader>
              <Auth />
            </LazyLoader>
          </Layout>
        } />
        <Route path="/reset-password" element={
          <Layout>
            <LazyLoader>
              <ResetPassword />
            </LazyLoader>
          </Layout>
        } />
        <Route path="/checkout" element={
          <Layout>
            <LazyLoader>
              <Checkout />
            </LazyLoader>
          </Layout>
        } />
        <Route path="/profile" element={
          <Layout>
            <LazyLoader>
              <Profile />
            </LazyLoader>
          </Layout>
        } />
        <Route path="/user-profile" element={
          <Layout>
            <LazyLoader>
              <UserProfile />
            </LazyLoader>
          </Layout>
        } />

        {/* Admin routes - SINGLE AdminLayout instance with proper nesting */}
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
          <Route path="dashboard" element={
            <LazyLoader>
              <Dashboard />
            </LazyLoader>
          } />
          <Route path="artists" element={
            <LazyLoader>
              <AdminArtists />
            </LazyLoader>
          } />
          <Route path="blog" element={
            <LazyLoader>
              <AdminBlog />
            </LazyLoader>
          } />
          <Route path="appointments" element={
            <LazyLoader>
              <Appointments />
            </LazyLoader>
          } />
          <Route path="clients" element={
            <LazyLoader>
              <Clients />
            </LazyLoader>
          } />
          <Route path="clients/:id" element={
            <LazyLoader>
              <ClientDetail />
            </LazyLoader>
          } />
          <Route path="products" element={
            <LazyLoader>
              <Products />
            </LazyLoader>
          } />
          <Route path="stock" element={
            <LazyLoader>
              <Stock />
            </LazyLoader>
          } />
          <Route path="projects" element={
            <LazyLoader>
              <Projects />
            </LazyLoader>
          } />
          <Route path="events" element={
            <LazyLoader>
              <AdminEvents />
            </LazyLoader>
          } />
          <Route path="financial" element={
            <LazyLoader>
              <Financial />
            </LazyLoader>
          } />
          <Route path="analytics" element={
            <LazyLoader>
              <Analytics />
            </LazyLoader>
          } />
          <Route path="loyalty" element={
            <LazyLoader>
              <Loyalty />
            </LazyLoader>
          } />
          <Route path="security" element={
            <LazyLoader>
              <Security />
            </LazyLoader>
          } />
        </Route>

        {/* Standalone admin auth routes */}
        <Route path="/admin/auth" element={
          <LazyLoader>
            <AdminAuth />
          </LazyLoader>
        } />
        <Route path="/admin/setup" element={
          <LazyLoader>
            <AdminUserSetup />
          </LazyLoader>
        } />

        {/* 404 */}
        <Route path="*" element={
          <Layout>
            <LazyLoader>
              <NotFound />
            </LazyLoader>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
