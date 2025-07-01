
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Users, Filter } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import { getAllTattooArtists, TattooArtist } from "@/data/mockTattooArtists";

const TattooArtistDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const allArtists = getAllTattooArtists();
  
  // Extract unique locations and specialties for filters
  const locations = Array.from(new Set(allArtists.map(artist => `${artist.location.city}, ${artist.location.state}`)));
  const specialties = Array.from(new Set(allArtists.flatMap(artist => artist.specialties)));

  // Filter artists based on search criteria
  const filteredArtists = allArtists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = selectedLocation === "all" || 
                           `${artist.location.city}, ${artist.location.state}` === selectedLocation;
    
    const matchesSpecialty = selectedSpecialty === "all" || 
                           artist.specialties.includes(selectedSpecialty);
    
    const matchesAvailability = !showAvailableOnly || artist.isAvailable;

    return matchesSearch && matchesLocation && matchesSpecialty && matchesAvailability;
  });

  return (
    <TattooArtistLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-4">
              Nossos Artistas
            </h1>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Conheça os tatuadores mais talentosos da comunidade 99Tattoo. 
              Cada artista traz sua própria visão e especialidade única.
            </p>
            <div className="flex items-center justify-center gap-6 text-red-100">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>{allArtists.length} Artistas</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-1 text-yellow-400" />
                <span>Avaliação Média: 4.8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-8">
          <Card className="shadow-lg bg-white border-gray-200 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-red-600" />
                <h2 className="text-lg font-black text-gray-800">Filtros de Busca</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nome ou estilo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-red-200 focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Location Filter */}
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="border-red-200 focus:border-red-600">
                    <SelectValue placeholder="Localização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as cidades</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Specialty Filter */}
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="border-red-200 focus:border-red-600">
                    <SelectValue placeholder="Especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os estilos</SelectItem>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Availability Filter */}
                <Button
                  variant={showAvailableOnly ? "default" : "outline"}
                  onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                  className={showAvailableOnly 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "border-green-600 text-green-600 hover:bg-green-50"
                  }
                >
                  {showAvailableOnly ? "✓ Disponíveis" : "Só Disponíveis"}
                </Button>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                Mostrando {filteredArtists.length} de {allArtists.length} artistas
              </div>
            </CardContent>
          </Card>

          {/* Artists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtists.map((artist) => (
              <Link key={artist.id} to={`/tatuadores-da-nova-era/perfil/${artist.id}`}>
                <Card className="shadow-lg bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl hover:shadow-red-glow transition-all duration-300 transform hover:scale-105 cursor-pointer h-full">
                  <div className="relative">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${
                      artist.isAvailable 
                        ? 'bg-green-500 text-white' 
                        : 'bg-orange-500 text-white'
                    }`}>
                      {artist.isAvailable ? 'Disponível' : 'Ocupado'}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="text-xl font-black text-gray-800 mb-2">{artist.name}</h3>
                    
                    <div className="flex items-center mb-3">
                      <MapPin className="h-4 w-4 mr-1 text-red-500" />
                      <span className="text-sm text-gray-600">
                        {artist.location.city}, {artist.location.state}
                      </span>
                    </div>

                    <div className="flex items-center mb-3">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold">{artist.stats.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({artist.stats.reviews})</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
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

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                      <div>
                        <strong>{artist.stats.experience}</strong> anos exp.
                      </div>
                      <div>
                        <strong>{artist.stats.worksCompleted}</strong> trabalhos
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/tatuadores-da-nova-era/perfil/${artist.id}`;
                      }}
                    >
                      Ver Perfil
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* No results */}
          {filteredArtists.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Nenhum artista encontrado</h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar os filtros de busca para encontrar o artista ideal.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLocation("all");
                  setSelectedSpecialty("all");
                  setShowAvailableOnly(false);
                }}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistDirectory;
