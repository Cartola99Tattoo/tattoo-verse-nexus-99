
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Artists from './pages/Artists';
import ArtistDetail from './pages/ArtistDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Events from './pages/Events';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import Profile from './pages/UserProfile';
import ResetPassword from './pages/ResetPassword';
import { CartProvider } from './contexts/CartContext';
import { SonnerToaster } from './components/ui/sonner-toaster';

// Admin Routes
import AdminAuth from './pages/AdminAuth';
import AdminUserSetup from './pages/AdminUserSetup';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminAnalytics from './pages/admin/Analytics';
import AdminLoyalty from './pages/admin/Loyalty';
import AdminSecurity from './pages/admin/Security';
import ProtectedRoute from './components/auth/ProtectedRoute';

import './App.css';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artist/:id" element={<ArtistDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/events" element={<Events />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Admin routes */}
          <Route path="/admin/auth" element={<AdminAuth />} />
          <Route path="/admin/setup" element={<AdminUserSetup />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/admin/loyalty" element={<ProtectedRoute><AdminLoyalty /></ProtectedRoute>} />
          <Route path="/admin/security" element={<ProtectedRoute><AdminSecurity /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Toast notifications container */}
        <SonnerToaster />
      </CartProvider>
    </Router>
  );
}

export default App;
