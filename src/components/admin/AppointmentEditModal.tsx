
import React, { useState, useEffect, useRef } from "react";
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
import { CalendarIcon, Clock, User, Bed, Save, X, Phone, Mail, UserPlus, Upload, Printer, Edit, AlertTriangle, CheckCircle, Sparkles, DollarSign, Image } from "lucide-react";
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
  service_description: z.string().optional(),
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
  const [validationState, setValidationState] = useState<'idle' | 'checking' | 'available' | 'conflict'>('idle');
  const [conflictMessage, setConflictMessage] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        service_description: appointment.service_description || "",
      });
    }
  }, [appointment, isOpen, reset]);

  useEffect(() => {
    const validateConflicts = async () => {
      const [artist_id, bed_id, date, time, duration_minutes] = watchedFields;
      
      if (artist_id && date && time && duration_minutes && appointment) {
        setValidationState('checking');
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const endTime = format(
            new Date(new Date(`${date}T${time}`).getTime() + duration_minutes * 60000), 
            'HH:mm'
          );
          
          if (bed_id && bed_id !== "none") {
            const isAvailable = await bedService.checkBedAvailability(bed_id, date, time, endTime);
            if (!isAvailable) {
              setValidationState('conflict');
              setConflictMessage('Maca não disponível no horário selecionado');
              return;
            }
          }
          
          setValidationState('available');
          setConflictMessage('');
        } catch (error) {
          setValidationState('conflict');
          setConflictMessage('Erro ao verificar disponibilidade');
        }
      } else {
        setValidationState('idle');
        setConflictMessage('');
      }
    };

    const timeoutId = setTimeout(validateConflicts, 600);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Alguns arquivos não foram aceitos",
        description: "Apenas imagens de até 10MB são permitidas.",
        variant: "destructive",
      });
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
    toast({
      title: "✅ Fotos adicionadas",
      description: `${validFiles.length} foto(s) de referência adicionada(s) com sucesso.`,
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddPhotos = () => {
    fileInputRef.current?.click();
  };

  const handlePrintForm = () => {
    toast({
      title: "✅ Ficha de anamnese",
      description: "Preparando ficha para impressão...",
    });
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  if (!appointment) {
    return null;
  }

  const onSubmit = (data: EditAppointmentFormData) => {
    if (validationState === 'conflict') {
      toast({
        title: "Conflito detectado",
        description: conflictMessage,
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
      <span className={`px-3 py-1 rounded-full text-white text-xs font-bold shadow-md ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-6xl w-full max-h-[95vh] overflow-y-auto bg-white border-2 border-red-200/50 shadow-2xl rounded-2xl">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-100/20 via-transparent to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-100/15 via-transparent to-transparent rounded-full transform -translate-x-24 translate-y-24"></div>

        <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 -m-6 mb-6 rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] animate-pulse"></div>
          <DialogTitle className="text-2xl font-black text-white flex items-center gap-3 relative z-10">
            <Edit className="h-6 w-6" />
            Editar Agendamento
            {getStatusBadge(appointment.status)}
          </DialogTitle>
          <DialogDescription className="text-red-100 font-semibold relative z-10 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {format(new Date(`${appointment.date}T${appointment.time}`), "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 space-y-6 p-6 bg-white">
          {/* Informações do Cliente */}
          <div className="bg-gradient-to-r from-red-50/80 via-white/90 to-red-50/80 rounded-xl p-6 border-2 border-red-100/50 shadow-lg">
            <h3 className="text-lg font-black text-red-700 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-1">Nome</p>
                <p className="text-lg font-bold text-gray-800">{client?.name || 'Cliente não encontrado'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-1">Contato</p>
                <p className="text-lg font-bold text-gray-800">{client?.phone || client?.email || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4">
              <Button
                onClick={() => {
                  if (client?.id) {
                    window.open(`/admin/clients/${client.id}`, '_blank');
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg px-4 py-2 h-auto font-bold"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Ver Perfil
              </Button>
              
              <Button
                onClick={() => {
                  if (client?.phone) {
                    window.open(`tel:${client.phone}`);
                  }
                }}
                variant="outline"
                className="border-2 border-green-500 text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg px-4 py-2 h-auto font-bold"
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
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg px-4 py-2 h-auto font-bold"
              >
                <Mail className="h-4 w-4 mr-2" />
                E-mail
              </Button>
            </div>
          </div>

          {/* Indicador de validação */}
          {validationState !== 'idle' && (
            <div className={`p-4 rounded-xl border-2 transition-all duration-300 shadow-lg ${
              validationState === 'checking' 
                ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300' 
                : validationState === 'conflict' 
                  ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-300' 
                  : 'bg-gradient-to-r from-green-50 to-green-100 border-green-300'
            }`}>
              <div className="flex items-center gap-3">
                {validationState === 'checking' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-blue-800 font-bold">Verificando disponibilidade...</span>
                  </>
                ) : validationState === 'conflict' ? (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-red-800 font-bold">{conflictMessage}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-bold">Horário disponível! ✨</span>
                  </>
                )}
              </div>
            </div>
          )}

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
                  className="h-12 border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-lg"
                />
                {errors.date && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.date.message}
                  </p>
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
                  className="h-12 border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-lg"
                />
                {errors.time && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.time.message}
                  </p>
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
                  className="h-12 border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-lg"
                />
                {errors.duration_minutes && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.duration_minutes.message}
                  </p>
                )}
              </div>

              {/* Artista */}
              <div className="space-y-3">
                <Label htmlFor="artist_id" className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Artista *
                </Label>
                <Select onValueChange={(value) => setValue('artist_id', value)} defaultValue={watch('artist_id')}>
                  <SelectTrigger className="h-12 border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-lg">
                    <SelectValue placeholder="Selecione um artista" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-red-200 shadow-xl rounded-lg bg-white z-[60]">
                    {artists.map((artist) => (
                      <SelectItem key={artist.id} value={artist.id} className="hover:bg-red-50 focus:bg-red-100 p-3 rounded-md">
                        <span className="font-bold">{artist.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.artist_id && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.artist_id.message}
                  </p>
                )}
              </div>

              {/* Maca */}
              <div className="space-y-3">
                <Label htmlFor="bed_id" className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  Maca
                </Label>
                <Select onValueChange={(value) => setValue('bed_id', value)} defaultValue={watch('bed_id')}>
                  <SelectTrigger className="h-12 border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-lg">
                    <SelectValue placeholder="Selecione a maca" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-red-200 shadow-xl rounded-lg bg-white z-[60]">
                    <SelectItem value="none" className="hover:bg-red-50 focus:bg-red-100 p-3 rounded-md">
                      <span className="font-bold text-gray-600">Nenhuma maca específica</span>
                    </SelectItem>
                    {activeBeds.map((bed) => (
                      <SelectItem key={bed.id} value={bed.id} className="hover:bg-red-50 focus:bg-red-100 p-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <Bed className="h-3 w-3 text-red-600" />
                          <span className="font-bold">{bed.name} (Maca {bed.number})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preço */}
              <div className="space-y-3">
                <Label htmlFor="estimated_price" className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Preço (R$)
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  {...register('estimated_price', { valueAsNumber: true })}
                  className="h-12 border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-lg"
                />
              </div>
            </div>

            {/* Descrição do Serviço */}
            <div className="space-y-3">
              <Label htmlFor="service_description" className="text-sm font-bold text-red-700">Descrição do Serviço</Label>
              <textarea
                {...register('service_description')}
                placeholder="Descreva a tatuagem, localização, tamanho, estilo, etc..."
                className="w-full min-h-24 p-4 border-2 border-red-200 focus:border-red-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 resize-none bg-white"
                rows={4}
              />
            </div>

            {/* Observações */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-sm font-bold text-red-700">Observações</Label>
              <textarea
                {...register('notes')}
                placeholder="Observações adicionais..."
                className="w-full min-h-24 p-4 border-2 border-red-200 focus:border-red-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 resize-none bg-white"
                rows={4}
              />
            </div>

            {/* Upload de Fotos */}
            <div className="space-y-4 bg-gradient-to-r from-red-50/80 via-white/90 to-red-50/80 rounded-xl p-6 border-2 border-red-100/50 shadow-lg">
              <Label className="text-sm font-bold text-red-700 flex items-center gap-2">
                <Image className="h-4 w-4" />
                Fotos de Referência da Tatuagem
              </Label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-red-200 rounded-lg p-6 text-center bg-red-50/30 hover:bg-red-50/50 transition-all duration-300">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddPhotos}
                    className="border-2 border-green-500 text-green-600 hover:bg-green-50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 rounded-lg px-6 py-3 h-auto font-bold"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Adicionar Fotos
                  </Button>
                  <p className="text-xs text-gray-600 mt-3 font-medium">JPG, PNG até 10MB cada</p>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Referência ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-red-200 shadow-md group-hover:shadow-lg transition-all duration-300"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <p className="text-xs text-gray-600 mt-1 truncate font-medium">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botões de Ação Adicionais */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-red-200">
                <Button
                  type="button"
                  onClick={handlePrintForm}
                  variant="outline"
                  className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 rounded-lg px-4 py-2 h-auto font-bold"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Ficha
                </Button>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-3 pt-4 border-t-2 border-red-100">
              <Button 
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg px-6 py-3 h-auto font-bold"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || validationState === 'conflict'}
                className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-xl hover:shadow-red-500/25 transition-all duration-500 transform hover:scale-105 px-8 py-3 h-auto rounded-lg font-black relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
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
