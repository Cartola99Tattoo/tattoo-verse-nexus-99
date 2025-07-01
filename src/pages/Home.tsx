
import React from 'react';
import Hero from '@/components/home/Hero';
import ServicesSection from '@/components/home/ServicesSection';
import ArtistsSection from '@/components/home/ArtistsSection';
import FeaturedTattoos from '@/components/home/FeaturedTattoos';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogPreview from '@/components/home/BlogPreview';
import CTASection from '@/components/home/CTASection';
import AboutSection from '@/components/home/AboutSection';
import EventTattoos from '@/components/home/EventTattoos';
import InstagramFeed from '@/components/home/InstagramFeed';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [showSelector, setShowSelector] = useState(true); // início com a tela de seleção
  const navigate = useNavigate();

  if (showSelector) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
        <h1 className="text-3xl font-bold mb-6">Bem-vindo à 99Tattoo</h1>
        <div className="space-y-4 w-full max-w-xs">
          <button onClick={() => setShowSelector(false)} className="w-full px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition">Site Público / Loja</button>
          <button onClick={() => navigate('/admin')} className="w-full px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition">Painel Admin</button>
          <button onClick={() => navigate('/tatuadores-da-nova-era')} className="w-full px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 transition">Tatuadores</button>
          <button onClick={() => navigate('/nave-mae-da-tatuagem')} className="w-full px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-600 transition">Nave Mãe</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* resto do código atual... */}
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* Hero Section with Enhanced Gradient */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black/5 to-red-800/10"></div>
        <Hero />
      </div>
      
      {/* Services Section - Moved to be more prominent after Hero */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-inner">
        <ServicesSection />
      </div>
      
      {/* About Section with Subtle Shadow */}
      <div className="shadow-lg bg-white relative z-10">
        <AboutSection />
      </div>
      
      {/* Featured Tattoos with Enhanced Cards */}
      <div className="bg-white relative">
        <FeaturedTattoos />
      </div>
      
      {/* Artists Section with Dark Gradient */}
      <div className="bg-gradient-to-b from-gray-900 to-black text-white shadow-2xl">
        <ArtistsSection />
      </div>
      
      {/* Events with Red Accent */}
      <div className="bg-gradient-to-br from-red-50 to-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent"></div>
        <EventTattoos />
      </div>
      
      {/* Testimonials with Elevated Design */}
      <div className="bg-white shadow-xl">
        <TestimonialsSection />
      </div>
      
      {/* Blog Preview with Gradient */}
      <div className="bg-gradient-to-t from-gray-100 to-white">
        <BlogPreview />
      </div>
      
      {/* CTA with Strong Red Gradient */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-2xl">
        <CTASection />
      </div>
      
      {/* Instagram Feed with Final Gradient */}
      <div className="bg-gradient-to-b from-gray-900 to-black">
        <InstagramFeed />
      </div>
    </div>
  );
};

export default Home;
