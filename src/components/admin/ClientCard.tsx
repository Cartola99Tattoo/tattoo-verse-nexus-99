
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Client } from "@/services/interfaces/IClientService";
import { Eye, Calendar, Phone, Mail, AlertCircle, Thermometer, Flame, User } from "lucide-react";

interface ClientCardProps {
  client: Client;
  onViewClient: (clientId: string) => void;
  isDragging?: boolean;
}

const ClientCard = ({ client, onViewClient, isDragging }: ClientCardProps) => {
  const getStatusColor = (status: string) => {
    const variants = {
      new: "tattooInfo",
      interested: "tattooWarning", 
      pending: "tattooWarning",
      completed: "tattooSuccess",
      returning: "tattoo",
      vip: "tattoo"
    };
    return variants[status as keyof typeof variants] || "secondary";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      new: "Novo Lead",
      interested: "Interessado", 
      pending: "Agendamento Pendente",
      completed: "Tatuagem Concluída",
      returning: "Retorno Esperado",
      vip: "VIP/Fidelidade"
    };
    return labels[status as keyof typeof labels] || status;
  };

  // Calcular temperatura baseada em critérios automáticos
  const calculateTemperature = () => {
    let score = 0;
    
    // Pontuação baseada no valor gasto
    if (client.total_spent > 2000) score += 3;
    else if (client.total_spent > 1000) score += 2;
    else if (client.total_spent > 500) score += 1;
    
    // Pontuação baseada no número de pedidos
    if (client.total_orders > 5) score += 2;
    else if (client.total_orders > 2) score += 1;
    
    // Pontuação baseada no status
    if (client.status === 'interested' || client.status === 'pending') score += 2;
    else if (client.status === 'vip') score += 3;
    
    // Pontuação baseada na recência da última atualização
    const daysSinceUpdate = Math.floor((Date.now() - new Date(client.updated_at).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceUpdate < 7) score += 2;
    else if (daysSinceUpdate < 30) score += 1;
    
    return Math.min(score, 8); // Máximo 8 pontos
  };

  const getTemperatureConfig = () => {
    const temp = client.temperature_score || calculateTemperature();
    
    if (temp >= 6) {
      return {
        level: "hot",
        color: "text-red-500",
        bgColor: "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
        icon: Flame,
        label: "Muito Interessado"
      };
    } else if (temp >= 3) {
      return {
        level: "warm",
        color: "text-orange-500",
        bgColor: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
        icon: Thermometer,
        label: "Moderadamente Interessado"
      };
    } else {
      return {
        level: "cold",
        color: "text-blue-500",
        bgColor: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
        icon: Thermometer,
        label: "Pouco Interessado"
      };
    }
  };

  const hasNotification = client.status === 'interested' || client.status === 'pending';
  const temperatureConfig = getTemperatureConfig();
  const TemperatureIcon = temperatureConfig.icon;

  return (
    <Card className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-red-glow ${isDragging ? 'opacity-50 rotate-2' : ''} ${temperatureConfig.bgColor} w-full max-w-sm shadow-lg hover:scale-[1.02]`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Avatar className="h-10 w-10 flex-shrink-0 shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-red-100 to-red-200 text-red-800 font-medium">
                {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm truncate text-gray-900">{client.name}</h3>
              <p className="text-xs text-gray-600 truncate">{client.email}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {hasNotification && (
              <AlertCircle className="h-4 w-4 text-orange-500" />
            )}
            <div className="flex items-center gap-1" title={temperatureConfig.label}>
              <TemperatureIcon className={`h-3 w-3 ${temperatureConfig.color}`} />
              <span className={`text-xs ${temperatureConfig.color}`}>
                {temperatureConfig.level === 'hot' ? '🔥' : 
                 temperatureConfig.level === 'warm' ? '🌡️' : '❄️'}
              </span>
            </div>
          </div>
        </div>

        <Badge variant={getStatusColor(client.status) as any} className="text-xs mb-2">
          {getStatusLabel(client.status)}
        </Badge>

        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 flex-shrink-0 text-gray-500" />
            <span className="truncate">Último contato: {formatDate(client.updated_at)}</span>
          </div>
          
          {client.phone && (
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3 flex-shrink-0 text-gray-500" />
              <span className="truncate">{client.phone}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Total gasto:</span>
            <span className="text-red-600 font-medium">{formatCurrency(client.total_spent)}</span>
          </div>

          {client.preferred_style && (
            <div className="flex items-center space-x-1">
              <Badge variant="outline" className="text-xs truncate border-red-200 text-red-700">
                {client.preferred_style}
              </Badge>
            </div>
          )}

          {client.preferred_artist_id && (
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3 flex-shrink-0 text-gray-500" />
              <span className="text-xs truncate">Artista preferencial</span>
            </div>
          )}

          {/* Informações de agendamento */}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="text-xs text-gray-500">
              {client.next_appointment_date ? (
                <div>
                  <span className="font-medium">Próximo agendamento:</span>
                  <div className="text-green-600">{formatDate(client.next_appointment_date)}</div>
                  {client.next_appointment_artist && (
                    <div className="text-gray-400">Com: {client.next_appointment_artist}</div>
                  )}
                </div>
              ) : (
                <span className="text-gray-400">Não agendado</span>
              )}
            </div>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="flex gap-1 mt-3">
          {client.phone && (
            <Button variant="outline" size="sm" className="flex-1 text-xs p-1 border-red-200 hover:border-red-300">
              <Phone className="h-3 w-3" />
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1 text-xs p-1 border-red-200 hover:border-red-300">
            <Mail className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs p-1 border-red-200 hover:border-red-300">
            <Calendar className="h-3 w-3" />
          </Button>
        </div>

        <Button 
          variant="tattoo" 
          size="sm" 
          className="w-full mt-2 text-xs"
          onClick={() => onViewClient(client.id)}
        >
          <Eye className="h-3 w-3 mr-1" />
          Ver Perfil
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
