
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Artist } from "@/services/interfaces/IArtistsService";

interface ArtistCardProps {
  artist: Artist;
  variant?: "default" | "compact";
}

const ArtistCard = ({ artist, variant = "default" }: ArtistCardProps) => {
  const fullName = `${artist.first_name} ${artist.last_name}`;
  const initials = `${artist.first_name.charAt(0)}${artist.last_name.charAt(0)}`;

  // Generate truncated bio for preview
  const truncatedBio = artist.bio.length > 120 
    ? `${artist.bio.substring(0, 120)}...` 
    : artist.bio;
    
  return (
    <Link to={`/artists/${artist.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-200 group">
        <div className="aspect-square w-full overflow-hidden relative">
          {variant === "default" && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white text-sm">Ver perfil</p>
            </div>
          )}
          <Avatar className="w-full h-full rounded-none">
            <AvatarImage 
              src={artist.avatar_url} 
              alt={fullName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            <AvatarFallback className="w-full h-full text-4xl bg-gray-200">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">{fullName}</h3>
            {artist.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="text-sm font-medium">{artist.rating}</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-500 mb-3 text-sm">{artist.style}</p>
          
          {variant === "default" && (
            <p className="text-sm text-gray-600 mb-4">{truncatedBio}</p>
          )}
          
          <div className="flex flex-wrap gap-1 mt-2">
            {artist.specialties.slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100">
                {specialty}
              </Badge>
            ))}
            {artist.specialties.length > 3 && (
              <Badge variant="outline" className="bg-gray-100">
                +{artist.specialties.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArtistCard;
