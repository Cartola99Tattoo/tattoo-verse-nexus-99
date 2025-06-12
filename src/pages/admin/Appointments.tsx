
import React, { useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Calendar as CalendarIcon, Users, Clock, MapPin, Sparkles, Expand, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";
import AppointmentForm from "@/components/admin/AppointmentForm";
import AppointmentEditModal from "@/components/admin/AppointmentEditModal";
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

// Mock data para demonstração de um estúdio movimentado
const mockAppointments: Appointment[] = [
  {
    id: '1',
    client_id: '1',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-12',
    time: '09:00',
    duration_minutes: 120,
    status: 'confirmed',
    service_description: 'Tatuagem dragão no braço',
    notes: 'Cliente regular',
    estimated_price: 300,
  },
  {
    id: '2',
    client_id: '2',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-12',
    time: '10:30',
    duration_minutes: 90,
    status: 'scheduled',
    service_description: 'Rosa no ombro',
    notes: 'Primeira sessão',
    estimated_price: 200,
  },
  {
    id: '3',
    client_id: '3',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-12',
    time: '14:00',
    duration_minutes: 180,
    status: 'confirmed',
    service_description: 'Mandala nas costas',
    notes: 'Sessão longa',
    estimated_price: 500,
  },
  {
    id: '4',
    client_id: '4',
    artist_id: '3',
    bed_id: '3',
    date: '2024-12-13',
    time: '11:00',
    duration_minutes: 60,
    status: 'scheduled',
    service_description: 'Retoque em tatuagem',
    notes: 'Cliente antigo',
    estimated_price: 100,
  },
  {
    id: '5',
    client_id: '5',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-13',
    time: '15:30',
    duration_minutes: 150,
    status: 'confirmed',
    service_description: 'Tatuagem tribal',
    notes: 'Design personalizado',
    estimated_price: 400,
  },
  {
    id: '6',
    client_id: '1',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-14',
    time: '09:30',
    duration_minutes: 240,
    status: 'confirmed',
    service_description: 'Sleeve completa',
    notes: 'Sessão 2 de 4',
    estimated_price: 800,
  },
  {
    id: '7',
    client_id: '6',
    artist_id: '3',
    bed_id: '3',
    date: '2024-12-14',
    time: '16:00',
    duration_minutes: 90,
    status: 'scheduled',
    service_description: 'Borboleta colorida',
    notes: 'Primeira tatuagem',
    estimated_price: 250,
  },
];

const mockClients: Client[] = [
  { id: '1', name: 'Ana Silva', email: 'ana@email.com', phone: '(11) 99999-1111' },
  { id: '2', name: 'Bruno Costa', email: 'bruno@email.com', phone: '(11) 99999-2222' },
  { id: '3', name: 'Carla Santos', email: 'carla@email.com', phone: '(11) 99999-3333' },
  { id: '4', name: 'Diego Ferreira', email: 'diego@email.com', phone: '(11) 99999-4444' },
  { id: '5', name: 'Elena Rodrigues', email: 'elena@email.com', phone: '(11) 99999-5555' },
  { id: '6', name: 'Felipe Oliveira', email: 'felipe@email.com', phone: '(11) 99999-6666' },
];

const Appointments = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('month');
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const EventComponent = ({ event }: { event: any }) => {
    const appointment = event.resource;
    const client = clients.find(c => c.id === appointment.client_id);
    const artist = ['João Silva', 'Maria Santos', 'Pedro Costa'].find((_, index) => 
      ['1', '2', '3'][index] === appointment.artist_id
    );

    const firstName = client?.name?.split(' ')[0] || 'Cliente';
    const artistFirstName = artist?.split(' ')[0] || 'Artista';

    return (
      <div className="appointment-card-compact bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white rounded-md shadow-lg border border-red-400 hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        <div className="relative z-10 p-1.5 h-full flex flex-col justify-between text-xs">
          <div className="space-y-0.5">
            <div className="font-bold truncate flex items-center gap-1">
              <Users className="h-2.5 w-2.5 flex-shrink-0" />
              <span className="text-xs">{firstName}</span>
            </div>
            <div className="opacity-90 truncate flex items-center gap-1">
              <Clock className="h-2.5 w-2.5 flex-shrink-0" />
              <span className="text-xs">{appointment.time}</span>
            </div>
          </div>
          <div className="opacity-80 truncate flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 flex-shrink-0" />
            <span className="text-xs">{artistFirstName}</span>
          </div>
        </div>
      </div>
    );
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
    : "p-2 bg-gradient-to-br from-red-50 via-white to-red-50 min-h-screen relative overflow-hidden";

  const calendarHeight = isFullscreen 
    ? 'calc(100vh - 80px)'
    : 'calc(100vh - 120px)';

  return (
    <div className={containerClass}>
      {/* Elementos decorativos de fundo - mais sutis no modo tela cheia */}
      {!isFullscreen && (
        <>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-red-100/10 via-transparent to-transparent rounded-full transform translate-x-24 -translate-y-24"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-100/8 via-transparent to-transparent rounded-full transform -translate-x-16 translate-y-16"></div>
        </>
      )}

      <div className="relative z-10">
        {/* Cabeçalho Ultra Compacto */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-2 rounded-lg shadow-lg mb-1.5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] animate-pulse"></div>
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <div>
                <h1 className="text-base font-black">Calendário de Agendamentos</h1>
                <p className="text-red-100 font-medium text-xs">Gerencie todos os agendamentos do estúdio</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 px-3 py-1.5 h-auto rounded-md font-bold text-xs"
              >
                {isFullscreen ? (
                  <>
                    <Minimize className="h-3 w-3 mr-1" />
                    Sair Tela Cheia
                  </>
                ) : (
                  <>
                    <Expand className="h-3 w-3 mr-1" />
                    Tela Cheia
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-white text-red-700 hover:bg-red-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-3 py-1.5 h-auto rounded-md font-bold text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Novo Agendamento
              </Button>
            </div>
          </div>
        </div>

        {/* Calendário Principal Maximizado */}
        <div className="bg-white rounded-lg shadow-lg border border-red-100/50 backdrop-blur-sm relative overflow-hidden">
          <div className="relative z-10 p-1">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: calendarHeight }}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              views={['month', 'week', 'day', 'agenda']}
              view={currentView}
              onView={handleViewChange}
              date={currentDate}
              onNavigate={setCurrentDate}
              messages={messages}
              culture="pt-BR"
              components={{
                event: EventComponent,
              }}
              className={cn(
                "rounded-lg overflow-hidden",
                isFullscreen ? "calendar-99tattoo-fullscreen" : "calendar-99tattoo-maximized"
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
                  "hover:bg-red-50/60 transition-colors duration-200",
                  format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && "bg-red-100/40"
                ),
              })}
              formats={{
                dayFormat: (date, culture, localizer) =>
                  localizer?.format(date, 'dd', culture) || '',
                dayHeaderFormat: (date, culture, localizer) =>
                  localizer?.format(date, 'EEEE', culture) || '',
                monthHeaderFormat: (date, culture, localizer) =>
                  localizer?.format(date, 'MMMM yyyy', culture) || '',
                agendaDateFormat: (date, culture, localizer) =>
                  localizer?.format(date, 'dd/MM', culture) || '',
                agendaTimeFormat: (date, culture, localizer) =>
                  localizer?.format(date, 'HH:mm', culture) || '',
                timeGutterFormat: (date, culture, localizer) =>
                  localizer?.format(date, 'HH:mm', culture) || '',
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
      </div>

      {/* Modal Criar Agendamento */}
      {showCreateForm && (
        <AppointmentForm
          selectedSlot={selectedSlot}
          clients={clients}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Modal Editar Agendamento */}
      <AppointmentEditModal
        appointment={selectedEvent}
        client={selectedClient}
        isOpen={!!selectedEvent}
        onClose={handleCloseEditModal}
        onUpdate={handleEditSuccess}
      />
    </div>
  );
};

export default Appointments;
