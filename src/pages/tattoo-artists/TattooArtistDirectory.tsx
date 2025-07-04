
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Search, Filter, Users, Award } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import { getAllTattooArtists } from "@/data/mockTattooArtists";

const TattooArtistDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedStyle, setSelectedStyle] = useState("all");
  
  const artists = getAllTattooArtists();
  
  // Get unique cities and styles for filters
  const cities = [...new Set(artists.map(artist => artist.location.city))];
  const styles = [...new Set(artists.flatMap(artist => artist.specialties))];
  
  // Filter artists based on search and filters
  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCity = selectedCity === "all" || artist.location.city === selectedCity;
    const matchesStyle = selectedStyle === "all" || artist.specialties.includes(selectedStyle);
    
    return matchesSearch && matchesCity && matchesStyle;
  });

  return (
    <TattooArtistLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-black mb-4">
                Diretório de Tatuadores
              </h1>
              <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                Conheça os tatuadores da nossa comunidade e encontre o artista perfeito para seu próximo projeto
              </p>
              
              <div className="flex items-center justify-center gap-6 text-red-200">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{artists.length} Artistas</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  <span>Verificados</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 fill-yellow-400 text-yellow-400" />
                  <span>Avaliados</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-8">
          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-red-600 flex items-center">
                <Filter className="h-6 w-6 mr-2" />
                Filtros de Busca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, estilo ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-red-200 focus:border-red-400"
                  />
                </div>
                
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="border-red-200 focus:border-red-400">
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as cidades</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger className="border-red-200 focus:border-red-400">
                    <SelectValue placeholder="Selecione o estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os estilos</SelectItem>
                    {styles.map(style => (
                      <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Artists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtists.map((artist) => (
              <Card key={artist.id} className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-red-glow transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-3 border-red-200"
                    />
                    <h3 className="text-xl font-black text-red-600 mb-1">{artist.name}</h3>
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

                  <div className="mb-4">
                    <div className={`text-center py-2 px-3 rounded-lg text-sm font-medium ${
                      artist.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {artist.isAvailable ? '✅ Disponível' : '⏰ Agenda Cheia'}
                    </div>
                  </div>

                  <Link to={`/tatuadores-da-nova-era/perfil/${artist.id}`}>
                    <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 font-bold">
                      Ver Perfil Completo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArtists.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">Nenhum artista encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou buscar por outros termos</p>
            </div>
          )}
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistDirectory;
