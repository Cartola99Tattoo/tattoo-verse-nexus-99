
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getArtistsService } from "@/services/serviceFactory";
import { Plus, Search, Filter, Edit, Trash2, Eye, Palette, Users, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Artist } from "@/services/interfaces/IArtistsService";
import ArtistForm from "@/components/admin/ArtistForm";

const AdminArtists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [styleFilter, setStyleFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const queryClient = useQueryClient();
  const artistsService = getArtistsService();

  // Buscar artistas
  const { data: artistsData, isLoading: artistsLoading } = useQuery({
    queryKey: ['admin-artists', searchTerm, statusFilter, styleFilter],
    queryFn: () => artistsService.fetchArtists({
      search: searchTerm || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter as 'active' | 'inactive',
      style: styleFilter === 'all' ? undefined : styleFilter,
      limit: 100
    }),
  });

  const artists = artistsData?.artists || [];

  // Mutation para criar artista
  const createArtistMutation = useMutation({
    mutationFn: (data: any) => {
      if (!artistsService.createArtist) {
        throw new Error('Serviço de criação não disponível');
      }
      return artistsService.createArtist(data);
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
    mutationFn: ({ id, data }: { id: string, data: any }) => {
      if (!artistsService.updateArtist) {
        throw new Error('Serviço de atualização não disponível');
      }
      return artistsService.updateArtist(id, data);
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

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
    ) : (
      <Badge variant="secondary">Inativo</Badge>
    );
  };

  const uniqueStyles = [...new Set(artists.map(artist => artist.style))];

  return (
    <AdminLayout 
      title="Gestão de Tatuadores" 
      description="Gerencie os artistas, seus perfis e configurações"
    >
      <div className="p-6 space-y-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Artistas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{artists.length}</div>
              <p className="text-xs text-muted-foreground">
                Tatuadores cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Artistas Ativos</CardTitle>
              <Palette className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {artists.filter(a => a.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Disponíveis para agendamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estilos Diferentes</CardTitle>
              <Star className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {uniqueStyles.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Variedade de estilos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comissão Média</CardTitle>
              <Star className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {artists.length > 0 
                  ? Math.round(artists.reduce((acc, a) => acc + a.commission_percentage, 0) / artists.length)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Comissão média dos artistas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Controles */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar tatuadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-[300px]"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={styleFilter} onValueChange={setStyleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estilo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Estilos</SelectItem>
                {uniqueStyles.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Tatuador
          </Button>
        </div>

        {/* Tabela de Artistas */}
        <Card>
          <CardHeader>
            <CardTitle>Tatuadores Cadastrados</CardTitle>
            <CardDescription>
              Gerencie os perfis dos tatuadores e suas configurações
            </CardDescription>
          </CardHeader>
          <CardContent>
            {artistsLoading ? (
              <div className="flex justify-center py-8">
                <p>Carregando tatuadores...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artista</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Estilo</TableHead>
                    <TableHead>Especialidades</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artists.map((artist) => (
                    <TableRow key={artist.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={artist.avatar_url} />
                            <AvatarFallback>
                              {artist.first_name.charAt(0)}{artist.last_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {artist.first_name} {artist.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {artist.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{artist.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{artist.style}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {artist.specialties.slice(0, 2).map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {artist.specialties.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{artist.specialties.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{artist.commission_percentage}%</TableCell>
                      <TableCell>{getStatusBadge(artist.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => window.open(`/artists/${artist.id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditArtist(artist)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteArtist(artist)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Dialog para Criar Artista */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Novo Tatuador</DialogTitle>
              <DialogDescription>
                Cadastre um novo tatuador no sistema
              </DialogDescription>
            </DialogHeader>
            <ArtistForm
              onSubmit={(data) => createArtistMutation.mutateAsync(data)}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createArtistMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog para Editar Artista */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Editar Tatuador</DialogTitle>
              <DialogDescription>
                Atualize as informações do tatuador
              </DialogDescription>
            </DialogHeader>
            {selectedArtist && (
              <ArtistForm
                artist={selectedArtist}
                onSubmit={(data) => updateArtistMutation.mutateAsync({ 
                  id: selectedArtist.id, 
                  data 
                })}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setSelectedArtist(null);
                }}
                isLoading={updateArtistMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminArtists;
