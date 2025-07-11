
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getClientService } from "@/services/serviceFactory";
import { Client } from "@/services/interfaces/IClientService";
import { toast } from "@/hooks/use-toast";

interface CreateClientFormProps {
  onSuccess: () => void;
}

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  birth_date: string;
  status: 'new' | 'active' | 'inactive' | 'vip';
  preferred_style: string;
  notes: string;
}

const CreateClientForm = ({ onSuccess }: CreateClientFormProps) => {
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    status: 'new',
    preferred_style: '',
    notes: ''
  });

  const clientService = getClientService();

  const createClientMutation = useMutation({
    mutationFn: (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'total_spent' | 'total_orders'>) =>
      clientService.createClient(clientData),
    onSuccess: () => {
      toast({
        title: "Cliente criado",
        description: "O cliente foi cadastrado com sucesso.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Erro ao criar cliente",
        description: "Não foi possível cadastrar o cliente.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Dados incompletos",
        description: "Nome e email são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    createClientMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      birth_date: formData.birth_date || undefined,
      status: formData.status,
      preferred_style: formData.preferred_style || undefined,
      notes: formData.notes || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nome do cliente"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@exemplo.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <Label htmlFor="birth_date">Data de Nascimento</Label>
          <Input
            id="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Endereço completo"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Novo</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="preferred_style">Estilo Preferido</Label>
          <Select
            value={formData.preferred_style}
            onValueChange={(value) => setFormData({ ...formData, preferred_style: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estilo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Realismo">Realismo</SelectItem>
              <SelectItem value="Old School">Old School</SelectItem>
              <SelectItem value="Minimalista">Minimalista</SelectItem>
              <SelectItem value="Blackwork">Blackwork</SelectItem>
              <SelectItem value="Aquarela">Aquarela</SelectItem>
              <SelectItem value="Geométrico">Geométrico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Informações adicionais sobre o cliente"
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={createClientMutation.isPending}>
          {createClientMutation.isPending ? "Cadastrando..." : "Cadastrar Cliente"}
        </Button>
      </div>
    </form>
  );
};

export default CreateClientForm;
