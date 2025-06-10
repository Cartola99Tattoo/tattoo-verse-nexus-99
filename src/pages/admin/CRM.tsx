
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
import { getClientService } from "@/services/serviceFactory";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, Search, Filter, Plus, Eye, UserCheck, UserX, TrendingUp, Clock, Phone, Mail, MessageSquare, Target, Calendar, MapPin, Edit, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CRMClientDetail from "@/components/admin/CRMClientDetail";
import CRMLeadForm from "@/components/admin/CRMLeadForm";

const CRM = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [originFilter, setOriginFilter] = useState<string>("all");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clientService = getClientService();

  // Buscar estatísticas do CRM
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['crm-stats'],
    queryFn: () => clientService.fetchClientStats(),
  });

  // Buscar clientes/leads
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['crm-clients', searchTerm, statusFilter, originFilter],
    queryFn: () => clientService.fetchClients({
      search: searchTerm || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      limit: 100
    }),
  });

  const handleViewClient = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      new: { variant: "tattooInfo", label: "Novo Lead", icon: Users },
      interested: { variant: "tattooWarning", label: "Interessado", icon: Eye },
      pending: { variant: "tattooWarning", label: "Proposta Enviada", icon: Clock },
      active: { variant: "tattooSuccess", label: "Em Negociação", icon: TrendingUp },
      completed: { variant: "tattooSuccess", label: "Convertido", icon: UserCheck },
      inactive: { variant: "secondary", label: "Perdido", icon: UserX },
      returning: { variant: "tattoo", label: "Retorno", icon: TrendingUp },
      vip: { variant: "tattoo", label: "VIP", icon: UserCheck },
    };
    
    const variant = variants[status as keyof typeof variants];
    const IconComponent = variant?.icon || Users;

    return (
      <Badge variant={variant?.variant as any}>
        <IconComponent className="h-3 w-3 mr-1" />
        {variant?.label || status}
      </Badge>
    );
  };

  const getOriginBadge = (origin?: string) => {
    if (!origin) return <Badge variant="secondary">Não definido</Badge>;

    const origins = {
      'landing_events': { label: 'Landing Eventos', variant: 'tattoo' },
      'contact_form': { label: 'Formulário Contato', variant: 'tattooInfo' },
      'consultation': { label: 'Consultoria', variant: 'tattooWarning' },
      'shop': { label: 'Loja', variant: 'tattooSuccess' },
      'referral': { label: 'Indicação', variant: 'tattooSecondary' },
      'social_media': { label: 'Redes Sociais', variant: 'tattooOutline' },
    };

    const originData = origins[origin as keyof typeof origins] || { label: origin, variant: 'secondary' };
    
    return (
      <Badge variant={originData.variant as any}>
        {originData.label}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cards de Estatísticas CRM */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card variant="tattoo">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos Leads</CardTitle>
              <Target className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.new_clients_this_month || 0}</div>
              <p className="text-xs text-gray-600">Este mês</p>
            </CardContent>
          </Card>

          <Card variant="tattoo">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.conversion_rate || 0}%</div>
              <p className="text-xs text-gray-600">Leads → Clientes</p>
            </CardContent>
          </Card>

          <Card variant="tattoo">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.average_conversion_time || 0}d</div>
              <p className="text-xs text-gray-600">Para conversão</p>
            </CardContent>
          </Card>

          <Card variant="tattoo">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Quentes</CardTitle>
              <div className="h-4 w-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.hot_clients || 0}</div>
              <p className="text-xs text-gray-600">Alta prioridade</p>
            </CardContent>
          </Card>

          <Card variant="tattoo">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.average_order_value || 0)}</div>
              <p className="text-xs text-gray-600">Por conversão</p>
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
              variant="tattoo"
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
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
              <SelectItem value="pending">Proposta Enviada</SelectItem>
              <SelectItem value="active">Em Negociação</SelectItem>
              <SelectItem value="completed">Convertido</SelectItem>
              <SelectItem value="inactive">Perdido</SelectItem>
            </SelectContent>
          </Select>

          <Select value={originFilter} onValueChange={setOriginFilter}>
            <SelectTrigger className="w-[180px] border-red-200 focus:border-red-600">
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Origens</SelectItem>
              <SelectItem value="landing_events">Landing Eventos</SelectItem>
              <SelectItem value="contact_form">Formulário Contato</SelectItem>
              <SelectItem value="consultation">Consultoria</SelectItem>
              <SelectItem value="referral">Indicação</SelectItem>
              <SelectItem value="social_media">Redes Sociais</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="tattoo" size="default">
                <Plus className="h-4 w-4 mr-2" />
                Novo Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Lead</DialogTitle>
                <DialogDescription>
                  Adicione um novo lead/contato ao CRM
                </DialogDescription>
              </DialogHeader>
              <CRMLeadForm 
                onSuccess={() => {
                  setIsCreateDialogOpen(false);
                  queryClient.invalidateQueries({ queryKey: ['crm-clients'] });
                  queryClient.invalidateQueries({ queryKey: ['crm-stats'] });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista de Clientes/Leads */}
      <Card variant="tattoo">
        <CardHeader variant="gradient">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-800">Gestão de Leads e Clientes</CardTitle>
              <CardDescription>
                Acompanhe o funil de vendas e gerencie relacionamentos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente/Lead</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Interesse</TableHead>
                  <TableHead>Último Contato</TableHead>
                  <TableHead>Valor Potencial</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Carregando leads...
                    </TableCell>
                  </TableRow>
                ) : clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Nenhum lead encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-red-50">
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
                        {getOriginBadge('landing_events')}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {client.preferred_style || 'Eventos customizados'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(client.updated_at)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(client.total_spent || 5000)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="tattooOutline" 
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
                              onClick={() => window.open(`https://wa.me/${client.phone?.replace(/\D/g, '')}`)}
                            >
                              <MessageSquare className="h-4 w-4" />
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

      {/* Modal de Detalhes do Cliente */}
      {selectedClientId && (
        <CRMClientDetail 
          clientId={selectedClientId}
          onClose={() => setSelectedClientId(null)}
        />
      )}
    </div>
  );
};

export default CRM;
