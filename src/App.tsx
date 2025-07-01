import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Shop from './pages/Shop';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminHome from './pages/admin/index';
import AdminArtists from './pages/admin/AdminArtists';
import AdminAuth from './pages/AdminAuth';
import AdminUserSetup from './pages/AdminUserSetup';
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
import Projects from './pages/admin/Projects';
import Events from './pages/admin/Events';
import MultiTenantTests from './pages/admin/MultiTenantTests';
import Pricing from './pages/Pricing';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import ArtistProfile from './pages/ArtistProfile';
import TattooArtistsLanding from './pages/tattoo-artists/TattooArtistsLanding';
import TattooArtistDirectory from './pages/tattoo-artists/TattooArtistDirectory';
import TattooArtistProfile from './pages/tattoo-artists/TattooArtistProfile';
import TattooArtistDashboard from './pages/tattoo-artists/TattooArtistDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/artists" element={<AdminArtists />} />
        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route path="/admin/user-setup" element={<AdminUserSetup />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/admin/clients" element={<Clients />} />
        <Route path="/admin/clients/:id" element={<ClientDetail />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/stock" element={<Stock />} />
        <Route path="/admin/financial" element={<Financial />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/loyalty" element={<Loyalty />} />
        <Route path="/admin/security" element={<Security />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/projects" element={<Projects />} />
        <Route path="/admin/events" element={<Events />} />
        <Route path="/admin/multi-tenant-tests" element={<MultiTenantTests />} />

        <Route path="/pricing" element={<Pricing />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/artist/:id" element={<ArtistProfile />} />
        <Route path="*" element={<NotFound />} />

      {/* Tattoo Artists Platform Routes */}
      <Route path="/tatuadores-da-nova-era" element={<TattooArtistsLanding />} />
      <Route path="/tatuadores-da-nova-era/artistas" element={<TattooArtistDirectory />} />
      <Route path="/tatuadores-da-nova-era/perfil/:id" element={<TattooArtistProfile />} />
      <Route path="/tatuadores-da-nova-era/dashboard" element={<TattooArtistDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
