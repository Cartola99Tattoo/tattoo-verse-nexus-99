import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Users, Calendar, DollarSign, Settings, Plus, Search, MoreHorizontal } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getStudioService, getNaveMaeService } from "@/services/serviceFactory";

const StudioManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const studioService = getStudioService();
  const naveMaeService = getNaveMaeService();

  const { data: studiosData, loading, refresh } = useDataQuery(
    () => studioService.fetchStudios(),
    []
  );

  const { data: metricsData } = useDataQuery(
    () => naveMaeService.getConsolidatedMetrics(),
    []
  );

  const studios = studiosData || [];
  const metrics = metricsData || {
    totalStudios: 0,
    totalArtists: 0,
    totalAppointments: 0,
    totalRevenue: 0
  };

  const filteredStudios = studios.filter(studio => {
    const matchesSearch = studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         studio.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || studio.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <NaveMaeLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Gestão de Estúdios
          </h1>
          <p className="text-gray-300">
            Gerencie todos os estúdios parceiros da rede 99Tattoo
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Total de Estúdios</p>
                  <p className="text-3xl font-bold text-white">{metrics.totalStudios || studios.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Artistas Ativos</p>
                  <p className="text-3xl font-bold text-white">{metrics.totalArtists || 0}</p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Agendamentos Hoje</p>
                  <p className="text-3xl font-bold text-white">{metrics.totalAppointments || 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Receita Total</p>
                  <p className="text-3xl font-bold text-white">R$ {(metrics.totalRevenue || 0).toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
              <Input
                placeholder="Buscar estúdios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30"
              />
            </div>
            
            <div className="flex gap-4 items-center">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all" className="text-white">Todos os Status</SelectItem>
                  <SelectItem value="active" className="text-white">Ativo</SelectItem>
                  <SelectItem value="inactive" className="text-white">Inativo</SelectItem>
                  <SelectItem value="suspended" className="text-white">Suspenso</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Estúdio
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 text-white border-gray-700">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Estúdio</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-300">Funcionalidade em desenvolvimento...</p>
                    <Button onClick={() => setShowCreateDialog(false)}>
                      Fechar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Studios Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-600 rounded mb-4"></div>
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudios.map((studio) => (
              <Card key={studio.id} className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border-purple-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {studio.logo_url ? (
                        <img src={studio.logo_url} alt={studio.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg font-bold text-white">{studio.name}</CardTitle>
                        <p className="text-sm text-gray-300">{studio.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Badge className={`text-xs ${getStatusColor(studio.status)}`}>
                      {studio.status === 'active' ? 'Ativo' : studio.status === 'inactive' ? 'Inativo' : 'Suspenso'}
                    </Badge>
                    <Badge className={`text-xs ${getPlanColor(studio.subscription_plan)}`}>
                      {studio.subscription_plan === 'basic' ? 'Básico' : 
                       studio.subscription_plan === 'premium' ? 'Premium' : 'Enterprise'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {studio.description && (
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2">{studio.description}</p>
                  )}
                  
                  {studio.address && (
                    <p className="text-xs text-gray-400 mb-4">{studio.address}</p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Configurar
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredStudios.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum estúdio encontrado</h3>
            <p className="text-gray-300">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Adicione o primeiro estúdio à rede 99Tattoo'
              }
            </p>
          </div>
        )}
      </div>
    </NaveMaeLayout>
  );
};

export default StudioManagement;
