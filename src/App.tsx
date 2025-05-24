
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

        {/* Admin routes - SINGLE AdminLayout instance with dynamic titles */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={
            <AdminLayout title="Dashboard" description="Visão geral e métricas do estúdio">
              <Dashboard />
            </AdminLayout>
          } />
          <Route path="artists" element={
            <AdminLayout title="Tatuadores" description="Gerencie os tatuadores e seus portfólios">
              <AdminArtists />
            </AdminLayout>
          } />
          <Route path="blog" element={
            <AdminLayout title="Blog" description="Gerencie artigos e conteúdo do blog">
              <AdminBlog />
            </AdminLayout>
          } />
          <Route path="appointments" element={
            <AdminLayout title="Agendamentos" description="Gerencie agendamentos e calendário">
              <Appointments />
            </AdminLayout>
          } />
          <Route path="clients" element={
            <AdminLayout title="Clientes" description="Gerencie clientes e relacionamentos">
              <Clients />
            </AdminLayout>
          } />
          <Route path="clients/:id" element={
            <AdminLayout title="Detalhes do Cliente" description="Informações detalhadas do cliente">
              <ClientDetail />
            </AdminLayout>
          } />
          <Route path="products" element={
            <AdminLayout title="Produtos" description="Gerencie produtos e catálogo">
              <Products />
            </AdminLayout>
          } />
          <Route path="stock" element={
            <AdminLayout title="Estoque" description="Controle de estoque e inventário">
              <Stock />
            </AdminLayout>
          } />
          <Route path="projects" element={
            <AdminLayout title="Projetos" description="Gerencie projetos e tarefas do estúdio">
              <Projects />
            </AdminLayout>
          } />
          <Route path="financial" element={
            <AdminLayout title="Financeiro" description="Controle financeiro e relatórios">
              <Financial />
            </AdminLayout>
          } />
          <Route path="analytics" element={
            <AdminLayout title="Analytics" description="Análise de dados e performance do estúdio">
              <Analytics />
            </AdminLayout>
          } />
          <Route path="loyalty" element={
            <AdminLayout title="Programa de Fidelidade" description="Gerencie o programa de fidelidade do estúdio">
              <Loyalty />
            </AdminLayout>
          } />
          <Route path="security" element={
            <AdminLayout title="Segurança" description="Configurações de segurança e acesso">
              <Security />
            </AdminLayout>
          } />
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
