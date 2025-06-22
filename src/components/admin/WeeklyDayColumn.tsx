
import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Plus, Eye, Activity, TrendingUp, Clock } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, Client } from '@/services/interfaces/IClientService';
import UltraOptimizedAppointmentBlock from './UltraOptimizedAppointmentBlock';

interface WeeklyDayColumnProps {
  day: Date;
  dayKey: string;
  dayAppointments: Appointment[];
  clients: Client[];
  onCreateAppointment: (date: Date) => void;
  onDayClick: (date: Date) => void;
}

const WeeklyDayColumn: React.FC<WeeklyDayColumnProps> = ({
  day,
  dayKey,
  dayAppointments,
  clients,
  onCreateAppointment,
  onDayClick,
}) => {
  const isToday = isSameDay(day, new Date());
  
  // Estatísticas do dia
  const stats = {
    count: dayAppointments.length,
    revenue: dayAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0),
    duration: dayAppointments.reduce((sum, apt) => sum + (apt.duration_minutes || 60), 0),
    inProgress: dayAppointments.filter(apt => apt.status === 'in_progress').length,
    confirmed: dayAppointments.filter(apt => apt.status === 'confirmed').length
  };

  // Escala de tempo para grid lines - ALINHAMENTO MATEMÁTICO PRECISO
  const timeScale = [];
  const PIXELS_PER_HOUR = 80; // Constante para garantir alinhamento
  const START_HOUR = 8;
  
  for (let hour = START_HOUR; hour <= 20; hour++) {
    timeScale.push({ 
      hour, 
      top: (hour - START_HOUR) * PIXELS_PER_HOUR,
      isCurrentHour: isToday && new Date().getHours() === hour
    });
  }

  return (
    <div className="min-h-[1120px]">
      <Card className={`
        h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 
        ${isToday ? 'border-red-400 shadow-red-200 ring-2 ring-red-200' : 'border-gray-200'}
      `}>
        <CardHeader className={`
          p-5 rounded-t-xl transition-all duration-300 
          ${isToday 
            ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white' 
            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300'
          }
        `}>
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
              <Badge className="bg-white text-red-700 font-black text-xs px-3 py-1 shadow-lg animate-pulse">
                HOJE
              </Badge>
            )}

            {/* Indicadores dinâmicos */}
            <div className="flex justify-center gap-2">
              {stats.inProgress > 0 && (
                <Badge className="bg-blue-500 text-white font-bold text-xs px-2 py-1 animate-pulse flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  {stats.inProgress} EM ANDAMENTO
                </Badge>
              )}
              
              {stats.confirmed > 0 && (
                <Badge className="bg-green-500 text-white font-bold text-xs px-2 py-1">
                  {stats.confirmed} CONFIRMADOS
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 space-y-4">
          {/* Dashboard mini refinado */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 shadow-inner">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <CalendarIcon className="h-4 w-4 text-gray-600" />
                  <div className="text-xl font-black text-gray-800">{stats.count}</div>
                </div>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Agendamentos</div>
              </div>
              
              <div className="text-center space-y-1">
                {stats.revenue > 0 ? (
                  <>
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <div className="text-sm font-black text-green-700">
                        R$ {stats.revenue.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Receita</div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <div className="text-sm font-black text-gray-700">
                        {Math.round(stats.duration / 60)}h
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Horas</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Botão Adicionar Ultra-Refinado - AGORA CONECTADO AO MODAL */}
          <Button
            onClick={() => onCreateAppointment(day)}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black transition-all duration-300 text-sm py-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>

          {/* Área dos agendamentos com grid refinado - ALINHAMENTO MATEMÁTICO PRECISO */}
          <div 
            className="relative bg-gradient-to-b from-gray-50 to-white rounded-xl border-2 border-gray-200 shadow-inner overflow-hidden" 
            style={{ height: `${13 * PIXELS_PER_HOUR}px` }} // 13 horas * 80px = 1040px
          >
            {/* Grid lines horizontais MATEMATICAMENTE PRECISAS */}
            {timeScale.map((time) => (
              <div key={`${time.hour}-grid-container`}>
                {/* Linha principal do horário */}
                <div 
                  className={`absolute left-0 right-0 border-t-2 transition-colors duration-300 z-10 ${
                    time.isCurrentHour ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{ top: `${time.top}px` }}
                >
                  {/* Label do horário - POSICIONAMENTO PRECISO */}
                  <span className={`
                    absolute right-2 -top-2 text-xs font-bold transition-colors duration-300 bg-white px-1 rounded z-20
                    ${time.isCurrentHour ? 'text-red-600' : 'text-gray-500'}
                  `}>
                    {time.hour}h
                  </span>
                </div>
                
                {/* Linha de meio (30min) - ALINHAMENTO PERFEITO */}
                <div 
                  className="absolute left-4 right-4 h-px bg-gray-200/60 z-5"
                  style={{ top: `${time.top + (PIXELS_PER_HOUR / 2)}px` }}
                />
              </div>
            ))}
            
            {/* Área dos blocos de agendamento */}
            <SortableContext items={dayAppointments.map(apt => apt.id)} strategy={verticalListSortingStrategy}>
              <div className="relative h-full" id={dayKey} style={{ paddingTop: '2px', paddingLeft: '2px', paddingRight: '2px' }}>
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
                
                {/* Estado vazio otimizado */}
                {dayAppointments.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
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
};

export default WeeklyDayColumn;
