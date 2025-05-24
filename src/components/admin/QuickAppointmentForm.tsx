
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Client, Appointment } from "@/services/interfaces/IClientService";
import { getClientService } from "@/services/serviceFactory";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface QuickAppointmentFormProps {
  selectedSlot: { start: Date; end: Date } | null;
  clients: Client[];
  onSuccess: () => void;
  onConflict: (message: string) => void;
  checkConflicts: (appointment: {
    artist_id: string;
    date: string;
    time: string;
    duration_minutes: number;
  }) => Appointment[];
}

const QuickAppointmentForm = ({
  selectedSlot,
  clients,
  onSuccess,
  onConflict,
  checkConflicts
}: QuickAppointmentFormProps) => {
  const [clientId, setClientId] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [artistId, setArtistId] = useState("");
  const [date, setDate] = useState(
    selectedSlot ? format(selectedSlot.start, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
  const [time, setTime] = useState(
    selectedSlot ? format(selectedSlot.start, 'HH:mm') : '09:00'
  );
  const [duration, setDuration] = useState(120); // 2 horas padrão
  const [serviceType, setServiceType] = useState<'tattoo' | 'piercing' | 'consultation'>('tattoo');
  const [notes, setNotes] = useState("");
  const [createNewClient, setCreateNewClient] = useState(false);

  const clientService = getClientService();

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
      // Verificar conflitos antes de criar
      const conflicts = checkConflicts({
        artist_id: appointmentData.artist_id,
        date: appointmentData.date,
        time: appointmentData.time,
        duration_minutes: appointmentData.duration_minutes
      });

      if (conflicts.length > 0) {
        const conflictTimes = conflicts.map(c => `${c.time} (${c.duration_minutes}min)`).join(', ');
        throw new Error(`Conflito detectado nos horários: ${conflictTimes}`);
      }

      return clientService.createAppointment(appointmentData);
    },
    onSuccess: () => {
      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso.",
      });
      onSuccess();
    },
    onError: (error: any) => {
      onConflict(error.message);
      toast({
        title: "Erro ao criar agendamento",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const createClientMutation = useMutation({
    mutationFn: (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'total_spent' | 'total_orders'>) =>
      clientService.createClient(clientData),
    onSuccess: (newClient) => {
      setClientId(newClient.id);
      setCreateNewClient(false);
      toast({
        title: "Cliente criado",
        description: "O cliente foi criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar cliente",
        description: "Não foi possível criar o cliente.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalClientId = clientId;

    // Criar novo cliente se necessário
    if (createNewClient && newClientName.trim()) {
      const newClient = await createClientMutation.mutateAsync({
        name: newClientName.trim(),
        email: '', // Pode ser preenchido depois
        phone: newClientPhone.trim(),
        status: 'new'
      });
      finalClientId = newClient.id;
    }

    if (!finalClientId || !artistId) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione o cliente e o artista.",
        variant: "destructive"
      });
      return;
    }

    createAppointmentMutation.mutate({
      client_id: finalClientId,
      artist_id: artistId,
      date,
      time,
      duration_minutes: duration,
      service_type: serviceType,
      status: 'scheduled',
      notes: notes.trim() || undefined
    });
  };

  // Lista de artistas (mockada - em produção viria do banco)
  const artists = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Costa' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Cliente */}
      <div className="space-y-2">
        <Label>Cliente</Label>
        {!createNewClient ? (
          <div className="space-y-2">
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} - {client.phone || client.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateNewClient(true)}
            >
              + Criar novo cliente
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Input
              placeholder="Nome do novo cliente"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              required
            />
            <Input
              placeholder="Telefone (opcional)"
              value={newClientPhone}
              onChange={(e) => setNewClientPhone(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setCreateNewClient(false);
                setNewClientName("");
                setNewClientPhone("");
              }}
            >
              Voltar para lista
            </Button>
          </div>
        )}
      </div>

      {/* Artista */}
      <div className="space-y-2">
        <Label>Artista *</Label>
        <Select value={artistId} onValueChange={setArtistId} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o artista" />
          </SelectTrigger>
          <SelectContent>
            {artists.map((artist) => (
              <SelectItem key={artist.id} value={artist.id}>
                {artist.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data e Hora */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data *</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Hora *</Label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Duração e Serviço */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Duração (minutos) *</Label>
          <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60">1 hora</SelectItem>
              <SelectItem value="90">1h 30min</SelectItem>
              <SelectItem value="120">2 horas</SelectItem>
              <SelectItem value="180">3 horas</SelectItem>
              <SelectItem value="240">4 horas</SelectItem>
              <SelectItem value="300">5 horas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tipo de Serviço *</Label>
          <Select value={serviceType} onValueChange={(value: any) => setServiceType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tattoo">Tatuagem</SelectItem>
              <SelectItem value="piercing">Piercing</SelectItem>
              <SelectItem value="consultation">Consulta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notas */}
      <div className="space-y-2">
        <Label>Notas (opcional)</Label>
        <Textarea
          placeholder="Observações sobre o agendamento..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit" 
          className="flex-1"
          disabled={createAppointmentMutation.isPending || createClientMutation.isPending}
        >
          {createAppointmentMutation.isPending ? "Criando..." : "Criar Agendamento"}
        </Button>
      </div>
    </form>
  );
};

export default QuickAppointmentForm;
