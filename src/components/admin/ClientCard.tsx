
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Client } from "@/services/interfaces/IClientService";
import { Eye, Calendar, Phone, Mail, AlertCircle, Thermometer, Flame } from "lucide-react";

interface ClientCardProps {
  client: Client;
  onViewClient: (clientId: string) => void;
  isDragging?: boolean;
}

const ClientCard = ({ client, onViewClient, isDragging }: ClientCardProps) => {
  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-blue-100 text-blue-800",
      interested: "bg-yellow-100 text-yellow-800", 
      pending: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      returning: "bg-purple-100 text-purple-800",
      vip: "bg-pink-100 text-pink-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
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
    const temp = calculateTemperature();
    
    if (temp >= 6) {
      return {
        level: "hot",
        color: "text-red-500",
        bgColor: "bg-red-50 border-red-200",
        icon: Flame,
        label: "Muito Interessado"
      };
    } else if (temp >= 3) {
      return {
        level: "warm",
        color: "text-orange-500",
        bgColor: "bg-orange-50 border-orange-200",
        icon: Thermometer,
        label: "Moderadamente Interessado"
      };
    } else {
      return {
        level: "cold",
        color: "text-blue-500",
        bgColor: "bg-blue-50 border-blue-200",
        icon: Thermometer,
        label: "Pouco Interessado"
      };
    }
  };

  const hasNotification = client.status === 'interested' || client.status === 'pending';
  const temperatureConfig = getTemperatureConfig();
  const TemperatureIcon = temperatureConfig.icon;

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${isDragging ? 'opacity-50 rotate-2' : ''} ${temperatureConfig.bgColor}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-800">
                {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm truncate max-w-[120px]">{client.name}</h3>
              <p className="text-xs text-gray-500 truncate max-w-[120px]">{client.email}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
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

        <Badge className={`text-xs mb-2 ${getStatusColor(client.status)}`}>
          {getStatusLabel(client.status)}
        </Badge>

        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Último contato: {formatDate(client.updated_at)}</span>
          </div>
          
          {client.phone && (
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span className="truncate">{client.phone}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-medium">Total gasto:</span>
            <span className="text-green-600 font-medium">{formatCurrency(client.total_spent)}</span>
          </div>

          {client.preferred_style && (
            <div className="flex items-center space-x-1">
              <Badge variant="outline" className="text-xs">
                {client.preferred_style}
              </Badge>
            </div>
          )}

          {/* Informações de agendamento (preparação para módulo futuro) */}
          <div className="border-t pt-2 mt-2">
            <div className="text-xs text-gray-500">
              Próximo agendamento: <span className="text-gray-400">Não agendado</span>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-3 text-xs"
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
