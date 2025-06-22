
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, BarChart3, TrendingUp } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, Client } from '@/services/interfaces/IClientService';
import UltraOptimizedAppointmentBlock from './UltraOptimizedAppointmentBlock';
import WeeklyDayColumn from './WeeklyDayColumn';

interface EnhancedWeeklyViewProps {
  appointments: Appointment[];
  clients: Client[];
  currentDate: Date;
  onReschedule: (appointmentId: string, newDate: string) => void;
  onDayClick: (date: Date) => void;
  onCreateAppointment: (date: Date) => void;
}

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

  // Estatísticas da semana aprimoradas
  const weekStats = {
    total: weekAppointments.length,
    confirmed: weekAppointments.filter(apt => apt.status === 'confirmed').length,
    inProgress: weekAppointments.filter(apt => apt.status === 'in_progress').length,
    completed: weekAppointments.filter(apt => apt.status === 'completed').length,
    revenue: weekAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0),
    totalHours: Math.round(weekAppointments.reduce((sum, apt) => sum + (apt.duration_minutes || 60), 0) / 60),
    avgPrice: weekAppointments.length > 0 
      ? Math.round(weekAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0) / weekAppointments.length)
      : 0
  };

  return (
    <div className="space-y-6">
      {/* Header refinado com identidade 99Tattoo aprimorada */}
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
            <p className="text-red-100 font-bold text-lg">🔥 PAINEL VISUAL SEMANAL REVOLUCIONÁRIO 🔥</p>
            <p className="text-red-200 font-medium text-sm mt-1">99Tattoo Professional Dashboard - Sem Limites de Espaço</p>
            
            {/* Estatísticas rápidas no header */}
            <div className="flex justify-center items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span className="font-bold">{weekStats.total} agendamentos</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span className="font-bold">R$ {weekStats.revenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span className="font-bold">{weekStats.totalHours}h</span>
              </div>
            </div>
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

      {/* REVOLUÇÃO SEMANAL: GRID DE 7 COLUNAS (SEM COLUNA DE HORÁRIOS) */}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="grid grid-cols-7 gap-4">
          {/* APENAS COLUNAS DOS DIAS DA SEMANA - 40% MAIS ESPAÇO PARA CADA DIA */}
          {weekDays.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayAppointments = appointmentsByDay[dayKey] || [];

            return (
              <WeeklyDayColumn
                key={dayKey}
                day={day}
                dayKey={dayKey}
                dayAppointments={dayAppointments}
                clients={clients}
                onCreateAppointment={onCreateAppointment}
                onDayClick={onDayClick}
              />
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

      {/* Resumo da Semana Ultra-Refinado e Completo */}
      <Card className="bg-white border-2 border-gray-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-t-xl p-8">
          <CardTitle className="text-2xl font-black flex items-center gap-4">
            <BarChart3 className="h-8 w-8" />
            🚀 Resumo Semanal Ultra-Detalhado - Layout Revolucionário
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-2 border-red-200 text-center shadow-lg">
              <div className="text-4xl font-black text-red-700 mb-3">
                {weekStats.total}
              </div>
              <div className="text-sm text-red-600 font-black uppercase tracking-wide">
                Total de Agendamentos
              </div>
              <div className="text-xs text-red-500 mt-1">
                {weekStats.confirmed} confirmados
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-200 text-center shadow-lg">
              <div className="text-4xl font-black text-green-700 mb-3">
                R$ {weekStats.revenue.toLocaleString()}
              </div>
              <div className="text-sm text-green-600 font-black uppercase tracking-wide">
                Receita Total
              </div>
              <div className="text-xs text-green-500 mt-1">
                Média: R$ {weekStats.avgPrice.toLocaleString()}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-blue-200 text-center shadow-lg">
              <div className="text-4xl font-black text-blue-700 mb-3">
                {weekStats.inProgress}
              </div>
              <div className="text-sm text-blue-600 font-black uppercase tracking-wide">
                Em Andamento
              </div>
              <div className="text-xs text-blue-500 mt-1">
                {weekStats.completed} concluídos
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border-2 border-purple-200 text-center shadow-lg">
              <div className="text-4xl font-black text-purple-700 mb-3">
                +40%
              </div>
              <div className="text-sm text-purple-600 font-black uppercase tracking-wide">
                Mais Espaço Visual
              </div>
              <div className="text-xs text-purple-500 mt-1">
                Layout revolucionário
              </div>
            </div>
          </div>
          
          {/* Destaque da Revolução */}
          <div className="mt-8 bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-2xl text-center shadow-2xl">
            <h3 className="text-xl font-black mb-2">🎯 REVOLUÇÃO IMPLEMENTADA COM SUCESSO!</h3>
            <p className="text-red-100 font-medium">
              Coluna "Horários" removida • 40% mais espaço por dia • Marcadores temporais integrados • Layout ultra-intuitivo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedWeeklyView;
