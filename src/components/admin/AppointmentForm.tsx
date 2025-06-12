
import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Calendar as CalendarIcon, Clock, User, Bed, Scissors, FileText, DollarSign, X } from "lucide-react";
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-gradient-to-br from-white to-red-50 border-red-200">
        <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-4 rounded-lg -mx-6 -mt-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-black flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {prefilledClientData ? `Novo Agendamento - ${prefilledClientData.name}` : 'Novo Agendamento'}
              </DialogTitle>
              <DialogDescription className="text-red-100">
                {prefilledClientData 
                  ? `Criar agendamento para o cliente ${prefilledClientData.name}`
                  : 'Preencha os dados para criar um novo agendamento'
                }
              </DialogDescription>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="client" className="text-red-800 font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente *
              </Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId} disabled={!!prefilledClientData}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex flex-col">
                        <span>{client.name}</span>
                        <span className="text-sm text-gray-500">{client.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {prefilledClientData && (
                <p className="text-sm text-red-600">Cliente pré-selecionado da ficha 360°</p>
              )}
            </div>

            {/* Tatuador */}
            <div className="space-y-2">
              <Label htmlFor="artist" className="text-red-800 font-medium flex items-center gap-2">
                <Scissors className="h-4 w-4" />
                Tatuador *
              </Label>
              <Select value={selectedArtistId} onValueChange={setSelectedArtistId}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue placeholder="Selecione o tatuador" />
                </SelectTrigger>
                <SelectContent>
                  {artists.map((artist) => (
                    <SelectItem key={artist.id} value={artist.id}>
                      <div className="flex flex-col">
                        <span>{artist.name}</span>
                        <span className="text-sm text-gray-500">{artist.specialty}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label className="text-red-800 font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Data *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-red-200 focus:border-red-500",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Horário */}
            <div className="space-y-2">
              <Label className="text-red-800 font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Horário *
              </Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Maca */}
            <div className="space-y-2">
              <Label className="text-red-800 font-medium flex items-center gap-2">
                <Bed className="h-4 w-4" />
                Maca
              </Label>
              <Select value={selectedBedId} onValueChange={setSelectedBedId}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue placeholder="Selecione a maca" />
                </SelectTrigger>
                <SelectContent>
                  {beds.map((bed) => (
                    <SelectItem key={bed.id} value={bed.id}>
                      {bed.name} - {bed.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duração */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-red-800 font-medium flex items-center gap-2">
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
                className="border-red-200 focus:border-red-500"
              />
            </div>
          </div>

          {/* Tipo de Serviço */}
          <div className="space-y-2">
            <Label className="text-red-800 font-medium">Tipo de Serviço</Label>
            <Select value={serviceType} onValueChange={(value: any) => setServiceType(value)}>
              <SelectTrigger className="border-red-200 focus:border-red-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tattoo">Tatuagem</SelectItem>
                <SelectItem value="piercing">Piercing</SelectItem>
                <SelectItem value="consultation">Consultoria</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Descrição do Serviço */}
          <div className="space-y-2">
            <Label htmlFor="serviceDescription" className="text-red-800 font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Descrição do Serviço
            </Label>
            <Textarea
              id="serviceDescription"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              placeholder="Descreva o que será feito na sessão..."
              className="border-red-200 focus:border-red-500"
              rows={3}
            />
          </div>

          {/* Preço Estimado */}
          <div className="space-y-2">
            <Label htmlFor="estimatedPrice" className="text-red-800 font-medium flex items-center gap-2">
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
              className="border-red-200 focus:border-red-500"
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-red-800 font-medium">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações adicionais..."
              className="border-red-200 focus:border-red-500"
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-red-200">
            {onClose && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                Cancelar
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={createAppointmentMutation.isPending}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
            >
              {createAppointmentMutation.isPending ? 'Criando...' : 'Criar Agendamento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;
