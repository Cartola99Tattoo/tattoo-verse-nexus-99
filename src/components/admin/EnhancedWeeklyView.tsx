
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

// Componente de bloco de agendamento ultra-otimizado para legibilidade máxima
const UltraOptimizedAppointmentBlock: React.FC<{
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

  // Artistas com paleta refinada para máxima legibilidade
  const artists = [
    { 
      id: '1', 
      name: 'João Silva', 
      primaryColor: '#dc2626', 
      lightBg: '#fef2f2', 
      borderColor: '#fecaca',
      textColor: '#7f1d1d'
    },
    { 
      id: '2', 
      name: 'Maria Santos', 
      primaryColor: '#2563eb', 
      lightBg: '#eff6ff', 
      borderColor: '#bfdbfe',
      textColor: '#1e3a8a'
    },
    { 
      id: '3', 
      name: 'Pedro Costa', 
      primaryColor: '#059669', 
      lightBg: '#f0fdf4', 
      borderColor: '#bbf7d0',
      textColor: '#064e3b'
    },
    { 
      id: '4', 
      name: 'Ana Oliveira', 
      primaryColor: '#7c3aed', 
      lightBg: '#faf5ff', 
      borderColor: '#ddd6fe',
      textColor: '#581c87'
    },
    { 
      id: '5', 
      name: 'Carlos Mendes', 
      primaryColor: '#d97706', 
      lightBg: '#fffbeb', 
      borderColor: '#fed7aa',
      textColor: '#92400e'
    },
  ];

  // Tipos de serviço com ícones otimizados
  const serviceTypes = {
    tattoo: { icon: Palette, name: 'Tattoo', short: 'TAT', color: '#dc2626' },
    piercing: { icon: Zap, name: 'Piercing', short: 'PIE', color: '#2563eb' },
    consultation: { icon: User, name: 'Consulta', short: 'CON', color: '#059669' },
  };

  // Status com indicadores visuais refinados
  const statusConfig = {
    scheduled: { 
      name: 'Agendado', 
      dotColor: '#f59e0b',
      progress: 0,
      pulse: false
    },
    confirmed: { 
      name: 'Confirmado', 
      dotColor: '#10b981',
      progress: 0,
      pulse: false
    },
    in_progress: { 
      name: 'Em Andamento', 
      dotColor: '#3b82f6',
      progress: 65,
      pulse: true
    },
    completed: { 
      name: 'Concluído', 
      dotColor: '#8b5cf6',
      progress: 100,
      pulse: false
    },
    cancelled: { 
      name: 'Cancelado', 
      dotColor: '#ef4444',
      progress: 0,
      pulse: false
    },
  };

  const artist = artists.find(a => a.id === appointment.artist_id) || artists[0];
  const serviceConfig = serviceTypes[appointment.service_type as keyof typeof serviceTypes] || serviceTypes.tattoo;
  const statusInfo = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.scheduled;
  const ServiceIcon = serviceConfig.icon;
  
  // Calcular altura precisa baseada na duração
  const duration = appointment.duration_minutes || 60;
  const pixelsPerHour = 80;
  const height = Math.max(48, (duration / 60) * pixelsPerHour);
  
  // Calcular posição vertical ultra-precisa
  const [hours, minutes] = appointment.time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const startHour = 8;
  const topPosition = ((totalMinutes - startHour * 60) / 60) * pixelsPerHour;

  // Calcular horário de fim
  const endMinutes = totalMinutes + duration;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

  // Determinar layout responsivo baseado na duração
  const isVeryShort = duration < 45;
  const isShort = duration >= 45 && duration < 90;
  const isMedium = duration >= 90 && duration < 180;
  const isLong = duration >= 180;

  // Nome do cliente otimizado
  const clientFirstName = client?.name?.split(' ')[0] || 'Cliente';
  const clientShortName = clientFirstName.length > 8 ? clientFirstName.substring(0, 8) + '...' : clientFirstName;

  return (
    <div
      ref={setNodeRef}
      style={{ 
        ...style, 
        borderLeftColor: artist.primaryColor,
        backgroundColor: artist.lightBg,
        borderColor: artist.borderColor,
        height: `${height}px`,
        top: `${Math.max(0, topPosition)}px`,
        position: 'absolute',
        width: 'calc(100% - 4px)',
        left: '2px',
        zIndex: isDragging ? 1000 : 10
      }}
      className={`
        rounded-lg border-l-4 border-r border-t border-b bg-white shadow-sm 
        hover:shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-80 scale-[1.02] shadow-xl' : ''}
        ${isOverlay ? 'scale-105 shadow-2xl ring-2 ring-red-300' : ''}
        overflow-hidden group relative
      `}
      {...attributes}
      {...listeners}
      title={`${client?.name || 'Cliente'} - ${serviceConfig.name} - ${appointment.time} às ${endTime} - ${statusInfo.name}`}
    >
      {/* Barra de progresso para "Em Andamento" */}
      {statusInfo.progress > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ${statusInfo.pulse ? 'animate-pulse' : ''}`}
            style={{ width: `${statusInfo.progress}%` }}
          />
        </div>
      )}

      <div className={`p-2 h-full flex flex-col justify-between ${statusInfo.progress > 0 ? 'pt-3' : ''}`}>
        {/* SEÇÃO PRIMÁRIA: Informações Essenciais (sempre visíveis) */}
        <div className="space-y-1">
          {/* Horário - MÁXIMA PRIORIDADE */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 flex-shrink-0" style={{ color: artist.primaryColor }} />
              <span className="text-sm font-black tracking-tight" style={{ color: artist.textColor }}>
                {appointment.time}
              </span>
              {!isVeryShort && (
                <span className="text-xs font-medium text-gray-500">
                  - {endTime}
                </span>
              )}
            </div>
            
            {/* Status dot otimizado */}
            <div className="flex items-center gap-1">
              <div 
                className={`w-2 h-2 rounded-full ${statusInfo.pulse ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: statusInfo.dotColor }}
              />
              {isLong && (
                <span className="text-xs font-medium text-gray-600">
                  {statusInfo.name}
                </span>
              )}
            </div>
          </div>

          {/* Cliente - SEGUNDA PRIORIDADE */}
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-bold text-gray-800 truncate leading-tight">
              {clientShortName}
            </span>
          </div>

          {/* Tipo de Serviço - Visível em blocos não muito curtos */}
          {!isVeryShort && (
            <div className="flex items-center gap-1">
              <ServiceIcon 
                className="h-3 w-3 flex-shrink-0" 
                style={{ color: serviceConfig.color }} 
              />
              <span className="text-xs font-semibold text-gray-700">
                {isShort ? serviceConfig.short : serviceConfig.name}
              </span>
            </div>
          )}
        </div>

        {/* SEÇÃO SECUNDÁRIA: Informações Expandidas (apenas blocos médios e longos) */}
        {isMedium && (
          <div className="space-y-1 pt-1 border-t border-gray-200">
            {/* Artista */}
            <div className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: artist.primaryColor }}
              />
              <span className="text-xs font-medium text-gray-600 truncate">
                {artist.name.split(' ')[0]}
              </span>
            </div>
          </div>
        )}

        {/* SEÇÃO TERCIÁRIA: Informações Completas (apenas blocos longos) */}
        {isLong && (
          <div className="space-y-1 pt-2 border-t border-gray-200">
            {/* Artista completo */}
            <div className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: artist.primaryColor }}
              />
              <span className="text-xs font-medium text-gray-600 truncate">
                {artist.name}
              </span>
            </div>

            {/* Preço */}
            {appointment.estimated_price && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-green-600 flex-shrink-0" />
                <span className="text-xs font-bold text-green-700">
                  R$ {appointment.estimated_price.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Duração visual para blocos muito curtos */}
        {isVeryShort && (
          <div className="text-center">
            <span className="text-xs font-bold text-gray-500">
              {duration}min
            </span>
          </div>
        )}
      </div>

      {/* Hover overlay ultra-sutil */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none rounded-lg"></div>
      
      {/* Indicador de drag ativo */}
      {isDragging && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg border-2 border-red-400 animate-pulse"></div>
      )}
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
      duration: dayAppts.reduce((sum, apt) => sum + (apt.duration_minutes || 60), 0),
      inProgress: dayAppts.filter(apt => apt.status === 'in_progress').length
    };
  };

  // Escala de tempo ultra-proeminente
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
      {/* Header refinado com identidade 99Tattoo */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 rounded-2xl shadow-2xl border border-red-500">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigateWeek('prev')}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-lg rounded-xl group"
          >
            <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-3xl font-black mb-2 tracking-tight">
              {format(weekStart, "dd 'de' MMMM", { locale: ptBR })} - {format(weekEnd, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
            <p className="text-red-100 font-bold text-lg">Painel Visual Semanal Ultra-Intuitivo</p>
            <p className="text-red-200 font-medium text-sm mt-1">99Tattoo Professional Dashboard</p>
          </div>
          
          <Button
            onClick={() => navigateWeek('next')}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-lg rounded-xl group"
          >
            <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Painel Semanal Ultra-Refinado */}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="grid grid-cols-8 gap-3">
          {/* Coluna da Escala de Tempo Ultra-Proeminente */}
          <div className="bg-gradient-to-b from-white to-gray-50 border-2 border-gray-300 rounded-2xl p-4 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="font-black text-gray-800 text-base tracking-wide">HORÁRIOS</h3>
              <div className="w-full h-0.5 bg-gradient-to-r from-red-600 to-red-700 mt-3 rounded-full"></div>
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
                  <div className="text-center font-black rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 px-4 py-2 text-sm text-gray-800 shadow-sm">
                    {time.label}
                  </div>
                  {/* Linha de grade ultra-sutil mas presente */}
                  <div className="absolute right-0 w-6 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Colunas dos dias da semana - Layout ultra-limpo */}
          {weekDays.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayAppointments = appointmentsByDay[dayKey] || [];
            const isToday = isSameDay(day, new Date());
            const stats = getDayStats(dayKey);

            return (
              <div key={dayKey} className="min-h-[1120px]">
                <Card className={`h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                  isToday ? 'border-red-400 shadow-red-200 ring-2 ring-red-200' : 'border-gray-200'
                }`}>
                  <CardHeader className={`p-5 rounded-t-xl transition-all duration-300 ${
                    isToday 
                      ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white' 
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300'
                  }`}>
                    <CardTitle className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        <span className="text-sm font-black tracking-wide uppercase">
                          {format(day, 'EEEE', { locale: ptBR })}
                        </span>
                      </div>
                      
                      <div className="text-2xl font-black tracking-tight">
                        {format(day, 'dd', { locale: ptBR })}
                      </div>
                      
                      {isToday && (
                        <Badge className="bg-white text-red-700 font-black text-xs px-3 py-1 shadow-lg">
                          HOJE
                        </Badge>
                      )}

                      {stats.inProgress > 0 && (
                        <Badge className="bg-blue-500 text-white font-bold text-xs px-2 py-1 animate-pulse">
                          {stats.inProgress} EM ANDAMENTO
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-4 space-y-4">
                    {/* Mini Dashboard Ultra-Refinado */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 shadow-inner">
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="space-y-1">
                          <div className="text-xl font-black text-gray-800">{stats.count}</div>
                          <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Agendamentos</div>
                        </div>
                        
                        {stats.revenue > 0 && (
                          <div className="space-y-1">
                            <div className="text-sm font-black text-green-700">R$ {stats.revenue.toLocaleString()}</div>
                            <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Receita</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botão Adicionar Ultra-Refinado */}
                    <Button
                      onClick={() => onCreateAppointment(day)}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black transition-all duration-300 text-sm py-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] rounded-xl"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Agendamento
                    </Button>

                    {/* Área dos agendamentos com grid ultra-refinado */}
                    <div className="relative bg-gradient-to-b from-gray-50 to-white rounded-xl border-2 border-gray-200 shadow-inner" style={{ minHeight: '1040px' }}>
                      {/* Linhas de grade horizontais ultra-sutis mas funcionais */}
                      {timeScale.map((time, index) => (
                        <div 
                          key={`${time.hour}-grid`}
                          className="absolute left-0 right-0 border-t border-gray-200/60"
                          style={{ top: `${index * 80}px`, height: '80px' }}
                        >
                          <span className="absolute right-2 top-1 text-xs text-gray-400 font-bold">
                            {time.hour}h
                          </span>
                        </div>
                      ))}
                      
                      <SortableContext items={dayAppointments.map(apt => apt.id)} strategy={verticalListSortingStrategy}>
                        <div className="relative h-full p-2" id={dayKey}>
                          {dayAppointments.map((appointment) => {
                            const client = clients.find(c => c.id === appointment.client_id);
                            return (
                              <UltraOptimizedAppointmentBlock
                                key={appointment.id}
                                appointment={appointment}
                                client={client}
                              />
                            );
                          })}
                          
                          {dayAppointments.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                              <CalendarIcon className="h-20 w-20 mb-4 opacity-20" />
                              <p className="text-sm font-bold">Dia Livre</p>
                              <p className="text-xs text-gray-500 mt-1">Sem agendamentos</p>
                            </div>
                          )}
                        </div>
                      </SortableContext>
                    </div>

                    {/* Botão Ver Detalhes Ultra-Refinado */}
                    <Button
                      onClick={() => onDayClick(day)}
                      variant="outline"
                      className="w-full text-gray-700 border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 text-sm py-3 font-bold rounded-xl transform hover:scale-[1.02]"
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
            <UltraOptimizedAppointmentBlock
              appointment={activeAppointment}
              client={clients.find(c => c.id === activeAppointment.client_id)}
              isOverlay
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Resumo da Semana Ultra-Refinado */}
      <Card className="bg-white border-2 border-gray-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-t-xl p-8">
          <CardTitle className="text-2xl font-black flex items-center gap-4">
            <CalendarIcon className="h-8 w-8" />
            Resumo Semanal Ultra-Detalhado
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-2 border-red-200 text-center shadow-lg">
              <div className="text-4xl font-black text-red-700 mb-3">
                {weekAppointments.length}
              </div>
              <div className="text-sm text-red-600 font-black uppercase tracking-wide">
                Total de Agendamentos
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-200 text-center shadow-lg">
              <div className="text-4xl font-black text-green-700 mb-3">
                R$ {weekAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-green-600 font-black uppercase tracking-wide">
                Receita Estimada
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-blue-200 text-center shadow-lg">
              <div className="text-4xl font-black text-blue-700 mb-3">
                {weekAppointments.filter(apt => apt.status === 'confirmed').length}
              </div>
              <div className="text-sm text-blue-600 font-black uppercase tracking-wide">
                Confirmados
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border-2 border-purple-200 text-center shadow-lg">
              <div className="text-4xl font-black text-purple-700 mb-3">
                {Math.round(weekAppointments.reduce((sum, apt) => sum + (apt.duration_minutes || 60), 0) / 60)}h
              </div>
              <div className="text-sm text-purple-600 font-black uppercase tracking-wide">
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
