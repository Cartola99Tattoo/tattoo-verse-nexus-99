
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getClientService } from "@/services/serviceFactory";
import { ClientInteraction } from "@/services/interfaces/IClientService";
import { toast } from "@/hooks/use-toast";

interface ClientInteractionFormProps {
  clientId: string;
  onSuccess: () => void;
}

interface InteractionFormData {
  type: 'call' | 'email' | 'visit' | 'note' | 'appointment' | 'purchase' | '';
  title: string;
  description: string;
  date: string;
}

const ClientInteractionForm = ({ clientId, onSuccess }: ClientInteractionFormProps) => {
  const [formData, setFormData] = useState<InteractionFormData>({
    type: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const clientService = getClientService();

  const createInteractionMutation = useMutation({
    mutationFn: (interactionData: Omit<ClientInteraction, 'id' | 'created_at'>) =>
      clientService.createClientInteraction(interactionData),
    onSuccess: () => {
      toast({
        title: "Interação registrada",
        description: "A interação foi registrada com sucesso.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Erro ao registrar interação",
        description: "Não foi possível registrar a interação.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.title || !formData.description) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    createInteractionMutation.mutate({
      client_id: clientId,
      type: formData.type as any,
      title: formData.title,
      description: formData.description,
      date: formData.date,
    });
  };

  const typeLabels = {
    call: "Ligação",
    email: "Email",
    visit: "Visita",
    note: "Nota",
    appointment: "Agendamento",
    purchase: "Compra"
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo de Interação *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Ligação</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="visit">Visita</SelectItem>
              <SelectItem value="note">Nota</SelectItem>
              <SelectItem value="appointment">Agendamento</SelectItem>
              <SelectItem value="purchase">Compra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="date">Data *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Título da interação"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descreva os detalhes da interação"
          rows={4}
          required
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={createInteractionMutation.isPending}>
          {createInteractionMutation.isPending ? "Registrando..." : "Registrar Interação"}
        </Button>
      </div>
    </form>
  );
};

export default ClientInteractionForm;
