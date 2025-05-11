
import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import AboutSection from '@/components/home/AboutSection';
import FeaturedTattoos from '@/components/home/FeaturedTattoos';
import ArtistsSection from '@/components/home/ArtistsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogPreview from '@/components/home/BlogPreview';
import CTASection from '@/components/home/CTASection';
import InstagramFeed from '@/components/home/InstagramFeed';

const Home = () => {
  return (
    <Layout>
      <Hero />
      <AboutSection />
      <FeaturedTattoos />
      <ArtistsSection />
      <TestimonialsSection />
      <BlogPreview />
      <CTASection />
      <InstagramFeed />
    </Layout>
  );
};

export default Home;
