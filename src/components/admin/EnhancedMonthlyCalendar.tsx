
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, User, Clock, Scissors, Palette, Activity, Zap, DollarSign, Users } from 'lucide-react';
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

  // Artistas com cores mais vibrantes para diferenciação
  const artists = [
    { id: '1', name: 'João Silva', color: 'bg-red-600', dot: 'bg-red-500', ring: 'ring-red-300' },
    { id: '2', name: 'Maria Santos', color: 'bg-blue-600', dot: 'bg-blue-500', ring: 'ring-blue-300' },
    { id: '3', name: 'Pedro Costa', color: 'bg-green-600', dot: 'bg-green-500', ring: 'ring-green-300' },
    { id: '4', name: 'Ana Oliveira', color: 'bg-purple-600', dot: 'bg-purple-500', ring: 'ring-purple-300' },
    { id: '5', name: 'Carlos Mendes', color: 'bg-amber-600', dot: 'bg-amber-500', ring: 'ring-amber-300' },
  ];

  // Configuração aprimorada de cores por tipo de serviço
  const serviceTypes = {
    tattoo: { 
      icon: Palette, 
      color: 'text-red-700', 
      bg: 'bg-red-100', 
      dot: 'bg-red-600',
      ring: 'ring-red-200',
      name: 'Tatuagem'
    },
    piercing: { 
      icon: Zap, 
      color: 'text-blue-700', 
      bg: 'bg-blue-100', 
      dot: 'bg-blue-600',
      ring: 'ring-blue-200',
      name: 'Piercing'
    },
    consultation: { 
      icon: User, 
      color: 'text-purple-700', 
      bg: 'bg-purple-100', 
      dot: 'bg-purple-600',
      ring: 'ring-purple-200',
      name: 'Consulta'
    },
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
      const count = dayAppointments.filter(apt => apt.artist_id === artist.id).length;
      if (count > 0) {
        acc.push({
          ...artist,
          count
        });
      }
      return acc;
    }, [] as any[]);
    
    return artistCounts.sort((a, b) => b.count - a.count);
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
    
    return serviceCounts.sort((a, b) => b.count - a.count);
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
    <div className="space-y-8">
      {/* Header de Navegação Aprimorado */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 rounded-2xl shadow-red-glow border border-red-500">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigateMonth('prev')}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-lg rounded-xl"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-3xl font-black mb-2 text-gradient-red">
              {format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
            <p className="text-red-100 font-medium text-lg">Calendário Avançado com Mini-Dashboards Visuais</p>
          </div>
          
          <Button
            onClick={() => navigateMonth('next')}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-lg rounded-xl"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Calendário com Células Significativamente Ampliadas */}
      <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-2xl hover:shadow-red-glow transition-all duration-500">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-xl p-6">
          <CardTitle className="text-2xl font-black flex items-center gap-3">
            <CalendarIcon className="h-8 w-8" />
            Calendário Mensal Premium - Dashboard Interativo
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8">
          {/* Cabeçalhos dos dias da semana aprimorados */}
          <div className="grid grid-cols-7 gap-4 mb-8">
            {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day) => (
              <div key={day} className="text-center font-black text-red-800 py-4 bg-gradient-to-r from-red-100 to-red-200 rounded-xl border-2 border-red-300 shadow-lg">
                <span className="text-lg">{day}</span>
              </div>
            ))}
          </div>

          {/* Grid do calendário com células significativamente ampliadas */}
          <div className="grid grid-cols-7 gap-6">
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
                    h-64 transition-all duration-500 hover:shadow-2xl hover:shadow-red-glow hover:scale-[1.02] cursor-pointer transform
                    ${isCurrentMonth 
                      ? isToday 
                        ? 'bg-gradient-to-br from-red-100 via-red-200 to-red-300 border-4 border-red-600 shadow-2xl ring-4 ring-red-400 animate-pulse' 
                        : 'bg-gradient-to-br from-white via-red-50 to-red-100 border-2 border-red-300 hover:border-red-500 shadow-xl' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 opacity-60'
                    }
                  `}
                  onClick={() => onDayClick(day)}
                >
                  <CardContent className="p-4 h-full flex flex-col">
                    {/* Cabeçalho do dia aprimorado */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`
                          text-2xl font-black
                          ${isCurrentMonth ? 'text-red-800' : 'text-gray-500'}
                          ${isToday ? 'text-red-900 text-3xl' : ''}
                        `}>
                          {format(day, 'd')}
                        </span>
                        {isToday && (
                          <Badge className="bg-gradient-to-r from-red-600 to-red-800 text-white text-xs font-bold px-2 py-1 animate-bounce">
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
                          className="h-10 w-10 p-0 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-125 hover:rotate-90"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      )}
                    </div>

                    {/* Mini-Dashboard Visual Completamente Redesenhado */}
                    {isCurrentMonth && dayAppointments.length > 0 && (
                      <div className="flex-1 space-y-3">
                        {/* Total de agendamentos com destaque premium */}
                        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white text-center py-2 px-3 rounded-xl shadow-lg border border-red-500">
                          <div className="text-lg font-black">{dayAppointments.length}</div>
                          <div className="text-xs font-medium">Agendamento{dayAppointments.length !== 1 ? 's' : ''}</div>
                        </div>

                        {/* Receita do dia com destaque */}
                        {dayRevenue > 0 && (
                          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white text-center py-2 px-3 rounded-xl shadow-lg border border-green-500">
                            <div className="flex items-center justify-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span className="text-sm font-bold">R$ {dayRevenue.toLocaleString()}</span>
                            </div>
                          </div>
                        )}

                        {/* Indicadores por artista aprimorados */}
                        <div className="space-y-2">
                          {artistStats.slice(0, 3).map((stat) => (
                            <div key={stat.name} className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 border border-gray-200 shadow-sm">
                              <div className={`w-4 h-4 rounded-full ${stat.dot} border-2 border-white shadow-md ring-2 ${stat.ring}`}></div>
                              <span className="text-xs text-gray-700 font-semibold truncate flex-1">
                                {stat.name.split(' ')[0]}
                              </span>
                              <Badge className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5">
                                {stat.count}
                              </Badge>
                            </div>
                          ))}
                          {artistStats.length > 3 && (
                            <div className="text-xs text-red-700 font-bold text-center bg-red-50 rounded-lg p-2 border border-red-200">
                              +{artistStats.length - 3} artistas
                            </div>
                          )}
                        </div>

                        {/* Indicadores por tipo de serviço aprimorados */}
                        <div className="flex flex-wrap gap-2 justify-center">
                          {serviceStats.slice(0, 3).map((service) => {
                            const IconComponent = service.icon;
                            return (
                              <div key={service.type} className={`${service.bg} p-2 rounded-full border-2 border-white shadow-lg ring-2 ${service.ring} hover:scale-110 transition-transform duration-200`}>
                                <IconComponent className={`h-4 w-4 ${service.color}`} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Estado vazio premium */}
                    {isCurrentMonth && dayAppointments.length === 0 && (
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="text-gray-300 mb-3">
                          <CalendarIcon className="h-12 w-12" />
                        </div>
                        <span className="text-sm text-gray-600 font-semibold mb-1">Dia Livre</span>
                        <span className="text-xs text-gray-500">Sem agendamentos</span>
                        <div className="mt-3 w-full h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"></div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legenda Premium Aprimorada */}
      <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-2xl hover:shadow-red-glow transition-all duration-500">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-xl p-6">
          <CardTitle className="text-xl font-black flex items-center gap-3">
            <Palette className="h-6 w-6" />
            Legenda Visual Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Artistas */}
            <div>
              <h4 className="font-black text-red-800 mb-4 text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Artistas
              </h4>
              <div className="space-y-3">
                {artists.map((artist) => (
                  <div key={artist.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className={`w-5 h-5 rounded-full ${artist.dot} border-2 border-white shadow-md ring-2 ${artist.ring}`}></div>
                    <span className="text-sm font-semibold text-gray-700">{artist.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tipos de Serviço */}
            <div>
              <h4 className="font-black text-red-800 mb-4 text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Tipos de Serviço
              </h4>
              <div className="space-y-3">
                {Object.entries(serviceTypes).map(([type, config]) => {
                  const IconComponent = config.icon;
                  return (
                    <div key={type} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className={`${config.bg} p-2 rounded-full border-2 border-white shadow-md ring-2 ${config.ring}`}>
                        <IconComponent className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {config.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Novo Agendamento Premium */}
      <Dialog open={showAppointmentModal} onOpenChange={setShowAppointmentModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-xl -mx-6 -mt-6 mb-6">
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <Plus className="h-6 w-6" />
              Novo Agendamento Premium
              {selectedDate && (
                <span className="text-red-100 font-medium ml-3">
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
