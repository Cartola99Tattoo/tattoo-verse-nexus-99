
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Clock, Scissors, GripVertical } from 'lucide-react';
import { Appointment, Client } from '@/services/interfaces/IClientService';

interface DraggableAppointmentCardProps {
  appointment: Appointment;
  client?: Client;
  timeSlot: string;
  isOverlay?: boolean;
}

const DraggableAppointmentCard: React.FC<DraggableAppointmentCardProps> = ({
  appointment,
  client,
  timeSlot,
  isOverlay = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: appointment.id,
    data: { timeSlot }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'cancelled': return 'bg-gray-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-red-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'scheduled': return 'Agendado';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Concluído';
      default: return 'Pendente';
    }
  };

  // Mockup dos artistas
  const artists = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Costa' },
  ];

  const artist = artists.find(a => a.id === appointment.artist_id);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        bg-gradient-to-br from-white to-red-50 border-2 border-red-200 
        shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer
        ${isDragging ? 'opacity-50 rotate-2 scale-110' : ''}
        ${isOverlay ? 'rotate-3 scale-105 shadow-2xl' : ''}
      `}
      {...attributes}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-3 w-3 text-red-600" />
              <span className="font-bold text-red-800 text-sm truncate">
                {client?.name?.split(' ')[0] || 'Cliente'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-3 w-3 text-red-600" />
              <span className="text-xs text-red-700">
                {appointment.time} ({appointment.duration_minutes}min)
              </span>
            </div>
            
            {artist && (
              <div className="flex items-center gap-2 mb-2">
                <Scissors className="h-3 w-3 text-red-600" />
                <span className="text-xs text-red-700 truncate">
                  {artist.name.split(' ')[0]}
                </span>
              </div>
            )}
          </div>
          
          <div
            {...listeners}
            className="text-red-400 hover:text-red-600 cursor-grab active:cursor-grabbing p-1"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-1">
          <Badge 
            className={`${getStatusColor(appointment.status)} text-white text-xs font-bold`}
          >
            {getStatusText(appointment.status)}
          </Badge>
          
          {appointment.service_description && (
            <p className="text-xs text-red-600 line-clamp-2 bg-red-50 p-1 rounded border border-red-200">
              {appointment.service_description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DraggableAppointmentCard;
