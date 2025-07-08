
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Heart, User, Calendar, Filter } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const mockPortfolioItems = [
  {
    id: 1,
    title: "Retrato Realista Feminino",
    artist: "João Silva Santos",
    artistId: "1",
    style: "Realismo",
    image: "https://images.unsplash.com/photo-1564131072-6c4d41e23ba6?w=400&h=500&fit=crop",
    description: "Retrato realista em preto e cinza com técnica de sombreado avançada",
    year: 2024,
    views: 1250,
    likes: 89,
    bodyPart: "Braço",
    timeSpent: "8 horas",
    featured: true
  },
  {
    id: 2,
    title: "Mandala Geométrica",
    artist: "Maria Fernanda Costa",
    artistId: "2",
    style: "Blackwork",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop",
    description: "Mandala complexa em blackwork com detalhes geométricos precisos",
    year: 2024,
    views: 980,
    likes: 156,
    bodyPart: "Costas",
    timeSpent: "12 horas",
    featured: false
  },
  {
    id: 3,
    title: "Flores Aquarela",
    artist: "Ana Beatriz Silva",
    artistId: "3",
    style: "Aquarela",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop",
    description: "Composição floral em técnica aquarela com degradês únicos",
    year: 2024,
    views: 750,
    likes: 234,
    bodyPart: "Perna",
    timeSpent: "6 horas",
    featured: true
  },
  {
    id: 4,
    title: "Leão Minimalista",
    artist: "Carlos Montenegro",
    artistId: "4",
    style: "Fine Line",
    image: "https://images.unsplash.com/photo-1565058379802-bbe93b2b2a98?w=400&h=500&fit=crop",
    description: "Leão em traços minimalistas com técnica fine line delicada",
    year: 2024,
    views: 850,
    likes: 92,
    bodyPart: "Antebraço",
    timeSpent: "4 horas",
    featured: false
  },
  {
    id: 5,
    title: "Dragão Oriental",
    artist: "Roberto Martins",
    artistId: "5",
    style: "Oriental",
    image: "https://images.unsplash.com/photo-1596730018434-f2b4a4e73e8c?w=400&h=500&fit=crop",
    description: "Dragão tradicional japonês com técnicas clássicas da tatuagem oriental",
    year: 2023,
    views: 1100,
    likes: 178,
    bodyPart: "Braço Completo",
    timeSpent: "16 horas",
    featured: false
  },
  {
    id: 6,
    title: "Rosas Sombreadas",
    artist: "Patricia Lima",
    artistId: "6",
    style: "Sombreado",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=500&fit=crop",
    description: "Composição de rosas com sombreado realista em preto e cinza",
    year: 2023,
    views: 920,
    likes: 145,
    bodyPart: "Ombro",
    timeSpent: "5 horas",
    featured: false
  }
];

const TattooArtistsPortfolio = () => {
  const [styleFilter, setStyleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredItems = mockPortfolioItems.filter(item => {
    return styleFilter === 'all' || item.style === styleFilter;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return b.year - a.year;
      case 'oldest': return a.year - b.year;
      case 'popular': return b.likes - a.likes;
      case 'views': return b.views - a.views;
      default: return 0;
    }
  });

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'Realismo': return 'bg-blue-100 text-blue-800';
      case 'Blackwork': return 'bg-gray-100 text-gray-800';
      case 'Aquarela': return 'bg-purple-100 text-purple-800';
      case 'Fine Line': return 'bg-green-100 text-green-800';
      case 'Oriental': return 'bg-red-100 text-red-800';
      case 'Sombreado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const featuredItems = sortedItems.filter(item => item.featured);
  const regularItems = sortedItems.filter(item => !item.featured);

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Portfólio <span className="text-red-400">99Tattoo</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore os melhores trabalhos dos tatuadores mais talentosos da nossa rede
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 font-medium">Filtros:</span>
              </div>
              
              <div className="flex gap-4">
                <Select value={styleFilter} onValueChange={setStyleFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Estilos</SelectItem>
                    <SelectItem value="Realismo">Realismo</SelectItem>
                    <SelectItem value="Blackwork">Blackwork</SelectItem>
                    <SelectItem value="Aquarela">Aquarela</SelectItem>
                    <SelectItem value="Fine Line">Fine Line</SelectItem>
                    <SelectItem value="Oriental">Oriental</SelectItem>
                    <SelectItem value="Sombreado">Sombreado</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mais Recentes</SelectItem>
                    <SelectItem value="oldest">Mais Antigos</SelectItem>
                    <SelectItem value="popular">Mais Curtidos</SelectItem>
                    <SelectItem value="views">Mais Visualizados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trabalhos em Destaque */}
        {featuredItems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              Trabalhos em Destaque
              <Badge className="bg-red-500 text-white">Featured</Badge>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item) => (
                <Card key={item.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 overflow-hidden">
                  <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 text-white shadow-lg">
                        Destaque
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className={getStyleColor(item.style)}>
                        {item.style}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center justify-between text-white text-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {item.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {item.likes}
                          </div>
                        </div>
                        <span>{item.timeSpent}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{item.artist}</span>
                      <span>•</span>
                      <Calendar className="h-4 w-4" />
                      <span>{item.year}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span><strong>Local:</strong> {item.bodyPart}</span>
                      <span><strong>Tempo:</strong> {item.timeSpent}</span>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Galeria Principal */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Galeria Completa</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {regularItems.map((item) => (
            <Card key={item.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={getStyleColor(item.style)}>
                    {item.style}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg p-2">
                  <div className="flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {item.likes}
                      </div>
                    </div>
                    <span>{item.timeSpent}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
                
                <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                  <User className="h-3 w-3" />
                  <span>{item.artist}</span>
                  <span>•</span>
                  <span>{item.year}</span>
                </div>
                
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="text-xs text-gray-500 mb-3">
                  <span><strong>Local:</strong> {item.bodyPart}</span>
                </div>
                
                <Button size="sm" variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-50">
                  Ver Mais
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-to-r from-red-600/10 to-red-700/10 border-red-500/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Quer exibir seu trabalho?
              </h3>
              <p className="text-gray-300 mb-6">
                Junte-se à nossa comunidade e mostre suas criações para milhares de pessoas apaixonadas por tatuagem.
              </p>
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                Enviar Trabalho
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsPortfolio;
