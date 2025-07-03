
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Shop from './pages/Shop';
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
import NotFound from './pages/NotFound';
import ArtistProfile from './pages/ArtistProfile';
import TattooArtistsLanding from './pages/tattoo-artists/TattooArtistsLanding';
import TattooArtistDirectory from './pages/tattoo-artists/TattooArtistDirectory';
import TattooArtistProfile from './pages/tattoo-artists/TattooArtistProfile';
import TattooArtistDashboard from './pages/tattoo-artists/TattooArtistDashboard';
import TattooArtistsBlog from './pages/tattoo-artists/TattooArtistsBlog';
import TattooArtistsShop from './pages/tattoo-artists/TattooArtistsShop';
import TattooArtistsPortfolio from './pages/tattoo-artists/TattooArtistsPortfolio';
import TattooArtistsServices from './pages/tattoo-artists/TattooArtistsServices';
import TattooArtistsContact from './pages/tattoo-artists/TattooArtistsContact';
import TattooArtistsEvents from './pages/tattoo-artists/TattooArtistsEvents';
import Ecosistema from './pages/Ecosistema';

// Login pages
import ClienteLogin from './pages/login/ClienteLogin';
import EstudioLogin from './pages/login/EstudioLogin';
import AdminLogin from './pages/login/AdminLogin';
import TatuadorLogin from './pages/login/TatuadorLogin';

// Register pages
import ClienteRegister from './pages/register/ClienteRegister';
import EstudioRegister from './pages/register/EstudioRegister';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/shop" element={<Shop />} />
        
        {/* Nova Landing Page do Ecossistema */}
        <Route path="/ecosistema" element={<Ecosistema />} />
        
        {/* Login Routes */}
        <Route path="/login/cliente" element={<ClienteLogin />} />
        <Route path="/login/estudio" element={<EstudioLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/tatuador" element={<TatuadorLogin />} />
        
        {/* Register Routes */}
        <Route path="/register/cliente" element={<ClienteRegister />} />
        <Route path="/register/estudio" element={<EstudioRegister />} />

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

        <Route path="/artist/:id" element={<ArtistProfile />} />

        {/* Tattoo Artists Platform Routes */}
        <Route path="/tatuadores-da-nova-era" element={<TattooArtistsLanding />} />
        <Route path="/tatuadores-da-nova-era/artistas" element={<TattooArtistDirectory />} />
        <Route path="/tatuadores-da-nova-era/perfil/:id" element={<TattooArtistProfile />} />
        <Route path="/tatuadores-da-nova-era/dashboard" element={<TattooArtistDashboard />} />
        <Route path="/tatuadores-da-nova-era/blog" element={<TattooArtistsBlog />} />
        <Route path="/tatuadores-da-nova-era/shop" element={<TattooArtistsShop />} />
        <Route path="/tatuadores-da-nova-era/portfolio" element={<TattooArtistsPortfolio />} />
        <Route path="/tatuadores-da-nova-era/eventos" element={<TattooArtistsEvents />} />
        <Route path="/tatuadores-da-nova-era/services" element={<TattooArtistsServices />} />
        <Route path="/tatuadores-da-nova-era/contact" element={<TattooArtistsContact />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
