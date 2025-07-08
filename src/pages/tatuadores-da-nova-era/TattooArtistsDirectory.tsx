
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const TattooArtistsDirectory = () => {
  const artists = [
    {
      id: 1,
      name: "Marina Santos",
      specialty: "Fine Line",
      rating: 4.9,
      location: "São Paulo, SP",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b002?w=150&h=150&fit=crop&crop=face",
      portfolio: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Carlos Montenegro",
      specialty: "Realismo",
      rating: 4.8,
      location: "Rio de Janeiro, RJ",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      portfolio: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Ana Costa",
      specialty: "Aquarela",
      rating: 4.7,
      location: "Belo Horizonte, MG",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      portfolio: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=200&fit=crop"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Diretório de <span className="text-white">Tatuadores</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                Encontre os melhores tatuadores profissionais do Brasil
              </p>
            </div>
          </div>
        </section>

        {/* Artists Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-red-600 mb-6">
                Tatuadores em Destaque
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {artists.map(artist => (
                <Card key={artist.id} className="bg-white border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={artist.portfolio} 
                      alt={`Portfolio de ${artist.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-red-200">
                      <AvatarImage src={artist.image} alt={artist.name} />
                      <AvatarFallback className="bg-red-100 text-red-600">
                        {artist.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-xl font-bold text-red-600 mb-2">{artist.name}</h3>
                    <Badge className="bg-red-100 text-red-600 mb-3">{artist.specialty}</Badge>
                    
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{artist.rating}</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{artist.location}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link to={`/tatuadores-da-nova-era/perfil/${artist.id}`} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white">
                          Ver Perfil
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default TattooArtistsDirectory;
