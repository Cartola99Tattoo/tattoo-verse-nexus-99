
import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Scissors, X, Calendar as CalendarIcon, CheckCircle, Play, Calendar, Timer, Pause, Edit, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, Client } from '@/services/interfaces/IClientService';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DailyAppointmentStatusKanbanProps {
  selectedDate: Date | null;
  appointments: Appointment[];
  clients: Client[];
  onClose: () => void;
  onUpdateAppointmentStatus: (appointmentId: string, newStatus: string) => void;
  onCreateAppointment: (date: Date, timeSlot?: string) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

interface AppointmentTimer {
  id: string;
  startTime: Date;
  isRunning: boolean;
  elapsedTime: number; // em segundos
  totalTime: number; // tempo total acumulado
}

const DraggableAppointmentCard: React.FC<{
  appointment: Appointment;
  client?: Client;
  timer?: AppointmentTimer;
  onStartTimer: (id: string) => void;
  onPauseTimer: (id: string) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}> = ({ appointment, client, timer, onStartTimer, onPauseTimer, onEditAppointment, onDeleteAppointment }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: appointment.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const artist = ['João Silva', 'Maria Santos', 'Pedro Costa'].find((_, index) => 
    ['1', '2', '3'][index] === appointment.artist_id
  );

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'from-blue-600 to-blue-700';
      case 'scheduled': return 'from-blue-500 to-blue-600';
      case 'in_progress': return 'from-orange-600 to-orange-700';
      case 'completed': return 'from-green-600 to-green-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-grab active:cursor-grabbing transform hover:scale-102 group`}
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
          
          {/* Botões de ação - aparecem no hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEditAppointment(appointment);
              }}
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteAppointment(appointment.id);
              }}
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {appointment.service_description && (
          <div className="bg-red-50 p-3 rounded-lg border border-red-200 mb-3">
            <p className="text-sm text-red-600 font-medium">
              {appointment.service_description}
            </p>
          </div>
        )}

        {/* Timer avançado para agendamentos em atendimento */}
        {appointment.status === 'in_progress' && timer && (
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-lg border-2 border-orange-200 mb-3 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-bold text-orange-800">
                  Tempo em Atendimento
                </span>
              </div>
              <div className="flex gap-1">
                {timer.isRunning ? (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPauseTimer(appointment.id);
                    }}
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0 text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    <Pause className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartTimer(appointment.id);
                    }}
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0 text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-orange-700">Tempo Atual:</span>
                <span className="font-mono font-bold text-orange-800 bg-orange-200 px-2 py-1 rounded">
                  {formatTime(timer.elapsedTime)}
                </span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-orange-700">Tempo Total:</span>
                <span className="font-mono font-bold text-orange-800 bg-orange-200 px-2 py-1 rounded">
                  {formatTime(timer.totalTime)}
                </span>
              </div>
              
              {/* Barra de progresso baseada na duração estimada */}
              <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.min((timer.totalTime / (appointment.duration_minutes * 60)) * 100, 100)}%` 
                  }}
                />
              </div>
              <div className="text-xs text-orange-600 text-center">
                {Math.round((timer.totalTime / (appointment.duration_minutes * 60)) * 100)}% do tempo estimado
              </div>
            </div>
          </div>
        )}

        {/* Timer para agendamentos concluídos */}
        {appointment.status === 'completed' && timer && timer.totalTime > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border-2 border-green-200 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-bold text-green-800">
                Tempo Total de Atendimento
              </span>
            </div>
            <div className="text-center">
              <span className="font-mono font-bold text-green-800 bg-green-200 px-3 py-2 rounded text-lg">
                {formatTime(timer.totalTime)}
              </span>
            </div>
            <div className="text-xs text-green-600 text-center mt-1">
              Estimado: {appointment.duration_minutes} min | Real: {Math.round(timer.totalTime / 60)} min
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Badge className={`bg-gradient-to-r ${getStatusColor(appointment.status)} text-white font-bold`}>
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
};

const DailyAppointmentStatusKanban: React.FC<DailyAppointmentStatusKanbanProps> = ({
  selectedDate,
  appointments,
  clients,
  onClose,
  onUpdateAppointmentStatus,
  onCreateAppointment,
  onEditAppointment,
  onDeleteAppointment,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [timers, setTimers] = useState<AppointmentTimer[]>([]);

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

  // Atualizar timers a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => 
        prevTimers.map(timer => 
          timer.isRunning 
            ? { 
                ...timer, 
                elapsedTime: timer.elapsedTime + 1,
                totalTime: timer.totalTime + 1
              }
            : timer
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartTimer = (appointmentId: string) => {
    setTimers(prevTimers => {
      const existingTimer = prevTimers.find(t => t.id === appointmentId);
      if (existingTimer) {
        return prevTimers.map(timer => 
          timer.id === appointmentId 
            ? { ...timer, isRunning: true, startTime: new Date() }
            : timer
        );
      } else {
        return [...prevTimers, {
          id: appointmentId,
          startTime: new Date(),
          isRunning: true,
          elapsedTime: 0,
          totalTime: 0
        }];
      }
    });
  };

  const handlePauseTimer = (appointmentId: string) => {
    setTimers(prevTimers => 
      prevTimers.map(timer => 
        timer.id === appointmentId 
          ? { ...timer, isRunning: false }
          : timer
      )
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const appointmentId = active.id as string;
      const newStatus = over.id as string;
      
      // Se movendo para "Em Atendimento", iniciar timer
      if (newStatus === 'in_progress') {
        handleStartTimer(appointmentId);
      }
      
      // Se movendo de "Em Atendimento" para "Concluído", parar timer
      const appointment = dayAppointments.find(apt => apt.id === appointmentId);
      if (appointment?.status === 'in_progress' && newStatus === 'completed') {
        handlePauseTimer(appointmentId);
      }
      
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
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-white to-red-50 border-red-200">
        <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-xl -mx-6 -mt-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-black flex items-center gap-3">
                <CalendarIcon className="h-6 w-6" />
                Gestão Diária Completa de Agendamentos
              </DialogTitle>
              <p className="text-red-100 font-medium text-lg">
                {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => onCreateAppointment(selectedDate)}
                className="bg-white text-red-700 hover:bg-red-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-auto max-h-[calc(95vh-220px)]">
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <div className="grid grid-cols-3 gap-6 min-w-max">
              {statusColumns.map((column) => (
                <div key={column.id} className="min-w-[350px]">
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
                    
                    <CardContent className="p-4 min-h-[500px]">
                      <SortableContext 
                        items={appointmentsByStatus[column.id]?.map(apt => apt.id) || []} 
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3" id={column.id}>
                          {appointmentsByStatus[column.id]?.map((appointment) => {
                            const client = clients.find(c => c.id === appointment.client_id);
                            const timer = timers.find(t => t.id === appointment.id);
                            
                            return (
                              <DraggableAppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                client={client}
                                timer={timer}
                                onStartTimer={handleStartTimer}
                                onPauseTimer={handlePauseTimer}
                                onEditAppointment={onEditAppointment}
                                onDeleteAppointment={onDeleteAppointment}
                              />
                            );
                          })}
                          
                          {appointmentsByStatus[column.id]?.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                              <column.icon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                              <p className="font-medium">Nenhum agendamento</p>
                              <p className="text-sm text-gray-400">Arraste um agendamento aqui</p>
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

        <div className="flex justify-between items-center pt-4 border-t-2 border-red-200">
          <div className="flex gap-4">
            <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 text-sm font-bold">
              Agendados: {appointmentsByStatus.scheduled?.length || 0}
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 text-sm font-bold">
              Em Atendimento: {appointmentsByStatus.in_progress?.length || 0}
            </Badge>
            <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 text-sm font-bold">
              Concluídos: {appointmentsByStatus.completed?.length || 0}
            </Badge>
          </div>
          
          <Badge className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 text-lg font-bold">
            Total: {dayAppointments.length} agendamentos
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyAppointmentStatusKanban;
