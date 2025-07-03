
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Heart, Share2, Filter, Grid, List } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const mockPortfolioItems = [
  {
    id: 1,
    title: "Realismo em Preto e Cinza",
    artist: "Carlos Silva",
    style: "Realismo",
    category: "Retrato",
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e7?w=400&h=400&fit=crop",
    likes: 234,
    views: 1456,
    description: "Retrato realista executado com técnica de sombreamento avançada."
  },
  {
    id: 2,
    title: "Mandala Geométrica",
    artist: "Ana Costa",
    style: "Geometric",
    category: "Ornamental",
    image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=400&h=400&fit=crop",
    likes: 189,
    views: 892,
    description: "Design geométrico complexo com padrões mandálicos simétricos."
  },
  {
    id: 3,
    title: "Aquarela Floral",
    artist: "Marina Santos",
    style: "Aquarela",
    category: "Natureza",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop",
    likes: 312,
    views: 2134,
    description: "Técnica de aquarela aplicada em motivos florais delicados."
  },
  {
    id: 4,
    title: "Old School Clássico",
    artist: "Roberto Alves",
    style: "Old School",
    category: "Tradicional",
    image: "https://images.unsplash.com/photo-1611024847487-e26177381a0f?w=400&h=400&fit=crop",
    likes: 145,
    views: 678,
    description: "Tatuagem tradicional americana com cores vibrantes."
  },
  {
    id: 5,
    title: "Biomecânico Futurista",
    artist: "Lucas Ferreira",
    style: "Biomecânico",
    category: "Futurista",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop",
    likes: 456,
    views: 3245,
    description: "Design biomecânico com elementos futuristas integrados."
  },
  {
    id: 6,
    title: "Fine Line Minimalista",
    artist: "Julia Mendes",
    style: "Fine Line",
    category: "Minimalista",
    image: "https://images.unsplash.com/photo-1585652869062-2d5b45d7a5eb?w=400&h=400&fit=crop",
    likes: 267,
    views: 1543,
    description: "Tatuagem delicada com traços finos e design minimalista."
  }
];

const TattooArtistsPortfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = ["all", "Realismo", "Geometric", "Aquarela", "Old School", "Biomecânico", "Fine Line"];
  
  const filteredItems = selectedCategory === "all" 
    ? mockPortfolioItems 
    : mockPortfolioItems.filter(item => item.style === selectedCategory);

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Portfólio da
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Comunidade</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore os melhores trabalhos dos tatuadores da nossa comunidade
          </p>
        </div>

        {/* Filtros e Controles */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "border-white/30 text-white hover:bg-white/20"
                  }
                >
                  {category === "all" ? "Todos" : category}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`border-white/30 text-white hover:bg-white/20 ${viewMode === "grid" ? "bg-white/20" : ""}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`border-white/30 text-white hover:bg-white/20 ${viewMode === "list" ? "bg-white/20" : ""}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
          {filteredItems.map((item) => (
            <Card key={item.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 group cursor-pointer">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-red-600 text-white">
                      {item.style}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{item.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <img src={item.image} alt={item.title} className="w-full h-96 object-cover rounded-lg" />
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">Artista: {item.artist}</p>
                              <p className="text-sm text-gray-600">Categoria: {item.category}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge>{item.style}</Badge>
                            </div>
                          </div>
                          <p className="text-gray-700">{item.description}</p>
                          <div className="flex justify-between items-center pt-4 border-t">
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {item.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {item.views}
                              </span>
                            </div>
                            <Button size="sm" variant="outline">
                              <Share2 className="h-4 w-4 mr-2" />
                              Compartilhar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-3">por {item.artist}</p>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {item.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {item.views}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-red-600 border-red-300">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-16 w-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum trabalho encontrado</h3>
            <p className="text-gray-300">Tente ajustar os filtros de categoria</p>
          </div>
        )}
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsPortfolio;
