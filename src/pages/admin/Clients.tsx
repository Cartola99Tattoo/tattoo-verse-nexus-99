import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getClientService } from "@/services/serviceFactory";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  Users, Search, Filter, Plus, Eye, UserCheck, Crown, UserX, LayoutGrid, List, 
  TrendingUp, Clock, Settings, Mail, Phone, Tag, Move, Target, MessageSquare 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CRMLeadForm from "@/components/admin/CRMLeadForm";
import ClientsKanban from "@/components/admin/ClientsKanban";
import KanbanSettings from "@/components/admin/KanbanSettings";
import CRMClientDetail from "@/components/admin/CRMClientDetail";
import AppointmentForm from "@/components/admin/AppointmentForm";
import { Client } from "@/services/interfaces/IClientService";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [temperatureFilter, setTemperatureFilter] = useState<string>("all");
  const [originFilter, setOriginFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("kanban");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentClientData, setAppointmentClientData] = useState<{ id: string; name: string } | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clientService = getClientService();

  // Buscar estatísticas unificadas
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['client-stats'],
    queryFn: () => clientService.fetchClientStats(),
  });

  // Buscar clientes com filtros expandidos
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients', searchTerm, statusFilter, temperatureFilter, originFilter],
    queryFn: () => clientService.fetchClients({
      search: searchTerm || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      temperature: temperatureFilter === 'all' ? undefined : temperatureFilter,
      limit: 100
    }),
  });

  // Mutação para ações em massa
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ clientIds, action, value }: { 
      clientIds: string[]; 
      action: 'status' | 'temperature' | 'tag'; 
      value: string 
    }) => {
      const promises = clientIds.map(id => {
        if (action === 'status') {
          return clientService.updateClient(id, { status: value as any });
        } else if (action === 'temperature') {
          return clientService.updateClientTemperature(id, value as any);
        }
        return Promise.resolve();
      });
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client-stats'] });
      setSelectedClients([]);
      toast({
        title: "Ação executada",
        description: "A ação em massa foi executada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível executar a ação em massa.",
        variant: "destructive"
      });
    }
  });

  const handleBulkAction = (action: 'status' | 'temperature' | 'tag', value: string) => {
    if (selectedClients.length === 0) return;
    bulkUpdateMutation.mutate({ clientIds: selectedClients, action, value });
  };

  const handleClientSelection = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(clients.map(c => c.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleViewClient = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      new: { variant: "tattooInfo", icon: Users },
      active: { variant: "tattooSuccess", icon: UserCheck },
      inactive: { variant: "secondary", icon: UserX },
      vip: { variant: "tattoo", icon: Crown },
      interested: { variant: "tattooWarning", icon: Eye },
      pending: { variant: "tattooWarning", icon: Clock },
      completed: { variant: "tattooSuccess", icon: UserCheck },
      returning: { variant: "tattoo", icon: TrendingUp },
    };
    
    const labels = {
      new: "Novo",
      active: "Ativo", 
      inactive: "Inativo",
      vip: "VIP",
      interested: "Interessado",
      pending: "Pendente",
      completed: "Concluído",
      returning: "Retorno",
    };

    const variant = variants[status as keyof typeof variants];
    const IconComponent = variant?.icon || Users;

    return (
      <Badge variant={variant?.variant as any}>
        <IconComponent className="h-3 w-3 mr-1" />
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTemperatureBadge = (temperature?: string) => {
    if (!temperature) return null;

    const variants = {
      hot: { variant: "destructive", label: "🔥 Quente" },
      warm: { variant: "tattooWarning", label: "🔶 Morno" },
      cold: { variant: "tattooInfo", label: "❄️ Frio" },
    };

    const variant = variants[temperature as keyof typeof variants];
    if (!variant) return null;

    return (
      <Badge variant={variant.variant as any}>
        {variant.label}
      </Badge>
    );
  };

  const getOriginBadge = (origin?: string) => {
    if (!origin) return <Badge variant="secondary">Manual</Badge>;

    const origins = {
      'landing_events': { label: 'Landing Eventos', variant: 'tattoo' },
      'contact_form': { label: 'Formulário Contato', variant: 'tattooInfo' },
      'consultation': { label: 'Consultoria', variant: 'tattooWarning' },
      'shop': { label: 'Loja', variant: 'tattooSuccess' },
      'referral': { label: 'Indicação', variant: 'tattooSecondary' },
      'social_media': { label: 'Redes Sociais', variant: 'tattooOutline' },
      'manual': { label: 'Manual', variant: 'secondary' },
    };

    const originData = origins[origin as keyof typeof origins] || { label: origin, variant: 'secondary' };
    
    return (
      <Badge variant={originData.variant as any}>
        {originData.label}
      </Badge>
    );
  };

  // Mock clients data for loyalty integration demonstration
  const mockClientsForLoyalty = clients.map(client => ({
    ...client,
    loyaltyPoints: Math.floor(Math.random() * 2000),
    loyaltyLevel: ['Bronze', 'Prata', 'Ouro', 'Platina'][Math.floor(Math.random() * 4)],
  }));

  const handleOpenAppointmentForm = (clientId: string, clientName: string) => {
    setAppointmentClientData({ id: clientId, name: clientName });
    setSelectedClientId(null); // Close client detail modal
    setShowAppointmentForm(true);
  };

  const handleCloseAppointmentForm = () => {
    setShowAppointmentForm(false);
    setAppointmentClientData(null);
  };

  const handleAppointmentSuccess = () => {
    handleCloseAppointmentForm();
    toast({
      title: "✨ Agendamento criado!",
      description: "O agendamento foi criado com sucesso a partir da ficha do cliente.",
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-red-50 via-white to-red-50 min-h-screen relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-100/20 via-transparent to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-100/15 via-transparent to-transparent rounded-full transform -translate-x-24 translate-y-24"></div>

      <div className="relative z-10">
        {/* Cards de Estatísticas CRM/Clientes Unificados */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 animate-fade-in">
            {/* Cards de Estatísticas CRM/Clientes Unificados */}
            <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">Total</CardTitle>
                <Users className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900">{stats.total_clients}</div>
                <p className="text-xs text-red-600">Clientes</p>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">Novos Leads</CardTitle>
                <Target className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.new_clients_this_month || 0}</div>
                <p className="text-xs text-gray-600">Este mês</p>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">Conversão</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.conversion_rate || 0}%</div>
                <p className="text-xs text-gray-600">Taxa</p>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">Quentes</CardTitle>
                <div className="h-4 w-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.hot_clients || 0}</div>
                <p className="text-xs text-gray-600">Alta prioridade</p>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">Tempo Médio</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.average_conversion_time || 0}d</div>
                <p className="text-xs text-gray-600">Conversão</p>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">Ticket Médio</CardTitle>
                <Users className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.average_order_value || 0)}</div>
                <p className="text-xs text-gray-600">Por cliente</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Ações em Massa */}
        {selectedClients.length > 0 && (
          <Card variant="tattooRed">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-800">
                  {selectedClients.length} cliente(s) selecionado(s)
                </span>
                <div className="flex gap-2">
                  <Select onValueChange={(value) => handleBulkAction('status', value)}>
                    <SelectTrigger className="w-[140px] h-8">
                      <Move className="h-3 w-3 mr-1" />
                      <SelectValue placeholder="Mover para" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interested">Interessado</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="returning">Retorno</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select onValueChange={(value) => handleBulkAction('temperature', value)}>
                    <SelectTrigger className="w-[140px] h-8">
                      <Tag className="h-3 w-3 mr-1" />
                      <SelectValue placeholder="Temperatura" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hot">🔥 Quente</SelectItem>
                      <SelectItem value="warm">🔶 Morno</SelectItem>
                      <SelectItem value="cold">❄️ Frio</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedClients([])}
                  >
                    Limpar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros e Controles Expandidos com melhor styling */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-lg shadow-lg border border-red-200 animate-fade-in">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-red-200 focus:border-red-600"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] border-red-200 focus:border-red-600">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="new">Novo Lead</SelectItem>
                <SelectItem value="interested">Interessado</SelectItem>
                <SelectItem value="pending">Agendamento Pendente</SelectItem>
                <SelectItem value="completed">Tatuagem Concluída</SelectItem>
                <SelectItem value="returning">Retorno Esperado</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>

            <Select value={temperatureFilter} onValueChange={setTemperatureFilter}>
              <SelectTrigger className="w-[140px] border-red-200 focus:border-red-600">
                <SelectValue placeholder="Temperatura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="hot">🔥 Quente</SelectItem>
                <SelectItem value="warm">🔶 Morno</SelectItem>
                <SelectItem value="cold">❄️ Frio</SelectItem>
              </SelectContent>
            </Select>

            <Select value={originFilter} onValueChange={setOriginFilter}>
              <SelectTrigger className="w-[160px] border-red-200 focus:border-red-600">
                <SelectValue placeholder="Origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Origens</SelectItem>
                <SelectItem value="landing_events">Landing Eventos</SelectItem>
                <SelectItem value="contact_form">Formulário Contato</SelectItem>
                <SelectItem value="consultation">Consultoria</SelectItem>
                <SelectItem value="shop">Loja</SelectItem>
                <SelectItem value="referral">Indicação</SelectItem>
                <SelectItem value="social_media">Redes Sociais</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <div className="flex border border-red-200 rounded-lg">
              <Button
                variant={viewMode === "kanban" ? "tattoo" : "ghost"}
                size="sm"
                onClick={() => setViewMode("kanban")}
                className="rounded-r-none"
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Kanban
              </Button>
              <Button
                variant={viewMode === "table" ? "tattoo" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4 mr-1" />
                Tabela
              </Button>
            </div>

            {viewMode === "kanban" && (
              <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="tattooOutline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Configurar Estágios
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Configurações do Kanban</DialogTitle>
                    <DialogDescription>
                      Configure os estágios e suas propriedades no painel Kanban
                    </DialogDescription>
                  </DialogHeader>
                  <KanbanSettings 
                    onClose={() => setIsSettingsDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            )}

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="tattoo" size="default">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Lead/Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Lead/Cliente</DialogTitle>
                  <DialogDescription>
                    Adicione um novo lead ou cliente ao sistema
                  </DialogDescription>
                </DialogHeader>
                <CRMLeadForm 
                  onSuccess={() => {
                    setIsCreateDialogOpen(false);
                    queryClient.invalidateQueries({ queryKey: ['clients'] });
                    queryClient.invalidateQueries({ queryKey: ['client-stats'] });
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="animate-fade-in">
          {viewMode === "kanban" ? (
            <ClientsKanban 
              clients={mockClientsForLoyalty}
              onClientSelect={handleViewClient}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              temperatureFilter={temperatureFilter}
            />
          ) : (
            <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 rounded-t-lg">
                <CardTitle className="text-red-800">Lista de Clientes</CardTitle>
                <CardDescription className="text-red-600">
                  Gerencie todos os clientes e leads do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-red-50">
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedClients.length === clients.length && clients.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="text-red-800 font-bold">Cliente</TableHead>
                      <TableHead className="text-red-800 font-bold">Contato</TableHead>
                      <TableHead className="text-red-800 font-bold">Status</TableHead>
                      <TableHead className="text-red-800 font-bold">Fidelidade</TableHead>
                      <TableHead className="text-red-800 font-bold">Origem</TableHead>
                      <TableHead className="text-red-800 font-bold">Total Gasto</TableHead>
                      <TableHead className="text-red-800 font-bold text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockClientsForLoyalty.map((client) => (
                      <TableRow 
                        key={client.id} 
                        className="hover:bg-red-50 transition-colors duration-200 group"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedClients.includes(client.id)}
                            onCheckedChange={(checked) => handleClientSelection(client.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-red-900 group-hover:text-red-700">{client.name}</div>
                            <div className="text-sm text-gray-500">{formatDate(client.created_at)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-sm">
                              <Mail className="h-3 w-3 text-red-500" />
                              <span>{client.email}</span>
                            </div>
                            {client.phone && (
                              <div className="flex items-center space-x-1 text-sm">
                                <Phone className="h-3 w-3 text-red-500" />
                                <span>{client.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getStatusBadge(client.status)}
                            {getTemperatureBadge(client.temperature)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="tattoo" className="animate-pulse">
                              <Crown className="h-3 w-3 mr-1" />
                              {client.loyaltyLevel}
                            </Badge>
                            <div className="text-xs text-gray-600">{client.loyaltyPoints} pts</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getOriginBadge(client.origin)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-green-600">{formatCurrency(client.total_spent)}</div>
                            <div className="text-sm text-gray-500">{client.total_orders} pedidos</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="tattooOutline"
                            size="sm"
                            onClick={() => handleViewClient(client.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Ficha 360°
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal Criar Cliente/Lead */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-red-50 border-red-200">
          <DialogHeader>
            <DialogTitle className="text-red-800">Cadastrar Novo Lead/Cliente</DialogTitle>
            <DialogDescription className="text-red-600">
              Adicione um novo lead ou cliente ao sistema
            </DialogDescription>
          </DialogHeader>
          <CRMLeadForm 
            onSuccess={() => {
              setIsCreateDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ['clients'] });
              queryClient.invalidateQueries({ queryKey: ['client-stats'] });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Configurações Kanban */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="max-w-4xl bg-gradient-to-br from-white to-red-50 border-red-200">
          <DialogHeader>
            <DialogTitle className="text-red-800">Configurações do Kanban</DialogTitle>
            <DialogDescription className="text-red-600">
              Configure os estágios e suas propriedades no painel Kanban
            </DialogDescription>
          </DialogHeader>
          <KanbanSettings 
            onClose={() => setIsSettingsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Ficha 360° do Cliente */}
      {selectedClientId && (
        <CRMClientDetail 
          clientId={selectedClientId}
          onClose={() => setSelectedClientId(null)}
          onOpenAppointmentForm={handleOpenAppointmentForm}
        />
      )}

      {/* Modal Criar Agendamento (do cliente) */}
      {showAppointmentForm && appointmentClientData && (
        <AppointmentForm
          prefilledClientData={appointmentClientData}
          clients={clients}
          onSuccess={handleAppointmentSuccess}
          onClose={handleCloseAppointmentForm}
        />
      )}
    </div>
  );
};

export default Clients;
