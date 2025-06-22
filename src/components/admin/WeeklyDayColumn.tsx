
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

  // SISTEMA DE MARCADORES TEMPORAIS INTEGRADOS - REVOLUÇÃO ESPACIAL
  const timeMarkers = [];
  const PIXELS_PER_HOUR = 80; // Constante matemática precisa
  const START_HOUR = 8;
  const END_HOUR = 20;
  
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    timeMarkers.push({ 
      hour, 
      top: (hour - START_HOUR) * PIXELS_PER_HOUR,
      isCurrentHour: isToday && new Date().getHours() === hour,
      label: `${hour.toString().padStart(2, '0')}h`
    });
  }

  return (
    <div className="min-h-[1120px]">
      <Card className={`
        h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 
        ${isToday ? 'border-red-400 shadow-red-200 ring-2 ring-red-200' : 'border-gray-200'}
      `}>
        <CardHeader className={`
          p-6 rounded-t-xl transition-all duration-300 
          ${isToday 
            ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white' 
            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300'
          }
        `}>
          <CardTitle className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {/* DESTAQUE VISUAL DOS DIAS DA SEMANA EM VERMELHO - IDENTIDADE 99TATTOO */}
              <span className={`text-sm font-black tracking-wide uppercase ${
                isToday ? 'text-white' : 'text-red-600'
              }`}>
                {format(day, 'EEEE', { locale: ptBR })}
              </span>
            </div>
            
            {/* NÚMERO DO DIA EM VERMELHO - IDENTIDADE 99TATTOO */}
            <div className={`text-3xl font-black tracking-tight ${
              isToday ? 'text-white' : 'text-red-600'
            }`}>
              {format(day, 'dd', { locale: ptBR })}
            </div>
            
            {isToday && (
              <Badge className="bg-white text-red-700 font-black text-xs px-3 py-1 shadow-lg animate-pulse">
                🔥 HOJE
              </Badge>
            )}

            {/* Indicadores dinâmicos aprimorados */}
            <div className="flex justify-center gap-2 flex-wrap">
              {stats.inProgress > 0 && (
                <Badge className="bg-blue-500 text-white font-bold text-xs px-2 py-1 animate-pulse flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  {stats.inProgress} EM ANDAMENTO
                </Badge>
              )}
              
              {stats.confirmed > 0 && (
                <Badge className="bg-green-500 text-white font-bold text-xs px-2 py-1">
                  ✅ {stats.confirmed} CONFIRMADOS
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 space-y-4">
          {/* Dashboard mini EXPANDIDO com mais espaço */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border-2 border-gray-200 shadow-inner">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-600" />
                  <div className="text-2xl font-black text-gray-800">{stats.count}</div>
                </div>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Agendamentos</div>
              </div>
              
              <div className="text-center space-y-2">
                {stats.revenue > 0 ? (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div className="text-lg font-black text-green-700">
                        R$ {stats.revenue.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Receita</div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-5 w-5 text-gray-600" />
                      <div className="text-lg font-black text-gray-700">
                        {Math.round(stats.duration / 60)}h
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Horas</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* BOTÃO REDESENHADO: CÍRCULO VERMELHO COM RELÓGIO + PLUS - IDENTIDADE 99TATTOO */}
          <Button
            onClick={() => onCreateAppointment(day)}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black transition-all duration-300 text-sm py-6 shadow-lg hover:shadow-xl transform hover:scale-[1.02] rounded-xl relative overflow-hidden group"
          >
            <div className="flex items-center justify-center gap-3 relative z-10">
              {/* CÍRCULO VERMELHO COM ÍCONES - DESIGN MODERNO */}
              <div className="bg-white/20 rounded-full p-2 flex items-center justify-center">
                <div className="relative">
                  <Clock className="h-4 w-4 text-white" />
                  <Plus className="h-3 w-3 text-white absolute -top-1 -right-1" />
                </div>
              </div>
              <span className="font-black text-sm">🚀 NOVO AGENDAMENTO</span>
            </div>
            {/* Efeito hover shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </Button>

          {/* ÁREA REVOLUCIONÁRIA DOS AGENDAMENTOS COM MARCADORES TEMPORAIS INTEGRADOS */}
          <div 
            className="relative bg-gradient-to-b from-gray-50 to-white rounded-xl border-2 border-gray-200 shadow-inner overflow-hidden" 
            style={{ height: `${13 * PIXELS_PER_HOUR}px` }}
          >
            {/* MARCADORES TEMPORAIS INTEGRADOS - SEM COLUNA DEDICADA */}
            {timeMarkers.map((marker) => (
              <div key={`${marker.hour}-integrated-time`}>
                {/* Linha horizontal precisa */}
                <div 
                  className={`absolute left-0 right-0 border-t transition-colors duration-300 z-10 ${
                    marker.isCurrentHour ? 'border-red-500 border-t-2' : 'border-gray-300'
                  }`}
                  style={{ top: `${marker.top}px` }}
                >
                  {/* Label do horário integrado na lateral */}
                  <span className={`
                    absolute right-2 -top-3 text-xs font-bold transition-all duration-300 px-2 py-1 rounded-md z-20
                    ${marker.isCurrentHour 
                      ? 'bg-red-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {marker.label}
                  </span>
                </div>
                
                {/* Linha de meio (30min) discreta */}
                <div 
                  className="absolute left-6 right-6 h-px bg-gray-200/50 z-5"
                  style={{ top: `${marker.top + (PIXELS_PER_HOUR / 2)}px` }}
                />
              </div>
            ))}
            
            {/* Área dos blocos de agendamento com mais espaço */}
            <SortableContext items={dayAppointments.map(apt => apt.id)} strategy={verticalListSortingStrategy}>
              <div className="relative h-full" id={dayKey} style={{ paddingTop: '4px', paddingLeft: '4px', paddingRight: '4px' }}>
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
                    <CalendarIcon className="h-24 w-24 mb-4 opacity-20" />
                    <p className="text-lg font-bold">✨ Dia Livre</p>
                    <p className="text-sm text-gray-500 mt-1">Mais espaço para criatividade</p>
                  </div>
                )}
              </div>
            </SortableContext>
          </div>

          {/* Botão Ver Detalhes AMPLIADO */}
          <Button
            onClick={() => onDayClick(day)}
            variant="outline"
            className="w-full text-gray-700 border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 text-sm py-4 font-bold rounded-xl transform hover:scale-[1.02]"
          >
            <Eye className="h-5 w-5 mr-2" />
            👁️ Ver Detalhes Completos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyDayColumn;
