
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Appointment, Client } from "@/services/interfaces/IClientService";
import { Calendar, Clock, User, Phone, Mail, MapPin, Eye, Edit, Trash2, Check, X } from "lucide-react";
import { getClientService } from "@/services/serviceFactory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface AppointmentCardProps {
  appointment: Appointment;
  client?: Client;
  onClose: () => void;
  onUpdate: () => void;
}

const AppointmentCard = ({ appointment, client, onClose, onUpdate }: AppointmentCardProps) => {
  const queryClient = useQueryClient();
  const clientService = getClientService();

  const updateStatusMutation = useMutation({
    mutationFn: (status: Appointment['status']) => 
      clientService.updateAppointmentStatus(appointment.id, status),
    onSuccess: () => {
      toast({
        title: "Status atualizado",
        description: "O status do agendamento foi atualizado com sucesso.",
      });
      onUpdate();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do agendamento.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      completed: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
      no_show: "bg-gray-100 text-gray-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      scheduled: "Agendado",
      confirmed: "Confirmado",
      in_progress: "Em Andamento",
      completed: "Concluído",
      cancelled: "Cancelado",
      no_show: "Não Compareceu"
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getServiceTypeLabel = (type: string) => {
    const labels = {
      tattoo: "Tatuagem",
      piercing: "Piercing",
      consultation: "Consulta"
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      {/* Informações do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-100 text-blue-800">
                {client?.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'CL'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{client?.name || 'Cliente não encontrado'}</h3>
              <p className="text-sm text-gray-500">{client?.email}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {client && (
            <>
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{client.phone}</span>
                </div>
              )}
              {client.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{client.address}</span>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  Ligar
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-1" />
                  E-mail
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Perfil
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detalhes do Agendamento */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Detalhes do Agendamento</CardTitle>
            <Badge className={getStatusColor(appointment.status)}>
              {getStatusLabel(appointment.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <span className="text-sm font-medium">Data:</span>
                <p className="text-sm">{formatDate(appointment.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <span className="text-sm font-medium">Horário:</span>
                <p className="text-sm">
                  {appointment.time} ({appointment.duration_minutes} min)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <span className="text-sm font-medium">Artista:</span>
                <p className="text-sm">João Silva</p> {/* Em produção viria do banco */}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium">Serviço:</span>
              <p className="text-sm">{getServiceTypeLabel(appointment.service_type)}</p>
            </div>
          </div>

          {appointment.service_description && (
            <div>
              <span className="text-sm font-medium">Descrição:</span>
              <p className="text-sm mt-1">{appointment.service_description}</p>
            </div>
          )}

          {appointment.estimated_price && (
            <div>
              <span className="text-sm font-medium">Preço Estimado:</span>
              <p className="text-sm mt-1 text-green-600 font-medium">
                {formatCurrency(appointment.estimated_price)}
              </p>
            </div>
          )}

          {appointment.notes && (
            <div>
              <span className="text-sm font-medium">Observações:</span>
              <p className="text-sm mt-1">{appointment.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações de Status */}
      <Card>
        <CardHeader>
          <CardTitle>Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {appointment.status === 'scheduled' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateStatusMutation.mutate('confirmed')}
                disabled={updateStatusMutation.isPending}
              >
                <Check className="h-4 w-4 mr-1" />
                Confirmar
              </Button>
            )}

            {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateStatusMutation.mutate('in_progress')}
                disabled={updateStatusMutation.isPending}
              >
                <Clock className="h-4 w-4 mr-1" />
                Iniciar
              </Button>
            )}

            {appointment.status === 'in_progress' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateStatusMutation.mutate('completed')}
                disabled={updateStatusMutation.isPending}
              >
                <Check className="h-4 w-4 mr-1" />
                Concluir
              </Button>
            )}

            {['scheduled', 'confirmed'].includes(appointment.status) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateStatusMutation.mutate('cancelled')}
                disabled={updateStatusMutation.isPending}
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
            )}

            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>

            <Button variant="outline" size="sm" className="text-red-600">
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
};

export default AppointmentCard;
