
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Instagram, Heart } from "lucide-react";

const artistsData = [
  {
    id: 1,
    name: "Mariana Silva",
    specialty: "Realismo",
    location: "São Paulo, SP",
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1594736797933-d0589ba2fe65?q=80&w=1974&auto=format&fit=crop",
    styles: ["Realismo", "Retrato", "Preto e Cinza"],
    experience: "8 anos",
    instagram: "@mariana_tattoo"
  },
  {
    id: 2,
    name: "Rafael Costa",
    specialty: "Blackwork",
    location: "Rio de Janeiro, RJ",
    rating: 4.8,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    styles: ["Blackwork", "Geométrico", "Mandala"],
    experience: "6 anos",
    instagram: "@rafael_blackwork"
  },
  {
    id: 3,
    name: "Juliana Mendes",
    specialty: "Aquarela",
    location: "Belo Horizonte, MG",
    rating: 5.0,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1974&auto=format&fit=crop",
    styles: ["Aquarela", "Colorido", "Floral"],
    experience: "10 anos",
    instagram: "@juli_watercolor"
  },
  {
    id: 4,
    name: "Carlos Fernandes",
    specialty: "Traditional",
    location: "Porto Alegre, RS",
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1974&auto=format&fit=crop",
    styles: ["Traditional", "Old School", "Neo Traditional"],
    experience: "12 anos",
    instagram: "@carlos_traditional"
  }
];

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Todos");
  const navigate = useNavigate();

  const styles = ["Todos", "Realismo", "Blackwork", "Aquarela", "Traditional", "Geométrico"];

  const filteredArtists = artistsData.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStyle = selectedStyle === "Todos" || artist.styles.includes(selectedStyle);
    return matchesSearch && matchesStyle;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Nossos <span className="text-white">Tatuadores</span>
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-white">
              Conheça os artistas talentosos que transformarão suas ideias em arte permanente
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <Input
                variant="tattoo"
                placeholder="Buscar por nome ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="shadow-lg border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {styles.map(style => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                    selectedStyle === style
                      ? "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-red-glow"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredArtists.map(artist => (
              <Card 
                key={artist.id} 
                variant="tattoo" 
                className="group cursor-pointer overflow-hidden bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl hover:shadow-red-glow transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => navigate(`/artists/${artist.id}`)}
              >
                <div className="relative">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="icon" variant="tattooOutline" className="bg-white/90 shadow-lg">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="absolute top-3 left-3">
                    <Badge variant="tattoo" className="font-semibold shadow-md bg-gradient-to-r from-red-600 to-red-800">
                      {artist.specialty}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-red-600 hover:text-red-700 transition-colors">
                      {artist.name}
                    </h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-700">{artist.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1 text-red-500" />
                    <span className="text-sm">{artist.location}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {artist.styles.slice(0, 3).map(style => (
                      <Badge key={style} variant="tattooOutline" className="text-xs border-red-200 text-red-600">
                        {style}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <span>Experiência: <span className="font-medium text-red-600">{artist.experience}</span></span>
                    <span>{artist.reviews} avaliações</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="tattoo"
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/artists/${artist.id}`);
                      }}
                    >
                      Ver Perfil
                    </Button>
                    <Button
                      variant="tattooOutline"
                      size="icon"
                      className="shadow-md hover:shadow-lg border-red-200 text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://instagram.com/${artist.instagram.replace('@', '')}`, '_blank');
                      }}
                    >
                      <Instagram className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredArtists.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-red-600 mb-2">Nenhum artista encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Artists;
