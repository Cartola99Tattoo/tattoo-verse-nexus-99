
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Bed } from "lucide-react";
import { Appointment } from "@/services/interfaces/IClientService";
import QuickAppointmentForm from "./QuickAppointmentForm";

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

interface AppointmentCalendarProps {
  appointments: Appointment[];
  clients: any[];
  onAppointmentCreated: () => void;
}

const AppointmentCalendar = ({ appointments, clients, onAppointmentCreated }: AppointmentCalendarProps) => {
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Converter appointments para eventos do calendário
  const calendarEvents = appointments.map(appointment => {
    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate.getTime() + appointment.duration_minutes * 60000);
    
    return {
      id: appointment.id,
      title: `${appointment.service_type} - ${appointment.client_id}`,
      start: startDate,
      end: endDate,
      resource: appointment
    };
  });

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setIsFormOpen(true);
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.resource);
  };

  const checkConflicts = (appointmentData: {
    artist_id: string;
    bed_id?: string;
    date: string;
    time: string;
    duration_minutes: number;
  }) => {
    return appointments.filter(existing => {
      const existingStart = new Date(`${existing.date}T${existing.time}`);
      const existingEnd = new Date(existingStart.getTime() + existing.duration_minutes * 60000);
      
      const newStart = new Date(`${appointmentData.date}T${appointmentData.time}`);
      const newEnd = new Date(newStart.getTime() + appointmentData.duration_minutes * 60000);
      
      // Verifica sobreposição de horários
      const hasTimeConflict = (newStart < existingEnd && newEnd > existingStart);
      
      if (!hasTimeConflict) return false;
      
      // Verifica conflito de artista
      if (existing.artist_id === appointmentData.artist_id) return true;
      
      // Verifica conflito de maca
      if (appointmentData.bed_id && existing.bed_id === appointmentData.bed_id) return true;
      
      return false;
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: "#3B82F6",
      confirmed: "#10B981",
      in_progress: "#F59E0B",
      completed: "#6B7280",
      cancelled: "#EF4444",
      no_show: "#8B5CF6"
    };
    return colors[status as keyof typeof colors] || "#6B7280";
  };

  const eventStyleGetter = (event: any) => {
    const status = event.resource.status;
    return {
      style: {
        backgroundColor: getStatusColor(status),
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block"
      }
    };
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Calendário de Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: "600px" }}>
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              views={["month", "week", "day"]}
              defaultView="week"
              step={30}
              timeslots={2}
              min={new Date(0, 0, 0, 8, 0, 0)}
              max={new Date(0, 0, 0, 20, 0, 0)}
              eventPropGetter={eventStyleGetter}
              messages={{
                next: "Próximo",
                previous: "Anterior",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "Não há eventos neste período",
                showMore: (total) => `+ Ver mais (${total})`
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialog para novo agendamento */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
          </DialogHeader>
          <QuickAppointmentForm
            selectedSlot={selectedSlot}
            clients={clients}
            onSuccess={() => {
              setIsFormOpen(false);
              onAppointmentCreated();
            }}
            onConflict={(message) => {
              console.error("Conflito:", message);
            }}
            checkConflicts={checkConflicts}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para visualizar agendamento existente */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge style={{ backgroundColor: getStatusColor(selectedEvent.status) }}>
                  {selectedEvent.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Cliente: {selectedEvent.client_id}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Duração: {selectedEvent.duration_minutes}min</span>
                </div>
                
                {selectedEvent.bed_id && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-gray-500" />
                    <span>Maca: {selectedEvent.bed_id}</span>
                  </div>
                )}
              </div>
              
              {selectedEvent.notes && (
                <div>
                  <h4 className="font-medium mb-2">Observações:</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentCalendar;
