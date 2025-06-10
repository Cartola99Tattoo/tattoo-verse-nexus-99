
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
