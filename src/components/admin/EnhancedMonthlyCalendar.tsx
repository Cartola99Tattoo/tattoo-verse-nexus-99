import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, User, Clock, Scissors, Palette } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, Client } from '@/services/interfaces/IClientService';
import AppointmentForm from './AppointmentForm';

interface EnhancedMonthlyCalendarProps {
  appointments: Appointment[];
  clients: Client[];
  currentDate: Date;
  onCreateAppointment: (appointment: Partial<Appointment>) => void;
  onDayClick: (date: Date) => void;
}

const EnhancedMonthlyCalendar: React.FC<EnhancedMonthlyCalendarProps> = ({
  appointments,
  clients,
  currentDate,
  onCreateAppointment,
  onDayClick,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(currentDate);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mockup dos artistas
  const artists = [
    { id: '1', name: 'João Silva', color: 'bg-red-500' },
    { id: '2', name: 'Maria Santos', color: 'bg-blue-500' },
    { id: '3', name: 'Pedro Costa', color: 'bg-green-500' },
    { id: '4', name: 'Ana Oliveira', color: 'bg-purple-500' },
    { id: '5', name: 'Carlos Mendes', color: 'bg-yellow-500' },
  ];

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Adicionar dias da semana anterior e próxima para completar o grid
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());
  
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getAppointmentsForDay = (day: Date) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === dayKey);
  };

  const getArtistStats = (dayAppointments: Appointment[]) => {
    const artistCounts = artists.reduce((acc, artist) => {
      acc[artist.id] = {
        count: dayAppointments.filter(apt => apt.artist_id === artist.id).length,
        color: artist.color,
        name: artist.name
      };
      return acc;
    }, {} as Record<string, { count: number; color: string; name: string }>);
    
    return Object.values(artistCounts).filter(stat => stat.count > 0);
  };

  const handleAddAppointment = (day: Date) => {
    setSelectedDate(day);
    setShowAppointmentModal(true);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedMonth(subMonths(selectedMonth, 1));
    } else {
      setSelectedMonth(addMonths(selectedMonth, 1));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header de Navegação */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigateMonth('prev')}
            variant="ghost"
            className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-2xl font-black">
              {format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
            <p className="text-red-100 font-medium">Calendário Visual Avançado</p>
          </div>
          
          <Button
            onClick={() => navigateMonth('next')}
            variant="ghost"
            className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Calendário */}
      <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-xl">
          <CardTitle className="text-xl font-black flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            Mini-Dashboards por Dia
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Cabeçalhos dos dias da semana */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="text-center font-bold text-red-800 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Grid do calendário */}
          <div className="grid grid-cols-7 gap-3">
            {calendarDays.map((day) => {
              const dayAppointments = getAppointmentsForDay(day);
              const artistStats = getArtistStats(dayAppointments);
              const isCurrentMonth = isSameMonth(day, selectedMonth);
              const isToday = isSameDay(day, new Date());

              return (
                <Card
                  key={day.toISOString()}
                  className={`
                    h-32 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer
                    ${isCurrentMonth 
                      ? isToday 
                        ? 'bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-500 shadow-lg' 
                        : 'bg-gradient-to-br from-white to-red-50 border-2 border-red-200' 
                      : 'bg-gray-50 border border-gray-200 opacity-50'
                    }
                  `}
                  onClick={() => onDayClick(day)}
                >
                  <CardContent className="p-2 h-full flex flex-col">
                    {/* Cabeçalho do dia */}
                    <div className="flex justify-between items-center mb-2">
                      <span className={`
                        text-sm font-bold
                        ${isCurrentMonth ? 'text-red-800' : 'text-gray-400'}
                        ${isToday ? 'text-red-900' : ''}
                      `}>
                        {format(day, 'd')}
                      </span>
                      
                      {isCurrentMonth && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddAppointment(day);
                          }}
                          size="sm"
                          className="h-6 w-6 p-0 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {/* Mini-Dashboard */}
                    {isCurrentMonth && dayAppointments.length > 0 && (
                      <div className="flex-1 space-y-1">
                        {/* Total de agendamentos */}
                        <Badge className="bg-red-600 text-white text-xs font-bold w-full justify-center">
                          {dayAppointments.length} Agendamento{dayAppointments.length !== 1 ? 's' : ''}
                        </Badge>

                        {/* Indicadores por artista */}
                        <div className="space-y-1">
                          {artistStats.slice(0, 2).map((stat) => (
                            <div key={stat.name} className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
                              <span className="text-xs text-red-700 font-medium truncate">
                                {stat.name.split(' ')[0]}: {stat.count}
                              </span>
                            </div>
                          ))}
                          {artistStats.length > 2 && (
                            <div className="text-xs text-red-600 font-medium">
                              +{artistStats.length - 2} mais
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Estado vazio */}
                    {isCurrentMonth && dayAppointments.length === 0 && (
                      <div className="flex-1 flex items-center justify-center">
                        <span className="text-xs text-gray-400">Livre</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal Novo Agendamento */}
      <Dialog open={showAppointmentModal} onOpenChange={setShowAppointmentModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto bg-gradient-to-br from-white to-red-50 border-red-200">
          <DialogHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white p-4 rounded-lg -mx-6 -mt-6 mb-6">
            <DialogTitle className="text-xl font-black flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Novo Agendamento
              {selectedDate && (
                <span className="text-red-100 font-medium ml-2">
                  - {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <AppointmentForm
            clients={clients}
            onSuccess={() => {
              if (selectedDate) {
                onCreateAppointment({
                  date: format(selectedDate, 'yyyy-MM-dd')
                });
              }
              setShowAppointmentModal(false);
              setSelectedDate(null);
            }}
            onClose={() => {
              setShowAppointmentModal(false);
              setSelectedDate(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedMonthlyCalendar;
