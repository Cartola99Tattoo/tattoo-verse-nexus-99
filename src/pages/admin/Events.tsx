
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, MapPin, Search, Filter, Edit, Trash2, Users, Target, ShoppingCart, TrendingUp, BarChart3, CheckCircle2, Maximize2, Minimize2, Activity, Globe, ExternalLink } from "lucide-react";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getEventService, getProjectService } from "@/services/serviceFactory";
import { IEvent } from "@/services/interfaces/IEventService";
import { IProject, IProjectSmartGoal } from "@/services/interfaces/IProjectService";
import EventForm from "@/components/admin/EventForm";
import EventKanban from "@/components/admin/EventKanban";
import EventDashboard from "@/components/admin/EventDashboard";
import EventLandingPageModal from "@/components/admin/EventLandingPageModal";
import { toast } from "@/hooks/use-toast";

const Events = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);
  const [selectedEventForLanding, setSelectedEventForLanding] = useState<IEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isKanbanFullscreen, setIsKanbanFullscreen] = useState(false);
  
  const eventService = getEventService();
  const projectService = getProjectService();

  const { data: events, loading, refresh } = useDataQuery<IEvent[]>(
    () => eventService.fetchEvents(),
    []
  );

  const { data: projects } = useDataQuery<IProject[]>(
    () => projectService.fetchProjects(),
    []
  );

  const { data: smartGoals } = useDataQuery<IProjectSmartGoal[]>(
    () => projectService.fetchProjectSmartGoals('all'),
    []
  );

  // Ensure data is always an array, even if null
  const safeEvents = events || [];
  const safeProjects = projects || [];
  const safeSmartGoals = smartGoals || [];

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowCreateForm(true);
  };

  const handleEditEvent = (event: IEvent) => {
    setEditingEvent(event);
    setShowCreateForm(true);
  };

  const handleViewLandingPage = (event: IEvent) => {
    setSelectedEventForLanding(event);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await eventService.deleteEvent(eventId);
        refresh();
        toast({
          title: "Sucesso",
          description: "Evento excluído com sucesso!",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir evento. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingEvent(null);
    refresh();
  };

  // Handle fullscreen exit with Escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isKanbanFullscreen) {
        setIsKanbanFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isKanbanFullscreen]);

  const toggleKanbanFullscreen = () => {
    setIsKanbanFullscreen(!isKanbanFullscreen);
  };

  const filteredEvents = safeEvents.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesType = typeFilter === 'all' || event.eventType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'active': return 'Ativo';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'flash_day': return 'Flash Day';
      case 'workshop': return 'Workshop';
      case 'collection_launch': return 'Lançamento';
      case 'exhibition': return 'Exposição';
      case 'other': return 'Outro';
      default: return type;
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (!price || price === 0) return 'Grátis';
    return `R$ ${price.toFixed(2)}`;
  };

  if (showCreateForm) {
    return (
      <EventForm
        event={editingEvent}
        onClose={handleFormClose}
      />
    );
  }

  // Render fullscreen Kanban
  if (isKanbanFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-white to-red-50 overflow-hidden">
        {/* Fullscreen Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-3 md:p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black">
                Kanban de Gestão de Eventos - Modo Foco Total
              </h1>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 font-bold shadow-xl transition-all duration-300 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
              >
                <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Nova Tarefa</span>
                <span className="sm:hidden">Tarefa</span>
              </Button>
            </div>
            <Button
              onClick={toggleKanbanFullscreen}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
            >
              <Minimize2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Sair do Foco Total</span>
              <span className="hidden sm:inline lg:hidden">Foco Total</span>
              <span className="sm:hidden">Foco</span>
            </Button>
          </div>
        </div>

        {/* Fullscreen Kanban */}
        <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] overflow-hidden">
          <EventKanban events={safeEvents} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 bg-gradient-to-br from-white to-red-50 min-h-screen p-4 md:p-6">
      {/* Header with Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 md:gap-6">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-3 md:mb-4">
            Centro de Gestão Estratégica de Eventos 99Tattoo
          </h1>
          
          {/* Botões de Ação Principais */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            <Button 
              onClick={() => setShowCreateForm(true)} 
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold text-sm md:text-base px-3 md:px-4 py-2"
            >
              <Plus className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Novo Evento</span>
              <span className="sm:hidden">Evento</span>
            </Button>
            
            <Button
              onClick={toggleKanbanFullscreen}
              className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm md:text-base px-3 md:px-4 py-2"
            >
              <Maximize2 className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
              <span className="hidden lg:inline">Modo Foco Total</span>
              <span className="hidden sm:inline lg:hidden">Foco Total</span>
              <span className="sm:hidden">Foco</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-red-50 to-red-100 border-red-200 shadow-lg">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white font-bold text-xs md:text-sm"
          >
            <Activity className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Dash</span>
          </TabsTrigger>
          <TabsTrigger 
            value="kanban" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white font-bold text-xs md:text-sm"
          >
            <BarChart3 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Kanban de Gestão</span>
            <span className="sm:hidden">Kanban</span>
          </TabsTrigger>
          <TabsTrigger 
            value="events" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white font-bold text-xs md:text-sm"
          >
            <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Lista de Eventos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4 md:space-y-6">
          <EventDashboard events={safeEvents} smartGoals={safeSmartGoals} />
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4 md:space-y-6">
          {/* Dashboard de Métricas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
            <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-red-700 flex items-center gap-1 md:gap-2 text-xs md:text-sm lg:text-lg font-bold">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                  <span className="truncate">Total de Eventos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl md:text-2xl lg:text-3xl font-black text-red-600">{safeEvents.length}</div>
                <p className="text-xs text-gray-600 mt-1">Eventos cadastrados</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-green-700 flex items-center gap-1 md:gap-2 text-xs md:text-sm lg:text-lg font-bold">
                  <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                  <span className="truncate">Eventos Ativos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl md:text-2xl lg:text-3xl font-black text-green-600">
                  {safeEvents.filter(e => e.status === 'active').length}
                </div>
                <p className="text-xs text-gray-600 mt-1">Em andamento</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-blue-700 flex items-center gap-1 md:gap-2 text-xs md:text-sm lg:text-lg font-bold">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                  <span className="truncate">Concluídos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl md:text-2xl lg:text-3xl font-black text-blue-600">
                  {safeEvents.filter(e => e.status === 'completed').length}
                </div>
                <p className="text-xs text-gray-600 mt-1">Finalizados</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-purple-700 flex items-center gap-1 md:gap-2 text-xs md:text-sm lg:text-lg font-bold">
                  <Target className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                  <span className="truncate">Metas SMART</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl md:text-2xl lg:text-3xl font-black text-purple-600">
                  {safeSmartGoals.length}
                </div>
                <p className="text-xs text-gray-600 mt-1">Metas ativas</p>
              </CardContent>
            </Card>
          </div>

          {/* Header do Kanban */}
          <div className="bg-gradient-to-r from-red-100 to-red-200 p-3 md:p-4 lg:p-6 rounded-lg border-2 border-red-300 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-red-800 mb-1 md:mb-2">
                  Kanban de Gestão de Eventos
                </h2>
                <p className="text-xs md:text-sm lg:text-base text-red-700 font-medium">
                  Gerencie todas as etapas dos seus eventos desde o planejamento até a análise pós-evento
                </p>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
                >
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Nova Tarefa</span>
                  <span className="sm:hidden">Tarefa</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Kanban de Gestão de Eventos */}
          <EventKanban events={safeEvents} />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {/* Filtros */}
          <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-gray-50">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Filter className="h-5 w-5 text-red-600" />
                Filtros e Busca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-400" />
                    <Input
                      placeholder="Nome ou descrição..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-red-200 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-red-200 focus:border-red-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-red-200 shadow-lg">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="border-red-200 focus:border-red-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-red-200 shadow-lg">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="flash_day">Flash Day</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="collection_launch">Lançamento</SelectItem>
                      <SelectItem value="exhibition">Exposição</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    {filteredEvents.length} evento(s) encontrado(s)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Eventos */}
          <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-gray-50">
              <CardTitle className="text-red-800">Eventos ({filteredEvents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="h-8 w-32 mx-auto rounded-md bg-gradient-to-r from-red-200 to-red-300 animate-pulse"></div>
                  <p className="mt-2 text-gray-600">Carregando eventos...</p>
                </div>
              ) : !filteredEvents.length ? (
                <div className="text-center py-8 text-gray-500">Nenhum evento encontrado</div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="border border-red-200 rounded-lg p-4 bg-gradient-to-br from-white to-red-50 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-red-800">{event.name}</h3>
                            <Badge className={getStatusColor(event.status)}>
                              {getStatusLabel(event.status)}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-red-600" />
                              {new Date(event.startDate).toLocaleDateString('pt-BR')} • {event.startTime}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-red-600" />
                              {event.location}
                            </span>
                            {event.participatingArtists && event.participatingArtists.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4 text-red-600" />
                                  {event.participatingArtists.length <= 2 
                                    ? event.participatingArtists.join(', ')
                                    : `${event.participatingArtists.slice(0, 2).join(', ')} e mais ${event.participatingArtists.length - 2}`
                                  }
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewLandingPage(event)}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            title="Ver Landing Page"
                          >
                            <Globe className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEvent(event)}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {filteredEvents.length === 0 && !loading && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-red-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece criando seu primeiro evento e aproveite todas as funcionalidades de gestão e análise.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                <Button 
                  onClick={handleCreateEvent} 
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Evento
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Landing Page Modal */}
      {selectedEventForLanding && (
        <EventLandingPageModal
          event={selectedEventForLanding}
          isOpen={!!selectedEventForLanding}
          onClose={() => setSelectedEventForLanding(null)}
        />
      )}
    </div>
  );
};

export default Events;
