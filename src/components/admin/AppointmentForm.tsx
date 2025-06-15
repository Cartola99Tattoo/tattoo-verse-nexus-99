
import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getClientService } from "@/services/serviceFactory";
import { getBedService } from "@/services/serviceFactory";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, User, Bed, Scissors, FileText, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Client } from "@/services/interfaces/IClientService";

interface AppointmentFormProps {
  selectedSlot?: { start: Date; end: Date } | null;
  prefilledClientData?: { id: string; name: string } | null;
  clients: Client[];
  onSuccess: () => void;
  onClose?: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  selectedSlot, 
  prefilledClientData,
  clients, 
  onSuccess,
  onClose 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selectedSlot?.start || new Date()
  );
  const [selectedTime, setSelectedTime] = useState(
    selectedSlot?.start ? format(selectedSlot.start, 'HH:mm') : '09:00'
  );
  const [selectedClientId, setSelectedClientId] = useState(prefilledClientData?.id || '');
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const [selectedBedId, setSelectedBedId] = useState('');
  const [duration, setDuration] = useState(120);
  const [serviceType, setServiceType] = useState<'tattoo' | 'piercing' | 'consultation'>('tattoo');
  const [serviceDescription, setServiceDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | undefined>();

  const queryClient = useQueryClient();
  const clientService = getClientService();
  const bedService = getBedService();

  // Buscar macas disponíveis
  const { data: beds = [] } = useQuery({
    queryKey: ['beds'],
    queryFn: () => bedService.fetchBeds(),
  });

  // Mock artists data
  const artists = [
    { id: '1', name: 'João Silva', specialty: 'Realismo' },
    { id: '2', name: 'Maria Santos', specialty: 'Old School' },
    { id: '3', name: 'Pedro Costa', specialty: 'Tribal' },
  ];

  // Mutação para criar agendamento
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      return clientService.createAppointment(appointmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar agendamento",
        description: "Não foi possível criar o agendamento. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedClientId || !selectedArtistId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const appointmentData = {
      client_id: selectedClientId,
      artist_id: selectedArtistId,
      bed_id: selectedBedId,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      duration_minutes: duration,
      service_type: serviceType,
      service_description: serviceDescription,
      status: 'scheduled' as const,
      notes,
      estimated_price: estimatedPrice,
    };

    createAppointmentMutation.mutate(appointmentData);
  };

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  return (
    <div className="bg-gradient-to-br from-white to-red-50 rounded-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção de Informações Principais */}
        <div className="bg-white rounded-xl p-6 border-2 border-red-200 shadow-lg">
          <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Principais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cliente */}
            <div className="space-y-3">
              <Label htmlFor="client" className="text-red-800 font-bold flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Cliente *
              </Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId} disabled={!!prefilledClientData}>
                <SelectTrigger className="h-12 border-2 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent className="border-red-200 shadow-xl bg-white">
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id} className="hover:bg-red-50 focus:bg-red-50">
                      <div className="flex flex-col py-1">
                        <span className="font-medium text-red-800">{client.name}</span>
                        <span className="text-sm text-red-600">{client.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {prefilledClientData && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 font-medium">
                    Cliente pré-selecionado da ficha 360°
                  </p>
                </div>
              )}
            </div>

            {/* Tatuador */}
            <div className="space-y-3">
              <Label htmlFor="artist" className="text-red-800 font-bold flex items-center gap-2 text-base">
                <Scissors className="h-4 w-4" />
                Tatuador *
              </Label>
              <Select value={selectedArtistId} onValueChange={setSelectedArtistId}>
                <SelectTrigger className="h-12 border-2 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                  <SelectValue placeholder="Selecione o tatuador" />
                </SelectTrigger>
                <SelectContent className="border-red-200 shadow-xl bg-white">
                  {artists.map((artist) => (
                    <SelectItem key={artist.id} value={artist.id} className="hover:bg-red-50 focus:bg-red-50">
                      <div className="flex flex-col py-1">
                        <span className="font-medium text-red-800">{artist.name}</span>
                        <span className="text-sm text-red-600">{artist.specialty}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Seção de Data e Horário */}
        <div className="bg-white rounded-xl p-6 border-2 border-red-200 shadow-lg">
          <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Data e Horário
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Data */}
            <div className="space-y-3">
              <Label className="text-red-800 font-bold flex items-center gap-2 text-base">
                <CalendarIcon className="h-4 w-4" />
                Data *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal border-2 border-red-200 focus:border-red-500 bg-white shadow-md hover:bg-red-50 hover:shadow-lg transition-all duration-300",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-red-200 shadow-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={ptBR}
                    className="bg-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Horário */}
            <div className="space-y-3">
              <Label className="text-red-800 font-bold flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                Horário *
              </Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="h-12 border-2 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent className="border-red-200 shadow-xl bg-white">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time} className="hover:bg-red-50 focus:bg-red-50">
                      <span className="font-medium text-red-800">{time}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duração */}
            <div className="space-y-3">
              <Label htmlFor="duration" className="text-red-800 font-bold flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                Duração (minutos)
              </Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={30}
                max={480}
                step={30}
                className="h-12 border-2 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white shadow-md hover:shadow-lg transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Seção de Serviço */}
        <div className="bg-white rounded-xl p-6 border-2 border-red-200 shadow-lg">
          <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Detalhes do Serviço
          </h3>
          
          <div className="space-y-6">
            {/* Tipo de Serviço e Maca */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-red-800 font-bold text-base">Tipo de Serviço</Label>
                <Select value={serviceType} onValueChange={(value: any) => setServiceType(value)}>
                  <SelectTrigger className="h-12 border-2 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-red-200 shadow-xl bg-white">
                    <SelectItem value="tattoo" className="hover:bg-red-50 focus:bg-red-50">
                      <span className="font-medium text-red-800">Tatuagem</span>
                    </SelectItem>
                    <SelectItem value="piercing" className="hover:bg-red-50 focus:bg-red-50">
                      <span className="font-medium text-red-800">Piercing</span>
                    </SelectItem>
                    <SelectItem value="consultation" className="hover:bg-red-50 focus:bg-red-50">
                      <span className="font-medium text-red-800">Consultoria</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-red-800 font-bold flex items-center gap-2 text-base">
                  <Bed className="h-4 w-4" />
                  Maca
                </Label>
                <Select value={selectedBedId} onValueChange={setSelectedBedId}>
                  <SelectTrigger className="h-12 border-2 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                    <SelectValue placeholder="Selecione a maca" />
                  </SelectTrigger>
                  <SelectContent className="border-red-200 shadow-xl bg-white">
                    {beds.map((bed) => (
                      <SelectItem key={bed.id} value={bed.id} className="hover:bg-red-50 focus:bg-red-50">
                        <span className="font-medium text-red-800">{bed.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descrição do Serviço */}
            <div className="space-y-3">
              <Label htmlFor="serviceDescription" className="text-red-800 font-bold flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                Descrição do Serviço
              </Label>
              <Textarea
                id="serviceDescription"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                placeholder="Descreva o que será feito na sessão..."
                className="border-2 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 resize-none"
                rows={4}
              />
            </div>

            {/* Preço e Observações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="estimatedPrice" className="text-red-800 font-bold flex items-center gap-2 text-base">
                  <DollarSign className="h-4 w-4" />
                  Preço Estimado (R$)
                </Label>
                <Input
                  id="estimatedPrice"
                  type="number"
                  value={estimatedPrice || ''}
                  onChange={(e) => setEstimatedPrice(Number(e.target.value) || undefined)}
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                  className="h-12 border-2 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white shadow-md hover:shadow-lg transition-all duration-300"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes" className="text-red-800 font-bold text-base">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações adicionais..."
                  className="border-2 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-4 pt-6">
          {onClose && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="h-12 px-8 border-2 border-red-300 text-red-700 hover:bg-red-50 hover:border-red-500 shadow-md hover:shadow-lg transition-all duration-300 font-bold"
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={createAppointmentMutation.isPending}
            className="h-12 px-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold"
          >
            {createAppointmentMutation.isPending ? 'Criando...' : 'Criar Agendamento'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
