
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Client } from "@/services/interfaces/IClientService";
import { Eye, Calendar, Phone, Mail, AlertCircle, Thermometer, Flame, User, Star, Target, MessageSquare } from "lucide-react";

interface EnhancedClientCardProps {
  client: Client;
  onViewClient: (clientId: string) => void;
  onQuickAction: (action: string, clientId: string) => void;
  isDragging?: boolean;
}

const EnhancedClientCard = ({ client, onViewClient, onQuickAction, isDragging }: EnhancedClientCardProps) => {
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

  // Calcular nível de engajamento (mock - viria da integração com user profile)
  const getEngagementLevel = () => {
    let score = 0;
    if (client.total_spent > 2000) score += 3;
    else if (client.total_spent > 1000) score += 2;
    else if (client.total_spent > 500) score += 1;
    
    if (client.total_orders > 5) score += 2;
    else if (client.total_orders > 2) score += 1;
    
    if (client.status === 'interested' || client.status === 'pending') score += 2;
    else if (client.status === 'vip') score += 3;
    
    return Math.min(score, 8);
  };

  const getTemperatureConfig = () => {
    const temp = client.temperature_score || getEngagementLevel();
    
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

  // Mock de preferências (viria da integração com user profile)
  const mockPreferences = {
    styles: ['Realismo', 'Old School'],
    themes: ['Animais', 'Geométrica'],
    artists: ['Carlos Rodrigues'],
    completeness: 75
  };

  const hasNotification = client.status === 'interested' || client.status === 'pending';
  const temperatureConfig = getTemperatureConfig();
  const TemperatureIcon = temperatureConfig.icon;
  const engagementLevel = getEngagementLevel();

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${isDragging ? 'opacity-50 rotate-2' : ''} ${temperatureConfig.bgColor} w-full max-w-sm`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-blue-100 text-blue-800">
                {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm truncate">{client.name}</h3>
              <p className="text-xs text-gray-500 truncate">{client.email}</p>
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
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Status e Nível de Engajamento */}
        <div className="flex items-center justify-between">
          <Badge className={`text-xs ${getStatusColor(client.status)}`}>
            {getStatusLabel(client.status)}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500" />
            <span className="text-xs font-medium">{engagementLevel}/8</span>
          </div>
        </div>

        {/* Completude do Perfil */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Perfil Completo</span>
            <span className="font-medium">{mockPreferences.completeness}%</span>
          </div>
          <Progress value={mockPreferences.completeness} className="h-1" />
        </div>

        {/* Preferências do Cliente */}
        {mockPreferences.styles.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Estilos Preferidos:</p>
            <div className="flex flex-wrap gap-1">
              {mockPreferences.styles.slice(0, 2).map((style, index) => (
                <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                  {style}
                </Badge>
              ))}
              {mockPreferences.styles.length > 2 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  +{mockPreferences.styles.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Informações Básicas */}
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">Último contato: {formatDate(client.updated_at)}</span>
          </div>
          
          {client.phone && (
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{client.phone}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-medium">Total gasto:</span>
            <span className="text-green-600 font-medium">{formatCurrency(client.total_spent)}</span>
          </div>
        </div>

        {/* Ações Rápidas Baseadas em Preferências */}
        <div className="border-t pt-2 space-y-2">
          <div className="flex flex-wrap gap-1">
            {mockPreferences.artists.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs px-2 py-1 h-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAction('suggest-appointment', client.id);
                }}
              >
                <Target className="h-3 w-3 mr-1" />
                Sugerir Sessão
              </Button>
            )}
            
            {mockPreferences.styles.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs px-2 py-1 h-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAction('send-content', client.id);
                }}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Enviar Conteúdo
              </Button>
            )}
          </div>

          <div className="flex gap-1">
            {client.phone && (
              <Button variant="outline" size="sm" className="flex-1 text-xs p-1">
                <Phone className="h-3 w-3" />
              </Button>
            )}
            <Button variant="outline" size="sm" className="flex-1 text-xs p-1">
              <Mail className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs p-1">
              <Calendar className="h-3 w-3" />
            </Button>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => onViewClient(client.id)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Ver Perfil Completo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedClientCard;
