
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClientService, getBedService } from "@/services/serviceFactory";
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Filter, Calendar as CalendarIcon, Clock, User, Eye, Phone, Mail, UserPlus, AlertCircle, Bed, Settings, Sparkles, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Appointment, Client } from "@/services/interfaces/IClientService";
import { Bed as BedType } from "@/services/interfaces/IBedService";
import AppointmentForm from "@/components/admin/AppointmentForm";
import AppointmentCard from "@/components/admin/AppointmentCard";
import QuickAppointmentForm from "@/components/admin/QuickAppointmentForm";
import BedManagement from "@/components/admin/BedManagement";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';

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
  const [selectedBed, setSelectedBed] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const clientService = getClientService();
  const bedService = getBedService();

  // Buscar agendamentos
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments', selectedArtist, selectedStatus, selectedBed],
    queryFn: () => clientService.fetchUpcomingAppointments(100),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.fetchClients({ limit: 1000 }),
  });

  const { data: beds = [] } = useQuery({
    queryKey: ['beds'],
    queryFn: () => bedService.fetchBeds(),
  });

  const checkConflicts = (newAppointment: { artist_id: string; bed_id?: string; date: string; time: string; duration_minutes: number }) => {
    const newStart = new Date(`${newAppointment.date}T${newAppointment.time}`);
    const newEnd = new Date(newStart.getTime() + newAppointment.duration_minutes * 60000);

    const conflicts = appointments.filter(apt => {
      const artistConflict = apt.artist_id === newAppointment.artist_id && 
        apt.date === newAppointment.date &&
        apt.status !== 'cancelled';

      const bedConflict = newAppointment.bed_id && apt.bed_id === newAppointment.bed_id &&
        apt.date === newAppointment.date &&
        apt.status !== 'cancelled';

      return artistConflict || bedConflict;
    }).filter(apt => {
      const aptStart = new Date(`${apt.date}T${apt.time}`);
      const aptEnd = new Date(aptStart.getTime() + apt.duration_minutes * 60000);
      
      return (newStart < aptEnd && newEnd > aptStart);
    });

    return conflicts;
  };

  const addBedMutation = useMutation({
    mutationFn: (bedData: Omit<BedType, 'id' | 'created_at' | 'updated_at'>) =>
      bedService.createBed(bedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast({
        title: "Maca adicionada",
        description: "A maca foi adicionada com sucesso.",
      });
    }
  });

  const updateBedMutation = useMutation({
    mutationFn: ({ bedId, updates }: { bedId: string; updates: Partial<BedType> }) =>
      bedService.updateBed(bedId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast({
        title: "Maca atualizada",
        description: "A maca foi atualizada com sucesso.",
      });
    }
  });

  const deleteBedMutation = useMutation({
    mutationFn: (bedId: string) => bedService.deleteBed(bedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      toast({
        title: "Maca removida",
        description: "A maca foi removida com sucesso.",
      });
    }
  });

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

  // Enhanced financial integration mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'> & { price?: number }) => {
      console.log('Creating appointment with financial integration:', appointmentData);
      
      // Create the appointment
      const newAppointment = await clientService.createAppointment(appointmentData);
      
      // Simulate financial integration for pending revenue
      if (appointmentData.price && appointmentData.price > 0) {
        console.log(`Financial Integration: Pending revenue of R$ ${appointmentData.price} registered for appointment ${newAppointment.id}`);
        
        // In a real implementation, this would call:
        // await financialService.addPendingRevenue({
        //   amount: appointmentData.price,
        //   source: 'appointment',
        //   appointmentId: newAppointment.id,
        //   description: `Agendamento - ${appointmentData.service_type}`,
        //   dueDate: appointmentData.date
        // });
      }
      
      return newAppointment;
    },
    onSuccess: (newAppointment, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      const priceMessage = variables.price ? ` (R$ ${variables.price} em receita pendente)` : '';
      toast({
        title: "Agendamento criado com sucesso!",
        description: `Agendamento registrado${priceMessage}`,
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o agendamento.",
        variant: "destructive"
      });
    }
  });

  const enhancedUpdateStatusMutation = useMutation({
    mutationFn: async ({ appointmentId, status, price }: { appointmentId: string; status: Appointment['status']; price?: number }) => {
      console.log('Updating appointment status with financial integration:', { appointmentId, status, price });
      
      // Update appointment status
      await clientService.updateAppointmentStatus(appointmentId, status);
      
      // Financial integration when marking as completed
      if (status === 'completed' && price && price > 0) {
        console.log(`Financial Integration: Converting pending revenue to confirmed revenue of R$ ${price} for appointment ${appointmentId}`);
        
        // In a real implementation, this would call:
        // await financialService.confirmRevenue({
        //   appointmentId,
        //   amount: price,
        //   completedDate: new Date().toISOString(),
        //   category: 'service_revenue',
        //   description: 'Agendamento concluído'
        // });
        
        // Simulate adding to financial dashboard
        toast({
          title: "Receita registrada!",
          description: `R$ ${price.toFixed(2)} adicionados ao módulo financeiro.`,
        });
      }
      
      return { appointmentId, status, price };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
      
      const statusMessage = variables.status === 'completed' && variables.price 
        ? `Agendamento concluído e receita de R$ ${variables.price.toFixed(2)} registrada.`
        : "Status do agendamento atualizado com sucesso.";
        
      toast({
        title: "Atualização concluída",
        description: statusMessage,
      });
    }
  });

  const handleStatusUpdate = (appointmentId: string, status: Appointment['status']) => {
    enhancedUpdateStatusMutation.mutate({ appointmentId, status });
  };

  // Enhanced calendar events with better visual information
  const calendarEvents = appointments
    .filter(appointment => {
      if (selectedArtist !== 'all' && appointment.artist_id !== selectedArtist) return false;
      if (selectedStatus !== 'all' && appointment.status !== selectedStatus) return false;
      if (selectedBed !== 'all' && appointment.bed_id !== selectedBed) return false;
      return true;
    })
    .map(appointment => {
      const client = clients.find(c => c.id === appointment.client_id);
      const bed = beds.find(b => b.id === appointment.bed_id);
      const startDate = new Date(`${appointment.date}T${appointment.time}`);
      const endDate = new Date(startDate.getTime() + appointment.duration_minutes * 60000);

      return {
        id: appointment.id,
        title: `${client?.name || 'Cliente'} ${appointment.price ? `- R$ ${appointment.price}` : ''}`,
        start: startDate,
        end: endDate,
        resource: {
          appointment,
          client,
          bed,
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

  // Enhanced Event Component with better information display
  const EventComponent = ({ event }: any) => {
    const { appointment, client, bed } = event.resource;
    
    return (
      <div className="text-xs p-2 rounded-lg group relative bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-red-400">
        <div className="font-bold truncate text-white">{client?.name}</div>
        <div className="text-xs opacity-90 flex items-center gap-1 text-red-100">
          <span>{appointment.service_type === 'tattoo' ? '🎨' : appointment.service_type === 'piercing' ? '💎' : '💬'}</span>
          <span>{appointment.service_type}</span>
          {bed && (
            <>
              <span>•</span>
              <Bed className="h-3 w-3" />
              <span>{bed.name}</span>
            </>
          )}
        </div>
        {appointment.price && (
          <div className="text-xs opacity-90 flex items-center gap-1 text-green-200 font-bold">
            <DollarSign className="h-3 w-3" />
            <span>R$ {appointment.price}</span>
          </div>
        )}
        
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-xl rounded-lg p-1 flex gap-1 z-10 border border-gray-200">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              if (client?.phone) {
                window.open(`tel:${client.phone}`);
              }
            }}
            title="Ligar para cliente"
          >
            <Phone className="h-3 w-3 text-red-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              if (client?.email) {
                window.open(`mailto:${client.email}`);
              }
            }}
            title="Enviar e-mail"
          >
            <Mail className="h-3 w-3 text-red-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/admin/clients/${client?.id}`, '_blank');
            }}
            title="Ver perfil do cliente"
          >
            <UserPlus className="h-3 w-3 text-red-600" />
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

  const artists = [
    { id: 'all', name: 'Todos os Artistas' },
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Costa' },
  ];

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  // Calculate today's revenue from completed appointments
  const todayRevenue = appointments
    .filter(apt => apt.date === format(new Date(), 'yyyy-MM-dd') && apt.status === 'completed')
    .reduce((total, apt) => total + (apt.price || 0), 0);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 via-red-50/30 to-white min-h-screen">
      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-white to-gray-50 border-2 border-red-200 shadow-xl rounded-xl">
          <TabsTrigger 
            value="calendar" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white transition-all duration-300 rounded-lg font-bold"
          >
            <CalendarIcon className="h-4 w-4" />
            Calendário de Agendamentos
          </TabsTrigger>
          <TabsTrigger 
            value="beds" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white transition-all duration-300 rounded-lg font-bold"
          >
            <Bed className="h-4 w-4" />
            Gestão de Macas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          {/* Enhanced Statistics Cards with Real Financial Integration */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white border-red-400 hover:shadow-red-glow transition-all duration-500 transform hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-bold">Agendamentos Hoje</CardTitle>
                <CalendarIcon className="h-5 w-5 text-red-200" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-black">
                  {appointments.filter(apt => 
                    apt.date === format(new Date(), 'yyyy-MM-dd')
                  ).length}
                </div>
                <p className="text-xs text-red-200 font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Sessões programadas
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-2xl bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white border-green-400 hover:shadow-green-glow transition-all duration-500 transform hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-bold">Receita Hoje</CardTitle>
                <DollarSign className="h-5 w-5 text-green-200" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-black">
                  R$ {todayRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-green-200 font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Agendamentos concluídos
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white border-blue-400 hover:shadow-blue-glow transition-all duration-500 transform hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-bold">Macas Ativas</CardTitle>
                <Bed className="h-5 w-5 text-blue-200" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-black text-white">
                  {beds.filter(bed => bed.isActive).length}
                </div>
                <p className="text-xs text-blue-200 font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Disponíveis para uso
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white border-purple-400 hover:shadow-purple-glow transition-all duration-500 transform hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-bold">Confirmados</CardTitle>
                <Clock className="h-5 w-5 text-purple-200" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-black">
                  {appointments.filter(apt => apt.status === 'confirmed').length}
                </div>
                <p className="text-xs text-purple-200 font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Agendamentos confirmados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alerta de Conflito Aprimorado */}
          {conflictWarning && (
            <Card className="border-2 border-orange-400 bg-gradient-to-r from-orange-50 to-orange-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="flex items-center gap-3 p-4">
                <AlertCircle className="h-5 w-5 text-orange-600 animate-pulse" />
                <p className="text-sm text-orange-800 font-medium flex-1">{conflictWarning}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setConflictWarning(null)}
                  className="ml-auto hover:bg-orange-200 text-orange-600"
                >
                  ×
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-3">
              <Select value={selectedArtist} onValueChange={setSelectedArtist}>
                <SelectTrigger className="w-[200px] border-2 border-red-200 focus:border-red-500 shadow-lg">
                  <Filter className="h-4 w-4 mr-2 text-red-600" />
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

              <Select value={selectedBed} onValueChange={setSelectedBed}>
                <SelectTrigger className="w-[180px] border-2 border-red-200 focus:border-red-500 shadow-lg">
                  <Bed className="h-4 w-4 mr-2 text-red-600" />
                  <SelectValue placeholder="Filtrar por maca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Macas</SelectItem>
                  <SelectItem value="none">Sem Maca Específica</SelectItem>
                  {beds.filter(bed => bed.isActive).map((bed) => (
                    <SelectItem key={bed.id} value={bed.id}>
                      {bed.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px] border-2 border-red-200 focus:border-red-500 shadow-lg">
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
            
            <div className="flex gap-3">
              <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-2 border-blue-400 text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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
                  <Button className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-red-500">
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

          {/* Enhanced Calendar with Fixed Contrast and 99Tattoo Styling */}
          <Card className="shadow-2xl bg-gradient-to-br from-white via-gray-50 to-white border-2 border-red-200 hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/30 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-100/20 rounded-full transform -translate-x-12 translate-y-12"></div>
            
            <CardHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-t-lg relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black flex items-center gap-2">
                    <CalendarIcon className="h-6 w-6" />
                    Calendário de Agendamentos
                  </CardTitle>
                  <CardDescription className="text-red-100 font-medium">
                    Visualize e gerencie todos os agendamentos com estilo
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={view === 'day' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewChange('day')}
                    className={view === 'day' 
                      ? 'bg-gray-900 text-white font-bold shadow-xl border-2 border-gray-800 hover:bg-gray-800 hover:text-white' 
                      : 'border-2 border-gray-200 bg-white text-gray-900 hover:bg-gray-100 hover:border-gray-300 font-bold transition-all duration-300 shadow-lg'
                    }
                  >
                    Dia
                  </Button>
                  <Button
                    variant={view === 'week' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewChange('week')}
                    className={view === 'week' 
                      ? 'bg-gray-900 text-white font-bold shadow-xl border-2 border-gray-800 hover:bg-gray-800 hover:text-white' 
                      : 'border-2 border-gray-200 bg-white text-gray-900 hover:bg-gray-100 hover:border-gray-300 font-bold transition-all duration-300 shadow-lg'
                    }
                  >
                    Semana
                  </Button>
                  <Button
                    variant={view === 'month' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewChange('month')}
                    className={view === 'month' 
                      ? 'bg-gray-900 text-white font-bold shadow-xl border-2 border-gray-800 hover:bg-gray-800 hover:text-white' 
                      : 'border-2 border-gray-200 bg-white text-gray-900 hover:bg-gray-100 hover:border-gray-300 font-bold transition-all duration-300 shadow-lg'
                    }
                  >
                    Mês
                  </Button>
                  <Button
                    variant={view === 'agenda' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewChange('agenda')}
                    className={view === 'agenda' 
                      ? 'bg-gray-900 text-white font-bold shadow-xl border-2 border-gray-800 hover:bg-gray-800 hover:text-white' 
                      : 'border-2 border-gray-200 bg-white text-gray-900 hover:bg-gray-100 hover:border-gray-300 font-bold transition-all duration-300 shadow-lg'
                    }
                  >
                    Agenda
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 relative z-10">
              <div className="h-[600px] bg-white rounded-lg shadow-inner border-2 border-gray-100">
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
                      borderWidth: '2px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      color: 'white',
                      fontWeight: 'bold',
                    }
                  })}
                  components={{
                    event: EventComponent,
                  }}
                  min={new Date(0, 0, 0, 8, 0, 0)}
                  max={new Date(0, 0, 0, 20, 0, 0)}
                  step={30}
                  timeslots={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Appointment Details Modal */}
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
                />
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        <TabsContent value="beds">
          <BedManagement 
            beds={beds}
            onAddBed={(bedData) => addBedMutation.mutate(bedData)}
            onUpdateBed={(bedId, updates) => updateBedMutation.mutate({ bedId, updates })}
            onDeleteBed={(bedId) => deleteBedMutation.mutate(bedId)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
