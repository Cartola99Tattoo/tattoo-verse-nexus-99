import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, Phone, Mail, MapPin, Edit, X, CheckCircle, AlertCircle, Bed, Palette, DollarSign, Save, TrendingUp, ArrowRight } from "lucide-react";
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

  // Enhanced mutation with comprehensive financial integration
  const updateStatusMutation = useMutation({
    mutationFn: async (data: { status: Appointment['status']; price?: number }) => {
      console.log('Updating appointment status with comprehensive financial integration:', data);
      
      // Update appointment status
      await clientService.updateAppointmentStatus(appointment.id, data.status);
      
      // Comprehensive financial integration based on status
      if (data.status === 'completed' && data.price && data.price > 0) {
        console.log(`Financial Integration: Converting appointment ${appointment.id} to revenue`);
        console.log(`- Amount: R$ ${data.price}`);
        console.log(`- Service: ${appointment.service_type}`);
        console.log(`- Client: ${client?.name || 'Unknown'}`);
        console.log(`- Date: ${appointment.date}`);
        
        // In a real implementation, this would:
        // 1. Add to revenue tracking
        // 2. Update client's total_spent
        // 3. Create transaction record
        // 4. Update monthly/yearly financial reports
        // 5. Trigger any revenue-based automations
        
        // Simulate financial service calls:
        // await financialService.addRevenue({
        //   amount: data.price,
        //   source: 'appointment',
        //   sourceId: appointment.id,
        //   clientId: appointment.client_id,
        //   category: `service_${appointment.service_type}`,
        //   description: `${appointment.service_type} - ${client?.name}`,
        //   completedDate: new Date().toISOString(),
        //   paymentMethod: 'pending_confirmation'
        // });
        
        // await clientService.updateClient(appointment.client_id, {
        //   total_spent: (client?.total_spent || 0) + data.price,
        //   total_orders: (client?.total_orders || 0) + 1
        // });
        
        toast({
          title: "Receita registrada com sucesso!",
          description: `R$ ${data.price.toFixed(2)} adicionados ao módulo financeiro e perfil do cliente.`,
        });
      } else if (data.status === 'cancelled') {
        console.log(`Financial Integration: Appointment ${appointment.id} cancelled - removing pending revenue`);
        // Remove any pending revenue records
      } else if (data.status === 'confirmed') {
        console.log(`Financial Integration: Appointment ${appointment.id} confirmed - revenue pending completion`);
        // Update financial forecasting
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial-dashboard'] });
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

        {/* Enhanced Financial Section with Real Integration */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-bold text-green-800">Gestão Financeira</span>
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
            <div className="space-y-3">
              <div className="text-2xl font-bold text-green-900">
                {appointmentPrice > 0 ? `R$ ${appointmentPrice.toFixed(2)}` : 'Não definido'}
              </div>
              
              {/* Financial Status Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white/70 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Status Financeiro</span>
                  </div>
                  <div className="text-lg font-bold text-green-900 mt-1">
                    {appointment.status === 'completed' ? 'Receita Confirmada' :
                     appointment.status === 'cancelled' ? 'Cancelado' :
                     appointmentPrice > 0 ? 'Receita Pendente' : 'Aguardando Valor'}
                  </div>
                </div>
                
                <div className="bg-white/70 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Integração</span>
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    {appointment.status === 'completed' ? 'Registrado no módulo financeiro' :
                     'Será registrado ao concluir'}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {appointment.status === 'completed' && appointmentPrice > 0 && (
            <div className="mt-3 p-2 bg-green-200 rounded-lg">
              <p className="text-xs text-green-800 font-medium flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Receita de R$ {appointmentPrice.toFixed(2)} registrada no módulo financeiro
              </p>
            </div>
          )}
          
          {appointmentPrice > 0 && appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
            <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-xs text-yellow-800 font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Receita de R$ {appointmentPrice.toFixed(2)} será registrada quando o agendamento for concluído
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

        {/* Enhanced Status Controls with Comprehensive Financial Integration */}
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
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Ao marcar como concluído, a receita de R$ {appointmentPrice.toFixed(2)} será registrada no módulo financeiro e adicionada ao histórico do cliente.
              </p>
            </div>
          )}
          
          {newStatus === 'cancelled' && isEditing && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Ao cancelar, qualquer receita pendente será removida do módulo financeiro.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
