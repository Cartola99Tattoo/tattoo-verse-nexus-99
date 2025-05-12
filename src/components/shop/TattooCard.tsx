
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";

interface TattooCardProps {
  tattoo: {
    id: number;
    name: string;
    artist: string;
    image: string;
    price: number;
    category: string;
    rating: number;
  };
}

const TattooCard = ({ tattoo }: TattooCardProps) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    try {
      addToCart({
        id: tattoo.id,
        name: tattoo.name,
        price: tattoo.price,
        image: tattoo.image,
        artist: tattoo.artist,
        category: tattoo.category,
      });
      
      toast({
        title: "Produto adicionado",
        description: `${tattoo.name} foi adicionado ao carrinho.`,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item ao carrinho.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <Link to={`/shop/${tattoo.id}`}>
          <img
            src={tattoo.image}
            alt={tattoo.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
        <button 
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-colors"
          aria-label="Favoritar"
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold">
            <Link to={`/shop/${tattoo.id}`} className="hover:text-red-500 transition-colors">
              {tattoo.name}
            </Link>
          </h3>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span className="text-sm font-medium">{tattoo.rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">Por {tattoo.artist}</p>
        <p className="text-sm text-gray-500 mb-3">Categoria: {tattoo.category}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">R$ {tattoo.price}</span>
          <div className="space-x-2">
            <Button asChild size="sm" variant="outline" className="text-black border-black hover:bg-black hover:text-white">
              <Link to={`/shop/${tattoo.id}`}>Ver</Link>
            </Button>
            <Button 
              size="sm" 
              className="bg-red-500 hover:bg-red-600"
              onClick={handleAddToCart}
            >
              Comprar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TattooCard;
