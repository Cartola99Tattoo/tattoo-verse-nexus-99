
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, TrendingUp, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, Client } from '@/services/interfaces/IClientService';
import DraggableAppointmentCard from './DraggableAppointmentCard';

interface WeeklyAppointmentsKanbanProps {
  appointments: Appointment[];
  clients: Client[];
  currentDate: Date;
  onReschedule: (appointmentId: string, newDate: string) => void;
  onDayClick: (date: Date) => void;
  onCreateAppointment: (date: Date, timeSlot?: string) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

const WeeklyAppointmentsKanban: React.FC<WeeklyAppointmentsKanbanProps> = ({
  appointments,
  clients,
  currentDate,
  onReschedule,
  onDayClick,
  onCreateAppointment,
  onEditAppointment,
  onDeleteAppointment,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [weekDate, setWeekDate] = useState(currentDate);

  // Calcular o início e fim da semana
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

  // Calcular KPIs da semana
  const weeklyKPIs = {
    totalAppointments: weekAppointments.length,
    estimatedRevenue: weekAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0),
    confirmedAppointments: weekAppointments.filter(apt => apt.status === 'confirmed').length,
    pendingConfirmation: weekAppointments.filter(apt => apt.status === 'scheduled').length,
    inProgress: weekAppointments.filter(apt => apt.status === 'in_progress').length,
    completed: weekAppointments.filter(apt => apt.status === 'completed').length
  };

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

  const goToToday = () => {
    setWeekDate(new Date());
  };

  const AppointmentCardWithActions = ({ appointment, client, timeSlot }: {
    appointment: Appointment;
    client?: Client;
    timeSlot: string;
  }) => {
    return (
      <div className="relative group">
        <DraggableAppointmentCard
          appointment={appointment}
          client={client}
          timeSlot={timeSlot}
        />
        
        {/* Botões de ação - aparecem no hover */}
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEditAppointment(appointment);
            }}
            variant="outline"
            size="sm"
            className="h-5 w-5 p-0 bg-white border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Edit className="h-2.5 w-2.5" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteAppointment(appointment.id);
            }}
            variant="outline"
            size="sm"
            className="h-5 w-5 p-0 bg-white border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-2.5 w-2.5" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 bg-gradient-to-br from-gray-50 via-red-50/30 to-white min-h-screen px-2">
      {/* Navegação da Semana */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-4 rounded-2xl shadow-2xl border border-red-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigateWeek('prev')}
              variant="ghost"
              className="text-white hover:bg-white/20 transition-all duration-300 rounded-xl p-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-xl font-black mb-1">
                {format(weekStart, "dd 'de' MMMM", { locale: ptBR })} - {format(weekEnd, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </h2>
              <p className="text-red-100 font-medium text-sm">Kanban Semanal - Gestão Completa de Agendamentos</p>
            </div>
            
            <Button
              onClick={() => navigateWeek('next')}
              variant="ghost"
              className="text-white hover:bg-white/20 transition-all duration-300 rounded-xl p-2"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <Button
            onClick={goToToday}
            className="bg-white text-red-700 hover:bg-red-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold px-4 py-2 rounded-xl"
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Hoje
          </Button>
        </div>
      </div>

      {/* Dashboard Resumido da Semana - Compactado */}
      <div className="bg-gradient-to-br from-white via-red-50/50 to-white rounded-2xl shadow-2xl border-2 border-red-200/50 p-4">
        <h3 className="text-lg font-black text-red-800 mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Dashboard da Semana
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Total de Agendamentos */}
          <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <CalendarIcon className="h-6 w-6 text-white/80" />
              <div className="text-2xl font-black">{weeklyKPIs.totalAppointments}</div>
            </div>
            <div className="text-red-100 font-bold text-xs uppercase tracking-wide">
              Total de Agendamentos
            </div>
          </div>

          {/* Receita Estimada */}
          <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-6 w-6 text-white/80" />
              <div className="text-lg font-black">R$ {weeklyKPIs.estimatedRevenue.toLocaleString()}</div>
            </div>
            <div className="text-green-100 font-bold text-xs uppercase tracking-wide">
              Receita Estimada
            </div>
          </div>

          {/* Agendamentos Confirmados */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-6 w-6 text-white/80" />
              <div className="text-2xl font-black">{weeklyKPIs.confirmedAppointments}</div>
            </div>
            <div className="text-blue-100 font-bold text-xs uppercase tracking-wide">
              Confirmados
            </div>
          </div>

          {/* Aguardando Confirmação */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-3 rounded-xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-6 w-6 text-white/80" />
              <div className="text-2xl font-black">{weeklyKPIs.pendingConfirmation}</div>
            </div>
            <div className="text-orange-100 font-bold text-xs uppercase tracking-wide">
              Aguardando Confirmação
            </div>
          </div>
        </div>

        {/* Indicadores Adicionais - Compactados */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="bg-purple-50 border-2 border-purple-200 p-2 rounded-xl">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-xl font-black text-purple-800">{weeklyKPIs.inProgress}</div>
                <div className="text-purple-600 font-bold text-xs">Em Andamento</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border-2 border-green-200 p-2 rounded-xl">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-xl font-black text-green-800">{weeklyKPIs.completed}</div>
                <div className="text-green-600 font-bold text-xs">Concluídos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Semanal - Layout Otimizado para Espaço */}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="bg-gradient-to-br from-red-50/30 via-white to-red-50/30 p-3 rounded-3xl shadow-2xl border-2 border-red-100/50 overflow-hidden backdrop-blur-sm relative">
          {/* Elementos decorativos de fundo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/20 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-100/30 rounded-full transform -translate-x-12 translate-y-12"></div>
          
          {/* Grid Otimizado - Espaçamento Reduzido */}
          <div className="grid grid-cols-7 gap-1.5 relative z-10">
            {weekDays.map((day) => {
              const dayKey = format(day, 'yyyy-MM-dd');
              const dayAppointments = appointmentsByDay[dayKey] || [];
              const isToday = isSameDay(day, new Date());

              return (
                <div key={dayKey} className="min-h-[600px]">
                  <Card className={`h-full bg-white border-2 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    isToday ? 'border-red-500 bg-red-50/30 ring-2 ring-red-200' : 'border-red-200'
                  }`}>
                    <CardHeader className={`p-2 rounded-t-xl transition-all duration-300 ${
                      isToday 
                        ? 'bg-gradient-to-r from-red-700 to-red-800 text-white' 
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                    }`}>
                      <CardTitle className="text-center space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span className="text-white font-black text-xs uppercase tracking-wide">
                            {format(day, 'EEEE', { locale: ptBR })}
                          </span>
                        </div>
                        <div className="text-xl font-black text-white">
                          {format(day, 'dd', { locale: ptBR })}
                        </div>
                        {isToday && (
                          <Badge className="bg-white text-red-700 font-black text-xs animate-pulse">
                            🔥 HOJE
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-2 space-y-2">
                      {/* Estatísticas do Dia - Otimizado com Ícones */}
                      <div className="bg-red-50 border-2 border-red-200 p-1.5 rounded-xl">
                        <div className="flex items-center justify-center gap-1.5">
                          <CalendarIcon className="h-3 w-3 text-red-600" />
                          <span className="text-sm text-red-600 font-bold">
                            {dayAppointments.length}
                          </span>
                          {dayAppointments.length > 0 && (
                            <>
                              <span className="text-gray-400 text-xs">•</span>
                              <span className="text-xs text-green-600 font-bold">
                                R$ {dayAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0).toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Botão Adicionar - Otimizado */}
                      <Button
                        onClick={() => onCreateAppointment(day)}
                        className="w-full h-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] rounded-xl relative overflow-hidden group border-0"
                      >
                        <div className="flex items-center justify-center relative z-10">
                          <div className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center backdrop-blur-sm">
                            <Plus className="h-4 w-4 text-white font-black" strokeWidth={4} />
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      </Button>

                      {/* Lista de Agendamentos - Otimizada */}
                      <SortableContext items={dayAppointments.map(apt => apt.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-1.5 min-h-[320px]" id={dayKey}>
                          {dayAppointments.map((appointment) => {
                            const client = clients.find(c => c.id === appointment.client_id);
                            return (
                              <AppointmentCardWithActions
                                key={appointment.id}
                                appointment={appointment}
                                client={client}
                                timeSlot={dayKey}
                              />
                            );
                          })}
                          
                          {dayAppointments.length === 0 && (
                            <div className="text-center py-4 text-gray-400">
                              <CalendarIcon className="h-5 w-5 mx-auto mb-1 opacity-30" />
                              <p className="text-xs font-medium">Dia livre</p>
                              <p className="text-xs text-gray-500 mt-0.5">Espaço para criatividade</p>
                            </div>
                          )}
                        </div>
                      </SortableContext>

                      {/* Botão Ver Detalhes - Ícone de Lupa Apenas */}
                      <div className="pt-1.5 border-t-2 border-red-200">
                        <Button
                          onClick={() => onDayClick(day)}
                          variant="outline"
                          className="w-full text-red-600 border-2 border-red-200 hover:bg-red-50 hover:border-red-400 transition-all duration-300 font-bold text-sm py-1.5 rounded-xl transform hover:scale-[1.02] h-8"
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
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
  );
};

export default WeeklyAppointmentsKanban;
