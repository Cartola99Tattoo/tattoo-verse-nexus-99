
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, User, DollarSign, Palette, Zap, Phone, Activity } from 'lucide-react';
import { Appointment, Client } from '@/services/interfaces/IClientService';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface UltraOptimizedAppointmentBlockProps {
  appointment: Appointment;
  client?: Client;
  isOverlay?: boolean;
}

const UltraOptimizedAppointmentBlock: React.FC<UltraOptimizedAppointmentBlockProps> = ({ 
  appointment, 
  client, 
  isOverlay = false 
}) => {
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

  // CONSTANTES MATEMÁTICAS PARA ALINHAMENTO PERFEITO
  const PIXELS_PER_HOUR = 80;
  const START_HOUR = 8;
  const BORDER_OFFSET = 2;

  // Paleta refinada 99Tattoo com cores sutis
  const artists = [
    { 
      id: '1', 
      name: 'João Silva', 
      primaryColor: '#dc2626', 
      lightBg: '#fefefe', 
      borderColor: '#dc262666',
      textColor: '#1a1a1a'
    },
    { 
      id: '2', 
      name: 'Maria Santos', 
      primaryColor: '#2563eb', 
      lightBg: '#fefefe', 
      borderColor: '#2563eb66',
      textColor: '#1a1a1a'
    },
    { 
      id: '3', 
      name: 'Pedro Costa', 
      primaryColor: '#059669', 
      lightBg: '#fefefe', 
      borderColor: '#05966966',
      textColor: '#1a1a1a'
    },
    { 
      id: '4', 
      name: 'Ana Oliveira', 
      primaryColor: '#7c3aed', 
      lightBg: '#fefefe', 
      borderColor: '#7c3aed66',
      textColor: '#1a1a1a'
    },
    { 
      id: '5', 
      name: 'Carlos Mendes', 
      primaryColor: '#d97706', 
      lightBg: '#fefefe', 
      borderColor: '#d9770666',
      textColor: '#1a1a1a'
    },
  ];

  // Tipos de serviço com ícones e abreviações inteligentes
  const serviceTypes = {
    tattoo: { icon: Palette, name: 'Tattoo', short: 'TAT', abbrev: 'T', color: '#dc2626' },
    piercing: { icon: Zap, name: 'Piercing', short: 'PIE', abbrev: 'P', color: '#2563eb' },
    consultation: { icon: User, name: 'Consulta', short: 'CON', abbrev: 'C', color: '#059669' },
  };

  // Status com feedback visual aprimorado
  const statusConfig = {
    scheduled: { 
      name: 'Agendado', 
      dotColor: '#f59e0b',
      showProgress: false,
      pulse: false
    },
    confirmed: { 
      name: 'Confirmado', 
      dotColor: '#10b981',
      showProgress: false,
      pulse: false
    },
    in_progress: { 
      name: 'Em Andamento', 
      dotColor: '#3b82f6',
      showProgress: true,
      pulse: true,
      progress: 65
    },
    completed: { 
      name: 'Concluído', 
      dotColor: '#8b5cf6',
      showProgress: false,
      pulse: false
    },
    cancelled: { 
      name: 'Cancelado', 
      dotColor: '#ef4444',
      showProgress: false,
      pulse: false
    },
  };

  const artist = artists.find(a => a.id === appointment.artist_id) || artists[0];
  const serviceConfig = serviceTypes[appointment.service_type as keyof typeof serviceTypes] || serviceTypes.tattoo;
  const statusInfo = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.scheduled;
  const ServiceIcon = serviceConfig.icon;
  
  // CÁLCULOS MATEMÁTICOS PRECISOS PARA POSICIONAMENTO
  const duration = appointment.duration_minutes || 60;
  const height = Math.max(48, (duration / 60) * PIXELS_PER_HOUR);
  
  // Calcular posição vertical ULTRA-PRECISA
  const [hours, minutes] = appointment.time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const startHourMinutes = START_HOUR * 60;
  const topPosition = ((totalMinutes - startHourMinutes) / 60) * PIXELS_PER_HOUR;

  // Calcular horário de fim
  const endMinutes = totalMinutes + duration;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

  // Layout adaptativo inteligente baseado na duração
  const isUltraShort = duration < 45;   // Apenas essencial
  const isShort = duration >= 45 && duration < 90;     // Horário + cliente + ícone
  const isMedium = duration >= 90 && duration < 180;   // + tipo serviço
  const isLong = duration >= 180;                      // Informações completas

  // Nome do cliente otimizado para hierarquia
  const clientName = client?.name || 'Cliente';
  const clientFirstName = clientName.split(' ')[0];
  const clientInitials = clientName.split(' ').map(n => n[0]).join('').toUpperCase();
  
  // Espaçamento científico baseado na altura
  const padding = Math.max(8, Math.min(16, height * 0.15));

  const AppointmentContent = () => (
    <div
      className={`
        relative h-full overflow-hidden rounded-lg border-l-[6px] border-r border-t border-b 
        bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-80 scale-[1.02] shadow-xl rotate-1 z-50' : ''}
        ${isOverlay ? 'scale-105 shadow-2xl ring-2 ring-red-300 z-50' : ''}
        group hover:scale-[1.01] hover:brightness-105
      `}
      style={{ 
        borderLeftColor: artist.primaryColor,
        backgroundColor: artist.lightBg,
        borderColor: artist.borderColor,
      }}
    >
      {/* Barra de progresso para "Em Andamento" */}
      {statusInfo.showProgress && 'progress' in statusInfo && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200 overflow-hidden z-10">
          <div 
            className={`h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ${statusInfo.pulse ? 'animate-pulse' : ''}`}
            style={{ width: `${statusInfo.progress}%` }}
          />
        </div>
      )}

      {/* Indicador de status pulsante para "Em Andamento" */}
      {statusInfo.pulse && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 opacity-70 animate-pulse z-10"
          style={{ backgroundColor: statusInfo.dotColor }}
        />
      )}

      <div 
        className="h-full flex flex-col justify-between relative z-20"
        style={{ padding: `${padding}px` }}
      >
        {/* SEÇÃO PRIMÁRIA: Informações Essenciais (sempre visíveis) */}
        <div className="space-y-1">
          {/* Horário - MÁXIMA PRIORIDADE - Tipografia aprimorada */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" style={{ color: artist.primaryColor }} />
              <span 
                className="font-black tracking-tight leading-none" 
                style={{ 
                  color: artist.textColor,
                  fontSize: isUltraShort ? '14px' : '16px'
                }}
              >
                {appointment.time}
              </span>
              {!isUltraShort && (
                <span className="text-xs font-medium text-gray-500 leading-none">
                  - {endTime}
                </span>
              )}
            </div>
            
            {/* Status dot refinado */}
            <div className="flex items-center gap-1">
              <div 
                className={`w-2.5 h-2.5 rounded-full ${statusInfo.pulse ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: statusInfo.dotColor }}
              />
              {(statusInfo.pulse && statusInfo.showProgress) && (
                <Activity className="h-3 w-3 text-blue-500 animate-spin" style={{ animationDuration: '2s' }} />
              )}
            </div>
          </div>

          {/* Cliente - SEGUNDA PRIORIDADE - Hierarquia aprimorada */}
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
            <span 
              className="font-bold leading-none truncate" 
              style={{ 
                color: artist.textColor,
                fontSize: isUltraShort ? '12px' : '14px'
              }}
            >
              {isUltraShort ? clientInitials : clientFirstName}
            </span>
          </div>

          {/* Tipo de Serviço - Visível baseado na duração */}
          {!isUltraShort && (
            <div className="flex items-center gap-1.5">
              <ServiceIcon 
                className="h-3.5 w-3.5 flex-shrink-0" 
                style={{ color: serviceConfig.color }} 
              />
              <span className="text-xs font-semibold text-gray-700 leading-none">
                {isShort ? serviceConfig.abbrev : (isMedium ? serviceConfig.short : serviceConfig.name)}
              </span>
            </div>
          )}
        </div>

        {/* SEÇÃO SECUNDÁRIA: Informações Expandidas (blocos médios) */}
        {isMedium && (
          <div className="space-y-1 pt-1 border-t border-gray-200/60">
            <div className="flex items-center gap-1.5">
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: artist.primaryColor }}
              />
              <span className="text-xs font-medium text-gray-600 truncate leading-none">
                {artist.name.split(' ')[0]}
              </span>
            </div>
          </div>
        )}

        {/* SEÇÃO TERCIÁRIA: Informações Completas (blocos longos) */}
        {isLong && (
          <div className="space-y-1.5 pt-2 border-t border-gray-200/60">
            {/* Artista completo */}
            <div className="flex items-center gap-1.5">
              <div 
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: artist.primaryColor }}
              />
              <span className="text-xs font-medium text-gray-600 truncate leading-none">
                {artist.name}
              </span>
            </div>

            {/* Status detalhado */}
            <div className="flex items-center gap-1.5">
              <div 
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusInfo.pulse ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: statusInfo.dotColor }}
              />
              <span className="text-xs font-medium text-gray-600 leading-none">
                {statusInfo.name}
              </span>
            </div>

            {/* Preço */}
            {appointment.estimated_price && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3 w-3 text-green-600 flex-shrink-0" />
                <span className="text-xs font-bold text-green-700 leading-none">
                  R$ {appointment.estimated_price.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Duração para blocos ultra curtos */}
        {isUltraShort && (
          <div className="text-center">
            <span className="text-xs font-bold text-gray-500 leading-none">
              {duration}min
            </span>
          </div>
        )}
      </div>

      {/* Hover overlay orgânico */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none rounded-lg"></div>
      
      {/* Indicador de drag ativo com animação fluida */}
      {isDragging && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-lg border-2 border-red-400/50 animate-pulse"></div>
      )}
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      style={{ 
        ...style, 
        height: `${height}px`,
        top: `${Math.max(0, topPosition)}px`,
        position: 'absolute',
        width: `calc(100% - ${BORDER_OFFSET * 2}px)`,
        left: `${BORDER_OFFSET}px`,
        zIndex: isDragging ? 1000 : 10
      }}
      {...attributes}
      {...listeners}
    >
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div className="h-full">
            <AppointmentContent />
          </div>
        </HoverCardTrigger>
        <HoverCardContent 
          className="w-80 p-6 bg-white border-2 border-red-200 shadow-2xl rounded-xl z-50"
          sideOffset={10}
        >
          <div className="space-y-4">
            {/* Header do tooltip */}
            <div className="flex items-center justify-between border-b border-red-100 pb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: artist.primaryColor }}
                />
                <h3 className="font-bold text-lg text-gray-900">{clientName}</h3>
              </div>
              <Badge 
                className="text-white font-bold"
                style={{ backgroundColor: statusInfo.dotColor }}
              >
                {statusInfo.name}
              </Badge>
            </div>

            {/* Informações do agendamento */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-semibold text-gray-800">
                  {appointment.time} - {endTime} ({duration}min)
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <ServiceIcon className="h-4 w-4" style={{ color: serviceConfig.color }} />
                <span className="font-medium text-gray-700">
                  {serviceConfig.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">
                  Artista: {artist.name}
                </span>
              </div>

              {appointment.estimated_price && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-green-700">
                    R$ {appointment.estimated_price.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Descrição do serviço */}
            {appointment.service_description && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {appointment.service_description}
                </p>
              </div>
            )}

            {/* Informações do cliente */}
            {client && (
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <h4 className="font-semibold text-gray-800">Contato:</h4>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{client.phone}</span>
                </div>
                {client.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span>📧</span>
                    <span>{client.email}</span>
                  </div>
                )}
              </div>
            )}

            {/* Ações rápidas */}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Button size="sm" variant="tattoo" className="flex-1">
                <Phone className="h-3 w-3 mr-1" />
                Ligar
              </Button>
              <Button size="sm" variant="tattooOutline" className="flex-1">
                📱 WhatsApp
              </Button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default UltraOptimizedAppointmentBlock;
