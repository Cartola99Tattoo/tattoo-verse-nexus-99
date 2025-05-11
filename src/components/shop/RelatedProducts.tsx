
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface RelatedProductsProps {
  currentProductId: number;
  category: string;
}

// Dados simulados - em produção, isso viria de uma API
const getRelatedProducts = (currentId: number, category: string) => {
  const products = [
    {
      id: 1,
      name: "Dragão Oriental",
      artist: "Mariana Silva",
      category: "Colorido",
      image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2070&auto=format&fit=crop",
      price: 750,
      rating: 4.9,
    },
    {
      id: 2,
      name: "Mandala Geométrica",
      artist: "Rafael Costa",
      category: "Blackwork",
      image: "https://images.unsplash.com/photo-1562962230-16e4623d36e7?q=80&w=1974&auto=format&fit=crop",
      price: 550,
      rating: 4.8,
    },
    {
      id: 3,
      name: "Leão Aquarela",
      artist: "Juliana Mendes",
      category: "Aquarela",
      image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1974&auto=format&fit=crop",
      price: 850,
      rating: 5.0,
    },
    {
      id: 4,
      name: "Lobo Selvagem",
      artist: "Mariana Silva",
      category: "Realismo",
      image: "https://images.unsplash.com/photo-1543767271-7c5f36dc5310?q=80&w=1974&auto=format&fit=crop",
      price: 900,
      rating: 4.9,
    },
    {
      id: 5,
      name: "Flor de Cerejeira",
      artist: "Juliana Mendes",
      category: "Aquarela",
      image: "https://images.unsplash.com/photo-1542727365-19732c00842f?q=80&w=1976&auto=format&fit=crop",
      price: 450,
      rating: 4.7,
    },
    {
      id: 6,
      name: "Crânio Estilizado",
      artist: "Rafael Costa",
      category: "Blackwork",
      image: "https://images.unsplash.com/photo-1507101489873-a4bc1e72c4cc?q=80&w=1973&auto=format&fit=crop",
      price: 650,
      rating: 4.8,
    },
  ];
  
  // Filtrar produtos da mesma categoria, excluindo o produto atual
  return products.filter(p => p.id !== currentId && p.category === category);
};

const RelatedProducts = ({ currentProductId, category }: RelatedProductsProps) => {
  const [products, setProducts] = useState<any[]>([]);
  
  useEffect(() => {
    // Em um cenário real, aqui seria feita uma chamada à API
    const relatedProducts = getRelatedProducts(currentProductId, category);
    setProducts(relatedProducts);
  }, [currentProductId, category]);
  
  if (products.length === 0) {
    return null;
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <div 
            key={product.id}
            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            <Link to={`/shop/${product.id}`} className="block">
              <div className="h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </Link>
            
            <div className="p-4">
              <Link to={`/shop/${product.id}`} className="block">
                <h3 className="font-bold text-lg mb-1 group-hover:text-red-500 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <p className="text-sm text-gray-600 mb-2">Por {product.artist}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">R$ {product.price}</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-sm">{product.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
