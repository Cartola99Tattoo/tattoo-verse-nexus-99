
import React from 'react';
import Layout from '@/components/layout/Layout';
import BlogPreview from '@/components/home/BlogPreview';

const Home = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            99<span className="text-red-500">Tattoo</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Arte na pele com personalidade e estilo único
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/shop" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-medium transition-colors">
              Comprar Tatuagens
            </a>
            <a href="/blog" className="bg-transparent hover:bg-white hover:text-black border border-white text-white px-6 py-3 rounded-md font-medium transition-colors">
              Nosso Blog
            </a>
          </div>
        </div>
      </div>
      
      {/* Blog preview section */}
      <BlogPreview />
      
      {/* Add more home page sections here */}
    </Layout>
  );
};

export default Home;
