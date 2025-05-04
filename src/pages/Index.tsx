
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ArtistSection from '@/components/ArtistSection';
import BlogSection from '@/components/BlogSection';
import ShopSection from '@/components/ShopSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <BlogSection />
        <ShopSection />
        <ArtistSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
