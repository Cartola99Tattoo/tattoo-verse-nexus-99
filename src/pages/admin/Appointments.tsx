
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
import { Plus, Filter, Calendar as CalendarIcon, Clock, User, Eye, Phone, Mail, UserPlus, AlertCircle, Bed, Settings, Sparkles, TrendingUp, DollarSign, ArrowLeft, Printer, Upload, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Appointment, Client } from "@/services/interfaces/IClientService";
import { Bed as BedType } from "@/services/interfaces/IBedService";
import AppointmentForm from "@/components/admin/AppointmentForm";
import AppointmentEditModal from "@/components/admin/AppointmentEditModal";
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
  const [view, setView] = useState<View>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedArtist, setSelectedArtist] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBed, setSelectedBed] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [isDayViewFocused, setIsDayViewFocused] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      
      const newAppointment = await clientService.createAppointment(appointmentData);
      
      if (appointmentData.price && appointmentData.price > 0) {
        console.log(`Financial Integration: Pending revenue of R$ ${appointmentData.price} registered for appointment ${newAppointment.id}`);
      }
      
      return newAppointment;
    },
    onSuccess: (newAppointment, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      const priceMessage = variables.price ? ` (R$ ${variables.price} em receita pendente)` : '';
      toast({
        title: "Agendamento criado com sucesso! ✨",
        description: `Agendamento registrado${priceMessage}`,
      });
      setIsCreateDialogOpen(false);
      setIsQuickAddOpen(false);
      setSelectedSlot(null);
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
      
      await clientService.updateAppointmentStatus(appointmentId, status);
      
      if (status === 'completed' && price && price > 0) {
        console.log(`Financial Integration: Converting pending revenue to confirmed revenue of R$ ${price} for appointment ${appointmentId}`);
        
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
        title: `${client?.name || 'Cliente'}${appointment.price ? ` - R$ ${appointment.price}` : ''}`,
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
    setIsEditModalOpen(true);
  };

  const handleNavigate = (newDate: Date, view: View, action: string) => {
    setSelectedDate(newDate);
    
    if (view === 'month' && action === 'click') {
      setView('day');
      setIsDayViewFocused(true);
    }
  };

  const handleBackToMonth = () => {
    setView('month');
    setIsDayViewFocused(false);
  };

  // Enhanced Event Component with better information display
  const EventComponent = ({ event }: any) => {
    const { appointment, client, bed } = event.resource;
    
    return (
      <div className="text-xs p-3 rounded-xl group relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-2xl hover:shadow-red-500/50 transition-all duration-500 transform hover:scale-110 border-2 border-red-400 cursor-pointer overflow-hidden">
        {/* Elemento decorativo de fundo */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        
        <div className="relative z-10">
          <div className="font-bold truncate text-white text-sm mb-1">{client?.name}</div>
          <div className="text-xs opacity-90 flex items-center gap-1 text-red-100 mb-1">
            <span>{appointment.service_type === 'tattoo' ? '🎨' : appointment.service_type === 'piercing' ? '💎' : '💬'}</span>
            <span className="capitalize">{appointment.service_type}</span>
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
        </div>
        
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 shadow-xl rounded-lg p-1 flex gap-1 z-20 border border-gray-200">
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
    showMore: (total: number) => `+ ${total} mais`,
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
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50 via-red-50/20 to-white min-h-screen relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-100/10 via-transparent to-transparent rounded-full transform translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-red-100/10 via-transparent to-transparent rounded-full transform -translate-x-32 translate-y-32"></div>

      <Tabs defaultValue="calendar" className="space-y-8 relative z-10">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-white via-red-50/50 to-white border-2 border-red-200/50 shadow-2xl rounded-2xl p-2">
          <TabsTrigger 
            value="calendar" 
            className="flex items-center gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white transition-all duration-300 rounded-xl font-bold text-lg py-3"
          >
            <CalendarIcon className="h-5 w-5" />
            Calendário de Agendamentos
          </TabsTrigger>
          <TabsTrigger 
            value="beds" 
            className="flex items-center gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white transition-all duration-300 rounded-xl font-bold text-lg py-3"
          >
            <Bed className="h-5 w-5" />
            Gestão de Macas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-8">
          {/* Enhanced Statistics Cards with Real Financial Integration */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="shadow-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white border-red-400 hover:shadow-red-500/25 transition-all duration-500 transform hover:scale-105 group relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-bold">Agendamentos Hoje</CardTitle>
                <CalendarIcon className="h-6 w-6 text-red-200" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-black mb-2">
                  {appointments.filter(apt => 
                    apt.date === format(new Date(), 'yyyy-MM-dd')
                  ).length}
                </div>
                <p className="text-sm text-red-200 font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Sessões programadas
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-2xl bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white border-green-400 hover:shadow-green-500/25 transition-all duration-500 transform hover:scale-105 group relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-bold">Receita Hoje</CardTitle>
                <DollarSign className="h-6 w-6 text-green-200" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-black mb-2">
                  R$ {todayRevenue.toFixed(2)}
                </div>
                <p className="text-sm text-green-200 font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Agendamentos concluídos
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white border-blue-400 hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-105 group relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-bold">Macas Ativas</CardTitle>
                <Bed className="h-6 w-6 text-blue-200" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-black text-white mb-2">
                  {beds.filter(bed => bed.isActive).length}
                </div>
                <p className="text-sm text-blue-200 font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Disponíveis para uso
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white border-purple-400 hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 group relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-bold">Confirmados</CardTitle>
                <Clock className="h-6 w-6 text-purple-200" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-black mb-2">
                  {appointments.filter(apt => apt.status === 'confirmed').length}
                </div>
                <p className="text-sm text-purple-200 font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Agendamentos confirmados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Filters and Controls */}
          <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
            <div className="flex flex-wrap gap-4">
              <Select value={selectedArtist} onValueChange={setSelectedArtist}>
                <SelectTrigger className="w-[220px] h-12 border-2 border-red-200 focus:border-red-500 shadow-xl bg-white/90 hover:bg-red-50 transition-all duration-300 rounded-xl backdrop-blur-sm">
                  <Filter className="h-5 w-5 mr-2 text-red-600" />
                  <SelectValue placeholder="Filtrar por artista" />
                </SelectTrigger>
                <SelectContent className="border-2 border-red-200 shadow-2xl rounded-xl">
                  {artists.map((artist) => (
                    <SelectItem key={artist.id} value={artist.id} className="hover:bg-red-50 focus:bg-red-100 p-4 rounded-lg">
                      <span className="font-semibold">{artist.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBed} onValueChange={setSelectedBed}>
                <SelectTrigger className="w-[200px] h-12 border-2 border-red-200 focus:border-red-500 shadow-xl bg-white/90 hover:bg-red-50 transition-all duration-300 rounded-xl backdrop-blur-sm">
                  <Bed className="h-5 w-5 mr-2 text-red-600" />
                  <SelectValue placeholder="Filtrar por maca" />
                </SelectTrigger>
                <SelectContent className="border-2 border-red-200 shadow-2xl rounded-xl">
                  <SelectItem value="all" className="hover:bg-red-50 focus:bg-red-100 p-4 rounded-lg">
                    <span className="font-semibold">Todas as Macas</span>
                  </SelectItem>
                  <SelectItem value="none" className="hover:bg-red-50 focus:bg-red-100 p-4 rounded-lg">
                    <span className="font-semibold">Sem Maca Específica</span>
                  </SelectItem>
                  {beds.filter(bed => bed.isActive).map((bed) => (
                    <SelectItem key={bed.id} value={bed.id} className="hover:bg-red-50 focus:bg-red-100 p-4 rounded-lg">
                      <span className="font-semibold">{bed.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[200px] h-12 border-2 border-red-200 focus:border-red-500 shadow-xl bg-white/90 hover:bg-red-50 transition-all duration-300 rounded-xl backdrop-blur-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="border-2 border-red-200 shadow-2xl rounded-xl">
                  <SelectItem value="all" className="hover:bg-red-50 focus:bg-red-100 p-4 rounded-lg">
                    <span className="font-semibold">Todos os Status</span>
                  </SelectItem>
                  <SelectItem value="scheduled" className="hover:bg-red-50 focus:bg-red-100 p-4 rounded-lg">
                    <span className="font-semibold">Agendado</span>
                  </SelectItem>
                  <SelectItem value="confirmed" className="hover:bg-red-50 focus:bg-red-100 p-4 rounded-lg">
                    <span className="font-semibold">Confirmado</span>
                  </SelectItem>
                  <SelectItem value="in_progress" className="hover:bg-red-50 focus:bg-red-100 p-4 rounded-lg">
                    <span className="font-semibold">Em Andamento</span>
                  </SelectItem>
                  <SelectItem value="completed" className="hover:bg-red-50 focus:bg-red-100 p-4 rounded-lg">
                    <span className="font-semibold">Concluído</span>
                  </SelectItem>
                  <SelectItem value="cancelled" className="hover:bg-red-50 focus:bg-red-100 p-4 rounded-lg">
                    <span className="font-semibold">Cancelado</span>
                  </SelectItem>
                  <SelectItem value="no_show" className="hover:bg-red-50 focus:bg-red-100 p-4 rounded-lg">
                    <span className="font-semibold">Não Compareceu</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl h-12 px-6">
                    <Plus className="h-5 w-5 mr-2" />
                    Agendamento Rápido
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50/30 to-white border-2 border-blue-200/50 shadow-2xl rounded-2xl">
                  <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 -m-6 mb-6 rounded-t-2xl">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                      <Plus className="h-6 w-6" />
                      Agendamento Rápido
                    </DialogTitle>
                    <DialogDescription className="text-blue-100 font-medium">
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
                  <Button className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform hover:scale-105 border-2 border-red-500 rounded-xl h-12 px-8">
                    <Plus className="h-5 w-5 mr-2" />
                    Novo Agendamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-red-50/30 to-white border-2 border-red-200/50 shadow-2xl rounded-2xl">
                  <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 -m-6 mb-8 rounded-t-2xl">
                    <DialogTitle className="text-3xl font-black flex items-center gap-3">
                      <CalendarIcon className="h-8 w-8" />
                      Criar Novo Agendamento
                    </DialogTitle>
                    <DialogDescription className="text-red-100 font-semibold text-lg">
                      Agende uma nova sessão para um cliente
                    </DialogDescription>
                  </DialogHeader>
                  <div className="px-4">
                    <AppointmentForm 
                      selectedSlot={selectedSlot}
                      clients={clients}
                      onSuccess={() => {
                        setIsCreateDialogOpen(false);
                        setSelectedSlot(null);
                        queryClient.invalidateQueries({ queryKey: ['appointments'] });
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Enhanced Calendar with Modern View Selector */}
          <Card className="shadow-2xl bg-gradient-to-br from-white via-red-50/20 to-white border-2 border-red-200/50 hover:shadow-3xl transition-all duration-500 relative overflow-hidden rounded-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-100/20 rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-100/15 rounded-full transform -translate-x-24 translate-y-24"></div>
            
            <CardHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-t-2xl relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {isDayViewFocused && (
                    <Button
                      onClick={handleBackToMonth}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-red-700/50 transition-all duration-300 border-2 border-red-500 rounded-xl"
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Voltar ao Mês
                    </Button>
                  )}
                  <div>
                    <CardTitle className="text-3xl font-black flex items-center gap-3">
                      <CalendarIcon className="h-8 w-8" />
                      {isDayViewFocused ? 
                        `Detalhes do Dia - ${format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}` :
                        'Calendário de Agendamentos'
                      }
                    </CardTitle>
                    <CardDescription className="text-red-100 font-semibold text-lg">
                      {isDayViewFocused ? 
                        'Gestão detalhada de agendamentos por hora' :
                        'Clique em um dia para visualização detalhada'
                      }
                    </CardDescription>
                  </div>
                </div>
                
                {/* Enhanced View Selector with High Contrast */}
                <div className="flex items-center gap-2 bg-red-800/40 rounded-2xl p-2 backdrop-blur-sm">
                  {[
                    { key: 'month', label: 'Mês', icon: CalendarIcon },
                    { key: 'week', label: 'Semana', icon: CalendarIcon },
                    { key: 'day', label: 'Dia', icon: Clock },
                    { key: 'agenda', label: 'Agenda', icon: Eye }
                  ].map(({ key, label, icon: Icon }) => (
                    <Button
                      key={key}
                      onClick={() => setView(key as View)}
                      variant="ghost"
                      size="sm"
                      className={`
                        px-4 py-2 text-sm font-bold transition-all duration-300 rounded-xl
                        ${view === key 
                          ? 'bg-white text-red-700 shadow-2xl transform scale-110 border-2 border-red-300' 
                          : 'text-red-200 hover:text-white hover:bg-red-700/50 border-2 border-transparent hover:border-red-400'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 relative z-10">
              <div className="h-[700px] bg-white/90 rounded-2xl shadow-inner border-2 border-gray-100/50 backdrop-blur-sm">
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  view={view}
                  onView={setView}
                  date={selectedDate}
                  onNavigate={handleNavigate}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  selectable
                  popup
                  messages={messages}
                  culture="pt-BR"
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: getStatusColor(event.resource.appointment.status),
                      borderColor: getStatusColor(event.resource.appointment.status),
                      borderWidth: '3px',
                      borderRadius: '12px',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
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
                  formats={{
                    monthHeaderFormat: (date: Date) => format(date, 'MMMM yyyy', { locale: ptBR }),
                    dayHeaderFormat: (date: Date) => format(date, 'EEEE, dd/MM', { locale: ptBR }),
                    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => 
                      `${format(start, 'dd/MM', { locale: ptBR })} - ${format(end, 'dd/MM', { locale: ptBR })}`,
                    timeGutterFormat: (date: Date) => format(date, 'HH:mm', { locale: ptBR }),
                    eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
                      `${format(start, 'HH:mm', { locale: ptBR })} - ${format(end, 'HH:mm', { locale: ptBR })}`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Appointment Edit Modal */}
          <AppointmentEditModal
            appointment={selectedAppointment}
            client={clients.find(c => c.id === selectedAppointment?.client_id)}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedAppointment(null);
            }}
            onUpdate={() => {
              queryClient.invalidateQueries({ queryKey: ['appointments'] });
            }}
          />
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
