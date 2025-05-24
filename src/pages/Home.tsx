
import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import ServicesSection from '@/components/home/ServicesSection';
import ArtistsSection from '@/components/home/ArtistsSection';
import FeaturedTattoos from '@/components/home/FeaturedTattoos';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogPreview from '@/components/home/BlogPreview';
import CTASection from '@/components/home/CTASection';

const Home = () => {
  return (
    <Layout>
      <Hero />
      <ServicesSection />
      <ArtistsSection />
      <FeaturedTattoos />
      <TestimonialsSection />
      <BlogPreview />
      <CTASection />
    </Layout>
  );
};

export default Home;
