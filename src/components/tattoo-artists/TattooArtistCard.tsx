
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, MessageCircle, Instagram } from "lucide-react";
import { TattooArtist } from "@/data/mockTattooArtists";

interface TattooArtistCardProps {
  artist: TattooArtist;
  compact?: boolean;
}

const TattooArtistCard: React.FC<TattooArtistCardProps> = ({ artist, compact = false }) => {
  return (
    <Card className={`shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-red-glow transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 ${compact ? 'h-full' : ''}`}>
      <CardContent className={`${compact ? 'p-4' : 'p-6'}`}>
        <div className="text-center mb-4">
          <img
            src={artist.avatar}
            alt={artist.name}
            className={`${compact ? 'w-16 h-16' : 'w-20 h-20'} rounded-full mx-auto mb-3 object-cover border-3 border-red-200`}
          />
          <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-black text-red-600 mb-1`}>
            {artist.name}
          </h3>
          <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{artist.location.city}, {artist.location.state}</span>
          </div>
          <div className="flex items-center justify-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-gray-700">{artist.stats.rating}</span>
            <span className="text-gray-500 ml-1">({artist.stats.reviews})</span>
          </div>
        </div>

        {!compact && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
              {artist.bio}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {artist.specialties.slice(0, 3).map(specialty => (
                <Badge key={specialty} variant="outline" className="text-xs border-red-300 text-red-600">
                  {specialty}
                </Badge>
              ))}
              {artist.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                  +{artist.specialties.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {compact ? (
          <div className="flex flex-wrap gap-1 mb-3">
            {artist.specialties.slice(0, 2).map(specialty => (
              <Badge key={specialty} variant="outline" className="text-xs border-red-300 text-red-600">
                {specialty}
              </Badge>
            ))}
            {artist.specialties.length > 2 && (
              <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                +{artist.specialties.length - 2}
              </Badge>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
            <div className="text-center bg-red-50 p-2 rounded">
              <div className="font-bold text-red-600">{artist.stats.experience}a</div>
              <div className="text-gray-600">Experiência</div>
            </div>
            <div className="text-center bg-red-50 p-2 rounded">
              <div className="font-bold text-red-600">{artist.stats.worksCompleted}+</div>
              <div className="text-gray-600">Trabalhos</div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className={`text-center py-2 px-3 rounded-lg ${compact ? 'text-xs' : 'text-sm'} font-medium ${
            artist.isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {artist.isAvailable ? '✅ Disponível' : '⏰ Agenda Cheia'}
          </div>
        </div>

        {compact ? (
          <div className="space-y-2">
            <Link to={`/tatuadores-da-nova-era/perfil/${artist.id}`}>
              <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 font-bold text-sm">
                Ver Perfil
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                onClick={() => window.open(`https://wa.me/${artist.contact.whatsapp.replace(/\D/g, '')}`, '_blank')}
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                WhatsApp
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 border-pink-500 text-pink-600 hover:bg-pink-50"
                onClick={() => window.open(`https://instagram.com/${artist.contact.instagram.replace('@', '')}`, '_blank')}
              >
                <Instagram className="h-3 w-3 mr-1" />
                Instagram
              </Button>
            </div>
          </div>
        ) : (
          <Link to={`/tatuadores-da-nova-era/perfil/${artist.id}`}>
            <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 font-bold">
              Ver Perfil Completo
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default TattooArtistCard;
