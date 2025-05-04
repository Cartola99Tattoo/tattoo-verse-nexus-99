
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  artist: string;
  price: number;
  image: string;
  style: string;
}

const ShopSection: React.FC = () => {
  const products: Product[] = [
    {
      id: 1,
      name: "Pôster Dragão Futurista",
      artist: "Alex Mercer",
      price: 89.90,
      image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      style: "Digital Art"
    },
    {
      id: 2,
      name: "Adesivo Flor de Cerejeira",
      artist: "Julia Santos",
      price: 29.90,
      image: "https://images.unsplash.com/photo-1600267185393-e158a98703de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      style: "Aquarela"
    },
    {
      id: 3,
      name: "Sketchbook Personalizado",
      artist: "Marco Rocha",
      price: 120.00,
      image: "https://images.unsplash.com/photo-1506147854445-5a2b45da42f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      style: "Mixed Media"
    },
    {
      id: 4,
      name: "Flash Tattoo - Geométrico",
      artist: "Marco Rocha",
      price: 150.00,
      image: "https://images.unsplash.com/photo-1605451371289-feeb1293f13c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      style: "Geométrico"
    }
  ];

  return (
    <section id="loja" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nossa <span className="text-tattoo-red">Loja</span></h2>
          <div className="red-line mx-auto w-24 my-4"></div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore nossa coleção de designs exclusivos, produtos e acessórios para expressar seu estilo único.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-tattoo-darkgray rounded-lg overflow-hidden futuristic-border group"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tattoo-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-tattoo-red px-4 py-2 rounded text-white text-sm hover:bg-tattoo-red/80 transition-colors">
                    Visualizar
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-400">{product.artist}</p>
                  </div>
                  <span className="bg-tattoo-black px-2 py-1 rounded text-xs text-gray-300">
                    {product.style}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-tattoo-red font-semibold">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <button className="text-xs bg-tattoo-black text-white px-3 py-1 rounded hover:bg-tattoo-red transition-colors">
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-tattoo-red px-6 py-3 rounded futuristic-border flex items-center gap-2 hover:bg-tattoo-red/80 transition-all duration-300 mx-auto">
            Ver Loja Completa <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
