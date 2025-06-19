
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, Calendar, User, Eye, Heart, Share2, Tag, Image as ImageIcon } from "lucide-react";
import { mockTattooArtistService } from "@/services/mock/mockTattooArtistService";

interface TattooArtistPortfolioProps {
  artistId: string;
}

const TattooArtistPortfolio = ({ artistId }: TattooArtistPortfolioProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const { data: portfolioItems = [], isLoading } = useQuery({
    queryKey: ['tattoo-artist-portfolio', artistId],
    queryFn: () => mockTattooArtistService.getPortfolioItems(artistId),
  });

  const styles = [
    { value: 'all', label: 'Todos os Estilos' },
    { value: 'Realismo', label: 'Realismo' },
    { value: 'Aquarela', label: 'Aquarela' },
    { value: 'Tradicional', label: 'Tradicional' },
    { value: 'Geométrico', label: 'Geométrico' },
    { value: 'Blackwork', label: 'Blackwork' },
    { value: 'Oriental', label: 'Oriental' },
  ];

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'Trabalho Original', label: 'Trabalho Original' },
    { value: 'Cover Up', label: 'Cover Up' },
    { value: 'Restauração', label: 'Restauração' },
    { value: 'Colaboração', label: 'Colaboração' },
  ];

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStyle = selectedStyle === 'all' || item.style === selectedStyle;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesStyle && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Carregando portfólio...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Estatísticas */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">{portfolioItems.length}</div>
            <div className="text-gray-300">Trabalhos Realizados</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {new Set(portfolioItems.map(item => item.style)).size}
            </div>
            <div className="text-gray-300">Estilos Dominados</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {portfolioItems.filter(item => item.category === 'Cover Up').length}
            </div>
            <div className="text-gray-300">Cover Ups</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {Math.round(portfolioItems.length / 12 * 10) / 10}
            </div>
            <div className="text-gray-300">Anos de Experiência</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="w-full lg:w-96 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
            <Input
              placeholder="Buscar trabalhos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30"
            />
          </div>
          
          <div className="flex gap-4 items-center flex-wrap">
            <Filter className="h-5 w-5 text-white" />
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {styles.map((style) => (
                  <SelectItem key={style.value} value={style.value} className="text-white">
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value} className="text-white">
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Galeria de Trabalhos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4 relative">
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-xs">
                    {item.style}
                  </Badge>
                  <Badge className="bg-blue-500 text-white font-medium text-xs">
                    {item.category}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-2" />
                  {new Date(item.completion_date).toLocaleDateString('pt-BR')}
                </div>
                {item.client_name && (
                  <div className="flex items-center text-xs text-gray-500">
                    <User className="h-3 w-3 mr-2" />
                    {item.client_name}
                  </div>
                )}
                {item.session_duration && (
                  <div className="text-xs text-gray-500">
                    Duração: {item.session_duration}
                  </div>
                )}
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-gray-500 border-gray-300">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedItem(item)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver Detalhes
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 mx-auto mb-4 text-white/50" />
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum trabalho encontrado</h3>
          <p className="text-gray-300">Tente ajustar os filtros de busca</p>
        </div>
      )}

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedItem?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={selectedItem.image_url} 
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                      {selectedItem.style}
                    </Badge>
                    <Badge className="bg-blue-500 text-white">
                      {selectedItem.category}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{selectedItem.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Data de Conclusão:</span>
                    <p className="text-gray-600">{new Date(selectedItem.completion_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  {selectedItem.client_name && (
                    <div>
                      <span className="font-semibold text-gray-700">Cliente:</span>
                      <p className="text-gray-600">{selectedItem.client_name}</p>
                    </div>
                  )}
                  {selectedItem.session_duration && (
                    <div>
                      <span className="font-semibold text-gray-700">Duração:</span>
                      <p className="text-gray-600">{selectedItem.session_duration}</p>
                    </div>
                  )}
                </div>

                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-semibold text-gray-700">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-gray-500 border-gray-300">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                    <Heart className="h-4 w-4 mr-2" />
                    Curtir Trabalho
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TattooArtistPortfolio;
