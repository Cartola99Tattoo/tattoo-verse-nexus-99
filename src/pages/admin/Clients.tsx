
import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

// Componentes otimizados
import OptimizedCard from "@/components/common/OptimizedCard";
import OptimizedButton from "@/components/common/OptimizedButton";
import OptimizedTable from "@/components/common/OptimizedTable";
import LazyModal from "@/components/common/LazyModal";
import useOptimizedClientQuery from "@/hooks/useOptimizedClientQuery";
import usePerformanceOptimization from "@/hooks/usePerformanceOptimization";

const Clients = React.memo(() => {
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
  const { debounce, safeAsync } = usePerformanceOptimization();

  // Query otimizada para estatísticas
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['client-stats'],
    queryFn: () => clientService.fetchClientStats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Query otimizada para clientes
  const clientQueryOptions = useMemo(() => ({
    search: searchTerm || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    temperature: temperatureFilter === 'all' ? undefined : temperatureFilter,
    limit: 100
  }), [searchTerm, statusFilter, temperatureFilter]);

  const { data: clients = [], isLoading: clientsLoading } = useOptimizedClientQuery(clientQueryOptions);

  // Debounced search
  const debouncedSetSearchTerm = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [debounce]
  );

  // Mutação otimizada para ações em massa
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ clientIds, action, value }: { 
      clientIds: string[]; 
      action: 'status' | 'temperature' | 'tag'; 
      value: string 
    }) => {
      return safeAsync(async () => {
        const promises = clientIds.map(id => {
          if (action === 'status') {
            return clientService.updateClient(id, { status: value as any });
          } else if (action === 'temperature') {
            return clientService.updateClientTemperature(id, value as any);
          }
          return Promise.resolve();
        });
        return Promise.all(promises);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client-stats'] });
      setSelectedClients([]);
      toast({
        title: "✨ Ação executada",
        description: "A ação em massa foi executada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Não foi possível executar a ação em massa.",
        variant: "destructive"
      });
    }
  });

  // Callbacks memoizados
  const handleBulkAction = useCallback((action: 'status' | 'temperature' | 'tag', value: string) => {
    if (selectedClients.length === 0) return;
    bulkUpdateMutation.mutate({ clientIds: selectedClients, action, value });
  }, [selectedClients, bulkUpdateMutation]);

  const handleClientSelection = useCallback((clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId));
    }
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedClients(clients.map(c => c.id));
    } else {
      setSelectedClients([]);
    }
  }, [clients]);

  const handleViewClient = useCallback((clientId: string) => {
    setSelectedClientId(clientId);
  }, []);

  // Badges memoizados para melhor performance
  const getStatusBadge = useCallback((status: string) => {
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
  }, []);

  const getTemperatureBadge = useCallback((temperature?: string) => {
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
  }, []);

  const getOriginBadge = useCallback((origin?: string) => {
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
  }, []);

  // Mock clients data for loyalty integration demonstration
  const mockClientsForLoyalty = useMemo(() => 
    clients.map(client => ({
      ...client,
      loyaltyPoints: Math.floor(Math.random() * 2000),
      loyaltyLevel: ['Bronze', 'Prata', 'Ouro', 'Platina'][Math.floor(Math.random() * 4)],
    })), [clients]
  );

  // Colunas da tabela memoizadas
  const tableColumns = useMemo(() => [
    {
      key: 'name',
      label: 'Cliente',
      render: (client: any) => (
        <div>
          <div className="font-medium text-red-900">{client.name}</div>
          <div className="text-sm text-gray-500">{formatDate(client.created_at)}</div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contato',
      render: (client: any) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-sm">
            <Mail className="h-3 w-3 text-red-500" />
            <span className="truncate">{client.email}</span>
          </div>
          {client.phone && (
            <div className="flex items-center space-x-1 text-sm">
              <Phone className="h-3 w-3 text-red-500" />
              <span>{client.phone}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (client: any) => (
        <div className="space-y-1">
          {getStatusBadge(client.status)}
          {getTemperatureBadge(client.temperature)}
        </div>
      )
    },
    {
      key: 'loyalty',
      label: 'Fidelidade',
      render: (client: any) => (
        <div className="space-y-1">
          <Badge variant="tattoo" className="animate-pulse">
            <Crown className="h-3 w-3 mr-1" />
            {client.loyaltyLevel}
          </Badge>
          <div className="text-xs text-gray-600">{client.loyaltyPoints} pts</div>
        </div>
      )
    },
    {
      key: 'origin',
      label: 'Origem',
      render: (client: any) => getOriginBadge(client.origin)
    },
    {
      key: 'total',
      label: 'Total Gasto',
      render: (client: any) => (
        <div>
          <div className="font-medium text-green-600">{formatCurrency(client.total_spent)}</div>
          <div className="text-sm text-gray-500">{client.total_orders} pedidos</div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (client: any) => (
        <OptimizedButton
          variant="tattooOutline"
          size="sm"
          onClick={() => handleViewClient(client.id)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Ver Ficha 360°
        </OptimizedButton>
      )
    }
  ], [getStatusBadge, getTemperatureBadge, getOriginBadge, handleViewClient]);

  const handleOpenAppointmentForm = useCallback((clientId: string, clientName: string) => {
    setAppointmentClientData({ id: clientId, name: clientName });
    setSelectedClientId(null);
    setShowAppointmentForm(true);
  }, []);

  const handleCloseAppointmentForm = useCallback(() => {
    setShowAppointmentForm(false);
    setAppointmentClientData(null);
  }, []);

  const handleAppointmentSuccess = useCallback(() => {
    handleCloseAppointmentForm();
    toast({
      title: "✨ Agendamento criado!",
      description: "O agendamento foi criado com sucesso a partir da ficha do cliente.",
    });
  }, [handleCloseAppointmentForm]);

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gradient-to-br from-red-50 via-white to-red-50 min-h-screen relative overflow-hidden">
      {/* Elementos decorativos de fundo - otimizados */}
      <div className="absolute top-0 right-0 w-32 lg:w-64 h-32 lg:h-64 bg-gradient-to-bl from-red-100/20 via-transparent to-transparent rounded-full transform translate-x-16 lg:translate-x-32 -translate-y-16 lg:-translate-y-32 will-change-transform"></div>
      <div className="absolute bottom-0 left-0 w-24 lg:w-48 h-24 lg:h-48 bg-gradient-to-tr from-red-100/15 via-transparent to-transparent rounded-full transform -translate-x-12 lg:-translate-x-24 translate-y-12 lg:translate-y-24 will-change-transform"></div>

      <div className="relative z-10">
        {/* Header otimizado */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <OptimizedButton 
              variant="tattoo" 
              size="default"
              onClick={() => setIsCreateDialogOpen(true)}
              icon={<Plus className="h-4 w-4" />}
            >
              Novo Cliente
            </OptimizedButton>
            <h1 className="text-2xl lg:text-3xl font-black text-red-800">Gerenciar Clientes</h1>
          </div>
        </div>

        {/* Cards de Estatísticas otimizados */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 animate-fade-in mb-6">
            {[
              { title: "Total", value: stats.total_clients, icon: Users, color: "text-red-900", description: "Clientes" },
              { title: "Novos Leads", value: stats.new_clients_this_month || 0, icon: Target, color: "text-red-600", description: "Este mês" },
              { title: "Conversão", value: `${stats.conversion_rate || 0}%`, icon: TrendingUp, color: "text-green-600", description: "Taxa" },
              { title: "Quentes", value: stats.hot_clients || 0, icon: null, color: "text-red-600", description: "Alta prioridade" },
              { title: "Tempo Médio", value: `${stats.average_conversion_time || 0}d`, icon: Clock, color: "text-blue-600", description: "Conversão" },
              { title: "Ticket Médio", value: formatCurrency(stats.average_order_value || 0), icon: Users, color: "text-gray-900", description: "Por cliente" }
            ].map((stat, index) => (
              <OptimizedCard key={index} loading={statsLoading}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-red-800">{stat.title}</p>
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.description}</p>
                  </div>
                  {stat.icon && <stat.icon className="h-4 w-4 text-red-600" />}
                  {!stat.icon && index === 3 && <div className="h-4 w-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full" />}
                </div>
              </OptimizedCard>
            ))}
          </div>
        )}

        {/* Ações em massa otimizadas */}
        {selectedClients.length > 0 && (
          <OptimizedCard variant="tattooRed" className="mb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <span className="text-sm font-medium text-red-800">
                {selectedClients.length} cliente(s) selecionado(s)
              </span>
              <div className="flex flex-wrap gap-2">
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
                
                <OptimizedButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedClients([])}
                >
                  Limpar
                </OptimizedButton>
              </div>
            </div>
          </OptimizedCard>
        )}

        {/* Filtros otimizados */}
        <OptimizedCard className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                className="pl-10 border-red-200 focus:border-red-600"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-[180px] border-red-200 focus:border-red-600">
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
                <SelectTrigger className="w-full lg:w-[140px] border-red-200 focus:border-red-600">
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
                <SelectTrigger className="w-full lg:w-[160px] border-red-200 focus:border-red-600">
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
          </div>
          
          <div className="flex flex-col lg:flex-row gap-2 justify-between mt-4">
            <div className="flex border border-red-200 rounded-lg w-fit">
              <OptimizedButton
                variant={viewMode === "kanban" ? "tattoo" : "ghost"}
                size="sm"
                onClick={() => setViewMode("kanban")}
                className="rounded-r-none"
                icon={<LayoutGrid className="h-4 w-4" />}
              >
                Kanban
              </OptimizedButton>
              <OptimizedButton
                variant={viewMode === "table" ? "tattoo" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-l-none"
                icon={<List className="h-4 w-4" />}
              >
                Tabela
              </OptimizedButton>
            </div>

            {viewMode === "kanban" && (
              <OptimizedButton 
                variant="tattooOutline" 
                size="sm"
                onClick={() => setIsSettingsDialogOpen(true)}
                icon={<Settings className="h-4 w-4" />}
              >
                Configurar Estágios
              </OptimizedButton>
            )}
          </div>
        </OptimizedCard>

        {/* Conteúdo Principal otimizado */}
        <div className="animate-fade-in">
          {viewMode === "kanban" ? (
            <ClientsKanban 
              clients={mockClientsForLoyalty}
              onViewClient={handleViewClient}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              temperatureFilter={temperatureFilter}
            />
          ) : (
            <OptimizedCard>
              <OptimizedTable
                data={mockClientsForLoyalty}
                columns={tableColumns}
                onRowSelect={handleViewClient}
                selectedItems={selectedClients}
                onSelectAll={handleSelectAll}
                onItemSelect={handleClientSelection}
                getItemId={(client) => client.id}
                loading={clientsLoading}
              />
            </OptimizedCard>
          )}
        </div>
      </div>

      {/* Modals otimizados com lazy loading */}
      <LazyModal
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        title="Cadastrar Novo Lead/Cliente"
      >
        <CRMLeadForm 
          onSuccess={() => {
            setIsCreateDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            queryClient.invalidateQueries({ queryKey: ['client-stats'] });
          }}
        />
      </LazyModal>

      <LazyModal
        isOpen={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
        title="Configurações do Kanban"
      >
        <KanbanSettings 
          onClose={() => setIsSettingsDialogOpen(false)}
        />
      </LazyModal>

      {selectedClientId && (
        <CRMClientDetail 
          clientId={selectedClientId}
          onClose={() => setSelectedClientId(null)}
          onOpenAppointmentForm={handleOpenAppointmentForm}
        />
      )}

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
});

Clients.displayName = 'Clients';

export default Clients;
