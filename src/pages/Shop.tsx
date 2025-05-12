
import React from 'react';
import Layout from '@/components/layout/Layout';

const Shop = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Loja de Tatuagens</h1>
        <p className="text-gray-600 mb-8">
          Escolha entre nossa coleção de designs de tatuagens ou solicite um design personalizado.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 border rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Em breve</h2>
            <p>Nossa coleção está sendo preparada. Volte em breve!</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
