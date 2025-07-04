
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './contexts/ShopCartContext';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import TattooArtists from './pages/tattoo-artists/TattooArtists';
import TattooArtistProfile from './pages/tattoo-artists/TattooArtistProfile';
import TattooArtistDirectory from './pages/tattoo-artists/TattooArtistDirectory';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import TattooArtistsShop from './pages/tattoo-artists/TattooArtistsShop';
import TattooArtistsProductDetail from './pages/tattoo-artists/TattooArtistsProductDetail';
import TattooArtistsCheckout from './pages/tattoo-artists/TattooArtistsCheckout';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/servicos" element={<Services />} />
          
          {/* Tattoo Artists Routes */}
          <Route path="/tatuadores-da-nova-era" element={<TattooArtists />} />
          <Route path="/tatuadores-da-nova-era/perfil/:id" element={<TattooArtistProfile />} />
          <Route path="/tatuadores-da-nova-era/artistas" element={<TattooArtistDirectory />} />

          {/* Shop Routes */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
          
          {/* Tattoo Artists Shop Routes */}
          <Route path="/tatuadores-da-nova-era/shop" element={<TattooArtistsShop />} />
          <Route path="/tatuadores-da-nova-era/shop/:id" element={<TattooArtistsProductDetail />} />
          <Route path="/tatuadores-da-nova-era/shop/checkout" element={<TattooArtistsCheckout />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
