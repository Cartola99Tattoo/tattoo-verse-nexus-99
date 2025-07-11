import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, X, Calendar as CalendarIcon, Play, CheckCircle, AlertCircle, Timer, Edit, Trash2, DollarSign, TrendingUp, Users, CalendarDays, MapPin, Zap } from 'lucide-react';
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

// Timeline expandida com intervalos de 30 minutos
const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00'
];

// Card de agendamento aprimorado
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
    tattoo: { icon: '🎨', name: 'Tattoo', color: 'bg-red-500', bgLight: 'bg-red-50', border: 'border-red-200' },
    piercing: { icon: '⚡', name: 'Piercing', color: 'bg-blue-500', bgLight: 'bg-blue-50', border: 'border-blue-200' },
    consultation: { icon: '💬', name: 'Consulta', color: 'bg-green-500', bgLight: 'bg-green-50', border: 'border-green-200' },
  };

  const statusConfig = {
    scheduled: { name: 'Agendado', color: 'bg-orange-500', icon: <AlertCircle className="h-3 w-3" /> },
    confirmed: { name: 'Confirmado', color: 'bg-blue-500', icon: <CheckCircle className="h-3 w-3" /> },
    in_progress: { name: 'Em Andamento', color: 'bg-purple-500', icon: <Play className="h-3 w-3" /> },
    completed: { name: 'Concluído', color: 'bg-green-500', icon: <CheckCircle className="h-3 w-3" /> },
  };

  const serviceConfig = serviceTypes[appointment.service_type as keyof typeof serviceTypes] || serviceTypes.tattoo;
  const statusInfo = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.scheduled;

  const [timeElapsed, setTimeElapsed] = useState(0);

  // Cronômetro aprimorado para agendamentos em andamento
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (appointment.status === 'in_progress') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      setTimeElapsed(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [appointment.status]);

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Artistas mockados
  const artists = [
    { id: '1', name: 'João Silva', emoji: '🎨' },
    { id: '2', name: 'Maria Santos', emoji: '✨' },
    { id: '3', name: 'Pedro Costa', emoji: '🔥' },
    { id: '4', name: 'Ana Oliveira', emoji: '💫' },
    { id: '5', name: 'Carlos Mendes', emoji: '⚡' },
  ];

  const artist = artists.find(a => a.id === appointment.artist_id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative bg-gradient-to-br from-white via-red-50/30 to-white rounded-xl border-2 
        ${serviceConfig.border} ${serviceConfig.bgLight} p-3 shadow-lg hover:shadow-xl 
        transition-all duration-300 cursor-grab active:cursor-grabbing group
        ${isDragging ? 'opacity-60 scale-105 rotate-2 z-50 shadow-2xl ring-2 ring-red-300' : ''}
        ${isOverlay ? 'scale-110 shadow-2xl ring-4 ring-red-400 z-50 rotate-3' : ''}
        hover:scale-[1.02] hover:border-red-400 hover:shadow-2xl transform
      `}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      
      {/* Header do Card */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusInfo.color} animate-pulse shadow-lg`} />
          <span className="text-sm font-black text-gray-800 flex items-center gap-1">
            <User className="h-3 w-3 text-red-600" />
            {client?.name || 'Cliente'}
          </span>
          <span className="text-base">{serviceConfig.icon}</span>
        </div>
        
        {/* Botões de ação aprimorados */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(appointment);
            }}
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 transform hover:scale-110"
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
            className="h-6 w-6 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200 transform hover:scale-110"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Informações do Agendamento */}
      <div className="space-y-2 relative z-10">
        {/* Horário e Duração */}
        <div className="flex items-center gap-2 bg-white/60 p-2 rounded-lg border border-red-100">
          <Clock className="h-3 w-3 text-red-600" />
          <span className="font-bold text-red-700 text-xs">
            {appointment.time} ({appointment.duration_minutes}min)
          </span>
        </div>

        {/* Artista */}
        {artist && (
          <div className="flex items-center gap-2 bg-white/60 p-2 rounded-lg border border-red-100">
            <span className="text-sm">{artist.emoji}</span>
            <span className="font-bold text-gray-700 text-xs">
              {artist.name.split(' ')[0]}
            </span>
          </div>
        )}

        {/* Descrição do Serviço */}
        <div className="text-xs text-gray-700 font-medium line-clamp-2 bg-gradient-to-r from-red-50 to-white p-2 rounded-lg border border-red-100">
          {appointment.service_description}
        </div>

        {/* Preço */}
        {appointment.estimated_price && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-white p-2 rounded-lg border border-green-200">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="font-black text-green-700 text-xs">
              R$ {appointment.estimated_price.toLocaleString()}
            </span>
          </div>
        )}

        {/* Cronômetro para agendamentos em andamento - APRIMORADO */}
        {appointment.status === 'in_progress' && (
          <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white p-3 rounded-xl shadow-lg border-2 border-purple-300 relative overflow-hidden">
            {/* Animação de fundo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            
            <div className="flex items-center gap-2 relative z-10">
              <Timer className="h-4 w-4 text-white animate-spin" />
              <span className="font-mono font-black text-white text-sm">
                {formatElapsedTime(timeElapsed)}
              </span>
            </div>
            
            <div className="text-purple-100 font-bold text-xs mt-1 relative z-10">
              ⏰ EM ATENDIMENTO
            </div>
          </div>
        )}

        {/* Status Badge Aprimorado */}
        <div className="flex items-center gap-1">
          <Badge className={`${statusInfo.color} text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1`}>
            {statusInfo.icon}
            {statusInfo.name}
          </Badge>
        </div>
      </div>
    </div>
  );
};

// Coluna do Kanban aprimorada
interface KanbanColumnProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  appointments: Appointment[];
  clients: Client[];
  bgColor: string;
  headerColor: string;
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
  headerColor,
  onEdit,
  onDelete 
}) => {
  return (
    <div className="flex-1 min-h-[600px]">
      <Card className={`h-full border-2 shadow-xl hover:shadow-2xl transition-all duration-300 ${bgColor}`}>
        <CardHeader className={`p-4 text-white ${headerColor} rounded-t-lg relative overflow-hidden`}>
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"></div>
          
          <CardTitle className="flex items-center gap-3 text-center justify-center relative z-10">
            <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
              {icon}
            </div>
            <span className="font-black text-base">{title}</span>
            <Badge className="bg-white/30 text-white font-black text-sm px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
              {appointments.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-3">
          <SortableContext items={appointments.map(apt => apt.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3 min-h-[500px]" id={id}>
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
                  <div className="text-4xl mb-3 opacity-30">{icon}</div>
                  <p className="font-bold text-base">Nenhum agendamento</p>
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

  // Calcular estatísticas do dia aprimoradas
  const dayStats = {
    total: dayAppointments.length,
    revenue: dayAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0),
    scheduled: scheduledAppointments.length,
    inProgress: inProgressAppointments.length,
    completed: completedAppointments.length,
    averagePrice: dayAppointments.length > 0 ? dayAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0) / dayAppointments.length : 0,
    totalDuration: dayAppointments.reduce((sum, apt) => sum + apt.duration_minutes, 0),
  };

  // Renderizar como componente integrado se isOpen for true e não como modal
  const content = (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-4 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-8 translate-y-8"></div>
        
        <div className="relative z-10">
          <h2 className="text-xl font-black flex items-center gap-3 mb-1">
            <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
              <CalendarIcon className="h-5 w-5" />
            </div>
            🏢 Cronograma Detalhado do Dia
          </h2>
          <p className="text-red-100 font-bold text-base">
            {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>

      {/* Dashboard de Resumo do Dia */}
      <div className="bg-gradient-to-br from-white via-red-50/50 to-white rounded-2xl shadow-2xl border-2 border-red-200/50 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/20 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-100/30 rounded-full transform -translate-x-12 translate-y-12"></div>
        
        <h3 className="text-lg font-black text-red-800 mb-3 flex items-center gap-3 relative z-10">
          <TrendingUp className="h-5 w-5" />
          📊 Dashboard do Dia
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 relative z-10">
          <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-3 rounded-xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <CalendarDays className="h-5 w-5 text-white/80" />
              <div className="text-2xl font-black">{dayStats.total}</div>
            </div>
            <div className="text-red-100 font-black text-xs uppercase tracking-wide relative z-10">
              📅 TOTAL AGENDAMENTOS
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 p-3 rounded-xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <DollarSign className="h-5 w-5 text-white/80" />
              <div className="text-lg font-black">R$ {dayStats.revenue.toLocaleString()}</div>
            </div>
            <div className="text-green-100 font-black text-xs uppercase tracking-wide relative z-10">
              💰 RECEITA DO DIA
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 p-3 rounded-xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <Play className="h-5 w-5 text-white/80 animate-pulse" />
              <div className="text-2xl font-black">{dayStats.inProgress}</div>
            </div>
            <div className="text-purple-100 font-black text-xs uppercase tracking-wide relative z-10">
              ⚡ EM ANDAMENTO
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-3 rounded-xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <CheckCircle className="h-5 w-5 text-white/80" />
              <div className="text-2xl font-black">{dayStats.completed}</div>
            </div>
            <div className="text-blue-100 font-black text-xs uppercase tracking-wide relative z-10">
              ✅ CONCLUÍDOS
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div className="bg-orange-50 border-2 border-orange-200 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-lg font-black text-orange-800">{dayStats.totalDuration}min</div>
                <div className="text-orange-600 font-bold text-xs">⏰ Tempo Total</div>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 border-2 border-indigo-200 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <div>
                <div className="text-lg font-black text-indigo-800">R$ {dayStats.averagePrice.toFixed(0)}</div>
                <div className="text-indigo-600 font-bold text-xs">💎 Ticket Médio</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Lateral e Kanban de 3 Colunas */}
      <div className="flex gap-4 overflow-auto">
        {/* Timeline de Horários */}
        <div className="w-20 flex-shrink-0">
          <div className="bg-gradient-to-b from-red-600 via-red-700 to-red-800 p-3 rounded-xl h-full shadow-xl text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            
            <h3 className="text-xs font-black text-center mb-3 relative z-10">⏰ HORÁRIOS</h3>
            <div className="space-y-2 relative z-10">
              {timeSlots.map((time) => (
                <div key={time} className="text-center">
                  <div className="text-xs font-black text-white bg-white/20 p-1.5 rounded-lg border border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
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
            <div className="flex gap-4 h-full">
              <KanbanColumn
                id="scheduled"
                title="📋 Agendados"
                icon={<AlertCircle className="h-5 w-5" />}
                appointments={scheduledAppointments}
                clients={clients}
                bgColor="bg-gradient-to-b from-orange-50 to-white border-orange-300"
                headerColor="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700"
                onEdit={onEditAppointment}
                onDelete={onDeleteAppointment}
              />
              
              <KanbanColumn
                id="in_progress"
                title="⚡ Em Andamento"
                icon={<Play className="h-5 w-5" />}
                appointments={inProgressAppointments}
                clients={clients}
                bgColor="bg-gradient-to-b from-purple-50 to-white border-purple-300"
                headerColor="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700"
                onEdit={onEditAppointment}
                onDelete={onDeleteAppointment}
              />
              
              <KanbanColumn
                id="completed"
                title="✅ Atendimento Realizado"
                icon={<CheckCircle className="h-5 w-5" />}
                appointments={completedAppointments}
                clients={clients}
                bgColor="bg-gradient-to-b from-green-50 to-white border-green-300"
                headerColor="bg-gradient-to-r from-green-500 via-green-600 to-green-700"
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
      <div className="flex justify-center gap-3 pt-3 border-t-2 border-red-200 bg-gradient-to-r from-red-50 via-white to-red-50 rounded-lg p-3">
        <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 text-sm font-black rounded-full shadow-lg">
          📋 Agendados: {dayStats.scheduled}
        </Badge>
        <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 text-sm font-black rounded-full shadow-lg">
          ⚡ Em Andamento: {dayStats.inProgress}
        </Badge>
        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-black rounded-full shadow-lg">
          ✅ Concluídos: {dayStats.completed}
        </Badge>
      </div>
    </div>
  );

  // Se não estiver aberto, não renderizar nada
  if (!isOpen) return null;

  // Renderizar como componente integrado (não modal)
  return content;
};

export default StudioDayByDayEnhanced;
