
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './contexts/ShopCartContext';
import { Toaster } from './components/ui/toaster';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Ecosistema from './pages/Ecosistema';

// Tattoo Artists Routes
import TattooArtists from './pages/tattoo-artists/TattooArtists';
import TattooArtistProfile from './pages/tattoo-artists/TattooArtistProfile';
import TattooArtistDirectory from './pages/tattoo-artists/TattooArtistDirectory';
import TattooArtistsBlog from './pages/tattoo-artists/TattooArtistsBlog';
import TattooArtistsBlogArticle from './pages/tatuadores-da-nova-era/TattooArtistsBlogArticle';
import TattooArtistsEvents from './pages/tattoo-artists/TattooArtistsEvents';
import TattooArtistsPortfolio from './pages/tattoo-artists/TattooArtistsPortfolio';
import TattooArtistsServices from './pages/tattoo-artists/TattooArtistsServices';

// Shop Routes
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import TattooArtistsShop from './pages/tattoo-artists/TattooArtistsShop';
import TattooArtistsProductDetail from './pages/tattoo-artists/TattooArtistsProductDetail';
import TattooArtistsCheckout from './pages/tattoo-artists/TattooArtistsCheckout';

// Admin Routes
import AdminHome from './pages/admin/index';
import { AdminArtists } from './pages/admin/index';
import { AdminAuth } from './pages/admin/index';
import { AdminUserSetup } from './pages/admin/index';
import { Appointments } from './pages/admin/index';
import { Clients } from './pages/admin/index';
import { ClientDetail } from './pages/admin/index';
import { Products } from './pages/admin/index';
import { Stock } from './pages/admin/index';
import { Financial } from './pages/admin/index';
import { Dashboard } from './pages/admin/index';
import { Analytics } from './pages/admin/index';
import { Loyalty } from './pages/admin/index';
import { Security } from './pages/admin/index';
import { AdminBlog } from './pages/admin/index';
import { Projects } from './pages/admin/index';
import { Events } from './pages/admin/index';
import { MultiTenantTests } from './pages/admin/index';

// Nave Mae Routes
import NaveMaeLanding from './pages/nave-mae/NaveMaeLanding';
import NaveMaeDashboard from './pages/nave-mae/NaveMaeDashboard';
import NaveMaeArtists from './pages/nave-mae/NaveMaeArtists';
import NaveMaeClients from './pages/nave-mae/NaveMaeClients';
import NaveMaeAppointments from './pages/nave-mae/NaveMaeAppointments';
import NaveMaeProjects from './pages/nave-mae/NaveMaeProjects';
import NaveMaeLoyalty from './pages/nave-mae/NaveMaeLoyalty';
import NaveMaeProducts from './pages/nave-mae/NaveMaeProducts';
import NaveMaeStock from './pages/nave-mae/NaveMaeStock';
import NaveMaeFinancial from './pages/nave-mae/NaveMaeFinancial';
import NaveMaeReports from './pages/nave-mae/NaveMaeReports';
import NaveMaeEvents from './pages/nave-mae/NaveMaeEvents';
import NaveMaeBlog from './pages/nave-mae/NaveMaeBlog';
import NaveMaeSettings from './pages/nave-mae/NaveMaeSettings';
import NaveMaeSecurity from './pages/nave-mae/NaveMaeSecurity';
import NaveMaeStudios from './pages/nave-mae/NaveMaeStudios';
import NaveMaeAnalytics from './pages/nave-mae/NaveMaeAnalytics';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Toaster />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/ecosistema" element={<Ecosistema />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/artists" element={<AdminArtists />} />
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
            <Route path="/admin/tests" element={<MultiTenantTests />} />
            <Route path="/admin/auth" element={<AdminAuth />} />
            <Route path="/admin/setup" element={<AdminUserSetup />} />
            
            {/* Tattoo Artists Routes */}
            <Route path="/tatuadores-da-nova-era" element={<TattooArtists />} />
            <Route path="/tatuadores-da-nova-era/perfil/:id" element={<TattooArtistProfile />} />
            <Route path="/tatuadores-da-nova-era/artistas" element={<TattooArtistDirectory />} />
            <Route path="/tatuadores-da-nova-era/blog" element={<TattooArtistsBlog />} />
            <Route path="/tatuadores-da-nova-era/blog/:articleId" element={<TattooArtistsBlogArticle />} />
            <Route path="/tatuadores-da-nova-era/eventos" element={<TattooArtistsEvents />} />
            <Route path="/tatuadores-da-nova-era/portfolio" element={<TattooArtistsPortfolio />} />
            <Route path="/tatuadores-da-nova-era/services" element={<TattooArtistsServices />} />

            {/* Shop Routes */}
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            
            {/* Tattoo Artists Shop Routes */}
            <Route path="/tatuadores-da-nova-era/shop" element={<TattooArtistsShop />} />
            <Route path="/tatuadores-da-nova-era/shop/:id" element={<TattooArtistsProductDetail />} />
            <Route path="/tatuadores-da-nova-era/shop/checkout" element={<TattooArtistsCheckout />} />

            {/* Nave Mae Routes */}
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
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
