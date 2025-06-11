
import React, { useState } from "react";
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
import { CalendarIcon, Search, Bed, DollarSign, Clock, User } from "lucide-react";
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
        price: data.estimated_price || 0, // Add price for financial integration
      };
      return clientService.createAppointment(appointmentData);
    },
    onSuccess: () => {
      toast({
        title: "Agendamento criado com sucesso! ✨",
        description: "O agendamento foi criado e aparecerá no calendário.",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o agendamento.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    console.log('Submitting appointment data:', data);
    createAppointmentMutation.mutate(data);
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
    <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-xl shadow-inner border border-red-100">
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cliente */}
            <div className="space-y-3">
              <Label htmlFor="client_id" className="text-sm font-bold text-red-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente *
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-red-400" />
                <Input
                  placeholder="Buscar cliente..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="pl-10 border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300"
                />
              </div>
              <Select onValueChange={(value) => setValue('client_id', value)}>
                <SelectTrigger className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent className="border-2 border-red-200 shadow-xl max-h-48">
                  {filteredClients.map((client) => (
                    <SelectItem key={client.id} value={client.id} className="hover:bg-red-50">
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.client_id && (
                <p className="text-sm text-red-600 font-medium">{errors.client_id.message}</p>
              )}
            </div>

            {/* Artista */}
            <div className="space-y-3">
              <Label htmlFor="artist_id" className="text-sm font-bold text-red-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Artista *
              </Label>
              <Select onValueChange={(value) => setValue('artist_id', value)}>
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
              <Select onValueChange={(value) => setValue('bed_id', value)} defaultValue="none">
                <SelectTrigger className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                  <SelectValue placeholder="Selecione a maca (opcional)" />
                </SelectTrigger>
                <SelectContent className="border-2 border-red-200 shadow-xl">
                  {bedsLoading ? (
                    <SelectItem value="loading" disabled>Carregando macas...</SelectItem>
                  ) : (
                    <>
                      <SelectItem value="none" className="hover:bg-red-50">Nenhuma maca específica</SelectItem>
                      {activeBeds.map((bed) => (
                        <SelectItem key={bed.id} value={bed.id} className="hover:bg-red-50">
                          <div className="flex items-center gap-2">
                            <Bed className="h-4 w-4" />
                            <span>{bed.name} (Maca {bed.number})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
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
                    className="w-full justify-start text-left font-normal border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-red-600" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-2 border-red-200 shadow-xl">
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
                  />
                </PopoverContent>
              </Popover>
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
              <Select onValueChange={(value) => setValue('time', value)} defaultValue={watch('time')}>
                <SelectTrigger className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent className="border-2 border-red-200 shadow-xl max-h-48">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time} className="hover:bg-red-50">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tipo de Serviço */}
            <div className="space-y-3">
              <Label htmlFor="service_type" className="text-sm font-bold text-red-700">Tipo de Serviço *</Label>
              <Select onValueChange={(value: any) => setValue('service_type', value)} defaultValue="tattoo">
                <SelectTrigger className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="border-2 border-red-200 shadow-xl">
                  <SelectItem value="tattoo" className="hover:bg-red-50">🎨 Tatuagem</SelectItem>
                  <SelectItem value="piercing" className="hover:bg-red-50">💎 Piercing</SelectItem>
                  <SelectItem value="consultation" className="hover:bg-red-50">💬 Consulta</SelectItem>
                </SelectContent>
              </Select>
              {errors.service_type && (
                <p className="text-sm text-red-600 font-medium">{errors.service_type.message}</p>
              )}
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
                className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300"
              />
            </div>
          </div>

          {/* Descrição do Serviço */}
          <div className="space-y-3">
            <Label htmlFor="service_description" className="text-sm font-bold text-red-700">Descrição do Serviço</Label>
            <Textarea
              placeholder="Descreva a tatuagem, localização, tamanho, etc..."
              {...register('service_description')}
              className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 min-h-20"
            />
          </div>

          {/* Observações */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-bold text-red-700">Observações</Label>
            <Textarea
              placeholder="Observações adicionais..."
              {...register('notes')}
              className="border-2 border-red-200 focus:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 min-h-20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-red-200">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-2"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <CalendarIcon className="h-4 w-4 mr-2" />
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
