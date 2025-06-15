import React, { useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar as CalendarIcon, Users, Clock, MapPin, Sparkles, Expand, Minimize, X, Eye, Scissors, User, BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import AppointmentForm from "@/components/admin/AppointmentForm";
import AppointmentEditModal from "@/components/admin/AppointmentEditModal";
import DailyAppointmentsKanban from "@/components/admin/DailyAppointmentsKanban";
import DailyAppointmentStatusKanban from "@/components/admin/DailyAppointmentStatusKanban";
import AppointmentsDashboard from "@/components/admin/AppointmentsDashboard";
import WeeklyAppointmentsKanban from "@/components/admin/WeeklyAppointmentsKanban";
import { Client, Appointment } from "@/services/interfaces/IClientService";
import { getClientService } from "@/services/serviceFactory";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/styles/calendar.css";

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales,
});

// Dados simulados expandidos para demonstração
const mockAppointments: Appointment[] = [
  // Agendamentos para dezembro 2024
  {
    id: '1',
    client_id: '1',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-12',
    time: '09:00',
    duration_minutes: 120,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Tatuagem dragão no braço',
    notes: 'Cliente regular',
    estimated_price: 300,
    created_at: '2024-12-10T10:00:00Z',
    updated_at: '2024-12-10T10:00:00Z',
  },
  {
    id: '2',
    client_id: '2',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-12',
    time: '10:30',
    duration_minutes: 90,
    service_type: 'tattoo',
    status: 'scheduled',
    service_description: 'Rosa no ombro',
    notes: 'Primeira sessão',
    estimated_price: 200,
    created_at: '2024-12-09T15:30:00Z',
    updated_at: '2024-12-09T15:30:00Z',
  },
  {
    id: '3',
    client_id: '3',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-12',
    time: '14:00',
    duration_minutes: 180,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Mandala nas costas',
    notes: 'Sessão longa',
    estimated_price: 500,
    created_at: '2024-12-08T12:00:00Z',
    updated_at: '2024-12-08T12:00:00Z',
  },
  // Mais agendamentos para testar as visualizações
  {
    id: '4',
    client_id: '4',
    artist_id: '3',
    bed_id: '3',
    date: '2024-12-13',
    time: '09:30',
    duration_minutes: 60,
    service_type: 'tattoo',
    status: 'scheduled',
    service_description: 'Retoque em tatuagem',
    notes: 'Cliente antigo',
    estimated_price: 100,
    created_at: '2024-12-11T09:00:00Z',
    updated_at: '2024-12-11T09:00:00Z',
  },
  {
    id: '5',
    client_id: '5',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-13',
    time: '15:30',
    duration_minutes: 150,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Tatuagem tribal',
    notes: 'Design personalizado',
    estimated_price: 400,
    created_at: '2024-12-07T14:20:00Z',
    updated_at: '2024-12-07T14:20:00Z',
  },
  {
    id: '6',
    client_id: '1',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-14',
    time: '09:30',
    duration_minutes: 240,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Sleeve completa',
    notes: 'Sessão 2 de 4',
    estimated_price: 800,
    created_at: '2024-12-06T16:45:00Z',
    updated_at: '2024-12-06T16:45:00Z',
  },
  {
    id: '7',
    client_id: '6',
    artist_id: '3',
    bed_id: '3',
    date: '2024-12-14',
    time: '16:00',
    duration_minutes: 90,
    service_type: 'tattoo',
    status: 'scheduled',
    service_description: 'Borboleta colorida',
    notes: 'Primeira tatuagem',
    estimated_price: 250,
    created_at: '2024-12-10T11:30:00Z',
    updated_at: '2024-12-10T11:30:00Z',
  },
  // Agendamentos para a semana atual
  {
    id: '8',
    client_id: '7',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-16',
    time: '10:00',
    duration_minutes: 120,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Lobo geométrico',
    notes: 'Cliente VIP',
    estimated_price: 450,
    created_at: '2024-12-12T08:00:00Z',
    updated_at: '2024-12-12T08:00:00Z',
  },
  {
    id: '9',
    client_id: '8',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-16',
    time: '14:30',
    duration_minutes: 90,
    service_type: 'piercing',
    status: 'scheduled',
    service_description: 'Piercing no nariz',
    notes: 'Primeira vez',
    estimated_price: 80,
    created_at: '2024-12-13T10:00:00Z',
    updated_at: '2024-12-13T10:00:00Z',
  },
  {
    id: '10',
    client_id: '9',
    artist_id: '3',
    bed_id: '3',
    date: '2024-12-17',
    time: '11:00',
    duration_minutes: 180,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Fênix colorida',
    notes: 'Design complexo',
    estimated_price: 600,
    created_at: '2024-12-14T16:00:00Z',
    updated_at: '2024-12-14T16:00:00Z',
  },
  // Mais agendamentos para completar a semana
  {
    id: '11',
    client_id: '10',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-18',
    time: '09:00',
    duration_minutes: 60,
    service_type: 'consultation',
    status: 'scheduled',
    service_description: 'Consulta para nova tatuagem',
    notes: 'Orçamento',
    estimated_price: 0,
    created_at: '2024-12-15T12:00:00Z',
    updated_at: '2024-12-15T12:00:00Z',
  },
  {
    id: '12',
    client_id: '2',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-18',
    time: '15:00',
    duration_minutes: 120,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Continuação rosa no ombro',
    notes: 'Segunda sessão',
    estimated_price: 300,
    created_at: '2024-12-16T09:00:00Z',
    updated_at: '2024-12-16T09:00:00Z',
  }
];

const mockClients: Client[] = [
  { 
    id: '1', 
    name: 'Ana Silva', 
    email: 'ana@email.com', 
    phone: '(11) 99999-1111',
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-10T10:00:00Z',
    total_spent: 1100,
    total_orders: 3
  },
  { 
    id: '2', 
    name: 'Bruno Costa', 
    email: 'bruno@email.com', 
    phone: '(11) 99999-2222',
    status: 'active',
    created_at: '2024-02-20T14:30:00Z',
    updated_at: '2024-12-09T15:30:00Z',
    total_spent: 500,
    total_orders: 2
  },
  { 
    id: '3', 
    name: 'Carla Santos', 
    email: 'carla@email.com', 
    phone: '(11) 99999-3333',
    status: 'vip',
    created_at: '2023-11-05T09:15:00Z',
    updated_at: '2024-12-08T12:00:00Z',
    total_spent: 2500,
    total_orders: 5
  },
  { 
    id: '4', 
    name: 'Diego Ferreira', 
    email: 'diego@email.com', 
    phone: '(11) 99999-4444',
    status: 'returning',
    created_at: '2023-08-12T16:20:00Z',
    updated_at: '2024-12-11T09:00:00Z',
    total_spent: 800,
    total_orders: 4
  },
  { 
    id: '5', 
    name: 'Elena Rodrigues', 
    email: 'elena@email.com', 
    phone: '(11) 99999-5555',
    status: 'active',
    created_at: '2024-03-08T11:45:00Z',
    updated_at: '2024-12-07T14:20:00Z',
    total_spent: 400,
    total_orders: 1
  },
  { 
    id: '6', 
    name: 'Felipe Oliveira', 
    email: 'felipe@email.com', 
    phone: '(11) 99999-6666',
    status: 'new',
    created_at: '2024-12-10T11:30:00Z',
    updated_at: '2024-12-10T11:30:00Z',
    total_spent: 250,
    total_orders: 1
  },
  { 
    id: '7', 
    name: 'Gabriela Lima', 
    email: 'gabriela@email.com', 
    phone: '(11) 99999-7777',
    status: 'vip',
    created_at: '2023-10-22T14:00:00Z',
    updated_at: '2024-12-12T08:00:00Z',
    total_spent: 1800,
    total_orders: 4
  },
  { 
    id: '8', 
    name: 'Hugo Martins', 
    email: 'hugo@email.com', 
    phone: '(11) 99999-8888',
    status: 'new',
    created_at: '2024-12-13T10:00:00Z',
    updated_at: '2024-12-13T10:00:00Z',
    total_spent: 0,
    total_orders: 0
  },
  { 
    id: '9', 
    name: 'Isabela Rocha', 
    email: 'isabela@email.com', 
    phone: '(11) 99999-9999',
    status: 'active',
    created_at: '2024-05-18T11:30:00Z',
    updated_at: '2024-12-14T16:00:00Z',
    total_spent: 900,
    total_orders: 2
  },
  { 
    id: '10', 
    name: 'João Pereira', 
    email: 'joao@email.com', 
    phone: '(11) 99999-0000',
    status: 'new',
    created_at: '2024-12-15T12:00:00Z',
    updated_at: '2024-12-15T12:00:00Z',
    total_spent: 0,
    total_orders: 0
  }
];

const Appointments = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('month');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);
  const [selectedDayStatusDate, setSelectedDayStatusDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const queryClient = useQueryClient();
  const clientService = getClientService();

  // Usar dados mock para demonstração
  const appointments = mockAppointments;
  const clients = mockClients;

  const calendarEvents = appointments.map(appointment => ({
    ...appointment,
    title: `${clients.find(c => c.id === appointment.client_id)?.name || 'Cliente'} - ${appointment.time}`,
    start: new Date(`${appointment.date}T${appointment.time}`),
    end: new Date(new Date(`${appointment.date}T${appointment.time}`).getTime() + appointment.duration_minutes * 60000),
    resource: appointment,
  }));

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setShowCreateForm(true);
  }, []);

  const handleSelectEvent = useCallback((event: any) => {
    const appointment = event.resource;
    const client = clients.find(c => c.id === appointment.client_id);
    setSelectedEvent(appointment);
    setSelectedClient(client || null);
  }, [clients]);

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
    setSelectedSlot(null);
  };

  const handleCloseEditModal = () => {
    setSelectedEvent(null);
    setSelectedClient(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
    handleCloseCreateForm();
    toast({
      title: "✨ Agendamento criado!",
      description: "O agendamento foi criado com sucesso e aparece no calendário.",
    });
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
    handleCloseEditModal();
  };

  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDayDate(date);
  };

  const handleCloseDayKanban = () => {
    setSelectedDayDate(null);
  };

  const handleDayStatusClick = (date: Date) => {
    setSelectedDayStatusDate(date);
  };

  const handleCloseDayStatusKanban = () => {
    setSelectedDayStatusDate(null);
  };

  const handleRescheduleAppointment = async (appointmentId: string, newTime: string) => {
    try {
      console.log(`Reagendando agendamento ${appointmentId} para ${newTime}`);
      
      toast({
        title: "✅ Agendamento reagendado!",
        description: "O horário foi alterado com sucesso.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    } catch (error) {
      toast({
        title: "❌ Erro ao reagendar",
        description: "Não foi possível alterar o horário do agendamento.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'cancelled': return 'bg-gray-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-red-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'scheduled': return 'Agendado';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Concluído';
      default: return 'Pendente';
    }
  };

  // Mensagens em português brasileiro
  const messages = {
    today: 'Hoje',
    previous: '← Anterior',
    next: 'Próximo →',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há agendamentos neste período',
    showMore: (total: number) => `+ ${total} agendamentos`,
    allDay: 'Dia inteiro',
    work_week: 'Semana de trabalho',
  };

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-gradient-to-br from-red-50 via-white to-red-50 overflow-hidden"
    : "p-4 bg-gradient-to-br from-red-50 via-white to-red-50 min-h-screen relative overflow-hidden";

  const calendarHeight = isFullscreen 
    ? 'calc(100vh - 200px)'
    : 'calc(100vh - 400px)';

  return (
    <div className={containerClass}>
      {/* Elementos decorativos de fundo */}
      {!isFullscreen && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-100/20 via-transparent to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-100/15 via-transparent to-transparent rounded-full transform -translate-x-24 translate-y-24"></div>
        </>
      )}

      <div className="relative z-10">
        {/* Cabeçalho Principal */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-xl shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] animate-pulse"></div>
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-black">Gestão de Agendamentos 99Tattoo</h1>
                <p className="text-red-100 font-medium">Dashboard completo e calendário inteligente com fluxo Kanban</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold"
              >
                {isFullscreen ? (
                  <>
                    <Minimize className="h-4 w-4 mr-2" />
                    Sair Tela Cheia
                  </>
                ) : (
                  <>
                    <Expand className="h-4 w-4 mr-2" />
                    Tela Cheia
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-white text-red-700 hover:bg-red-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
          </div>
        </div>

        {/* Navegação por Abas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg mb-6">
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-white data-[state=active]:text-red-700 font-bold">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-white data-[state=active]:bg-white data-[state=active]:text-red-700 font-bold">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Mensal
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-white data-[state=active]:bg-white data-[state=active]:text-red-700 font-bold">
              <TrendingUp className="h-4 w-4 mr-2" />
              Semanal
            </TabsTrigger>
            <TabsTrigger value="daily" className="text-white data-[state=active]:bg-white data-[state=active]:text-red-700 font-bold">
              <Eye className="h-4 w-4 mr-2" />
              Diário
            </TabsTrigger>
          </TabsList>

          {/* Dashboard de Agendamentos */}
          <TabsContent value="dashboard" className="space-y-6">
            <AppointmentsDashboard 
              appointments={appointments} 
              clients={clients} 
            />
          </TabsContent>

          {/* Calendário Mensal */}
          <TabsContent value="monthly" className="space-y-6">
            <div className="bg-white rounded-xl shadow-xl border-2 border-red-100/50 backdrop-blur-sm relative overflow-hidden">
              <div className="relative z-10 p-2">
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: calendarHeight }}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  onNavigate={setCurrentDate}
                  onView={handleViewChange}
                  selectable
                  views={['month']}
                  view="month"
                  date={currentDate}
                  messages={messages}
                  culture="pt-BR"
                  components={{
                    event: EventComponent,
                  }}
                  className={cn(
                    "rounded-lg overflow-hidden",
                    isFullscreen ? "calendar-99tattoo-fullscreen" : "calendar-99tattoo-enhanced"
                  )}
                  eventPropGetter={(event) => ({
                    className: cn(
                      "transition-all duration-300 hover:shadow-xl appointment-event-enhanced",
                      event.resource.status === 'confirmed' && "appointment-confirmed",
                      event.resource.status === 'cancelled' && "appointment-cancelled",
                      event.resource.status === 'completed' && "appointment-completed"
                    ),
                  })}
                  dayPropGetter={(date) => ({
                    className: cn(
                      "hover:bg-red-50/60 transition-colors duration-200 cursor-pointer",
                      format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && "bg-red-100/40"
                    ),
                    onClick: () => handleDayStatusClick(date),
                  })}
                  formats={{
                    dayFormat: (date, culture, localizer) =>
                      localizer?.format(date, 'dd', culture) || '',
                    dayHeaderFormat: (date, culture, localizer) =>
                      localizer?.format(date, 'EEEE', culture) || '',
                    monthHeaderFormat: (date, culture, localizer) =>
                      localizer?.format(date, 'MMMM yyyy', culture) || '',
                  }}
                  step={30}
                  timeslots={2}
                  min={new Date(2024, 0, 1, 8, 0)}
                  max={new Date(2024, 0, 1, 20, 0)}
                  popup={true}
                  popupOffset={30}
                />
              </div>
            </div>
          </TabsContent>

          {/* Calendário Semanal Kanban */}
          <TabsContent value="weekly" className="space-y-6">
            <WeeklyAppointmentsKanban
              appointments={appointments}
              clients={clients}
              currentDate={currentDate}
              onReschedule={handleRescheduleAppointment}
              onDayClick={handleDayStatusClick}
            />
          </TabsContent>

          {/* Calendário Diário */}
          <TabsContent value="daily" className="space-y-6">
            <div className="text-center py-8">
              <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-red-600" />
              <h3 className="text-xl font-bold text-red-800 mb-2">Visualização Diária</h3>
              <p className="text-red-600 mb-4">Clique em um dia no calendário mensal ou semanal para ver os detalhes</p>
              <Button
                onClick={() => handleDayStatusClick(new Date())}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Dia de Hoje
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Criar Agendamento */}
      {showCreateForm && (
        <Dialog open={showCreateForm} onOpenChange={handleCloseCreateForm}>
          <DialogContent 
            className="max-w-5xl max-h-[95vh] overflow-auto bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-xl -mx-6 -mt-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-black flex items-center gap-3">
                    <CalendarIcon className="h-6 w-6" />
                    Novo Agendamento
                  </DialogTitle>
                  <p className="text-red-100 text-lg">Preencha os dados para criar um novo agendamento</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCloseCreateForm} 
                  className="text-white hover:bg-white/20 transition-all duration-300"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </DialogHeader>
            
            <AppointmentForm
              selectedSlot={selectedSlot}
              clients={clients}
              onSuccess={handleFormSuccess}
              onClose={handleCloseCreateForm}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Editar Agendamento */}
      <AppointmentEditModal
        appointment={selectedEvent}
        client={selectedClient}
        isOpen={!!selectedEvent}
        onClose={handleCloseEditModal}
        onUpdate={handleEditSuccess}
      />

      {/* Kanban Diário de Agendamentos (Horários) */}
      <DailyAppointmentsKanban
        selectedDate={selectedDayDate}
        appointments={appointments}
        clients={clients}
        onClose={handleCloseDayKanban}
        onReschedule={handleRescheduleAppointment}
      />

      {/* Kanban Diário de Status */}
      <DailyAppointmentStatusKanban
        selectedDate={selectedDayStatusDate}
        appointments={appointments}
        clients={clients}
        onClose={handleCloseDayStatusKanban}
        onStatusChange={handleRescheduleAppointment}
      />
    </div>
  );
};

export default Appointments;
