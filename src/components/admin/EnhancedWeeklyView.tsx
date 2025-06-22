
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, User, ChevronLeft, ChevronRight, Plus, Eye } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, Client } from '@/services/interfaces/IClientService';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EnhancedWeeklyViewProps {
  appointments: Appointment[];
  clients: Client[];
  currentDate: Date;
  onReschedule: (appointmentId: string, newDate: string) => void;
  onDayClick: (date: Date) => void;
  onCreateAppointment: (date: Date) => void;
}

// Componente de bloco de agendamento visual
const VisualAppointmentBlock: React.FC<{
  appointment: Appointment;
  client?: Client;
  isOverlay?: boolean;
}> = ({ appointment, client, isOverlay = false }) => {
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

  // Mockup dos artistas com cores
  const artists = [
    { id: '1', name: 'João Silva', color: 'from-red-500 to-red-600', border: 'border-red-400' },
    { id: '2', name: 'Maria Santos', color: 'from-blue-500 to-blue-600', border: 'border-blue-400' },
    { id: '3', name: 'Pedro Costa', color: 'from-green-500 to-green-600', border: 'border-green-400' },
    { id: '4', name: 'Ana Oliveira', color: 'from-purple-500 to-purple-600', border: 'border-purple-400' },
    { id: '5', name: 'Carlos Mendes', color: 'from-yellow-500 to-yellow-600', border: 'border-yellow-400' },
  ];

  const artist = artists.find(a => a.id === appointment.artist_id) || artists[0];
  const duration = appointment.duration_minutes || 60;
  const height = Math.max(40, (duration / 30) * 20); // Altura baseada na duração

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, height: `${height}px` }}
      className={`
        relative rounded-lg border-2 ${artist.border} shadow-lg hover:shadow-xl
        bg-gradient-to-br ${artist.color} text-white
        transition-all duration-300 cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 rotate-1 scale-105' : ''}
        ${isOverlay ? 'rotate-2 scale-110 shadow-2xl' : ''}
        overflow-hidden group
      `}
      {...attributes}
      {...listeners}
    >
      {/* Linha do tempo vertical */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30"></div>
      
      <div className="p-2 h-full flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="text-xs font-bold">{appointment.time}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="text-xs font-medium truncate">
              {client?.name?.split(' ')[0] || 'Cliente'}
            </span>
          </div>
        </div>

        {appointment.service_description && (
          <div className="text-xs opacity-90 line-clamp-1">
            {appointment.service_description}
          </div>
        )}

        {/* Indicador de duração */}
        <div className="text-xs opacity-75 font-medium">
          {duration}min
        </div>

        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

const EnhancedWeeklyView: React.FC<EnhancedWeeklyViewProps> = ({
  appointments,
  clients,
  currentDate,
  onReschedule,
  onDayClick,
  onCreateAppointment,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [weekDate, setWeekDate] = useState(currentDate);

  const weekStart = startOfWeek(weekDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(weekDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Filtrar agendamentos da semana atual
  const weekAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= weekStart && aptDate <= weekEnd;
  });

  // Organizar agendamentos por dia
  const appointmentsByDay = weekDays.reduce((acc, day) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    acc[dayKey] = weekAppointments
      .filter(apt => apt.date === dayKey)
      .sort((a, b) => a.time.localeCompare(b.time));
    return acc;
  }, {} as Record<string, Appointment[]>);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const appointmentId = active.id as string;
      const newDate = over.id as string;
      onReschedule(appointmentId, newDate);
    }
    
    setActiveId(null);
  };

  const activeAppointment = activeId 
    ? weekAppointments.find(apt => apt.id === activeId)
    : null;

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setWeekDate(subWeeks(weekDate, 1));
    } else {
      setWeekDate(addWeeks(weekDate, 1));
    }
  };

  const getDayStats = (dayKey: string) => {
    const dayAppts = appointmentsByDay[dayKey] || [];
    return {
      count: dayAppts.length,
      revenue: dayAppts.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0),
      duration: dayAppts.reduce((sum, apt) => sum + (apt.duration_minutes || 60), 0)
    };
  };

  return (
    <div className="space-y-6">
      {/* Header de Navegação */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigateWeek('prev')}
            variant="ghost"
            className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-2xl font-black">
              {format(weekStart, "dd 'de' MMMM", { locale: ptBR })} - {format(weekEnd, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
            <p className="text-red-100 font-medium">Visualização Semanal Gráfica e Fluida</p>
          </div>
          
          <Button
            onClick={() => navigateWeek('next')}
            variant="ghost"
            className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Kanban Semanal */}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayAppointments = appointmentsByDay[dayKey] || [];
            const isToday = isSameDay(day, new Date());
            const stats = getDayStats(dayKey);

            return (
              <div key={dayKey} className="min-h-[600px]">
                <Card className={`h-full bg-gradient-to-br from-white to-red-50 border-2 shadow-xl hover:shadow-2xl transition-all duration-500 ${
                  isToday ? 'border-red-500 shadow-red-200' : 'border-red-200'
                }`}>
                  <CardHeader className={`p-4 rounded-t-lg ${
                    isToday 
                      ? 'bg-gradient-to-r from-red-700 to-red-800 text-white' 
                      : 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                  }`}>
                    <CardTitle className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="text-sm font-bold">{format(day, 'EEEE', { locale: ptBR })}</span>
                      </div>
                      
                      <div className="text-lg font-black">
                        {format(day, 'dd', { locale: ptBR })}
                      </div>
                      
                      {isToday && (
                        <Badge className="bg-white text-red-700 font-bold text-xs">
                          HOJE
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-3 space-y-3">
                    {/* Dashboard do Dia */}
                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-lg border border-red-200">
                      <div className="grid grid-cols-1 gap-2 text-center">
                        <div>
                          <div className="text-lg font-black text-red-800">{stats.count}</div>
                          <div className="text-xs text-red-600">Agendamentos</div>
                        </div>
                        
                        {stats.revenue > 0 && (
                          <div>
                            <div className="text-sm font-bold text-green-800">R$ {stats.revenue.toLocaleString()}</div>
                            <div className="text-xs text-green-600">Receita</div>
                          </div>
                        )}
                        
                        {stats.duration > 0 && (
                          <div>
                            <div className="text-sm font-bold text-blue-800">{Math.round(stats.duration / 60)}h</div>
                            <div className="text-xs text-blue-600">Duração Total</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botão Adicionar */}
                    <Button
                      onClick={() => onCreateAppointment(day)}
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 transition-all duration-300 font-bold text-xs transform hover:scale-105"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Novo Agendamento
                    </Button>

                    {/* Linha do Tempo Vertical */}
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-300 via-red-400 to-red-500 opacity-30"></div>
                      
                      <SortableContext items={dayAppointments.map(apt => apt.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3 min-h-[350px]" id={dayKey}>
                          {dayAppointments.map((appointment) => {
                            const client = clients.find(c => c.id === appointment.client_id);
                            return (
                              <div key={appointment.id} className="relative ml-8">
                                {/* Conector à linha do tempo */}
                                <div className="absolute -left-6 top-1/2 w-4 h-0.5 bg-red-400"></div>
                                <div className="absolute -left-8 top-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-y-1/2"></div>
                                
                                <VisualAppointmentBlock
                                  appointment={appointment}
                                  client={client}
                                />
                              </div>
                            );
                          })}
                          
                          {dayAppointments.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                              <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                              <p className="text-sm">Dia livre</p>
                              <p className="text-xs mt-1">Sem agendamentos</p>
                            </div>
                          )}
                        </div>
                      </SortableContext>
                    </div>

                    {/* Botão Ver Detalhes */}
                    <div className="pt-3 border-t border-red-200">
                      <Button
                        onClick={() => onDayClick(day)}
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 transition-all duration-300 font-medium text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Dia Completo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeAppointment && (
            <VisualAppointmentBlock
              appointment={activeAppointment}
              client={clients.find(c => c.id === activeAppointment.client_id)}
              isOverlay
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Resumo da Semana */}
      <div className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 rounded-xl shadow-xl p-6">
        <h3 className="text-xl font-black text-red-800 mb-4 flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          Fluxo Semanal Criativo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border-2 border-red-200 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-black text-red-800">
              {weekAppointments.length}
            </div>
            <div className="text-sm text-red-600 font-bold">
              Total de Agendamentos
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-200 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-black text-green-800">
              R$ {weekAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-green-600 font-bold">
              Receita Estimada
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-black text-blue-800">
              {weekAppointments.filter(apt => apt.status === 'confirmed').length}
            </div>
            <div className="text-sm text-blue-600 font-bold">
              Confirmados
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border-2 border-purple-200 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-black text-purple-800">
              {Math.round(weekAppointments.reduce((sum, apt) => sum + (apt.duration_minutes || 60), 0) / 60)}h
            </div>
            <div className="text-sm text-purple-600 font-bold">
              Horas Totais
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWeeklyView;
