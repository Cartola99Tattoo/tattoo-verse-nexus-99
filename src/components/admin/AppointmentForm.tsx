
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Search, Bed, DollarSign, Clock, User, AlertTriangle, CheckCircle, Sparkles, Upload, X, Image } from "lucide-react";
import { Client } from "@/services/interfaces/IClientService";
import { getClientService, getBedService } from "@/services/serviceFactory";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const appointmentSchema = z.object({
  client_id: z.string().min(1, "Selecione um cliente"),
  artist_id: z.string().min(1, "Selecione um artista"),
  bed_id: z.string().optional(),
  date: z.string().min(1, "Selecione uma data"),
  time: z.string().min(1, "Selecione um horário"),
  duration_minutes: z.number().min(30, "Duração mínima é 30 minutos"),
  service_type: z.enum(["tattoo", "piercing", "consultation"]),
  service_description: z.string().optional(),
  estimated_price: z.number().optional(),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  selectedSlot?: { start: Date; end: Date } | null;
  clients: Client[];
  onSuccess: () => void;
}

const AppointmentForm = ({ selectedSlot, clients, onSuccess }: AppointmentFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(selectedSlot?.start || new Date());
  const [clientSearch, setClientSearch] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [validationState, setValidationState] = useState<'idle' | 'available' | 'conflict'>('idle');
  const [conflictMessage, setConflictMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const clientService = getClientService();
  const bedService = getBedService();

  const { data: beds = [], isLoading: bedsLoading } = useQuery({
    queryKey: ['beds'],
    queryFn: () => bedService.fetchBeds(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: selectedSlot ? format(selectedSlot.start, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      time: selectedSlot ? format(selectedSlot.start, 'HH:mm') : '09:00',
      duration_minutes: selectedSlot ? 
        Math.round((selectedSlot.end.getTime() - selectedSlot.start.getTime()) / 60000) : 120,
      service_type: "tattoo",
    },
  });

  const watchedFields = watch(['artist_id', 'bed_id', 'date', 'time', 'duration_minutes']);

  useEffect(() => {
    const [artist_id, bed_id, date, time, duration_minutes] = watchedFields;
    
    if (artist_id && date && time && duration_minutes) {
      const validateAvailability = async () => {
        try {
          if (bed_id && bed_id !== "none") {
            const endTime = format(
              new Date(new Date(`${date}T${time}`).getTime() + duration_minutes * 60000), 
              'HH:mm'
            );
            
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
      };

      const timeoutId = setTimeout(validateAvailability, 800);
      return () => clearTimeout(timeoutId);
    } else {
      setValidationState('idle');
      setConflictMessage('');
    }
  }, [watchedFields, bedService]);

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      if (data.bed_id && data.bed_id !== "none") {
        const endTime = format(
          new Date(new Date(`${data.date}T${data.time}`).getTime() + data.duration_minutes * 60000), 
          'HH:mm'
        );
        
        const isAvailable = await bedService.checkBedAvailability(
          data.bed_id,
          data.date,
          data.time,
          endTime
        );
        
        if (!isAvailable) {
          throw new Error('A maca selecionada não está disponível no horário escolhido');
        }
      }

      const photoReferences = uploadedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));

      const appointmentData = {
        client_id: data.client_id,
        artist_id: data.artist_id,
        bed_id: data.bed_id === "none" ? undefined : data.bed_id,
        date: data.date,
        time: data.time,
        duration_minutes: data.duration_minutes,
        service_type: data.service_type,
        status: 'scheduled' as const,
        service_description: data.service_description || '',
        estimated_price: data.estimated_price || 0,
        notes: data.notes || '',
        price: data.estimated_price || 0,
        photo_references: photoReferences,
      };
      return clientService.createAppointment(appointmentData);
    },
    onSuccess: () => {
      toast({
        title: "✨ Agendamento criado com sucesso!",
        description: `O agendamento foi criado e aparecerá no calendário.${uploadedFiles.length > 0 ? ` ${uploadedFiles.length} foto(s) de referência anexada(s).` : ''}`,
      });
      setUploadedFiles([]);
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar agendamento",
        description: error.message || "Não foi possível criar o agendamento.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    if (validationState === 'conflict') {
      toast({
        title: "Conflito detectado",
        description: conflictMessage,
        variant: "destructive",
      });
      return;
    }
    createAppointmentMutation.mutate(data);
  };

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
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const artists = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Costa' },
  ];

  const timeSlots = [];
  for (let hour = 8; hour <= 19; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  const activeBeds = beds.filter(bed => bed.isActive);

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-200/50 relative overflow-hidden max-h-[95vh] overflow-y-auto">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-100/20 via-transparent to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-100/15 via-transparent to-transparent rounded-full transform -translate-x-24 translate-y-24"></div>
      
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-t-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] animate-pulse"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
            <Sparkles className="h-6 w-6" />
            Criar Novo Agendamento
          </h2>
          <p className="text-red-100 font-semibold">Preencha os dados para criar um novo agendamento</p>
        </div>
      </div>
      
      <div className="relative z-10 p-6 bg-white">
        {/* Indicador de validação */}
        {validationState !== 'idle' && (
          <div className={`mb-6 p-4 rounded-xl border-2 transition-all duration-500 ${
            validationState === 'conflict' 
              ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-300 shadow-lg' 
              : 'bg-gradient-to-r from-green-50 to-green-100 border-green-300 shadow-lg'
          }`}>
            <div className="flex items-center gap-3">
              {validationState === 'conflict' ? (
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cliente */}
            <div className="space-y-3">
              <Label htmlFor="client_id" className="text-sm font-bold text-red-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente *
              </Label>
              <div className="space-y-2">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-400 transition-colors group-focus-within:text-red-600" />
                  <Input
                    placeholder="Buscar cliente..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="pl-10 h-12 border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-lg"
                  />
                </div>
                <Select onValueChange={(value) => setValue('client_id', value)}>
                  <SelectTrigger className="h-12 border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-lg">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-red-200 shadow-xl rounded-lg max-h-48 bg-white z-50">
                    {filteredClients.map((client) => (
                      <SelectItem key={client.id} value={client.id} className="hover:bg-red-50 focus:bg-red-100 p-3 rounded-md">
                        <div className="flex flex-col">
                          <div className="font-bold text-gray-900">{client.name}</div>
                          <div className="text-xs text-gray-600">{client.email}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.client_id && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.client_id.message}
                </p>
              )}
            </div>

            {/* Artista */}
            <div className="space-y-3">
              <Label htmlFor="artist_id" className="text-sm font-bold text-red-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Artista *
              </Label>
              <Select onValueChange={(value) => setValue('artist_id', value)}>
                <SelectTrigger className="h-12 border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-lg">
                  <SelectValue placeholder="Selecione um artista" />
                </SelectTrigger>
                <SelectContent className="border-2 border-red-200 shadow-xl rounded-lg bg-white z-50">
                  {artists.map((artist) => (
                    <SelectItem key={artist.id} value={artist.id} className="hover:bg-red-50 focus:bg-red-100 p-3 rounded-md">
                      <div className="font-bold text-gray-900">{artist.name}</div>
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

            {/* Data */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-red-700 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Data *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start text-left font-normal border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-lg"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-red-600" />
                    {selectedDate ? (
                      <span className="font-bold">{format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}</span>
                    ) : (
                      <span className="text-gray-500">Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-2 border-red-200 shadow-xl rounded-lg bg-white z-50">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setValue('date', format(date, 'yyyy-MM-dd'));
                      }
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="rounded-lg"
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
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
              <Select onValueChange={(value) => setValue('time', value)} defaultValue={watch('time')}>
                <SelectTrigger className="h-12 border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-lg">
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent className="border-2 border-red-200 shadow-xl rounded-lg max-h-48 bg-white z-50">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time} className="hover:bg-red-50 focus:bg-red-100 p-2 rounded-md">
                      <span className="font-bold">{time}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            {/* Tipo de Serviço */}
            <div className="space-y-3">
              <Label htmlFor="service_type" className="text-sm font-bold text-red-700 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Tipo de Serviço *
              </Label>
              <Select onValueChange={(value: any) => setValue('service_type', value)} defaultValue="tattoo">
                <SelectTrigger className="h-12 border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-lg">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="border-2 border-red-200 shadow-xl rounded-lg bg-white z-50">
                  <SelectItem value="tattoo" className="hover:bg-red-50 focus:bg-red-100 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎨</span>
                      <span className="font-bold">Tatuagem</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="piercing" className="hover:bg-red-50 focus:bg-red-100 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💎</span>
                      <span className="font-bold">Piercing</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="consultation" className="hover:bg-red-50 focus:bg-red-100 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💬</span>
                      <span className="font-bold">Consulta</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.service_type && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.service_type.message}
                </p>
              )}
            </div>

            {/* Maca */}
            <div className="space-y-3">
              <Label htmlFor="bed_id" className="text-sm font-bold text-red-700 flex items-center gap-2">
                <Bed className="h-4 w-4" />
                Maca
              </Label>
              <Select onValueChange={(value) => setValue('bed_id', value)} defaultValue="none">
                <SelectTrigger className="h-12 border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-lg">
                  <SelectValue placeholder="Selecione a maca (opcional)" />
                </SelectTrigger>
                <SelectContent className="border-2 border-red-200 shadow-xl rounded-lg bg-white z-50">
                  {bedsLoading ? (
                    <SelectItem value="loading" disabled className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-red-600 border-t-transparent"></div>
                        <span>Carregando macas...</span>
                      </div>
                    </SelectItem>
                  ) : (
                    <>
                      <SelectItem value="none" className="hover:bg-red-50 focus:bg-red-100 p-3 rounded-md">
                        <div className="font-bold text-gray-600">Nenhuma maca específica</div>
                      </SelectItem>
                      {activeBeds.map((bed) => (
                        <SelectItem key={bed.id} value={bed.id} className="hover:bg-red-50 focus:bg-red-100 p-3 rounded-md">
                          <div className="flex items-center gap-2">
                            <Bed className="h-3 w-3 text-red-600" />
                            <span className="font-bold">{bed.name} (Maca {bed.number})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Preço Estimado */}
            <div className="space-y-3">
              <Label htmlFor="estimated_price" className="text-sm font-bold text-red-700 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Preço Estimado (R$)
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

          {/* Upload de Fotos de Referência */}
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
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-red-300 text-red-700 hover:bg-red-100 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg px-6 py-3 h-auto font-bold"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Escolher Fotos de Referência
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
          </div>

          {/* Descrição do Serviço */}
          <div className="space-y-3">
            <Label htmlFor="service_description" className="text-sm font-bold text-red-700">Descrição do Serviço</Label>
            <Textarea
              placeholder="Descreva a tatuagem, localização, tamanho, estilo, etc..."
              {...register('service_description')}
              className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 min-h-24 bg-white rounded-lg resize-none"
              rows={4}
            />
          </div>

          {/* Observações */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-bold text-red-700">Observações</Label>
            <Textarea
              placeholder="Observações adicionais..."
              {...register('notes')}
              className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 min-h-20 bg-white rounded-lg resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t-2 border-red-100">
            <Button 
              type="submit" 
              disabled={isSubmitting || validationState === 'conflict'}
              className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-xl hover:shadow-red-500/25 transition-all duration-500 transform hover:scale-105 px-8 py-3 h-auto rounded-lg font-black text-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Criando Agendamento...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Criar Agendamento
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
