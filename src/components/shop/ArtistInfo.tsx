
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface ArtistInfoProps {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  specialties?: string[];
  rating?: number;
  totalReviews?: number;
}

const ArtistInfo = ({ 
  id, 
  name, 
  avatar, 
  bio, 
  specialties = ["Realismo", "Aquarela", "Geométrico"],
  rating = 4.8,
  totalReviews = 124
}: ArtistInfoProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start animate-fade-in">
      <div className="md:w-1/3 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-red-gradient blur-md rounded-full opacity-30 transform -translate-x-1 translate-y-1"></div>
          <img 
            src={avatar} 
            alt={name} 
            className="w-48 h-48 rounded-full object-cover relative z-10 border-2 border-white shadow-lg hover-scale"
          />
        </div>
        
        <h3 className="text-xl font-heading font-bold mb-2 text-center">{name}</h3>
        
        <div className="flex items-center mb-4">
          <div className="flex items-center text-yellow-500 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="h-4 w-4 fill-current" 
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                strokeWidth={i < Math.floor(rating) ? 0 : 2}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">{rating} ({totalReviews} avaliações)</span>
        </div>
        
        <Button 
          asChild
          variant="outline"
          className="w-full border-primary-500 text-primary-600 hover:bg-primary-50 hover-lift"
        >
          <Link to={`/artists/${id}`}>Ver perfil completo</Link>
        </Button>
      </div>
      
      <div className="md:w-2/3">
        <h4 className="text-lg font-heading font-semibold mb-3 border-b border-gray-200 pb-2">
          Sobre o Artista
        </h4>
        <p className="text-gray-700 mb-6 leading-relaxed">{bio}</p>
        
        <div>
          <h4 className="text-lg font-heading font-semibold mb-3 border-b border-gray-200 pb-2">
            Especialidades
          </h4>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty, index) => (
              <span 
                key={index} 
                className="bg-gradient-to-r from-primary-500 to-primary-400 text-white px-3 py-1 rounded-full text-sm shadow-sm hover-scale"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistInfo;
