
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, User, Bed, Save, X, Phone, Mail, UserPlus, Upload, Printer, Edit } from "lucide-react";
import { Client, Appointment } from "@/services/interfaces/IClientService";
import { getClientService, getBedService } from "@/services/serviceFactory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const editAppointmentSchema = z.object({
  date: z.string().min(1, "Selecione uma data"),
  time: z.string().min(1, "Selecione um horário"),
  duration_minutes: z.number().min(30, "Duração mínima é 30 minutos"),
  artist_id: z.string().min(1, "Selecione um artista"),
  bed_id: z.string().optional(),
  estimated_price: z.number().optional(),
  notes: z.string().optional(),
});

type EditAppointmentFormData = z.infer<typeof editAppointmentSchema>;

interface AppointmentEditModalProps {
  appointment: Appointment;
  client?: Client;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const AppointmentEditModal = ({ appointment, client, isOpen, onClose, onUpdate }: AppointmentEditModalProps) => {
  const queryClient = useQueryClient();
  const clientService = getClientService();
  const bedService = getBedService();

  const { data: beds = [] } = useQuery({
    queryKey: ['beds'],
    queryFn: () => bedService.fetchBeds(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditAppointmentFormData>({
    resolver: zodResolver(editAppointmentSchema),
  });

  useEffect(() => {
    if (appointment && isOpen) {
      reset({
        date: appointment.date,
        time: appointment.time,
        duration_minutes: appointment.duration_minutes,
        artist_id: appointment.artist_id,
        bed_id: appointment.bed_id || "none",
        estimated_price: appointment.estimated_price || 0,
        notes: appointment.notes || "",
      });
    }
  }, [appointment, isOpen, reset]);

  const updateAppointmentMutation = useMutation({
    mutationFn: async (data: EditAppointmentFormData) => {
      const updateData = {
        ...data,
        bed_id: data.bed_id === "none" ? undefined : data.bed_id,
        price: data.estimated_price || 0,
      };
      return clientService.updateAppointment(appointment.id, updateData);
    },
    onSuccess: () => {
      toast({
        title: "Agendamento atualizado! ✨",
        description: "As alterações foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      onUpdate();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o agendamento.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditAppointmentFormData) => {
    updateAppointmentMutation.mutate(data);
  };

  const artists = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Costa' },
  ];

  const activeBeds = beds.filter(bed => bed.isActive);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'Agendado', color: 'bg-blue-500' },
      confirmed: { label: 'Confirmado', color: 'bg-green-500' },
      in_progress: { label: 'Em Andamento', color: 'bg-yellow-500' },
      completed: { label: 'Concluído', color: 'bg-emerald-500' },
      cancelled: { label: 'Cancelado', color: 'bg-red-500' },
      no_show: { label: 'Não Compareceu', color: 'bg-gray-500' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    return (
      <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-gray-50 to-white border-2 border-red-200 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 -m-6 mb-6 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] animate-pulse"></div>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3 relative z-10">
            <Edit className="h-6 w-6" />
            Editar Agendamento
            {getStatusBadge(appointment.status)}
          </DialogTitle>
          <DialogDescription className="text-red-100 font-medium relative z-10 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {format(new Date(`${appointment.date}T${appointment.time}`), "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Cliente */}
          <div className="bg-gradient-to-r from-red-50 via-gray-50 to-red-50 rounded-xl p-6 border-2 border-red-100 shadow-inner">
            <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Nome</p>
                <p className="text-lg font-bold text-gray-800">{client?.name || 'Cliente não encontrado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Contato</p>
                <p className="text-lg font-bold text-gray-800">{client?.phone || client?.email || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => {
                  if (client?.id) {
                    window.open(`/admin/clients/${client.id}`, '_blank');
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Ver Perfil Completo
              </Button>
              
              <Button
                onClick={() => {
                  if (client?.phone) {
                    window.open(`tel:${client.phone}`);
                  }
                }}
                variant="outline"
                className="border-2 border-green-500 text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="h-4 w-4 mr-2" />
                Ligar
              </Button>
              
              <Button
                onClick={() => {
                  if (client?.email) {
                    window.open(`mailto:${client.email}`);
                  }
                }}
                variant="outline"
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Mail className="h-4 w-4 mr-2" />
                E-mail
              </Button>
            </div>
          </div>

          {/* Formulário de Edição */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Data */}
              <div className="space-y-3">
                <Label htmlFor="date" className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Data *
                </Label>
                <Input
                  type="date"
                  {...register('date')}
                  className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300"
                />
                {errors.date && (
                  <p className="text-sm text-red-600 font-medium">{errors.date.message}</p>
                )}
              </div>

              {/* Horário */}
              <div className="space-y-3">
                <Label htmlFor="time" className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horário *
                </Label>
                <Input
                  type="time"
                  {...register('time')}
                  className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300"
                />
                {errors.time && (
                  <p className="text-sm text-red-600 font-medium">{errors.time.message}</p>
                )}
              </div>

              {/* Duração */}
              <div className="space-y-3">
                <Label htmlFor="duration_minutes" className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duração (minutos) *
                </Label>
                <Input
                  type="number"
                  min="30"
                  step="30"
                  {...register('duration_minutes', { valueAsNumber: true })}
                  className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300"
                />
                {errors.duration_minutes && (
                  <p className="text-sm text-red-600 font-medium">{errors.duration_minutes.message}</p>
                )}
              </div>

              {/* Artista */}
              <div className="space-y-3">
                <Label htmlFor="artist_id" className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Artista *
                </Label>
                <Select onValueChange={(value) => setValue('artist_id', value)} defaultValue={watch('artist_id')}>
                  <SelectTrigger className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                    <SelectValue placeholder="Selecione um artista" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-red-200 shadow-xl">
                    {artists.map((artist) => (
                      <SelectItem key={artist.id} value={artist.id} className="hover:bg-red-50">
                        {artist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.artist_id && (
                  <p className="text-sm text-red-600 font-medium">{errors.artist_id.message}</p>
                )}
              </div>

              {/* Maca */}
              <div className="space-y-3">
                <Label htmlFor="bed_id" className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  Maca
                </Label>
                <Select onValueChange={(value) => setValue('bed_id', value)} defaultValue={watch('bed_id')}>
                  <SelectTrigger className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                    <SelectValue placeholder="Selecione a maca" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-red-200 shadow-xl">
                    <SelectItem value="none" className="hover:bg-red-50">Nenhuma maca específica</SelectItem>
                    {activeBeds.map((bed) => (
                      <SelectItem key={bed.id} value={bed.id} className="hover:bg-red-50">
                        {bed.name} (Maca {bed.number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preço */}
              <div className="space-y-3">
                <Label htmlFor="estimated_price" className="text-sm font-bold text-red-700">Preço (R$)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  {...register('estimated_price', { valueAsNumber: true })}
                  className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300"
                />
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-sm font-bold text-red-700">Observações</Label>
              <textarea
                {...register('notes')}
                placeholder="Observações adicionais..."
                className="w-full min-h-20 p-3 border-2 border-red-200 focus:border-red-500 rounded-md shadow-md hover:shadow-lg transition-all duration-300 resize-none"
                rows={3}
              />
            </div>

            {/* Ações Adicionais */}
            <div className="flex flex-wrap gap-3 p-6 bg-gradient-to-r from-red-50 via-gray-50 to-red-50 rounded-xl border-2 border-red-100 shadow-inner">
              <Button
                type="button"
                onClick={() => {
                  toast({
                    title: "Upload simulado",
                    description: "Funcionalidade de upload de fotos em desenvolvimento.",
                  });
                }}
                variant="outline"
                className="border-2 border-green-500 text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Upload className="h-4 w-4 mr-2" />
                Adicionar Fotos de Referência
              </Button>
              
              <Button
                type="button"
                onClick={() => {
                  toast({
                    title: "Impressão simulada",
                    description: "Gerando ficha de anamnese para impressão...",
                  });
                }}
                variant="outline"
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimir Ficha de Anamnese
              </Button>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-3 pt-4 border-t border-red-200">
              <Button 
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-2"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentEditModal;
