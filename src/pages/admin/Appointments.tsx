
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getClientService } from "@/services/serviceFactory";
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Filter, Calendar as CalendarIcon, Clock, User, Eye, Phone, Mail, UserPlus, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Appointment, Client } from "@/services/interfaces/IClientService";
import AppointmentForm from "@/components/admin/AppointmentForm";
import AppointmentCard from "@/components/admin/AppointmentCard";
import QuickAppointmentForm from "@/components/admin/QuickAppointmentForm";
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Appointments = () => {
  const [view, setView] = useState<View>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedArtist, setSelectedArtist] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const clientService = getClientService();

  // Buscar agendamentos
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments', selectedArtist, selectedStatus],
    queryFn: () => clientService.fetchUpcomingAppointments(100),
  });

  // Buscar clientes para referência
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.fetchClients({ limit: 1000 }),
  });

  // Função para verificar conflitos de agendamento
  const checkConflicts = (newAppointment: { artist_id: string; date: string; time: string; duration_minutes: number }) => {
    const newStart = new Date(`${newAppointment.date}T${newAppointment.time}`);
    const newEnd = new Date(newStart.getTime() + newAppointment.duration_minutes * 60000);

    const conflicts = appointments.filter(apt => 
      apt.artist_id === newAppointment.artist_id && 
      apt.date === newAppointment.date &&
      apt.status !== 'cancelled'
    ).filter(apt => {
      const aptStart = new Date(`${apt.date}T${apt.time}`);
      const aptEnd = new Date(aptStart.getTime() + apt.duration_minutes * 60000);
      
      return (newStart < aptEnd && newEnd > aptStart);
    });

    return conflicts;
  };

  // Atualizar status do agendamento
  const updateStatusMutation = useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: Appointment['status'] }) =>
      clientService.updateAppointmentStatus(appointmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Status atualizado",
        description: "O status do agendamento foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do agendamento.",
        variant: "destructive"
      });
    }
  });

  const handleStatusUpdate = (appointmentId: string, status: Appointment['status']) => {
    updateStatusMutation.mutate({ appointmentId, status });
  };

  // Converter agendamentos para eventos do calendário
  const calendarEvents = appointments
    .filter(appointment => {
      if (selectedArtist !== 'all' && appointment.artist_id !== selectedArtist) return false;
      if (selectedStatus !== 'all' && appointment.status !== selectedStatus) return false;
      return true;
    })
    .map(appointment => {
      const client = clients.find(c => c.id === appointment.client_id);
      const startDate = new Date(`${appointment.date}T${appointment.time}`);
      const endDate = new Date(startDate.getTime() + appointment.duration_minutes * 60000);

      return {
        id: appointment.id,
        title: client?.name || 'Cliente',
        start: startDate,
        end: endDate,
        resource: {
          appointment,
          client,
        }
      };
    });

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: '#3b82f6',
      confirmed: '#10b981',
      in_progress: '#f59e0b',
      completed: '#059669',
      cancelled: '#ef4444',
      no_show: '#6b7280'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setIsQuickAddOpen(true);
  };

  const handleSelectEvent = (event: any) => {
    setSelectedAppointment(event.resource.appointment);
  };

  const EventComponent = ({ event }: any) => {
    const { appointment, client } = event.resource;
    
    return (
      <div className="text-xs p-1 rounded group relative">
        <div className="font-medium truncate">{client?.name}</div>
        <div className="text-xs opacity-80">{appointment.service_type}</div>
        
        {/* Ações rápidas - aparecem no hover */}
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-lg rounded p-1 flex gap-1 z-10">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              if (client?.phone) {
                window.open(`tel:${client.phone}`);
              }
            }}
            title="Ligar para cliente"
          >
            <Phone className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              if (client?.email) {
                window.open(`mailto:${client.email}`);
              }
            }}
            title="Enviar e-mail"
          >
            <Mail className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/admin/clients/${client?.id}`, '_blank');
            }}
            title="Ver perfil do cliente"
          >
            <UserPlus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  const messages = {
    allDay: 'Dia inteiro',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há agendamentos neste período.',
  };

  // Lista de artistas fictícia - em produção viria do banco
  const artists = [
    { id: 'all', name: 'Todos os Artistas' },
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Costa' },
  ];

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(apt => 
                apt.date === format(new Date(), 'yyyy-MM-dd')
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Sessões programadas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(apt => apt.status === 'confirmed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Agendamentos confirmados
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {appointments.filter(apt => apt.status === 'scheduled').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Comparecimento</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">94%</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de Conflito */}
      {conflictWarning && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center gap-2 p-4">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <p className="text-sm text-orange-800">{conflictWarning}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setConflictWarning(null)}
              className="ml-auto"
            >
              ×
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filtros e Controles */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Select value={selectedArtist} onValueChange={setSelectedArtist}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por artista" />
            </SelectTrigger>
            <SelectContent>
              {artists.map((artist) => (
                <SelectItem key={artist.id} value={artist.id}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
              <SelectItem value="no_show">Não Compareceu</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          {/* Agendamento Rápido */}
          <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                <Plus className="h-4 w-4 mr-2" />
                Agendamento Rápido
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Agendamento Rápido</DialogTitle>
                <DialogDescription>
                  Crie um agendamento rapidamente
                </DialogDescription>
              </DialogHeader>
              <QuickAppointmentForm 
                selectedSlot={selectedSlot}
                clients={clients}
                onSuccess={() => {
                  setIsQuickAddOpen(false);
                  setSelectedSlot(null);
                  queryClient.invalidateQueries({ queryKey: ['appointments'] });
                }}
                onConflict={(message) => setConflictWarning(message)}
                checkConflicts={checkConflicts}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Agendamento</DialogTitle>
                <DialogDescription>
                  Agende uma nova sessão para um cliente
                </DialogDescription>
              </DialogHeader>
              <AppointmentForm 
                selectedSlot={selectedSlot}
                clients={clients}
                onSuccess={() => {
                  setIsCreateDialogOpen(false);
                  setSelectedSlot(null);
                  queryClient.invalidateQueries({ queryKey: ['appointments'] });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendário */}
      <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-800">Calendário de Agendamentos</CardTitle>
              <CardDescription>
                Visualize e gerencie todos os agendamentos
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewChange('day')}
              >
                Dia
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewChange('week')}
              >
                Semana
              </Button>
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewChange('month')}
              >
                Mês
              </Button>
              <Button
                variant={view === 'agenda' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewChange('agenda')}
              >
                Agenda
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              view={view}
              onView={handleViewChange}
              date={selectedDate}
              onNavigate={setSelectedDate}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              popup
              messages={messages}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: getStatusColor(event.resource.appointment.status),
                  borderColor: getStatusColor(event.resource.appointment.status),
                }
              })}
              components={{
                event: EventComponent,
              }}
              min={new Date(0, 0, 0, 8, 0, 0)} // 8:00 AM
              max={new Date(0, 0, 0, 20, 0, 0)} // 8:00 PM
              step={30}
              timeslots={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Agendamento */}
      {selectedAppointment && (
        <Dialog 
          open={!!selectedAppointment} 
          onOpenChange={() => setSelectedAppointment(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Agendamento</DialogTitle>
              <DialogDescription>
                Visualizar e editar informações do agendamento
              </DialogDescription>
            </DialogHeader>
            <AppointmentCard 
              appointment={selectedAppointment}
              client={clients.find(c => c.id === selectedAppointment.client_id)}
              onClose={() => setSelectedAppointment(null)}
              onUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['appointments'] });
                setSelectedAppointment(null);
              }}
              onStatusUpdate={handleStatusUpdate}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Appointments;
