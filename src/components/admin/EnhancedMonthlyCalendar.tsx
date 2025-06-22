
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, User, Clock, Scissors, Palette, Activity, Zap } from 'lucide-react';
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

  // Mockup dos artistas com cores para diferenciação
  const artists = [
    { id: '1', name: 'João Silva', color: 'bg-red-500', dot: 'bg-red-400' },
    { id: '2', name: 'Maria Santos', color: 'bg-blue-500', dot: 'bg-blue-400' },
    { id: '3', name: 'Pedro Costa', color: 'bg-green-500', dot: 'bg-green-400' },
    { id: '4', name: 'Ana Oliveira', color: 'bg-purple-500', dot: 'bg-purple-400' },
    { id: '5', name: 'Carlos Mendes', color: 'bg-yellow-600', dot: 'bg-yellow-500' },
  ];

  // Configuração de cores por tipo de serviço
  const serviceTypes = {
    tattoo: { icon: Palette, color: 'text-red-600', bg: 'bg-red-100', dot: 'bg-red-500' },
    piercing: { icon: Zap, color: 'text-blue-600', bg: 'bg-blue-100', dot: 'bg-blue-500' },
    removal: { icon: Activity, color: 'text-green-600', bg: 'bg-green-100', dot: 'bg-green-500' },
    consultation: { icon: User, color: 'text-purple-600', bg: 'bg-purple-100', dot: 'bg-purple-500' },
  };

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
        dot: artist.dot,
        name: artist.name
      };
      return acc;
    }, {} as Record<string, { count: number; color: string; dot: string; name: string }>);
    
    return Object.values(artistCounts).filter(stat => stat.count > 0);
  };

  const getServiceStats = (dayAppointments: Appointment[]) => {
    const serviceCounts = Object.keys(serviceTypes).reduce((acc, serviceType) => {
      const count = dayAppointments.filter(apt => apt.service_type === serviceType).length;
      if (count > 0) {
        acc.push({
          type: serviceType,
          count,
          ...serviceTypes[serviceType as keyof typeof serviceTypes]
        });
      }
      return acc;
    }, [] as any[]);
    
    return serviceCounts;
  };

  const getDayRevenue = (dayAppointments: Appointment[]) => {
    return dayAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0);
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
            <p className="text-red-100 font-medium">Calendário com Mini-Dashboards Visuais</p>
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

      {/* Calendário com Células Ampliadas */}
      <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-xl">
          <CardTitle className="text-xl font-black flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            Calendário Mensal - Mini-Dashboards por Dia
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Cabeçalhos dos dias da semana */}
          <div className="grid grid-cols-7 gap-3 mb-6">
            {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day) => (
              <div key={day} className="text-center font-bold text-red-800 py-3 bg-gradient-to-r from-red-100 to-red-200 rounded-lg border border-red-300">
                {day}
              </div>
            ))}
          </div>

          {/* Grid do calendário com células ampliadas */}
          <div className="grid grid-cols-7 gap-4">
            {calendarDays.map((day) => {
              const dayAppointments = getAppointmentsForDay(day);
              const artistStats = getArtistStats(dayAppointments);
              const serviceStats = getServiceStats(dayAppointments);
              const dayRevenue = getDayRevenue(dayAppointments);
              const isCurrentMonth = isSameMonth(day, selectedMonth);
              const isToday = isSameDay(day, new Date());

              return (
                <Card
                  key={day.toISOString()}
                  className={`
                    h-40 transition-all duration-300 hover:shadow-xl hover:scale-102 cursor-pointer
                    ${isCurrentMonth 
                      ? isToday 
                        ? 'bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-500 shadow-lg ring-2 ring-red-300' 
                        : 'bg-gradient-to-br from-white to-red-50 border-2 border-red-200 hover:border-red-400' 
                      : 'bg-gray-50 border border-gray-200 opacity-50'
                    }
                  `}
                  onClick={() => onDayClick(day)}
                >
                  <CardContent className="p-3 h-full flex flex-col">
                    {/* Cabeçalho do dia */}
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`
                          text-lg font-black
                          ${isCurrentMonth ? 'text-red-800' : 'text-gray-400'}
                          ${isToday ? 'text-red-900 text-xl' : ''}
                        `}>
                          {format(day, 'd')}
                        </span>
                        {isToday && (
                          <Badge className="bg-red-600 text-white text-xs font-bold">
                            HOJE
                          </Badge>
                        )}
                      </div>
                      
                      {isCurrentMonth && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddAppointment(day);
                          }}
                          size="sm"
                          className="h-7 w-7 p-0 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Mini-Dashboard Visual Aprimorado */}
                    {isCurrentMonth && dayAppointments.length > 0 && (
                      <div className="flex-1 space-y-2">
                        {/* Total de agendamentos com destaque */}
                        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-1 px-2 rounded-lg shadow-md">
                          <div className="text-sm font-black">{dayAppointments.length}</div>
                          <div className="text-xs">Agendamento{dayAppointments.length !== 1 ? 's' : ''}</div>
                        </div>

                        {/* Receita do dia */}
                        {dayRevenue > 0 && (
                          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-1 px-2 rounded-lg shadow-md">
                            <div className="text-xs font-bold">R$ {dayRevenue.toLocaleString()}</div>
                          </div>
                        )}

                        {/* Indicadores por artista com pontos coloridos */}
                        <div className="space-y-1">
                          {artistStats.slice(0, 2).map((stat) => (
                            <div key={stat.name} className="flex items-center gap-2 bg-white/80 rounded p-1">
                              <div className={`w-3 h-3 rounded-full ${stat.dot} border border-white shadow-sm`}></div>
                              <span className="text-xs text-red-700 font-medium truncate flex-1">
                                {stat.name.split(' ')[0]}: {stat.count}
                              </span>
                            </div>
                          ))}
                          {artistStats.length > 2 && (
                            <div className="text-xs text-red-600 font-bold text-center bg-white/60 rounded p-1">
                              +{artistStats.length - 2} artistas
                            </div>
                          )}
                        </div>

                        {/* Indicadores por tipo de serviço */}
                        <div className="flex flex-wrap gap-1 justify-center">
                          {serviceStats.slice(0, 3).map((service) => {
                            const IconComponent = service.icon;
                            return (
                              <div key={service.type} className={`${service.bg} p-1 rounded-full border`}>
                                <IconComponent className={`h-3 w-3 ${service.color}`} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Estado vazio aprimorado */}
                    {isCurrentMonth && dayAppointments.length === 0 && (
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="text-gray-300 mb-2">
                          <CalendarIcon className="h-8 w-8" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Dia Livre</span>
                        <span className="text-xs text-gray-400">Sem agendamentos</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legenda de Cores */}
      <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-xl">
          <CardTitle className="text-lg font-black flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Legenda Visual
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Artistas */}
            <div>
              <h4 className="font-bold text-red-800 mb-3">Artistas</h4>
              <div className="space-y-2">
                {artists.map((artist) => (
                  <div key={artist.id} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${artist.dot} border border-gray-300 shadow-sm`}></div>
                    <span className="text-sm font-medium text-gray-700">{artist.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tipos de Serviço */}
            <div>
              <h4 className="font-bold text-red-800 mb-3">Tipos de Serviço</h4>
              <div className="space-y-2">
                {Object.entries(serviceTypes).map(([type, config]) => {
                  const IconComponent = config.icon;
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <div className={`${config.bg} p-1 rounded-full border`}>
                        <IconComponent className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {type === 'tattoo' ? 'Tatuagem' : 
                         type === 'piercing' ? 'Piercing' : 
                         type === 'removal' ? 'Remoção' : 'Consulta'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
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
