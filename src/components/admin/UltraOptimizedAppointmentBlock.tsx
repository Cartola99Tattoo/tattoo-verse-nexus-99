
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

const UltraOptimizedAppointmentBlock: React.FC<Ul​traOptimizedAppointmentBlockProps> = ({ 
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

  // Tipos de serviço com ícones e cores
  const serviceTypes = {
    tattoo: { icon: Palette, name: 'Tattoo', color: '#dc2626', dot: '🎨' },
    piercing: { icon: Zap, name: 'Piercing', color: '#2563eb', dot: '⚡' },
    consultation: { icon: User, name: 'Consulta', color: '#059669', dot: '💬' },
  };

  // Status com feedback visual
  const statusConfig = {
    scheduled: { 
      name: 'Agendado', 
      dotColor: '#f59e0b',
      pulse: false
    },
    confirmed: { 
      name: 'Confirmado', 
      dotColor: '#10b981',
      pulse: false
    },
    in_progress: { 
      name: 'Em Andamento', 
      dotColor: '#3b82f6',
      pulse: true
    },
    completed: { 
      name: 'Concluído', 
      dotColor: '#8b5cf6',
      pulse: false
    },
    cancelled: { 
      name: 'Cancelado', 
      dotColor: '#ef4444',
      pulse: false
    },
  };

  const artist = artists.find(a => a.id === appointment.artist_id) || artists[0];
  const serviceConfig = serviceTypes[appointment.service_type as keyof typeof serviceTypes] || serviceTypes.tattoo;
  const statusInfo = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.scheduled;
  
  // CÁLCULOS MATEMÁTICOS PRECISOS PARA POSICIONAMENTO
  const duration = appointment.duration_minutes || 60;
  const height = Math.max(40, (duration / 60) * PIXELS_PER_HOUR);
  
  // Calcular posição vertical ULTRA-PRECISA
  const [hours, minutes] = appointment.time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const startHourMinutes = START_HOUR * 60;
  const topPosition = ((totalMinutes - startHourMinutes) / 60) * PIXELS_PER_HOUR;

  // Nome do cliente otimizado
  const clientName = client?.name || 'Cliente';
  const clientFirstName = clientName.split(' ')[0];
  
  // Layout adaptativo baseado na duração - INFORMAÇÕES ESSENCIAIS APENAS
  const isShort = duration < 90;

  const AppointmentContent = () => (
    <div
      className={`
        relative h-full overflow-hidden rounded-lg border-l-[4px] border-r border-t border-b 
        bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-80 scale-[1.02] shadow-lg rotate-1 z-50' : ''}
        ${isOverlay ? 'scale-105 shadow-xl ring-2 ring-red-300 z-50' : ''}
        group hover:scale-[1.01] hover:brightness-105
      `}
      style={{ 
        borderLeftColor: artist.primaryColor,
        backgroundColor: artist.lightBg,
        borderColor: artist.borderColor,
      }}
    >
      {/* Barra de progresso para "Em Andamento" */}
      {statusInfo.pulse && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200 overflow-hidden z-10">
          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-2/3 animate-pulse" />
        </div>
      )}

      <div className="h-full flex flex-col justify-between p-2 relative z-20">
        {/* INFORMAÇÕES ESSENCIAIS APENAS */}
        <div className="space-y-1">
          {/* Horário - MÁXIMA PRIORIDADE */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 flex-shrink-0" style={{ color: artist.primaryColor }} />
              <span 
                className="font-black text-sm leading-none" 
                style={{ color: artist.textColor }}
              >
                {appointment.time}
              </span>
            </div>
            
            {/* Status dot + Service dot */}
            <div className="flex items-center gap-1">
              <div 
                className={`w-2 h-2 rounded-full ${statusInfo.pulse ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: statusInfo.dotColor }}
              />
              <span className="text-xs">{serviceConfig.dot}</span>
            </div>
          </div>

          {/* Cliente - SEGUNDA PRIORIDADE */}
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-gray-500 flex-shrink-0" />
            <span 
              className="font-bold text-xs leading-none truncate" 
              style={{ color: artist.textColor }}
            >
              {clientFirstName}
            </span>
          </div>

          {/* Duração para blocos curtos */}
          {isShort && (
            <div className="text-center pt-1">
              <span className="text-xs font-medium text-gray-500">
                {duration}min
              </span>
            </div>
          )}
        </div>

        {/* Preço (apenas para blocos longos) */}
        {!isShort && appointment.estimated_price && (
          <div className="flex items-center gap-1 justify-center">
            <DollarSign className="h-3 w-3 text-green-600 flex-shrink-0" />
            <span className="text-xs font-bold text-green-700">
              R$ {appointment.estimated_price.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Hover overlay sutil */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none rounded-lg" />
      
      {/* Indicador de drag ativo */}
      {isDragging && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-600/5 rounded-lg border border-red-400/30" />
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
      <HoverCard openDelay={150} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div className="h-full">
            <AppointmentContent />
          </div>
        </HoverCardTrigger>
        <HoverCardContent 
          className="w-80 p-5 bg-white border-2 border-red-200 shadow-xl rounded-xl z-50"
          sideOffset={8}
        >
          <div className="space-y-4">
            {/* Header do tooltip */}
            <div className="flex items-center justify-between border-b border-red-100 pb-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: artist.primaryColor }}
                />
                <h3 className="font-bold text-base text-gray-900">{clientName}</h3>
              </div>
              <Badge 
                className="text-white font-bold text-xs"
                style={{ backgroundColor: statusInfo.dotColor }}
              >
                {statusInfo.name}
              </Badge>
            </div>

            {/* Informações completas do agendamento */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-semibold text-gray-800 text-sm">
                  {appointment.time} ({duration}min)
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <serviceConfig.icon className="h-4 w-4" style={{ color: serviceConfig.color }} />
                <span className="font-medium text-gray-700 text-sm">
                  {serviceConfig.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700 text-sm">
                  {artist.name}
                </span>
              </div>

              {appointment.estimated_price && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-green-700 text-sm">
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

            {/* Contato do cliente */}
            {client && (
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <h4 className="font-semibold text-gray-800 text-sm">Contato:</h4>
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
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Button size="sm" variant="tattoo" className="flex-1 text-xs py-1">
                <Phone className="h-3 w-3 mr-1" />
                Ligar
              </Button>
              <Button size="sm" variant="tattooOutline" className="flex-1 text-xs py-1">
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
