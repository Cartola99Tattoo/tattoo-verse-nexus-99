
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, User, ChevronLeft, ChevronRight, Plus, Eye, DollarSign, Activity, Palette, Zap } from 'lucide-react';
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

// Componente de bloco de agendamento visual aprimorado com escala de tempo
const VisualTimeBlock: React.FC<{
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

  // Artistas com cores mais vibrantes
  const artists = [
    { id: '1', name: 'João Silva', gradient: 'from-red-500 to-red-700', border: 'border-red-400', bg: 'bg-red-500' },
    { id: '2', name: 'Maria Santos', gradient: 'from-blue-500 to-blue-700', border: 'border-blue-400', bg: 'bg-blue-500' },
    { id: '3', name: 'Pedro Costa', gradient: 'from-green-500 to-green-700', border: 'border-green-400', bg: 'bg-green-500' },
    { id: '4', name: 'Ana Oliveira', gradient: 'from-purple-500 to-purple-700', border: 'border-purple-400', bg: 'bg-purple-500' },
    { id: '5', name: 'Carlos Mendes', gradient: 'from-amber-500 to-amber-700', border: 'border-amber-400', bg: 'bg-amber-500' },
  ];

  // Tipos de serviço com ícones
  const serviceTypes = {
    tattoo: { icon: Palette, color: 'text-white' },
    piercing: { icon: Zap, color: 'text-white' },
    consultation: { icon: User, color: 'text-white' },
  };

  const artist = artists.find(a => a.id === appointment.artist_id) || artists[0];
  const serviceConfig = serviceTypes[appointment.service_type as keyof typeof serviceTypes] || serviceTypes.tattoo;
  const ServiceIcon = serviceConfig.icon;
  
  // Calcular altura baseada na duração (mínimo 60px, máximo 200px)
  const duration = appointment.duration_minutes || 60;
  const height = Math.max(60, Math.min(200, (duration / 60) * 80));
  
  // Calcular posição vertical baseada no horário
  const [hours, minutes] = appointment.time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const startHour = 8; // Horário de início do estúdio (8h)
  const topPosition = ((totalMinutes - startHour * 60) / 60) * 60; // 60px por hora

  return (
    <div
      ref={setNodeRef}
      style={{ 
        ...style, 
        height: `${height}px`,
        top: `${Math.max(0, topPosition)}px`,
        position: 'absolute',
        width: 'calc(100% - 8px)',
        left: '4px'
      }}
      className={`
        rounded-xl border-2 ${artist.border} shadow-xl hover:shadow-2xl
        bg-gradient-to-br ${artist.gradient} text-white
        transition-all duration-300 cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 rotate-1 scale-105 z-50' : 'z-10'}
        ${isOverlay ? 'rotate-2 scale-110 shadow-2xl z-50' : ''}
        overflow-hidden group transform hover:scale-[1.02]
      `}
      {...attributes}
      {...listeners}
    >
      {/* Barra lateral colorida do artista */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${artist.bg} opacity-80`}></div>
      
      <div className="p-3 h-full flex flex-col justify-between relative">
        {/* Cabeçalho do agendamento */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-black">{appointment.time}</span>
            </div>
            <ServiceIcon className={`h-4 w-4 ${serviceConfig.color}`} />
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span className="text-xs font-bold truncate">
              {client?.name?.split(' ')[0] || 'Cliente'}
            </span>
          </div>
        </div>

        {/* Descrição do serviço */}
        {appointment.service_description && (
          <div className="flex-1 flex items-center">
            <p className="text-xs opacity-90 line-clamp-2 font-medium">
              {appointment.service_description}
            </p>
          </div>
        )}

        {/* Rodapé com duração e preço */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            <span className="text-xs font-bold">{duration}min</span>
          </div>
          
          {appointment.estimated_price && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span className="text-xs font-bold">
                R$ {appointment.estimated_price}
              </span>
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <Badge className={`text-xs px-2 py-0.5 ${
            appointment.status === 'confirmed' ? 'bg-green-600 text-white' :
            appointment.status === 'completed' ? 'bg-blue-600 text-white' :
            'bg-yellow-600 text-white'
          }`}>
            {appointment.status === 'confirmed' ? 'Confirmado' :
             appointment.status === 'completed' ? 'Concluído' : 'Agendado'}
          </Badge>
        </div>

        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
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

  // Gerar escala de tempo (8h às 20h)
  const timeScale = Array.from({ length: 13 }, (_, i) => i + 8);

  return (
    <div className="space-y-8">
      {/* Header de Navegação Premium */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 rounded-2xl shadow-red-glow border border-red-500">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigateWeek('prev')}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-lg rounded-xl"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-3xl font-black mb-2">
              {format(weekStart, "dd 'de' MMMM", { locale: ptBR })} - {format(weekEnd, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
            <p className="text-red-100 font-medium text-lg">Painel Visual Semanal com Escala de Tempo</p>
          </div>
          
          <Button
            onClick={() => navigateWeek('next')}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-lg rounded-xl"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Kanban Semanal com Escala de Tempo */}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="grid grid-cols-8 gap-4">
          {/* Coluna da escala de tempo */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4">
            <div className="text-center mb-4">
              <h3 className="font-black text-red-800 text-sm">Horários</h3>
            </div>
            <div className="space-y-4">
              {timeScale.map((hour) => (
                <div key={hour} className="h-16 flex items-center justify-center border-b border-red-200 last:border-b-0">
                  <span className="text-sm font-bold text-red-700">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Colunas dos dias da semana */}
          {weekDays.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayAppointments = appointmentsByDay[dayKey] || [];
            const isToday = isSameDay(day, new Date());
            const stats = getDayStats(dayKey);

            return (
              <div key={dayKey} className="min-h-[800px]">
                <Card className={`h-full bg-gradient-to-br from-white to-red-50 border-2 shadow-2xl hover:shadow-red-glow transition-all duration-500 ${
                  isToday ? 'border-red-500 shadow-red-200' : 'border-red-200'
                }`}>
                  <CardHeader className={`p-4 rounded-t-xl ${
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
                        <Badge className="bg-white text-red-700 font-bold text-xs animate-pulse">
                          HOJE
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-4 space-y-4">
                    {/* Dashboard do Dia */}
                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-xl border-2 border-red-200">
                      <div className="grid grid-cols-1 gap-2 text-center">
                        <div>
                          <div className="text-lg font-black text-red-800">{stats.count}</div>
                          <div className="text-xs text-red-600 font-medium">Agendamentos</div>
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
                            <div className="text-xs text-blue-600">Duração</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botão Adicionar */}
                    <Button
                      onClick={() => onCreateAppointment(day)}
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Agendamento
                    </Button>

                    {/* Área dos agendamentos com escala de tempo */}
                    <div className="relative min-h-[600px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                      {/* Linhas de grade da escala de tempo */}
                      {timeScale.map((hour, index) => (
                        <div 
                          key={hour} 
                          className="absolute left-0 right-0 border-t border-gray-300 opacity-50"
                          style={{ top: `${index * 60}px` }}
                        >
                          <span className="absolute -left-2 -top-2 text-xs text-gray-500 bg-white px-1 rounded">
                            {hour.toString().padStart(2, '0')}h
                          </span>
                        </div>
                      ))}
                      
                      <SortableContext items={dayAppointments.map(apt => apt.id)} strategy={verticalListSortingStrategy}>
                        <div className="relative h-full" id={dayKey}>
                          {dayAppointments.map((appointment) => {
                            const client = clients.find(c => c.id === appointment.client_id);
                            return (
                              <VisualTimeBlock
                                key={appointment.id}
                                appointment={appointment}
                                client={client}
                              />
                            );
                          })}
                          
                          {dayAppointments.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                              <CalendarIcon className="h-16 w-16 mb-4 opacity-30" />
                              <p className="text-sm font-medium">Dia livre</p>
                              <p className="text-xs mt-1">Sem agendamentos</p>
                            </div>
                          )}
                        </div>
                      </SortableContext>
                    </div>

                    {/* Botão Ver Detalhes */}
                    <Button
                      onClick={() => onDayClick(day)}
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 transition-all duration-300 font-medium text-sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Dia Completo
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeAppointment && (
            <VisualTimeBlock
              appointment={activeAppointment}
              client={clients.find(c => c.id === activeAppointment.client_id)}
              isOverlay
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Resumo da Semana Premium */}
      <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-2xl hover:shadow-red-glow transition-all duration-500">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-xl p-6">
          <CardTitle className="text-xl font-black flex items-center gap-3">
            <CalendarIcon className="h-6 w-6" />
            Fluxo Semanal Visual Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-200 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="text-4xl font-black text-red-800 mb-2">
                {weekAppointments.length}
              </div>
              <div className="text-sm text-red-600 font-bold">
                Total de Agendamentos
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="text-4xl font-black text-green-800 mb-2">
                R$ {weekAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-green-600 font-bold">
                Receita Estimada
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="text-4xl font-black text-blue-800 mb-2">
                {weekAppointments.filter(apt => apt.status === 'confirmed').length}
              </div>
              <div className="text-sm text-blue-600 font-bold">
                Confirmados
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="text-4xl font-black text-purple-800 mb-2">
                {Math.round(weekAppointments.reduce((sum, apt) => sum + (apt.duration_minutes || 60), 0) / 60)}h
              </div>
              <div className="text-sm text-purple-600 font-bold">
                Horas Totais
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedWeeklyView;
