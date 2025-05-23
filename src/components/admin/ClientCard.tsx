
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Client } from "@/services/interfaces/IClientService";
import { Eye, Calendar, Phone, Mail, AlertCircle } from "lucide-react";

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

  const hasNotification = client.status === 'interested' || client.status === 'pending';

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${isDragging ? 'opacity-50 rotate-2' : ''}`}>
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
          {hasNotification && (
            <AlertCircle className="h-4 w-4 text-orange-500" />
          )}
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
