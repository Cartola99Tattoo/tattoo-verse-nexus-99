
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brush, Search, Filter, Plus, Users, Star, Award, TrendingUp, Edit, Trash2, Eye } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";
import ArtistModal from "@/components/nave-mae/ArtistModal";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getArtistsService } from "@/services/serviceFactory";

const NaveMaeArtists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [studioFilter, setStudioFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const artistService = getArtistsService();
  const { data: artistsData, loading } = useDataQuery(
    () => artistService.fetchArtists(),
    []
  );

  const artists = Array.isArray(artistsData) ? artistsData : (artistsData?.artists || []);
  const [localArtists, setLocalArtists] = useState(artists);

  React.useEffect(() => {
    if (artists.length > 0) {
      setLocalArtists(artists);
    }
  }, [artists]);

  const filteredArtists = localArtists.filter(artist => {
    const fullName = `${artist.first_name} ${artist.last_name}`;
    const matchesSearch = fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || artist.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveArtist = (artistData) => {
    if (artistData.id) {
      // Update existing artist
      setLocalArtists(prev => prev.map(artist => 
        artist.id === artistData.id ? { ...artist, ...artistData } : artist
      ));
    } else {
      // Add new artist
      const newArtist = {
        ...artistData,
        id: `artist_${Date.now()}`,
        rating: 0,
        created_at: new Date().toISOString()
      };
      setLocalArtists(prev => [...prev, newArtist]);
    }
    setSelectedArtist(null);
  };

  const handleEditArtist = (artist) => {
    setSelectedArtist(artist);
    setIsModalOpen(true);
  };

  const handleDeleteArtist = (artistId) => {
    if (confirm('Tem certeza que deseja excluir este tatuador?')) {
      setLocalArtists(prev => prev.filter(artist => artist.id !== artistId));
    }
  };

  const totalArtists = localArtists.length;
  const activeArtists = localArtists.filter(a => a.status === 'active').length;
  const inactiveArtists = localArtists.filter(a => a.status === 'inactive').length;
  const featuredArtists = 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total de Tatuadores</p>
                  <p className="text-3xl font-bold text-purple-800">{totalArtists}</p>
                </div>
                <Brush className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Tatuadores Ativos</p>
                  <p className="text-3xl font-bold text-green-800">{activeArtists}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Em Destaque</p>
                  <p className="text-3xl font-bold text-yellow-800">{featuredArtists}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Performance Média</p>
                  <p className="text-3xl font-bold text-blue-800">8.7</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-96 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar tatuadores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4 items-center">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={studioFilter} onValueChange={setStudioFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Estúdios</SelectItem>
                    <SelectItem value="studio1">Estúdio 1</SelectItem>
                    <SelectItem value="studio2">Estúdio 2</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={() => {
                    setSelectedArtist(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Tatuador
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Tatuadores */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredArtists.map((artist) => (
              <Card key={artist.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">{`${artist.first_name} ${artist.last_name}`}</CardTitle>
                      <p className="text-sm text-gray-500">{artist.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`text-xs ${getStatusColor(artist.status)}`}>
                        {artist.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Especialidades:</strong> {artist.specialties?.join(', ') || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Telefone:</strong> {artist.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Avaliação:</strong> ⭐ {artist.rating?.toFixed(1) || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Estilo:</strong> {artist.style}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditArtist(artist)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteArtist(artist.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {filteredArtists.length === 0 && !loading && (
          <div className="text-center py-12">
            <Brush className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum tatuador encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Adicione o primeiro tatuador à rede'
              }
            </p>
          </div>
        )}

        <ArtistModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedArtist(null);
          }}
          artist={selectedArtist}
          onSave={handleSaveArtist}
        />
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeArtists;
