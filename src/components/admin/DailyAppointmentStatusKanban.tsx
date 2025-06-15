
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Scissors, X, Calendar as CalendarIcon, CheckCircle, Play, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, Client } from '@/services/interfaces/IClientService';
import DraggableAppointmentCard from './DraggableAppointmentCard';

interface DailyAppointmentStatusKanbanProps {
  selectedDate: Date | null;
  appointments: Appointment[];
  clients: Client[];
  onClose: () => void;
  onUpdateAppointmentStatus: (appointmentId: string, newStatus: string) => void;
}

const DailyAppointmentStatusKanban: React.FC<DailyAppointmentStatusKanbanProps> = ({
  selectedDate,
  appointments,
  clients,
  onClose,
  onUpdateAppointmentStatus,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Definir as colunas do status do agendamento
  const statusColumns = [
    { 
      id: 'scheduled', 
      title: 'Agendado', 
      icon: Calendar,
      color: 'from-blue-600 to-blue-700',
      description: 'Aguardando início'
    },
    { 
      id: 'in_progress', 
      title: 'Em Atendimento', 
      icon: Play,
      color: 'from-orange-600 to-orange-700',
      description: 'Sessão em andamento'
    },
    { 
      id: 'completed', 
      title: 'Concluído', 
      icon: CheckCircle,
      color: 'from-green-600 to-green-700',
      description: 'Finalizado com sucesso'
    }
  ];

  // Filtrar agendamentos do dia selecionado
  const dayAppointments = appointments.filter(apt => 
    selectedDate && apt.date === format(selectedDate, 'yyyy-MM-dd')
  );

  // Organizar agendamentos por status
  const appointmentsByStatus = statusColumns.reduce((acc, column) => {
    acc[column.id] = dayAppointments.filter(apt => {
      // Mapear status do appointment para as colunas
      switch (column.id) {
        case 'scheduled':
          return apt.status === 'scheduled' || apt.status === 'confirmed';
        case 'in_progress':
          return apt.status === 'in_progress';
        case 'completed':
          return apt.status === 'completed';
        default:
          return false;
      }
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
      const newStatus = over.id as string;
      onUpdateAppointmentStatus(appointmentId, newStatus);
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
        <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-xl -mx-6 -mt-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-black flex items-center gap-3">
                <CalendarIcon className="h-6 w-6" />
                Gestão Diária de Agendamentos
              </DialogTitle>
              <p className="text-red-100 font-medium text-lg">
                {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-auto max-h-[calc(90vh-220px)]">
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <div className="grid grid-cols-3 gap-6 min-w-max">
              {statusColumns.map((column) => (
                <div key={column.id} className="min-w-[300px]">
                  <Card className="h-full bg-white border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className={`bg-gradient-to-r ${column.color} text-white p-4 rounded-t-lg`}>
                      <CardTitle className="text-lg font-bold text-center flex items-center justify-center gap-3">
                        <column.icon className="h-5 w-5" />
                        <div>
                          <div>{column.title}</div>
                          <div className="text-sm opacity-90 font-normal">{column.description}</div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-4 min-h-[400px]">
                      <SortableContext 
                        items={appointmentsByStatus[column.id]?.map(apt => apt.id) || []} 
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {appointmentsByStatus[column.id]?.map((appointment) => {
                            const client = clients.find(c => c.id === appointment.client_id);
                            const artist = ['João Silva', 'Maria Santos', 'Pedro Costa'].find((_, index) => 
                              ['1', '2', '3'][index] === appointment.artist_id
                            );
                            
                            return (
                              <Card 
                                key={appointment.id}
                                className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <User className="h-4 w-4 text-red-600" />
                                        <span className="font-bold text-red-800 text-base">
                                          {client?.name || 'Cliente'}
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-4 w-4 text-red-600" />
                                        <span className="text-sm text-red-700">
                                          {appointment.time} ({appointment.duration_minutes}min)
                                        </span>
                                      </div>
                                      
                                      {artist && (
                                        <div className="flex items-center gap-2 mb-3">
                                          <Scissors className="h-4 w-4 text-red-600" />
                                          <span className="text-sm text-red-700">
                                            {artist}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {appointment.service_description && (
                                    <div className="bg-red-50 p-3 rounded-lg border border-red-200 mb-3">
                                      <p className="text-sm text-red-600 font-medium">
                                        {appointment.service_description}
                                      </p>
                                    </div>
                                  )}

                                  <div className="flex justify-between items-center">
                                    <Badge className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold">
                                      {appointment.service_type === 'tattoo' ? 'Tatuagem' : 
                                       appointment.service_type === 'piercing' ? 'Piercing' : 'Consultoria'}
                                    </Badge>
                                    
                                    {appointment.estimated_price && (
                                      <span className="text-sm font-bold text-green-600">
                                        R$ {appointment.estimated_price}
                                      </span>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                          
                          {appointmentsByStatus[column.id]?.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                              <column.icon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                              <p className="font-medium">Nenhum agendamento</p>
                            </div>
                          )}
                        </div>
                      </SortableContext>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <DragOverlay>
              {activeAppointment && (
                <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-2xl transform rotate-3 scale-105">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-red-600" />
                      <span className="font-bold text-red-800">
                        {clients.find(c => c.id === activeAppointment.client_id)?.name || 'Cliente'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-700">
                        {activeAppointment.time}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </DragOverlay>
          </DndContext>
        </div>

        <div className="flex justify-center pt-4 border-t-2 border-red-200">
          <Badge className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 text-lg font-bold">
            Total: {dayAppointments.length} agendamentos
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyAppointmentStatusKanban;
