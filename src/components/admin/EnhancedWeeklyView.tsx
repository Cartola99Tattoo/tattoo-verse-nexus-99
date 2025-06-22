import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, User, ChevronLeft, ChevronRight, Plus, Eye, DollarSign, Activity, Palette, Zap, Phone, Mail } from 'lucide-react';
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

// Componente de bloco de agendamento reformulado para máxima legibilidade
const OptimizedAppointmentBlock: React.FC<{
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
    transition: isDragging ? 'none' : transition,
  };

  // Artistas com cores sutis para melhor legibilidade
  const artists = [
    { id: '1', name: 'João Silva', color: '#ef4444', lightBg: '#fef2f2', border: '#fecaca' },
    { id: '2', name: 'Maria Santos', color: '#3b82f6', lightBg: '#eff6ff', border: '#bfdbfe' },
    { id: '3', name: 'Pedro Costa', color: '#10b981', lightBg: '#f0fdf4', border: '#bbf7d0' },
    { id: '4', name: 'Ana Oliveira', color: '#8b5cf6', lightBg: '#faf5ff', border: '#ddd6fe' },
    { id: '5', name: 'Carlos Mendes', color: '#f59e0b', lightBg: '#fffbeb', border: '#fed7aa' },
  ];

  // Tipos de serviço com ícones limpos
  const serviceTypes = {
    tattoo: { icon: Palette, name: 'Tattoo', short: 'TAT' },
    piercing: { icon: Zap, name: 'Piercing', short: 'PIE' },
    consultation: { icon: User, name: 'Consulta', short: 'CON' },
  };

  // Status simplificados com cores sutis
  const statusConfig = {
    scheduled: { name: 'Agendado', dot: '#f59e0b' },
    confirmed: { name: 'Confirmado', dot: '#10b981' },
    in_progress: { name: 'Em Andamento', dot: '#3b82f6' },
    completed: { name: 'Concluído', dot: '#8b5cf6' },
    cancelled: { name: 'Cancelado', dot: '#ef4444' },
  };

  const artist = artists.find(a => a.id === appointment.artist_id) || artists[0];
  const serviceConfig = serviceTypes[appointment.service_type as keyof typeof serviceTypes] || serviceTypes.tattoo;
  const statusInfo = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.scheduled;
  const ServiceIcon = serviceConfig.icon;
  
  // Calcular altura baseada na duração - mais precisa
  const duration = appointment.duration_minutes || 60;
  const pixelsPerHour = 80;
  const height = Math.max(60, (duration / 60) * pixelsPerHour);
  
  // Calcular posição vertical precisa
  const [hours, minutes] = appointment.time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const startHour = 8;
  const topPosition = ((totalMinutes - startHour * 60) / 60) * pixelsPerHour;

  // Calcular horário de fim
  const endMinutes = totalMinutes + duration;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

  // Determinar layout baseado na duração do bloco
  const isShortBlock = duration < 60;
  const isMediumBlock = duration >= 60 && duration < 180;
  const isLongBlock = duration >= 180;

  return (
    <div
      ref={setNodeRef}
      style={{ 
        ...style, 
        borderLeftColor: artist.color,
        backgroundColor: artist.lightBg,
        borderColor: artist.border,
        height: `${height}px`,
        top: `${Math.max(0, topPosition)}px`,
        position: 'absolute',
        width: 'calc(100% - 6px)',
        left: '3px',
        zIndex: isDragging ? 100 : 10
      }}
      className={`
        rounded-lg border-l-4 bg-white shadow-sm hover:shadow-md
        transition-all duration-200 cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-70 scale-105 shadow-lg' : ''}
        ${isOverlay ? 'scale-110 shadow-xl' : ''}
        overflow-hidden group
      `}
      {...attributes}
      {...listeners}
      title={`${client?.name || 'Cliente'} - ${serviceConfig.name} - ${appointment.time} às ${endTime} - ${statusInfo.name}`}
    >
      <div className="p-2 h-full flex flex-col justify-between">
        {/* SEÇÃO PRINCIPAL: Informações Primárias (sempre visíveis) */}
        <div className="space-y-1">
          {/* Horário - Maior destaque */}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" style={{ color: artist.color }} />
            <span className="text-sm font-bold text-gray-900">
              {appointment.time}
            </span>
            {!isShortBlock && (
              <span className="text-xs text-gray-600">
                - {endTime}
              </span>
            )}
            {/* Status dot */}
            <div 
              className="w-2 h-2 rounded-full ml-auto"
              style={{ backgroundColor: statusInfo.dot }}
            />
          </div>

          {/* Cliente - Segundo em importância */}
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-gray-500" />
            <span className="text-sm font-semibold text-gray-800 truncate">
              {client?.name?.split(' ')[0] || 'Cliente'}
            </span>
          </div>

          {/* Tipo de Serviço - Visível em blocos médios e longos */}
          {!isShortBlock && (
            <div className="flex items-center gap-1">
              <ServiceIcon className="h-3 w-3 text-gray-500" />
              <span className="text-xs font-medium text-gray-700">
                {serviceConfig.short}
              </span>
            </div>
          )}
        </div>

        {/* SEÇÃO SECUNDÁRIA: Informações adicionais para blocos longos */}
        {isLongBlock && (
          <div className="space-y-1 pt-2 border-t border-gray-200">
            {/* Artista */}
            <div className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: artist.color }}
              />
              <span className="text-xs text-gray-600 truncate">
                {artist.name.split(' ')[0]}
              </span>
            </div>

            {/* Preço para blocos longos */}
            {appointment.estimated_price && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-green-600" />
                <span className="text-xs font-medium text-green-700">
                  R$ {appointment.estimated_price.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Duração visual para blocos curtos */}
        {isShortBlock && (
          <div className="text-xs text-gray-500 text-center">
            {duration}min
          </div>
        )}
      </div>

      {/* Hover overlay sutil */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none rounded-lg"></div>
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

  // Escala de tempo limpa e proeminente
  const timeScale = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeScale.push({ 
      hour, 
      label: `${hour.toString().padStart(2, '0')}:00`,
      isMainHour: true
    });
  }

  return (
    <div className="space-y-6">
      {/* Header limpo e focado */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigateWeek('prev')}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 transition-colors rounded-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-1">
              {format(weekStart, "dd 'de' MMMM", { locale: ptBR })} - {format(weekEnd, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
            <p className="text-red-100 font-medium">Painel Visual Semanal - Agenda Intuitiva</p>
          </div>
          
          <Button
            onClick={() => navigateWeek('next')}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 transition-colors rounded-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Painel Semanal Reformulado */}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="grid grid-cols-8 gap-4">
          {/* Coluna da Escala de Tempo - Mais proeminente */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="text-center mb-4">
              <h3 className="font-bold text-gray-800 text-sm">HORÁRIOS</h3>
              <div className="w-full h-px bg-gray-300 mt-2"></div>
            </div>
            <div className="space-y-0 relative" style={{ height: '1040px' }}>
              {timeScale.map((time, index) => (
                <div 
                  key={time.hour}
                  className="flex items-center justify-center relative"
                  style={{ 
                    position: 'absolute',
                    top: `${index * 80}px`,
                    left: 0,
                    right: 0,
                    height: '80px'
                  }}
                >
                  <div className="text-center font-bold rounded-lg bg-gray-50 border border-gray-200 px-3 py-1 text-sm text-gray-700">
                    {time.label}
                  </div>
                  {/* Linha horizontal sutil */}
                  <div className="absolute right-0 w-4 h-px bg-gray-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Colunas dos dias da semana - Layout limpo */}
          {weekDays.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayAppointments = appointmentsByDay[dayKey] || [];
            const isToday = isSameDay(day, new Date());
            const stats = getDayStats(dayKey);

            return (
              <div key={dayKey} className="min-h-[1120px]">
                <Card className={`h-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200 ${
                  isToday ? 'border-red-300 shadow-md ring-1 ring-red-200' : 'border-gray-200'
                }`}>
                  <CardHeader className={`p-4 rounded-t-xl ${
                    isToday 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' 
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800'
                  }`}>
                    <CardTitle className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="text-sm font-bold">{format(day, 'EEEE', { locale: ptBR })}</span>
                      </div>
                      
                      <div className="text-xl font-bold">
                        {format(day, 'dd', { locale: ptBR })}
                      </div>
                      
                      {isToday && (
                        <Badge className="bg-white text-red-700 font-bold text-xs">
                          HOJE
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-4 space-y-4">
                    {/* Mini Dashboard Simplificado */}
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div>
                          <div className="text-lg font-bold text-gray-800">{stats.count}</div>
                          <div className="text-xs text-gray-600">Agendamentos</div>
                        </div>
                        
                        {stats.revenue > 0 && (
                          <div>
                            <div className="text-sm font-bold text-green-700">R$ {stats.revenue.toLocaleString()}</div>
                            <div className="text-xs text-gray-600">Receita</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botão Adicionar Limpo */}
                    <Button
                      onClick={() => onCreateAppointment(day)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm py-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Agendamento
                    </Button>

                    {/* Área dos agendamentos com grid limpo */}
                    <div className="relative bg-gray-50 rounded-lg border border-gray-200" style={{ minHeight: '1040px' }}>
                      {/* Linhas de grade horizontais sutis */}
                      {timeScale.map((time, index) => (
                        <div 
                          key={`${time.hour}-grid`}
                          className="absolute left-0 right-0 border-t border-gray-200"
                          style={{ top: `${index * 80}px`, height: '80px' }}
                        >
                          <span className="absolute right-2 top-1 text-xs text-gray-400 font-medium">
                            {time.hour}h
                          </span>
                        </div>
                      ))}
                      
                      <SortableContext items={dayAppointments.map(apt => apt.id)} strategy={verticalListSortingStrategy}>
                        <div className="relative h-full p-1" id={dayKey}>
                          {dayAppointments.map((appointment) => {
                            const client = clients.find(c => c.id === appointment.client_id);
                            return (
                              <OptimizedAppointmentBlock
                                key={appointment.id}
                                appointment={appointment}
                                client={client}
                              />
                            );
                          })}
                          
                          {dayAppointments.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                              <CalendarIcon className="h-16 w-16 mb-4 opacity-20" />
                              <p className="text-sm font-medium">Dia Livre</p>
                            </div>
                          )}
                        </div>
                      </SortableContext>
                    </div>

                    {/* Botão Ver Detalhes Limpo */}
                    <Button
                      onClick={() => onDayClick(day)}
                      variant="outline"
                      className="w-full text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors text-sm py-2"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeAppointment && (
            <OptimizedAppointmentBlock
              appointment={activeAppointment}
              client={clients.find(c => c.id === activeAppointment.client_id)}
              isOverlay
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Resumo da Semana Simplificado */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-xl p-6">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <CalendarIcon className="h-6 w-6" />
            Resumo Semanal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center">
              <div className="text-3xl font-bold text-red-700 mb-2">
                {weekAppointments.length}
              </div>
              <div className="text-sm text-red-600 font-medium">
                Total de Agendamentos
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">
                R$ {weekAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-green-600 font-medium">
                Receita Estimada
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">
                {weekAppointments.filter(apt => apt.status === 'confirmed').length}
              </div>
              <div className="text-sm text-blue-600 font-medium">
                Confirmados
              </div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 text-center">
              <div className="text-3xl font-bold text-purple-700 mb-2">
                {Math.round(weekAppointments.reduce((sum, apt) => sum + (apt.duration_minutes || 60), 0) / 60)}h
              </div>
              <div className="text-sm text-purple-600 font-medium">
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
