
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Scissors, X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, Client } from '@/services/interfaces/IClientService';
import DraggableAppointmentCard from './DraggableAppointmentCard';

interface DailyAppointmentsKanbanProps {
  selectedDate: Date | null;
  appointments: Appointment[];
  clients: Client[];
  onClose: () => void;
  onReschedule: (appointmentId: string, newTime: string) => void;
}

const DailyAppointmentsKanban: React.FC<DailyAppointmentsKanbanProps> = ({
  selectedDate,
  appointments,
  clients,
  onClose,
  onReschedule,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Gerar slots de horário (8:00 - 20:00)
  const timeSlots = [];
  for (let hour = 8; hour <= 19; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  // Filtrar agendamentos do dia selecionado
  const dayAppointments = appointments.filter(apt => 
    selectedDate && apt.date === format(selectedDate, 'yyyy-MM-dd')
  );

  // Organizar agendamentos por horário
  const appointmentsByTime = timeSlots.reduce((acc, time) => {
    acc[time] = dayAppointments.filter(apt => {
      const aptHour = parseInt(apt.time.split(':')[0]);
      const slotHour = parseInt(time.split(':')[0]);
      return aptHour === slotHour;
    });
    return acc;
  }, {} as Record<string, Appointment[]>);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const appointmentId = active.id as string;
      const newTimeSlot = over.id as string;
      onReschedule(appointmentId, newTimeSlot);
    }
    
    setActiveId(null);
  };

  const activeAppointment = activeId 
    ? dayAppointments.find(apt => apt.id === activeId)
    : null;

  if (!selectedDate) return null;

  return (
    <Dialog open={!!selectedDate} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-red-50 border-red-200">
        <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-4 rounded-lg -mx-6 -mt-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-black flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Agendamentos do Dia
              </DialogTitle>
              <p className="text-red-100 font-medium">
                {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-auto max-h-[calc(90vh-200px)]">
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <div className="grid grid-cols-6 gap-3 min-w-max">
              {timeSlots.map((timeSlot) => (
                <div key={timeSlot} className="min-w-[200px]">
                  <Card className="h-full bg-white border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3 rounded-t-lg">
                      <CardTitle className="text-sm font-bold text-center flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        {timeSlot}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-3 min-h-[120px]">
                      <SortableContext items={appointmentsByTime[timeSlot].map(apt => apt.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                          {appointmentsByTime[timeSlot].map((appointment) => {
                            const client = clients.find(c => c.id === appointment.client_id);
                            return (
                              <DraggableAppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                client={client}
                                timeSlot={timeSlot}
                              />
                            );
                          })}
                        </div>
                      </SortableContext>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <DragOverlay>
              {activeAppointment && (
                <DraggableAppointmentCard
                  appointment={activeAppointment}
                  client={clients.find(c => c.id === activeAppointment.client_id)}
                  timeSlot=""
                  isOverlay
                />
              )}
            </DragOverlay>
          </DndContext>
        </div>

        <div className="flex justify-center pt-4 border-t border-red-200">
          <Badge className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2">
            Total: {dayAppointments.length} agendamentos
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyAppointmentsKanban;
