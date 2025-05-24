
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Artists from './pages/Artists';
import ArtistDetail from './pages/ArtistDetail';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import ResetPassword from './pages/ResetPassword';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminArtists from './pages/admin/AdminArtists';
import Appointments from './pages/admin/Appointments';
import Clients from './pages/admin/Clients';
import ClientDetail from './pages/admin/ClientDetail';
import Products from './pages/admin/Products';
import Stock from './pages/admin/Stock';
import Financial from './pages/admin/Financial';
import Analytics from './pages/admin/Analytics';
import Loyalty from './pages/admin/Loyalty';
import Security from './pages/admin/Security';
import AdminBlog from './pages/admin/Blog';
import AdminAuth from './pages/AdminAuth';
import AdminUserSetup from './pages/AdminUserSetup';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Projects from './pages/admin/Projects';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:id" element={<ArtistDetail />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<ProductDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user-profile" element={<UserProfile />} />

        {/* Admin routes - SINGLE AdminLayout instance */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="artists" element={<AdminArtists />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="products" element={<Products />} />
          <Route path="stock" element={<Stock />} />
          <Route path="projects" element={<Projects />} />
          <Route path="financial" element={<Financial />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="loyalty" element={<Loyalty />} />
          <Route path="security" element={<Security />} />
        </Route>

        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route path="/admin/setup" element={<AdminUserSetup />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
