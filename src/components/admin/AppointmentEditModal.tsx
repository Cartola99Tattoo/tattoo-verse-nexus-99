
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
import { CalendarIcon, Clock, User, Bed, Save, X, Phone, Mail, UserPlus, Upload, Printer, Edit, AlertTriangle, CheckCircle, Sparkles, DollarSign } from "lucide-react";
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
  appointment: Appointment | null;
  client?: Client;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const AppointmentEditModal = ({ appointment, client, isOpen, onClose, onUpdate }: AppointmentEditModalProps) => {
  const queryClient = useQueryClient();
  const clientService = getClientService();
  const bedService = getBedService();
  const [conflictCheck, setConflictCheck] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // All hooks must be called before any early returns
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

  const watchedFields = watch(['artist_id', 'bed_id', 'date', 'time', 'duration_minutes']);

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

  // Validação em tempo real para conflitos
  useEffect(() => {
    const validateConflicts = async () => {
      const [artist_id, bed_id, date, time, duration_minutes] = watchedFields;
      
      if (artist_id && date && time && duration_minutes && appointment) {
        setIsValidating(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const endTime = format(
            new Date(new Date(`${date}T${time}`).getTime() + duration_minutes * 60000), 
            'HH:mm'
          );
          
          if (bed_id && bed_id !== "none") {
            const isAvailable = await bedService.checkBedAvailability(bed_id, date, time, endTime);
            if (!isAvailable) {
              setConflictCheck('Maca não disponível no horário selecionado');
              setIsValidating(false);
              return;
            }
          }
          
          setConflictCheck(null);
        } catch (error) {
          setConflictCheck('Erro ao verificar disponibilidade');
        }
        setIsValidating(false);
      }
    };

    const timeoutId = setTimeout(validateConflicts, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedFields, bedService, appointment]);

  const updateAppointmentMutation = useMutation({
    mutationFn: async (data: EditAppointmentFormData) => {
      const updateData = {
        ...data,
        bed_id: data.bed_id === "none" ? undefined : data.bed_id,
        price: data.estimated_price || 0,
      };
      return clientService.updateAppointment(appointment!.id, updateData);
    },
    onSuccess: () => {
      toast({
        title: "✨ Agendamento atualizado!",
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

  // Now we can safely return early after all hooks are called
  if (!appointment) {
    return null;
  }

  const onSubmit = (data: EditAppointmentFormData) => {
    if (conflictCheck) {
      toast({
        title: "Conflito detectado",
        description: conflictCheck,
        variant: "destructive",
      });
      return;
    }
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
      <span className={`px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-red-50/30 to-white border-2 border-red-200/50 shadow-2xl rounded-2xl relative">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-100/20 via-transparent to-transparent rounded-full transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-red-100/15 via-transparent to-transparent rounded-full transform -translate-x-32 translate-y-32"></div>

        <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 -m-6 mb-8 rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] animate-pulse"></div>
          <DialogTitle className="text-3xl font-black text-white flex items-center gap-4 relative z-10">
            <Edit className="h-8 w-8" />
            Editar Agendamento
            {getStatusBadge(appointment.status)}
          </DialogTitle>
          <DialogDescription className="text-red-100 font-semibold relative z-10 flex items-center gap-3 text-lg">
            <CalendarIcon className="h-5 w-5" />
            {format(new Date(`${appointment.date}T${appointment.time}`), "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 space-y-8">
          {/* Informações do Cliente */}
          <div className="bg-gradient-to-r from-red-50/80 via-white/90 to-red-50/80 rounded-2xl p-8 border-2 border-red-100/50 shadow-xl backdrop-blur-sm">
            <h3 className="text-xl font-black text-red-700 mb-6 flex items-center gap-3">
              <User className="h-6 w-6" />
              Informações do Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Nome</p>
                <p className="text-xl font-bold text-gray-800">{client?.name || 'Cliente não encontrado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Contato</p>
                <p className="text-xl font-bold text-gray-800">{client?.phone || client?.email || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <Button
                onClick={() => {
                  if (client?.id) {
                    window.open(`/admin/clients/${client.id}`, '_blank');
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl"
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
                className="border-2 border-green-500 text-green-600 hover:bg-green-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl"
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
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl"
              >
                <Mail className="h-4 w-4 mr-2" />
                E-mail
              </Button>
            </div>
          </div>

          {/* Indicador de validação em tempo real */}
          {(isValidating || conflictCheck) && (
            <div className={`p-6 rounded-2xl border-2 transition-all duration-500 transform shadow-xl ${
              isValidating 
                ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 animate-pulse' 
                : conflictCheck 
                  ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-300' 
                  : 'bg-gradient-to-r from-green-50 to-green-100 border-green-300'
            }`}>
              <div className="flex items-center gap-4">
                {isValidating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-blue-800 font-bold text-lg">Verificando disponibilidade...</span>
                  </>
                ) : conflictCheck ? (
                  <>
                    <AlertTriangle className="h-6 w-6 text-red-600 animate-bounce" />
                    <span className="text-red-800 font-bold text-lg">{conflictCheck}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span className="text-green-800 font-bold text-lg">Horário disponível! ✨</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Formulário de Edição */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Data */}
              <div className="space-y-4">
                <Label htmlFor="date" className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Data *
                </Label>
                <Input
                  type="date"
                  {...register('date')}
                  className="h-12 border-2 border-red-200 focus:border-red-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-xl"
                />
                {errors.date && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Horário */}
              <div className="space-y-4">
                <Label htmlFor="time" className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horário *
                </Label>
                <Input
                  type="time"
                  {...register('time')}
                  className="h-12 border-2 border-red-200 focus:border-red-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-xl"
                />
                {errors.time && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.time.message}
                  </p>
                )}
              </div>

              {/* Duração */}
              <div className="space-y-4">
                <Label htmlFor="duration_minutes" className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Duração (minutos) *
                </Label>
                <Input
                  type="number"
                  min="30"
                  step="30"
                  {...register('duration_minutes', { valueAsNumber: true })}
                  className="h-12 border-2 border-red-200 focus:border-red-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-xl"
                />
                {errors.duration_minutes && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.duration_minutes.message}
                  </p>
                )}
              </div>

              {/* Artista */}
              <div className="space-y-4">
                <Label htmlFor="artist_id" className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Artista *
                </Label>
                <Select onValueChange={(value) => setValue('artist_id', value)} defaultValue={watch('artist_id')}>
                  <SelectTrigger className="h-12 border-2 border-red-200 focus:border-red-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-xl">
                    <SelectValue placeholder="Selecione um artista" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-red-200 shadow-2xl rounded-xl">
                    {artists.map((artist) => (
                      <SelectItem key={artist.id} value={artist.id} className="hover:bg-red-50 focus:bg-red-100 p-4 rounded-lg">
                        <span className="font-semibold">{artist.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.artist_id && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.artist_id.message}
                  </p>
                )}
              </div>

              {/* Maca */}
              <div className="space-y-4">
                <Label htmlFor="bed_id" className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <Bed className="h-5 w-5" />
                  Maca
                </Label>
                <Select onValueChange={(value) => setValue('bed_id', value)} defaultValue={watch('bed_id')}>
                  <SelectTrigger className="h-12 border-2 border-red-200 focus:border-red-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-xl">
                    <SelectValue placeholder="Selecione a maca" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-red-200 shadow-2xl rounded-xl">
                    <SelectItem value="none" className="hover:bg-red-50 focus:bg-red-100 p-4 rounded-lg">
                      <span className="font-semibold text-gray-600">Nenhuma maca específica</span>
                    </SelectItem>
                    {activeBeds.map((bed) => (
                      <SelectItem key={bed.id} value={bed.id} className="hover:bg-red-50 focus:bg-red-100 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bed className="h-4 w-4 text-red-600" />
                          <span className="font-semibold">{bed.name} (Maca {bed.number})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preço */}
              <div className="space-y-4">
                <Label htmlFor="estimated_price" className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Preço (R$)
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  {...register('estimated_price', { valueAsNumber: true })}
                  className="h-12 border-2 border-red-200 focus:border-red-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-xl"
                />
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-4">
              <Label htmlFor="notes" className="text-sm font-bold text-red-700">Observações</Label>
              <textarea
                {...register('notes')}
                placeholder="Observações adicionais..."
                className="w-full min-h-24 p-4 border-2 border-red-200 focus:border-red-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 resize-none bg-white/90 backdrop-blur-sm"
                rows={4}
              />
            </div>

            {/* Ações Adicionais */}
            <div className="flex flex-wrap gap-4 p-8 bg-gradient-to-r from-red-50/80 via-white/90 to-red-50/80 rounded-2xl border-2 border-red-100/50 shadow-xl backdrop-blur-sm">
              <Button
                type="button"
                onClick={() => {
                  toast({
                    title: "Upload simulado",
                    description: "Funcionalidade de upload de fotos em desenvolvimento.",
                  });
                }}
                variant="outline"
                className="border-2 border-green-500 text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
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
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimir Ficha de Anamnese
              </Button>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4 pt-6 border-t-2 border-red-100">
              <Button 
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-3"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !!conflictCheck}
                className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform hover:scale-105 px-10 py-3 rounded-xl font-bold relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-3" />
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
