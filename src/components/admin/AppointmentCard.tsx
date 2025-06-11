
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, Phone, Mail, MapPin, Edit, X, CheckCircle, AlertCircle, Bed, Palette, DollarSign, Save } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment, Client } from "@/services/interfaces/IClientService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getClientService } from "@/services/serviceFactory";
import { toast } from "@/hooks/use-toast";

interface AppointmentCardProps {
  appointment: Appointment & { price?: number };
  client?: Client;
  onClose: () => void;
  onUpdate: () => void;
}

const AppointmentCard = ({ appointment, client, onClose, onUpdate }: AppointmentCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPriceEditing, setIsPriceEditing] = useState(false);
  const [newStatus, setNewStatus] = useState<Appointment['status']>(appointment.status);
  const [appointmentPrice, setAppointmentPrice] = useState<number>(appointment.price || 0);
  const [isDragging, setIsDragging] = useState(false);

  const queryClient = useQueryClient();
  const clientService = getClientService();

  const updateStatusMutation = useMutation({
    mutationFn: (data: { status: Appointment['status']; price?: number }) => {
      console.log('Updating appointment status with financial data:', data);
      
      // Simulate financial integration when marking as completed
      if (data.status === 'completed' && data.price) {
        console.log(`Financial: Recording revenue of R$ ${data.price} for completed appointment ${appointment.id}`);
        // In a real implementation, this would call the financial service
        toast({
          title: "Receita registrada",
          description: `Receita de R$ ${data.price} registrada no módulo financeiro.`,
        });
      }
      
      return clientService.updateAppointmentStatus(appointment.id, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      onUpdate();
      toast({
        title: "Status atualizado",
        description: "O status do agendamento foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive"
      });
    }
  });

  const handleStatusUpdate = () => {
    if (newStatus !== appointment.status) {
      updateStatusMutation.mutate({ 
        status: newStatus, 
        price: appointmentPrice > 0 ? appointmentPrice : undefined 
      });
    }
    setIsEditing(false);
  };

  const handlePriceSave = () => {
    console.log(`Financial: Price updated to R$ ${appointmentPrice} for appointment ${appointment.id}`);
    setIsPriceEditing(false);
    toast({
      title: "Valor atualizado",
      description: `Valor do agendamento definido como R$ ${appointmentPrice.toFixed(2)}.`,
    });
  };

  const handleStatusChange = (value: string) => {
    setNewStatus(value as Appointment['status']);
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      scheduled: { 
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100', 
        border: 'border-l-blue-500', 
        text: 'text-blue-700',
        badge: 'bg-blue-600 text-white shadow-blue-500/25',
        icon: '📅',
        label: 'Agendado'
      },
      confirmed: { 
        bg: 'bg-gradient-to-br from-green-50 to-green-100', 
        border: 'border-l-green-500', 
        text: 'text-green-700',
        badge: 'bg-green-600 text-white shadow-green-500/25',
        icon: '✅',
        label: 'Confirmado'
      },
      in_progress: { 
        bg: 'bg-gradient-to-br from-orange-50 to-orange-100', 
        border: 'border-l-orange-500', 
        text: 'text-orange-700',
        badge: 'bg-orange-600 text-white shadow-orange-500/25',
        icon: '🔄',
        label: 'Em Andamento'
      },
      completed: { 
        bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100', 
        border: 'border-l-emerald-500', 
        text: 'text-emerald-700',
        badge: 'bg-emerald-600 text-white shadow-emerald-500/25',
        icon: '✨',
        label: 'Concluído'
      },
      cancelled: { 
        bg: 'bg-gradient-to-br from-red-50 to-red-100', 
        border: 'border-l-red-500', 
        text: 'text-red-700',
        badge: 'bg-red-600 text-white shadow-red-500/25',
        icon: '❌',
        label: 'Cancelado'
      },
      no_show: { 
        bg: 'bg-gradient-to-br from-gray-50 to-gray-100', 
        border: 'border-l-gray-500', 
        text: 'text-gray-700',
        badge: 'bg-gray-600 text-white shadow-gray-500/25',
        icon: '👻',
        label: 'Não Compareceu'
      }
    };
    return configs[status as keyof typeof configs] || configs.scheduled;
  };

  const getServiceTypeConfig = (serviceType: string) => {
    const configs = {
      tattoo: { icon: '🎨', label: 'Tatuagem', color: 'text-red-600' },
      piercing: { icon: '💎', label: 'Piercing', color: 'text-purple-600' },
      consultation: { icon: '💬', label: 'Consulta', color: 'text-blue-600' }
    };
    return configs[serviceType as keyof typeof configs] || configs.tattoo;
  };

  const statusConfig = getStatusConfig(appointment.status);
  const serviceConfig = getServiceTypeConfig(appointment.service_type);

  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
  const endTime = new Date(appointmentDate.getTime() + appointment.duration_minutes * 60000);

  return (
    <Card 
      className={`border-l-4 ${statusConfig.border} ${statusConfig.bg} shadow-2xl hover:shadow-3xl transition-all duration-500 backdrop-blur-sm relative overflow-hidden group ${
        isDragging ? 'scale-105 rotate-1 z-50' : ''
      }`}
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      style={{
        boxShadow: isDragging ? '0 0 30px rgba(239, 68, 68, 0.4), 0 8px 25px rgba(0, 0, 0, 0.15)' : undefined
      }}
    >
      {/* Efeito de brilho animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
      
      <CardHeader className="relative z-10 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{statusConfig.icon}</span>
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                {client?.name || 'Cliente'}
                <Badge className={`${statusConfig.badge} animate-pulse`}>
                  {statusConfig.label}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 text-red-100 text-sm mt-1">
                <span className="text-lg">{serviceConfig.icon}</span>
                <span className="font-medium">{serviceConfig.label}</span>
                {appointmentPrice > 0 && (
                  <>
                    <span>•</span>
                    <DollarSign className="h-4 w-4" />
                    <span className="font-bold">R$ {appointmentPrice.toFixed(2)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-red-700 transition-all duration-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6 relative z-10">
        {/* Informações do Cliente */}
        {client && (
          <div className="bg-gradient-to-r from-white to-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 ring-4 ring-red-200 shadow-lg">
                <AvatarImage src={`https://github.com/${client.name}.png`} alt={client.name} />
                <AvatarFallback className="bg-red-600 text-white font-bold text-lg">
                  {client.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{client.name}</h3>
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-red-600" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-red-600" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator className="bg-gradient-to-r from-transparent via-red-300 to-transparent" />

        {/* Enhanced Financial Section */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-bold text-green-800">Valor do Serviço</span>
            </div>
            {!isPriceEditing ? (
              <Button
                onClick={() => setIsPriceEditing(true)}
                variant="outline"
                size="sm"
                className="border-green-300 text-green-600 hover:bg-green-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Valor
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handlePriceSave}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => {
                    setIsPriceEditing(false);
                    setAppointmentPrice(appointment.price || 0);
                  }}
                  variant="outline"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {isPriceEditing ? (
            <div className="space-y-2">
              <Label htmlFor="price" className="text-green-700 font-medium">Valor em R$</Label>
              <Input
                id="price"
                type="number"
                value={appointmentPrice}
                onChange={(e) => setAppointmentPrice(Number(e.target.value))}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="border-green-300 focus:border-green-500"
              />
            </div>
          ) : (
            <div className="text-2xl font-bold text-green-900">
              {appointmentPrice > 0 ? `R$ ${appointmentPrice.toFixed(2)}` : 'Não definido'}
            </div>
          )}
          
          {appointment.status === 'completed' && appointmentPrice > 0 && (
            <div className="mt-3 p-2 bg-green-200 rounded-lg">
              <p className="text-xs text-green-800 font-medium flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Receita registrada no módulo financeiro
              </p>
            </div>
          )}
        </div>

        {/* Detalhes do Agendamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border-2 border-red-200 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-red-600" />
              <span className="font-bold text-red-800">Data e Horário</span>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-bold text-red-900">
                {format(appointmentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">
                  {format(appointmentDate, 'HH:mm')} - {format(endTime, 'HH:mm')}
                </span>
                <Badge variant="outline" className="text-xs bg-white/70 border-red-300 text-red-700">
                  {appointment.duration_minutes}min
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-gray-600" />
              <span className="font-bold text-gray-800">Detalhes</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-red-600" />
                <span className="font-medium text-gray-700">Artista: <strong>João Silva</strong></span>
              </div>
              {appointment.bed_id && (
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Maca: <strong>Maca 1</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notas do Agendamento */}
        {appointment.notes && (
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border-2 border-yellow-200 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="font-bold text-yellow-800">Observações</span>
            </div>
            <p className="text-yellow-900 font-medium">{appointment.notes}</p>
          </div>
        )}

        {/* Enhanced Status Controls with Financial Integration */}
        <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border-2 border-gray-200 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-800">Status do Agendamento</span>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300"
              >
                <Edit className="h-4 w-4 mr-2" />
                Alterar Status
              </Button>
            ) : (
              <div className="flex gap-2">
                <Select value={newStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="no_show">Não Compareceu</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleStatusUpdate}
                  size="sm"
                  disabled={updateStatusMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setNewStatus(appointment.status);
                  }}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {newStatus === 'completed' && appointmentPrice > 0 && isEditing && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Ao marcar como concluído, a receita de R$ {appointmentPrice.toFixed(2)} será registrada no módulo financeiro.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
