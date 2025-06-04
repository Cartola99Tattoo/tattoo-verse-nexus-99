import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, MapPin, Search, Filter, Edit, Trash2, Users, Target, ShoppingCart, TrendingUp } from "lucide-react";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getEventService } from "@/services/serviceFactory";
import { IEvent } from "@/services/interfaces/IEventService";
import EventForm from "@/components/admin/EventForm";
import { toast } from "@/hooks/use-toast";

const Events = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const eventService = getEventService();

  const { data: events, loading, refresh } = useDataQuery<IEvent[]>(
    () => eventService.fetchEvents(),
    []
  );

  // Ensure events is always an array, even if data is null
  const safeEvents = events || [];

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowCreateForm(true);
  };

  const handleEditEvent = (event: IEvent) => {
    setEditingEvent(event);
    setShowCreateForm(true);
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

  // Use safeEvents instead of events to avoid null filter error
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

  const getMainGoalProgress = async (eventId: string) => {
    try {
      const goals = await eventService.fetchEventSmartGoals(eventId);
      if (goals.length === 0) return null;
      
      // Priorizar metas de faturamento, depois leads, depois outras
      const priorityGoal = goals.find(g => g.title.toLowerCase().includes('faturamento')) ||
                          goals.find(g => g.title.toLowerCase().includes('lead')) ||
                          goals[0];
      
      const progress = priorityGoal.targetValue > 0 ? 
        Math.min((priorityGoal.currentValue / priorityGoal.targetValue) * 100, 100) : 0;
        
      return {
        title: priorityGoal.title,
        progress,
        current: priorityGoal.currentValue,
        target: priorityGoal.targetValue,
        unit: priorityGoal.unit
      };
    } catch (error) {
      return null;
    }
  };

  if (showCreateForm) {
    return (
      <EventForm
        event={editingEvent}
        onClose={handleFormClose}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os eventos da 99Tattoo</p>
        </div>
        <Button 
          onClick={handleCreateEvent}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border-2 hover:border-purple-200">
              <div className="relative h-48 overflow-hidden">
                {event.featuredImage ? (
                  <img
                    src={event.featuredImage}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge className={getStatusColor(event.status)}>
                    {getStatusLabel(event.status)}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  {event.isPublic && (
                    <Badge variant="outline" className="bg-white/90 text-purple-700 border-purple-200">
                      Público
                    </Badge>
                  )}
                  {event.ticketProduct?.isEnabled && (
                    <Badge variant="outline" className="bg-white/90 text-green-700 border-green-200">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Venda
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1">{event.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString('pt-BR')} • {event.startTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <span>{event.location}</span>
                  </div>
                  {event.participatingArtists && event.participatingArtists.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span>{event.participatingArtists.length} artista(s)</span>
                    </div>
                  )}
                </div>

                {/* Performance Indicators */}
                {event.smartGoals && event.smartGoals.length > 0 && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Progresso Principal</span>
                    </div>
                    {event.smartGoals.slice(0, 1).map((goal) => {
                      const progress = goal.targetValue > 0 ? Math.min((goal.currentValue / goal.targetValue) * 100, 100) : 0;
                      return (
                        <div key={goal.id} className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{goal.title}</span>
                            <span>{progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="text-xs text-gray-500">
                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Ticket Sales Indicator */}
                {event.ticketProduct?.isEnabled && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingCart className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Ingressos</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {event.ticketProduct.ticketStock - (event.smartGoals?.find(g => g.title.toLowerCase().includes('ingresso'))?.currentValue || 0)} disponíveis de {event.ticketProduct.ticketStock}
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      R$ {event.ticketProduct.productPrice.toFixed(2)}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-indigo-700 border-indigo-200">
                    {getTypeLabel(event.eventType)}
                  </Badge>
                  {event.price && (
                    <span className="font-semibold text-green-600">
                      R$ {event.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEvent(event)}
                    className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredEvents.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando seu primeiro evento.'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
            <Button onClick={handleCreateEvent} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Evento
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;
