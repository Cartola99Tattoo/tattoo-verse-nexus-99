
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, X, Calendar as CalendarIcon, Play, CheckCircle, AlertCircle, Timer, Edit, Trash2, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, Client } from '@/services/interfaces/IClientService';

interface StudioDayByDayEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  appointments: Appointment[];
  clients: Client[];
  onStatusChange: (appointmentId: string, newStatus: 'scheduled' | 'in_progress' | 'completed') => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

// Timeline para horários
const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];

// Card de agendamento arrastável
interface DraggableAppointmentCardProps {
  appointment: Appointment;
  client?: Client;
  isOverlay?: boolean;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}

const DraggableAppointmentCard: React.FC<DraggableAppointmentCardProps> = ({ 
  appointment, 
  client, 
  isOverlay = false,
  onEdit,
  onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: appointment.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const serviceTypes = {
    tattoo: { icon: '🎨', name: 'Tattoo', color: 'bg-red-500' },
    piercing: { icon: '⚡', name: 'Piercing', color: 'bg-blue-500' },
    consultation: { icon: '💬', name: 'Consulta', color: 'bg-green-500' },
  };

  const statusConfig = {
    scheduled: { name: 'Agendado', color: 'bg-orange-500' },
    confirmed: { name: 'Confirmado', color: 'bg-blue-500' },
    in_progress: { name: 'Em Andamento', color: 'bg-purple-500' },
    completed: { name: 'Concluído', color: 'bg-green-500' },
  };

  const serviceConfig = serviceTypes[appointment.service_type as keyof typeof serviceTypes] || serviceTypes.tattoo;
  const statusInfo = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.scheduled;

  const [timeElapsed, setTimeElapsed] = useState(0);

  // Simular cronômetro para agendamentos em andamento
  React.useEffect(() => {
    if (appointment.status === 'in_progress') {
      const interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [appointment.status]);

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative bg-white rounded-xl border-2 border-gray-200 p-4 shadow-lg hover:shadow-xl 
        transition-all duration-300 cursor-grab active:cursor-grabbing group
        ${isDragging ? 'opacity-70 scale-105 rotate-2 z-50' : ''}
        ${isOverlay ? 'scale-110 shadow-2xl ring-2 ring-red-300 z-50' : ''}
        hover:scale-[1.02] hover:border-red-300
      `}
    >
      {/* Header do Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusInfo.color}`} />
          <span className="text-lg font-black text-gray-800">
            {client?.name || 'Cliente'}
          </span>
          <span className="text-lg">{serviceConfig.icon}</span>
        </div>
        
        {/* Botões de ação */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(appointment);
            }}
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(appointment.id);
            }}
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0 border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Informações do Agendamento */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-600" />
          <span className="font-bold text-gray-700">
            {appointment.time} ({appointment.duration_minutes}min)
          </span>
        </div>

        <div className="text-sm text-gray-600 font-medium">
          {appointment.service_description}
        </div>

        {appointment.estimated_price && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-bold text-green-700">
              R$ {appointment.estimated_price.toLocaleString()}
            </span>
          </div>
        )}

        {/* Cronômetro para agendamentos em andamento */}
        {appointment.status === 'in_progress' && (
          <div className="bg-purple-50 border border-purple-200 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-purple-600 animate-pulse" />
              <span className="font-mono font-bold text-purple-700">
                {formatElapsedTime(timeElapsed)}
              </span>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <Badge className={`${statusInfo.color} text-white font-bold text-xs`}>
          {statusInfo.name}
        </Badge>
      </div>
    </div>
  );
};

// Coluna do Kanban
interface KanbanColumnProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  appointments: Appointment[];
  clients: Client[];
  bgColor: string;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  id, 
  title, 
  icon, 
  appointments, 
  clients, 
  bgColor,
  onEdit,
  onDelete 
}) => {
  return (
    <div className="flex-1 min-h-[600px]">
      <Card className={`h-full border-2 shadow-xl ${bgColor}`}>
        <CardHeader className={`p-4 text-white ${bgColor.replace('bg-', 'bg-').replace('-50', '-600')}`}>
          <CardTitle className="flex items-center gap-3 text-center justify-center">
            {icon}
            <span className="font-black text-lg">{title}</span>
            <Badge className="bg-white/20 text-white font-bold">
              {appointments.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4">
          <SortableContext items={appointments.map(apt => apt.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4 min-h-[500px]" id={id}>
              {appointments.map((appointment) => {
                const client = clients.find(c => c.id === appointment.client_id);
                return (
                  <DraggableAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    client={client}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                );
              })}
              
              {appointments.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-4 opacity-30">{icon}</div>
                  <p className="font-medium">Nenhum agendamento</p>
                  <p className="text-sm text-gray-500 mt-1">Arraste cards para cá</p>
                </div>
              )}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
};

const StudioDayByDayEnhanced: React.FC<StudioDayByDayEnhancedProps> = ({
  isOpen,
  onClose,
  selectedDate,
  appointments,
  clients,
  onStatusChange,
  onEditAppointment,
  onDeleteAppointment,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Filtrar agendamentos do dia selecionado
  const dayAppointments = appointments.filter(apt => 
    apt.date === format(selectedDate, 'yyyy-MM-dd')
  );

  // Organizar agendamentos por status
  const scheduledAppointments = dayAppointments.filter(apt => 
    apt.status === 'scheduled' || apt.status === 'confirmed'
  );
  const inProgressAppointments = dayAppointments.filter(apt => 
    apt.status === 'in_progress'
  );
  const completedAppointments = dayAppointments.filter(apt => 
    apt.status === 'completed'
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const appointmentId = active.id as string;
      const newColumn = over.id as string;
      
      let newStatus: 'scheduled' | 'in_progress' | 'completed';
      if (newColumn === 'scheduled') {
        newStatus = 'scheduled';
      } else if (newColumn === 'in_progress') {
        newStatus = 'in_progress';
      } else {
        newStatus = 'completed';
      }
      
      onStatusChange(appointmentId, newStatus);
    }
    
    setActiveId(null);
  };

  const activeAppointment = activeId 
    ? dayAppointments.find(apt => apt.id === activeId)
    : null;

  // Calcular estatísticas do dia
  const dayStats = {
    total: dayAppointments.length,
    revenue: dayAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0),
    scheduled: scheduledAppointments.length,
    inProgress: inProgressAppointments.length,
    completed: completedAppointments.length,
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden bg-gradient-to-br from-white to-red-50 border-red-200">
        <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-lg -mx-6 -mt-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-black flex items-center gap-3">
                <CalendarIcon className="h-6 w-6" />
                Dia a Dia do Estúdio
              </DialogTitle>
              <p className="text-red-100 font-medium text-lg">
                {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
            
            {/* Estatísticas do Cabeçalho */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-black">{dayStats.total}</div>
                <div className="text-red-100 text-sm font-bold">Total</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black">R$ {dayStats.revenue.toLocaleString()}</div>
                <div className="text-red-100 text-sm font-bold">Receita</div>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Timeline Lateral */}
        <div className="flex gap-6 overflow-auto max-h-[calc(95vh-250px)]">
          {/* Timeline de Horários */}
          <div className="w-20 flex-shrink-0">
            <div className="bg-gray-100 p-3 rounded-lg h-full">
              <h3 className="text-xs font-bold text-gray-600 mb-4 text-center">Horários</h3>
              <div className="space-y-3">
                {timeSlots.map((time) => (
                  <div key={time} className="text-center">
                    <div className="text-xs font-bold text-gray-700 bg-white p-1 rounded border">
                      {time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kanban de 3 Colunas */}
          <div className="flex-1">
            <DndContext
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              collisionDetection={closestCorners}
            >
              <div className="flex gap-6 h-full">
                <KanbanColumn
                  id="scheduled"
                  title="Agendados"
                  icon={<AlertCircle className="h-6 w-6" />}
                  appointments={scheduledAppointments}
                  clients={clients}
                  bgColor="bg-orange-50 border-orange-200"
                  onEdit={onEditAppointment}
                  onDelete={onDeleteAppointment}
                />
                
                <KanbanColumn
                  id="in_progress"
                  title="Em Andamento"
                  icon={<Play className="h-6 w-6" />}
                  appointments={inProgressAppointments}
                  clients={clients}
                  bgColor="bg-purple-50 border-purple-200"
                  onEdit={onEditAppointment}
                  onDelete={onDeleteAppointment}
                />
                
                <KanbanColumn
                  id="completed"
                  title="Atendimento Realizado"
                  icon={<CheckCircle className="h-6 w-6" />}
                  appointments={completedAppointments}
                  clients={clients}
                  bgColor="bg-green-50 border-green-200"
                  onEdit={onEditAppointment}
                  onDelete={onDeleteAppointment}
                />
              </div>

              <DragOverlay>
                {activeAppointment && (
                  <DraggableAppointmentCard
                    appointment={activeAppointment}
                    client={clients.find(c => c.id === activeAppointment.client_id)}
                    isOverlay
                    onEdit={onEditAppointment}
                    onDelete={onDeleteAppointment}
                  />
                )}
              </DragOverlay>
            </DndContext>
          </div>
        </div>

        {/* Footer com Resumo */}
        <div className="flex justify-center gap-6 pt-4 border-t border-red-200 mt-4">
          <Badge className="bg-orange-500 text-white px-4 py-2">
            Agendados: {dayStats.scheduled}
          </Badge>
          <Badge className="bg-purple-500 text-white px-4 py-2">
            Em Andamento: {dayStats.inProgress}
          </Badge>
          <Badge className="bg-green-500 text-white px-4 py-2">
            Concluídos: {dayStats.completed}
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudioDayByDayEnhanced;
