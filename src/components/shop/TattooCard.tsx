
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart } from "lucide-react";
import OptimizedCartButton from "./OptimizedCartButton";

interface TattooCardProps {
  tattoo: {
    id: number;
    name: string;
    artist: string;
    category: string;
    image: string;
    price: number;
    rating: number;
  };
}

const TattooCard = ({ tattoo }: TattooCardProps) => {
  return (
    <Card variant="tattoo" className="group overflow-hidden h-full">
      <div className="relative">
        <Link to={`/shop/${tattoo.id}`}>
          <div className="h-64 overflow-hidden">
            <img
              src={tattoo.image}
              alt={tattoo.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </Link>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="icon" variant="tattooOutline" className="bg-white/90">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="tattoo" className="font-semibold">
            {tattoo.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/shop/${tattoo.id}`}>
            <h3 className="text-lg font-bold hover:text-red-600 transition-colors">
              {tattoo.name}
            </h3>
          </Link>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-sm font-medium">{tattoo.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">Por {tattoo.artist}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-red-600">R$ {tattoo.price}</span>
        </div>
        
        <div className="flex gap-2">
          <OptimizedCartButton
            productId={tattoo.id.toString()}
            productName={tattoo.name}
            price={tattoo.price}
            variant="tattoo"
            className="flex-1"
          />
          <Button asChild variant="tattooOutline" size="default">
            <Link to={`/shop/${tattoo.id}`}>
              Ver Detalhes
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TattooCard;
