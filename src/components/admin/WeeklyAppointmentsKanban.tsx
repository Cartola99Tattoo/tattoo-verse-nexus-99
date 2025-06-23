import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const getDayAppointmentsCount = (dayKey: string) => {
    return appointmentsByDay[dayKey]?.length || 0;
  };

  const getDayRevenue = (dayKey: string) => {
    return appointmentsByDay[dayKey]?.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0) || 0;
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
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEditAppointment(appointment);
            }}
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0 bg-white border-blue-200 text-blue-600 hover:bg-blue-50"
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
            className="h-6 w-6 p-0 bg-white border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Navegação da Semana */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-4 rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigateWeek('prev')}
              variant="ghost"
              className="text-white hover:bg-white/20 transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-xl font-black">
                {format(weekStart, "dd 'de' MMMM", { locale: ptBR })} - {format(weekEnd, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </h2>
              <p className="text-red-100 font-medium">Visualização Semanal Kanban com Gestão Completa</p>
            </div>
            
            <Button
              onClick={() => navigateWeek('next')}
              variant="ghost"
              className="text-white hover:bg-white/20 transition-all duration-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            onClick={goToToday}
            className="bg-white text-red-700 hover:bg-red-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Hoje
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
            const appointmentsCount = getDayAppointmentsCount(dayKey);
            const dayRevenue = getDayRevenue(dayKey);

            return (
              <div key={dayKey} className="min-h-[600px]">
                <Card className={`h-full bg-white border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isToday ? 'border-red-500 bg-red-50/30' : 'border-red-200'
                }`}>
                  <CardHeader className={`p-3 rounded-t-lg ${
                    isToday 
                      ? 'bg-gradient-to-r from-red-700 to-red-800 text-white' 
                      : 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                  }`}>
                    <CardTitle className="text-sm font-bold text-center">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          {/* DESTAQUE VISUAL DOS DIAS DA SEMANA EM VERMELHO - MANTÉM BRANCO NO HEADER */}
                          <span className="text-white">
                            {format(day, 'EEEE', { locale: ptBR })}
                          </span>
                        </div>
                        {/* NÚMERO DO DIA EM VERMELHO - MANTÉM BRANCO NO HEADER */}
                        <div className="text-lg font-black text-white">
                          {format(day, 'dd', { locale: ptBR })}
                        </div>
                        {isToday && (
                          <Badge className="bg-white text-red-700 font-bold text-xs">
                            HOJE
                          </Badge>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-3 space-y-3">
                    {/* Estatísticas do Dia COMPACTAS */}
                    <div className="bg-red-50 p-2 rounded-lg border border-red-200">
                      <div className="text-center space-y-1">
                        <div className="text-xs text-red-600 font-medium">
                          {appointmentsCount} agendamento{appointmentsCount !== 1 ? 's' : ''}
                        </div>
                        {dayRevenue > 0 && (
                          <div className="text-xs text-green-600 font-bold">
                            R$ {dayRevenue.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BOTÃO SIMPLIFICADO: APENAS + LIMPO - IDENTIDADE 99TATTOO */}
                    <Button
                      onClick={() => onCreateAppointment(day)}
                      className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] rounded-xl relative overflow-hidden group border-0"
                    >
                      <div className="flex items-center justify-center relative z-10">
                        {/* CÍRCULO VERMELHO COM APENAS + - DESIGN ULTRA-LIMPO */}
                        <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm">
                          <Plus className="h-5 w-5 text-white font-black" strokeWidth={3} />
                        </div>
                      </div>
                      {/* Efeito hover shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    </Button>

                    {/* Lista de Agendamentos */}
                    <SortableContext items={dayAppointments.map(apt => apt.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2 min-h-[350px]" id={dayKey}>
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
                          <div className="text-center py-6 text-gray-400">
                            <CalendarIcon className="h-6 w-6 mx-auto mb-2 opacity-30" />
                            <p className="text-xs">Dia livre</p>
                          </div>
                        )}
                      </div>
                    </SortableContext>

                    {/* Botão Ver Dia Completo SIMPLIFICADO */}
                    <div className="pt-2 border-t border-red-200">
                      <Button
                        onClick={() => onDayClick(day)}
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 transition-all duration-300 font-medium text-xs py-2"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Detalhes
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
            <DraggableAppointmentCard
              appointment={activeAppointment}
              client={clients.find(c => c.id === activeAppointment.client_id)}
              timeSlot=""
              isOverlay
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Resumo da Semana */}
      <div className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 rounded-xl shadow-xl p-6">
        <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Resumo da Semana
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
            <div className="text-2xl font-black text-red-800">
              {weekAppointments.length}
            </div>
            <div className="text-sm text-red-600 font-medium">
              Total de Agendamentos
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
            <div className="text-2xl font-black text-green-800">
              R$ {weekAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-green-600 font-medium">
              Receita Estimada
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-black text-blue-800">
              {weekAppointments.filter(apt => apt.status === 'confirmed').length}
            </div>
            <div className="text-sm text-blue-600 font-medium">
              Confirmados
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
            <div className="text-2xl font-black text-purple-800">
              {weekAppointments.filter(apt => apt.status === 'completed').length}
            </div>
            <div className="text-sm text-purple-600 font-medium">
              Concluídos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyAppointmentsKanban;
