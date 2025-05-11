
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import ArtistsSection from "@/components/home/ArtistsSection";
import FeaturedTattoos from "@/components/home/FeaturedTattoos";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BlogPreview from "@/components/home/BlogPreview";
import CTASection from "@/components/home/CTASection";
import InstagramFeed from "@/components/home/InstagramFeed";

const Index = () => {
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

export default Index;
