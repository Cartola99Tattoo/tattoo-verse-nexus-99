
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
import { Users, Search, Filter, Plus, Eye, UserCheck, Crown, UserX, LayoutGrid, List, TrendingUp, Clock, Settings, Mail, Phone, Tag, Move } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CreateClientForm from "@/components/admin/CreateClientForm";
import ClientsKanban from "@/components/admin/ClientsKanban";
import KanbanSettings from "@/components/admin/KanbanSettings";
import { Client } from "@/services/interfaces/IClientService";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [temperatureFilter, setTemperatureFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("kanban");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clientService = getClientService();

  // Buscar estatísticas
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['client-stats'],
    queryFn: () => clientService.fetchClientStats(),
  });

  // Buscar clientes
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients', searchTerm, statusFilter, temperatureFilter],
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
      setShowBulkActions(false);
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

  const getStatusBadge = (status: string) => {
    const variants = {
      new: { class: "bg-blue-100 text-blue-800 border-blue-300", icon: Users },
      active: { class: "bg-green-100 text-green-800 border-green-300", icon: UserCheck },
      inactive: { class: "bg-gray-100 text-gray-800 border-gray-300", icon: UserX },
      vip: { class: "bg-purple-100 text-purple-800 border-purple-300", icon: Crown },
      interested: { class: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: Eye },
      pending: { class: "bg-orange-100 text-orange-800 border-orange-300", icon: Clock },
      completed: { class: "bg-green-100 text-green-800 border-green-300", icon: UserCheck },
      returning: { class: "bg-purple-100 text-purple-800 border-purple-300", icon: TrendingUp },
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
      <Badge variant="outline" className={variant?.class}>
        <IconComponent className="h-3 w-3 mr-1" />
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTemperatureBadge = (temperature?: string) => {
    if (!temperature) return null;

    const variants = {
      hot: { class: "bg-red-100 text-red-800 border-red-300", label: "Quente" },
      warm: { class: "bg-orange-100 text-orange-800 border-orange-300", label: "Morno" },
      cold: { class: "bg-blue-100 text-blue-800 border-blue-300", label: "Frio" },
    };

    const variant = variants[temperature as keyof typeof variants];
    if (!variant) return null;

    return (
      <Badge variant="outline" className={variant.class}>
        {variant.label}
      </Badge>
    );
  };

  const handleViewClient = (clientId: string) => {
    navigate(`/admin/clients/${clientId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cards de Estatísticas Expandidas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_clients}</div>
              <p className="text-xs text-muted-foreground">Clientes</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.conversion_rate}%</div>
              <p className="text-xs text-muted-foreground">Taxa</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quentes</CardTitle>
              <div className="h-4 w-4 bg-red-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.hot_clients || 0}</div>
              <p className="text-xs text-muted-foreground">Interesse alto</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mornos</CardTitle>
              <div className="h-4 w-4 bg-orange-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.warm_clients || 0}</div>
              <p className="text-xs text-muted-foreground">Interesse médio</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.average_conversion_time}d</div>
              <p className="text-xs text-muted-foreground">Conversão</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.average_order_value)}</div>
              <p className="text-xs text-muted-foreground">Por cliente</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ações em Massa */}
      {selectedClients.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
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
                    <SelectItem value="hot">Quente</SelectItem>
                    <SelectItem value="warm">Morno</SelectItem>
                    <SelectItem value="cold">Frio</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedClients([]);
                  }}
                >
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros e Controles */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Temperatura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="hot">Quente</SelectItem>
              <SelectItem value="warm">Morno</SelectItem>
              <SelectItem value="cold">Frio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Kanban
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
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
                <Button variant="outline" size="sm">
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
              <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Adicione um novo cliente ao sistema CRM
                </DialogDescription>
              </DialogHeader>
              <CreateClientForm 
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
      {viewMode === "kanban" ? (
        <div className="bg-white rounded-lg">
          {clientsLoading ? (
            <div className="text-center py-8">Carregando clientes...</div>
          ) : (
            <ClientsKanban 
              clients={clients} 
              onViewClient={handleViewClient}
            />
          )}
        </div>
      ) : (
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-800">Lista de Clientes</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os clientes cadastrados
                </CardDescription>
              </div>
              {viewMode === "table" && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedClients.length === clients.length && clients.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-gray-600">Selecionar todos</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedClients.length === clients.length && clients.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Temperatura</TableHead>
                    <TableHead>Total Gasto</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Estilo Preferido</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientsLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        Carregando clientes...
                      </TableCell>
                    </TableRow>
                  ) : clients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        Nenhum cliente encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedClients.includes(client.id)}
                            onCheckedChange={(checked) => handleClientSelection(client.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-gray-500">{client.email}</div>
                            {client.phone && (
                              <div className="text-sm text-gray-500">{client.phone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(client.status)}
                        </TableCell>
                        <TableCell>
                          {getTemperatureBadge(client.temperature)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(client.total_spent)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {client.total_orders} pedidos
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {client.preferred_style || (
                            <span className="text-gray-400">Não definido</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDate(client.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewClient(client.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            {client.phone && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => window.open(`tel:${client.phone}`)}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                            )}
                            {client.email && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => window.open(`mailto:${client.email}`)}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Clients;
