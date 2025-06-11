
import React, { useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Calendar as CalendarIcon, Users, Clock, MapPin, Sparkles } from "lucide-react";
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

const Appointments = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('month');

  const queryClient = useQueryClient();
  const clientService = getClientService();

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => clientService.fetchUpcomingAppointments(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.fetchClients(),
  });

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

  const EventComponent = ({ event }: { event: any }) => {
    const appointment = event.resource;
    const client = clients.find(c => c.id === appointment.client_id);
    const artist = ['João Silva', 'Maria Santos', 'Pedro Costa'].find((_, index) => 
      ['1', '2', '3'][index] === appointment.artist_id
    );

    return (
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-1 rounded-md shadow-lg border border-red-300 hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        <div className="relative z-10">
          <div className="text-xs font-bold truncate flex items-center gap-1">
            <Users className="h-3 w-3 flex-shrink-0" />
            {client?.name || 'Cliente'}
          </div>
          <div className="text-xs opacity-90 truncate flex items-center gap-1">
            <Clock className="h-3 w-3 flex-shrink-0" />
            {appointment.time} ({appointment.duration_minutes}min)
          </div>
          <div className="text-xs opacity-80 truncate flex items-center gap-1">
            <Sparkles className="h-3 w-3 flex-shrink-0" />
            {artist || 'Artista'}
          </div>
          {appointment.bed_id && (
            <div className="text-xs opacity-70 truncate flex items-center gap-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              Maca
            </div>
          )}
        </div>
      </div>
    );
  };

  // Mensagens completamente em português brasileiro
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

  if (appointmentsLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-red-50 via-white to-red-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-red-50 via-white to-red-50 min-h-screen relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-100/20 via-transparent to-transparent rounded-full transform translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-red-100/15 via-transparent to-transparent rounded-full transform -translate-x-32 translate-y-32"></div>

      <div className="relative z-10">
        {/* Cabeçalho Otimizado */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-2xl shadow-2xl mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] animate-pulse"></div>
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                <CalendarIcon className="h-8 w-8" />
                Calendário de Agendamentos
              </h1>
              <p className="text-red-100 font-semibold">Gerencie todos os agendamentos do estúdio</p>
            </div>
            
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-red-700 hover:bg-red-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-6 py-3 h-auto rounded-xl font-bold relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-100/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Plus className="h-5 w-5 mr-2" />
              Novo Agendamento
            </Button>
          </div>
        </div>

        {/* Calendário Principal */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-100/50 p-6 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-50/30 via-transparent to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
          
          <div className="relative z-10">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 700 }}
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
              className="rounded-lg overflow-hidden calendar-99tattoo"
              eventPropGetter={(event) => ({
                className: cn(
                  "transition-all duration-300 hover:shadow-lg",
                  event.resource.status === 'confirmed' && "bg-green-600",
                  event.resource.status === 'cancelled' && "bg-gray-500",
                  event.resource.status === 'completed' && "bg-emerald-600"
                ),
              })}
              dayPropGetter={(date) => ({
                className: cn(
                  "hover:bg-red-50/50 transition-colors duration-200",
                  format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && "bg-red-100/30"
                ),
              })}
            />
          </div>
        </div>
      </div>

      {/* Modal Criar Agendamento - CORRIGIDO */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-white border-2 border-red-200 shadow-2xl rounded-2xl p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Criar Novo Agendamento</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            selectedSlot={selectedSlot}
            clients={clients}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>

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
