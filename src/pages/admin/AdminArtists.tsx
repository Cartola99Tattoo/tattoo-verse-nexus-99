import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getArtistsService } from "@/services/serviceFactory";
import { Plus, Search, Filter, Edit, Trash2, Eye, Palette, Users, Star, TrendingUp, Calendar, DollarSign, Award, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Artist } from "@/services/interfaces/IArtistsService";
import ArtistForm from "@/components/admin/ArtistForm";

const AdminArtists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [styleFilter, setStyleFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const queryClient = useQueryClient();
  const artistsService = getArtistsService();

  // Buscar artistas
  const { data: artistsData, isLoading: artistsLoading } = useQuery({
    queryKey: ['admin-artists', searchTerm, statusFilter, styleFilter, locationFilter],
    queryFn: () => artistsService.fetchArtists({
      search: searchTerm || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter as 'active' | 'inactive',
      style: styleFilter === 'all' ? undefined : styleFilter,
      limit: 100
    }),
  });

  const artists = artistsData?.artists || [];

  // Filtrar por localização no frontend (simulado)
  const filteredArtists = artists.filter(artist => {
    if (locationFilter === 'all') return true;
    const artistLocations = artist?.locations || [];
    return artistLocations.some((location: string) => 
      location.toLowerCase().includes(locationFilter.toLowerCase())
    );
  });

  // Mutation para criar artista
  const createArtistMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!artistsService.createArtist) {
        throw new Error('Serviço de criação não disponível');
      }
      const result = await artistsService.createArtist(data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Tatuador criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar tatuador. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Mutation para atualizar artista
  const updateArtistMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      if (!artistsService.updateArtist) {
        throw new Error('Serviço de atualização não disponível');
      }
      const result = await artistsService.updateArtist(id, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
      setIsEditDialogOpen(false);
      setSelectedArtist(null);
      toast({
        title: "Sucesso",
        description: "Tatuador atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar tatuador. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Mutation para deletar artista
  const deleteArtistMutation = useMutation({
    mutationFn: (id: string) => {
      if (!artistsService.deleteArtist) {
        throw new Error('Serviço de exclusão não disponível');
      }
      return artistsService.deleteArtist(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
      toast({
        title: "Sucesso",
        description: "Tatuador removido com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover tatuador. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleEditArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsEditDialogOpen(true);
  };

  const handleDeleteArtist = async (artist: Artist) => {
    if (window.confirm(`Tem certeza que deseja remover ${artist.first_name} ${artist.last_name}?`)) {
      deleteArtistMutation.mutate(artist.id);
    }
  };

  const handleCreateSave = async (data: any) => {
    await createArtistMutation.mutateAsync(data);
  };

  const handleUpdateSave = async (data: any) => {
    if (selectedArtist) {
      await updateArtistMutation.mutateAsync({ 
        id: selectedArtist.id, 
        data 
      });
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
        Ativo
      </Badge>
    ) : (
      <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md">
        Inativo
      </Badge>
    );
  };

  const getPerformanceMetrics = (artist: Artist) => {
    // Mock data para métricas de performance
    const mockMetrics = {
      appointments: Math.floor(Math.random() * 50) + 10,
      revenue: (Math.random() * 15000) + 5000,
      rating: (Math.random() * 1.5) + 3.5,
      portfolioCount: Math.floor(Math.random() * 20) + 5
    };
    return mockMetrics;
  };

  const uniqueStyles = [...new Set(artists.map(artist => artist.style))];
  const uniqueLocations = [...new Set(
    artists.flatMap(artist => artist?.locations || [])
  )];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 p-6 space-y-8">
      {/* Header com gradiente 99Tattoo */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2">Gestão de Tatuadores</h1>
            <p className="text-red-100 text-lg opacity-90">Gerencie os artistas talentosos do seu estúdio</p>
          </div>
          <div className="flex items-center gap-4 text-red-100">
            <div className="text-center">
              <div className="text-2xl font-bold">{filteredArtists.length}</div>
              <div className="text-sm opacity-75">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">
                {filteredArtists.filter(a => a.status === 'active').length}
              </div>
              <div className="text-sm opacity-75">Ativos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas Aprimorados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-red-800">Total de Artistas</CardTitle>
            <Users className="h-6 w-6 text-red-600 group-hover:scale-110 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-red-700">{filteredArtists.length}</div>
            <p className="text-xs text-red-600 font-medium">
              Tatuadores cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-green-800">Artistas Ativos</CardTitle>
            <Palette className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-700">
              {filteredArtists.filter(a => a.status === 'active').length}
            </div>
            <p className="text-xs text-green-600 font-medium">
              Disponíveis para agendamento
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-blue-800">Estilos Únicos</CardTitle>
            <Star className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-700">
              {uniqueStyles.length}
            </div>
            <p className="text-xs text-blue-600 font-medium">
              Variedade de estilos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-purple-800">Localizações</CardTitle>
            <MapPin className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-purple-700">
              {uniqueLocations.length}
            </div>
            <p className="text-xs text-purple-600 font-medium">
              Cidades atendidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Controles Aprimorados */}
      <Card className="bg-gradient-to-r from-white to-gray-50 border-red-200 shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 h-5 w-5" />
                <Input
                  placeholder="Buscar tatuadores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 shadow-lg transition-all duration-300"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] border-red-200 focus:border-red-500 shadow-lg">
                  <Filter className="h-4 w-4 mr-2 text-red-500" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-red-200 shadow-xl">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={styleFilter} onValueChange={setStyleFilter}>
                <SelectTrigger className="w-[160px] border-red-200 focus:border-red-500 shadow-lg">
                  <SelectValue placeholder="Estilo" />
                </SelectTrigger>
                <SelectContent className="bg-white border-red-200 shadow-xl">
                  <SelectItem value="all">Todos Estilos</SelectItem>
                  {uniqueStyles.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[160px] border-red-200 focus:border-red-500 shadow-lg">
                  <MapPin className="h-4 w-4 mr-2 text-red-500" />
                  <SelectValue placeholder="Localização" />
                </SelectTrigger>
                <SelectContent className="bg-white border-red-200 shadow-xl">
                  <SelectItem value="all">Todas Cidades</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-6 py-3 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Novo Tatuador
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Tatuadores Aprimorada */}
      <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-black">Tatuadores Cadastrados</CardTitle>
          <CardDescription className="text-red-100">
            Gerencie os perfis dos tatuadores e suas métricas de performance
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {artistsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
                    <TableHead className="font-black text-red-800">Artista</TableHead>
                    <TableHead className="font-black text-red-800">Contato</TableHead>
                    <TableHead className="font-black text-red-800">Estilo</TableHead>
                    <TableHead className="font-black text-red-800">Especialidades</TableHead>
                    <TableHead className="font-black text-red-800">Localização</TableHead>
                    <TableHead className="font-black text-red-800">Performance</TableHead>
                    <TableHead className="font-black text-red-800">Status</TableHead>
                    <TableHead className="text-right font-black text-red-800">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArtists.map((artist) => {
                    const metrics = getPerformanceMetrics(artist);
                    const artistLocations = artist?.locations || [];
                    return (
                      <TableRow key={artist.id} className="hover:bg-red-50 transition-colors duration-200 border-b border-red-100">
                        <TableCell>
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12 border-2 border-red-200 shadow-lg">
                              <AvatarImage src={artist.avatar_url} />
                              <AvatarFallback className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold">
                                {artist.first_name.charAt(0)}{artist.last_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-bold text-red-800 text-lg">
                                {artist.first_name} {artist.last_name}
                              </div>
                              <div className="text-sm text-red-600 font-medium">
                                {artist.commission_percentage}% comissão
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-700">{artist.email}</div>
                            <div className="text-sm text-gray-600">{artist.phone}</div>
                            {artist.contact?.instagram && (
                              <div className="text-sm text-red-600 font-medium">@{artist.contact.instagram}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg">
                            {artist.style}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {artist.specialties.slice(0, 2).map((specialty) => (
                              <Badge key={specialty} variant="outline" className="text-xs border-red-300 text-red-700 bg-red-50 font-medium">
                                {specialty}
                              </Badge>
                            ))}
                            {artist.specialties.length > 2 && (
                              <Badge variant="outline" className="text-xs border-red-300 text-red-700 bg-red-50 font-medium">
                                +{artist.specialties.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {artistLocations.slice(0, 2).map((location: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs border-purple-300 text-purple-700 bg-purple-50 font-medium flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {location}
                              </Badge>
                            ))}
                            {artistLocations.length > 2 && (
                              <Badge variant="outline" className="text-xs border-purple-300 text-purple-700 bg-purple-50 font-medium">
                                +{artistLocations.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-700">{metrics.appointments} agendamentos</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">R$ {metrics.revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-medium text-yellow-700">{metrics.rating.toFixed(1)} ⭐</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(artist.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => window.open(`/artists/${artist.id}`, '_blank')}
                              className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditArtist(artist)}
                              className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteArtist(artist)}
                              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Criação */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto bg-gradient-to-br from-white to-red-50 border-red-200">
          <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-lg -mx-6 -mt-6 mb-6">
            <DialogTitle className="text-2xl font-black">Novo Tatuador</DialogTitle>
            <DialogDescription className="text-red-100 text-lg">
              Cadastre um novo artista talentoso no sistema
            </DialogDescription>
          </DialogHeader>
          <ArtistForm
            onSave={handleCreateSave}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto bg-gradient-to-br from-white to-red-50 border-red-200">
          <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-lg -mx-6 -mt-6 mb-6">
            <DialogTitle className="text-2xl font-black">Editar Tatuador</DialogTitle>
            <DialogDescription className="text-red-100 text-lg">
              Atualize as informações do artista
            </DialogDescription>
          </DialogHeader>
          {selectedArtist && (
            <ArtistForm
              artist={selectedArtist}
              onSave={handleUpdateSave}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedArtist(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminArtists;
