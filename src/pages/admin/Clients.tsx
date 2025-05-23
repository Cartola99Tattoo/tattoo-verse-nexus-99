import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClientService } from "@/services/serviceFactory";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, Search, Filter, Plus, Eye, UserCheck, Crown, UserX, LayoutGrid, List } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CreateClientForm from "@/components/admin/CreateClientForm";
import ClientsKanban from "@/components/admin/ClientsKanban";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  
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
    queryKey: ['clients', searchTerm, statusFilter],
    queryFn: () => clientService.fetchClients({
      search: searchTerm || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      limit: 100
    }),
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      new: { class: "bg-blue-100 text-blue-800 border-blue-300", icon: Users },
      active: { class: "bg-green-100 text-green-800 border-green-300", icon: UserCheck },
      inactive: { class: "bg-gray-100 text-gray-800 border-gray-300", icon: UserX },
      vip: { class: "bg-purple-100 text-purple-800 border-purple-300", icon: Crown },
    };
    
    const labels = {
      new: "Novo",
      active: "Ativo", 
      inactive: "Inativo",
      vip: "VIP",
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

  const handleViewClient = (clientId: string) => {
    navigate(`/admin/clients/${clientId}`);
  };

  return (
    <AdminLayout 
      title="Módulo de Clientes" 
      description="Gestão completa de relacionamento com clientes (CRM)"
    >
      <div className="space-y-6">
        {/* Cards de Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_clients}</div>
                <p className="text-xs text-muted-foreground">
                  Clientes registrados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos este Mês</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.new_clients_this_month}</div>
                <p className="text-xs text-muted-foreground">
                  Clientes novos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes VIP</CardTitle>
                <Crown className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.vip_clients}</div>
                <p className="text-xs text-muted-foreground">
                  Status premium
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.average_order_value)}</div>
                <p className="text-xs text-muted-foreground">
                  Por pedido
                </p>
              </CardContent>
            </Card>
          </div>
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
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <div className="flex rounded-md border">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="rounded-r-none"
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
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

        {/* Visualização Kanban ou Tabela */}
        {viewMode === 'kanban' ? (
          <ClientsKanban 
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onClientClick={handleViewClient}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                Visualize e gerencie todos os clientes cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
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
                        <TableCell colSpan={7} className="text-center">
                          Carregando clientes...
                        </TableCell>
                      </TableRow>
                    ) : clients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Nenhum cliente encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      clients.map((client) => (
                        <TableRow key={client.id}>
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
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewClient(client.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Perfil
                            </Button>
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
    </AdminLayout>
  );
};

export default Clients;
