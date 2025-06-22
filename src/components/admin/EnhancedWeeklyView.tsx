
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

// Componente de bloco de agendamento visual ultra-aprimorado e otimizado
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
    transition: isDragging ? 'none' : transition,
  };

  // Artistas com cores ultra-vibrantes e distintas
  const artists = [
    { id: '1', name: 'João Silva', gradient: 'from-red-500 to-red-700', border: 'border-red-400', bg: 'bg-red-500', textColor: 'text-red-900', shadowColor: 'shadow-red-200' },
    { id: '2', name: 'Maria Santos', gradient: 'from-blue-500 to-blue-700', border: 'border-blue-400', bg: 'bg-blue-500', textColor: 'text-blue-900', shadowColor: 'shadow-blue-200' },
    { id: '3', name: 'Pedro Costa', gradient: 'from-green-500 to-green-700', border: 'border-green-400', bg: 'bg-green-500', textColor: 'text-green-900', shadowColor: 'shadow-green-200' },
    { id: '4', name: 'Ana Oliveira', gradient: 'from-purple-500 to-purple-700', border: 'border-purple-400', bg: 'bg-purple-500', textColor: 'text-purple-900', shadowColor: 'shadow-purple-200' },
    { id: '5', name: 'Carlos Mendes', gradient: 'from-amber-500 to-amber-700', border: 'border-amber-400', bg: 'bg-amber-500', textColor: 'text-amber-900', shadowColor: 'shadow-amber-200' },
  ];

  // Tipos de serviço com ícones específicos e cores distintivas
  const serviceTypes = {
    tattoo: { icon: Palette, name: 'Tatuagem', color: 'text-white', bgAccent: 'bg-red-600/20' },
    piercing: { icon: Zap, name: 'Piercing', color: 'text-white', bgAccent: 'bg-yellow-600/20' },
    consultation: { icon: User, name: 'Consulta', color: 'text-white', bgAccent: 'bg-blue-600/20' },
  };

  // Configuração de status ultra-rica com ícones visuais
  const statusConfig = {
    scheduled: { name: 'Agendado', color: 'bg-yellow-500 text-white', icon: '⏰', ring: 'ring-yellow-400' },
    confirmed: { name: 'Confirmado', color: 'bg-green-500 text-white', icon: '✅', ring: 'ring-green-400' },
    in_progress: { name: 'Em Andamento', color: 'bg-blue-600 text-white', icon: '🔄', ring: 'ring-blue-400' },
    completed: { name: 'Concluído', color: 'bg-purple-600 text-white', icon: '🎉', ring: 'ring-purple-400' },
    cancelled: { name: 'Cancelado', color: 'bg-red-600 text-white', icon: '❌', ring: 'ring-red-400' },
  };

  const artist = artists.find(a => a.id === appointment.artist_id) || artists[0];
  const serviceConfig = serviceTypes[appointment.service_type as keyof typeof serviceTypes] || serviceTypes.tattoo;
  const statusInfo = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.scheduled;
  const ServiceIcon = serviceConfig.icon;
  
  // Calcular altura proporcional baseada na duração - SISTEMA APRIMORADO
  const duration = appointment.duration_minutes || 60;
  const pixelsPerHour = 100; // Aumento para 100px por hora para melhor visualização
  const height = Math.max(80, (duration / 60) * pixelsPerHour); // Mínimo 80px
  
  // Calcular posição vertical ultra-precisa baseada no horário
  const [hours, minutes] = appointment.time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const startHour = 8; // 8h
  const topPosition = ((totalMinutes - startHour * 60) / 60) * pixelsPerHour;

  // Calcular horário de fim com precisão
  const endMinutes = totalMinutes + duration;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

  return (
    <div
      ref={setNodeRef}
      style={{ 
        ...style, 
        height: `${height}px`,
        top: `${Math.max(0, topPosition)}px`,
        position: 'absolute',
        width: 'calc(100% - 8px)',
        left: '4px',
        zIndex: isDragging ? 100 : 10
      }}
      className={`
        rounded-2xl border-2 ${artist.border} ${artist.shadowColor}
        bg-gradient-to-br ${artist.gradient} text-white
        transition-all duration-500 cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-80 rotate-2 scale-110 shadow-2xl ring-4 ring-white/50' : 'shadow-xl hover:shadow-2xl'}
        ${isOverlay ? 'rotate-3 scale-115 shadow-3xl ring-4 ring-white/60' : ''}
        overflow-hidden group transform hover:scale-[1.03] hover:-translate-y-1
        ${statusInfo.ring} ring-2
      `}
      {...attributes}
      {...listeners}
    >
      {/* Barra lateral ultra-vibrante do artista */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${artist.bg} opacity-100 shadow-inner`}></div>
      
      {/* Accent background para tipo de serviço */}
      <div className={`absolute top-0 right-0 w-8 h-8 ${serviceConfig.bgAccent} rounded-bl-2xl`}></div>
      
      <div className="p-4 h-full flex flex-col justify-between relative">
        {/* SEÇÃO 1: Horário Principal - DESTAQUE MÁXIMO */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 drop-shadow-sm" />
                <span className="text-lg font-black drop-shadow-sm tracking-tight">
                  {appointment.time} - {endTime}
                </span>
              </div>
              <span className="text-sm opacity-90 font-bold ml-6">
                {Math.floor(duration / 60)}h {duration % 60 > 0 ? `${duration % 60}min` : ''}
              </span>
            </div>
            
            {/* Status Badge Ultra-Visual */}
            <div className="flex items-center gap-2">
              <ServiceIcon className="h-4 w-4 drop-shadow-sm" />
              <Badge className={`text-xs px-2 py-1 ${statusInfo.color} font-black border-white/30 shadow-lg`}>
                {statusInfo.icon}
              </Badge>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: Informações Principais - ORGANIZAÇÃO APRIMORADA */}
        <div className="flex-1 space-y-3 py-2">
          {/* Cliente */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 drop-shadow-sm" />
              <span className="text-sm font-bold truncate drop-shadow-sm">
                {client?.name?.split(' ').slice(0, 2).join(' ') || 'Cliente'}
              </span>
            </div>
            
            {/* Artista */}
            <div className="flex items-center gap-2 ml-1">
              <div className={`w-3 h-3 rounded-full ${artist.bg} shadow-sm border border-white/30`}></div>
              <span className="text-xs font-semibold truncate opacity-95">
                {artist.name.split(' ')[0]}
              </span>
            </div>
          </div>
          
          {/* Descrição do Serviço - VISUAL APRIMORADO */}
          {appointment.service_description && (
            <div className="bg-white/10 rounded-lg p-2 border border-white/20">
              <p className="text-xs font-medium line-clamp-2 drop-shadow-sm">
                {appointment.service_description}
              </p>
            </div>
          )}
        </div>

        {/* SEÇÃO 3: Rodapé com Informações Críticas */}
        <div className="space-y-2">
          {/* Preço e Contato */}
          {appointment.estimated_price && (
            <div className="flex items-center justify-between bg-white/15 rounded-lg p-2 border border-white/20">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-black">
                  R$ {appointment.estimated_price.toLocaleString()}
                </span>
              </div>
              
              {client?.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span className="text-xs font-medium opacity-90">
                    {client.phone.slice(-4)}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* Status Final com Nome Completo */}
          <div className="text-center">
            <Badge className={`text-xs px-3 py-1 ${statusInfo.color} font-black shadow-lg border border-white/30`}>
              {statusInfo.name}
            </Badge>
          </div>
        </div>

        {/* Efeito de brilho premium no hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
        
        {/* Indicador de drag ativo */}
        {isDragging && (
          <div className="absolute inset-0 bg-white/20 rounded-2xl border-2 border-white/50 animate-pulse"></div>
        )}
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

  // Escala de tempo ULTRA-DETALHADA e PROEMINENTE (8h às 20h com intervalos de 30min)
  const timeScale = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeScale.push({ 
      hour, 
      minute: 0, 
      label: `${hour.toString().padStart(2, '0')}:00`,
      isMainHour: true
    });
    if (hour < 20) {
      timeScale.push({ 
        hour, 
        minute: 30, 
        label: `${hour.toString().padStart(2, '0')}:30`,
        isMainHour: false
      });
    }
  }

  return (
    <div className="space-y-8">
      {/* Header de Navegação Ultra-Premium */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 rounded-2xl shadow-2xl border border-red-500 relative overflow-hidden">
        {/* Padrão de fundo sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <Button
            onClick={() => navigateWeek('prev')}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-xl rounded-xl border border-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-4xl font-black mb-3 drop-shadow-lg">
              {format(weekStart, "dd 'de' MMMM", { locale: ptBR })} - {format(weekEnd, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
            <p className="text-red-100 font-bold text-xl drop-shadow-sm">Painel Visual Semanal Ultra-Preciso</p>
            <p className="text-red-200 font-medium text-sm mt-1">Escala de Tempo Dinâmica • Blocos Proporcionais • Drag & Drop Fluido</p>
          </div>
          
          <Button
            onClick={() => navigateWeek('next')}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-xl rounded-xl border border-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Painel Semanal com Escala de Tempo ULTRA-PROEMINENTE */}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="grid grid-cols-8 gap-6">
          {/* Coluna da Escala de Tempo - ULTRA-APRIMORADA E PROEMINENTE */}
          <div className="bg-gradient-to-br from-red-50 via-red-100 to-red-150 border-4 border-red-300 rounded-2xl p-6 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="font-black text-red-900 text-lg">ESCALA DE TEMPO</h3>
              <p className="text-sm text-red-700 font-bold">Horários Precisos</p>
              <div className="w-full h-0.5 bg-red-400 mt-2"></div>
            </div>
            <div className="space-y-0 relative" style={{ height: '1300px' }}>
              {timeScale.map((time, index) => (
                <div 
                  key={`${time.hour}-${time.minute}`}
                  className="flex items-center justify-center relative"
                  style={{ 
                    position: 'absolute',
                    top: `${index * 50}px`,
                    left: 0,
                    right: 0,
                    height: '50px'
                  }}
                >
                  <div className={`text-center font-black rounded-xl border-2 shadow-lg transition-all duration-300 ${
                    time.isMainHour 
                      ? 'text-red-900 bg-red-200 border-red-400 px-4 py-2 text-lg' 
                      : 'text-red-700 bg-red-100 border-red-300 px-3 py-1 text-sm'
                  }`}>
                    {time.label}
                  </div>
                  {time.isMainHour && (
                    <>
                      <div className="absolute right-0 w-6 h-1 bg-red-400 shadow-sm"></div>
                      <div className="absolute left-0 w-6 h-1 bg-red-400 shadow-sm"></div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Colunas dos dias da semana - ULTRA-APRIMORADAS */}
          {weekDays.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayAppointments = appointmentsByDay[dayKey] || [];
            const isToday = isSameDay(day, new Date());
            const stats = getDayStats(dayKey);

            return (
              <div key={dayKey} className="min-h-[1400px]">
                <Card className={`h-full bg-gradient-to-br from-white via-red-25 to-red-50 border-3 shadow-2xl hover:shadow-3xl transition-all duration-700 ${
                  isToday ? 'border-red-600 shadow-red-300 ring-4 ring-red-200 transform scale-[1.01]' : 'border-red-200'
                }`}>
                  <CardHeader className={`p-6 rounded-t-2xl shadow-lg ${
                    isToday 
                      ? 'bg-gradient-to-r from-red-800 to-red-900 text-white shadow-xl' 
                      : 'bg-gradient-to-r from-red-700 to-red-800 text-white'
                  }`}>
                    <CardTitle className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-3">
                        <CalendarIcon className="h-5 w-5 drop-shadow-sm" />
                        <span className="text-base font-black drop-shadow-sm">{format(day, 'EEEE', { locale: ptBR })}</span>
                      </div>
                      
                      <div className="text-2xl font-black drop-shadow-lg">
                        {format(day, 'dd', { locale: ptBR })}
                      </div>
                      
                      {isToday && (
                        <Badge className="bg-white text-red-800 font-black text-sm animate-pulse shadow-xl border-2 border-red-200">
                          🔥 HOJE
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-6">
                    {/* Dashboard Mini Ultra-Aprimorado */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border-2 border-red-200 shadow-inner">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
                          <div>
                            <div className="text-xl font-black text-red-900">{stats.count}</div>
                            <div className="text-xs text-red-700 font-bold">Agendamentos</div>
                          </div>
                          <Activity className="h-5 w-5 text-red-600" />
                        </div>
                        
                        {stats.revenue > 0 && (
                          <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
                            <div>
                              <div className="text-sm font-black text-green-900">R$ {stats.revenue.toLocaleString()}</div>
                              <div className="text-xs text-green-700 font-bold">Receita</div>
                            </div>
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                        
                        {stats.duration > 0 && (
                          <div className="flex items-center justify-between bg-white/50 rounded-lg p-2">
                            <div>
                              <div className="text-sm font-black text-blue-900">
                                {Math.floor(stats.duration / 60)}h {stats.duration % 60 > 0 ? `${stats.duration % 60}min` : ''}
                              </div>
                              <div className="text-xs text-blue-700 font-bold">Duração</div>
                            </div>
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botão Adicionar Ultra-Aprimorado */}
                    <Button
                      onClick={() => onCreateAppointment(day)}
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-black transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-red-500"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Novo Agendamento
                    </Button>

                    {/* Área dos agendamentos com escala de tempo ULTRA-PRECISA */}
                    <div className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 rounded-2xl border-2 border-gray-300 shadow-inner" style={{ minHeight: '1300px' }}>
                      {/* Linhas de grade da escala de tempo - ULTRA-APRIMORADAS E PROEMINENTES */}
                      {timeScale.map((time, index) => (
                        <div 
                          key={`${time.hour}-${time.minute}-grid`}
                          className={`absolute left-0 right-0 ${
                            time.isMainHour 
                              ? 'border-t-3 border-red-400 bg-red-50/30' 
                              : 'border-t-2 border-red-200 bg-red-25/20'
                          } transition-all duration-300`}
                          style={{ top: `${index * 50}px`, height: '50px' }}
                        >
                          <span className={`absolute right-2 top-1 text-xs rounded px-2 py-0.5 shadow-sm ${
                            time.isMainHour 
                              ? 'text-red-800 bg-red-100 font-black border border-red-300' 
                              : 'text-red-600 bg-red-50 font-bold border border-red-200'
                          }`}>
                            {time.isMainHour ? `${time.hour}h` : '30min'}
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
                              <CalendarIcon className="h-20 w-20 mb-6 opacity-20" />
                              <p className="text-lg font-bold">Dia Livre</p>
                              <p className="text-sm mt-2 font-medium">Sem agendamentos</p>
                            </div>
                          )}
                        </div>
                      </SortableContext>
                    </div>

                    {/* Botão Ver Detalhes Ultra-Aprimorado */}
                    <Button
                      onClick={() => onDayClick(day)}
                      variant="outline"
                      className="w-full text-red-700 border-red-300 hover:bg-red-50 transition-all duration-300 font-bold text-sm shadow-md hover:shadow-lg"
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

      {/* Resumo da Semana Ultra-Premium */}
      <Card className="bg-gradient-to-br from-white to-red-50 border-3 border-red-200 shadow-2xl hover:shadow-3xl transition-all duration-700">
        <CardHeader className="bg-gradient-to-r from-red-700 to-red-800 text-white rounded-t-2xl p-8">
          <CardTitle className="text-2xl font-black flex items-center gap-4">
            <CalendarIcon className="h-8 w-8" />
            Fluxo Semanal Visual Ultra-Premium - Escala de Tempo Precisa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-red-100 to-red-200 p-8 rounded-2xl border-2 border-red-300 text-center transform hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="text-5xl font-black text-red-900 mb-3">
                {weekAppointments.length}
              </div>
              <div className="text-sm text-red-700 font-black">
                Total de Agendamentos
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-8 rounded-2xl border-2 border-green-300 text-center transform hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="text-5xl font-black text-green-900 mb-3">
                R$ {weekAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-green-700 font-black">
                Receita Estimada
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-2xl border-2 border-blue-300 text-center transform hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="text-5xl font-black text-blue-900 mb-3">
                {weekAppointments.filter(apt => apt.status === 'confirmed').length}
              </div>
              <div className="text-sm text-blue-700 font-black">
                Confirmados
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-8 rounded-2xl border-2 border-purple-300 text-center transform hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="text-5xl font-black text-purple-900 mb-3">
                {Math.round(weekAppointments.reduce((sum, apt) => sum + (apt.duration_minutes || 60), 0) / 60)}h
              </div>
              <div className="text-sm text-purple-700 font-black">
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
