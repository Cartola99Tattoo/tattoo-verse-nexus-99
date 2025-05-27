import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, User, Route } from "lucide-react";
import { getClientService } from "@/services/serviceFactory";
import { toast } from "@/hooks/use-toast";
import TattooJourney from "@/components/admin/TattooJourney";
import { Client } from "@/services/interfaces/IClientService";

const ClientEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clientService = getClientService();

  const [formData, setFormData] = useState<Partial<Client>>({});

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.fetchClientById(id!),
    enabled: !!id
  });

  // Use useEffect to update formData when client data is loaded
  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Client>) => 
      clientService.updateClient(id!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cliente.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.email?.trim()) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof Client, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/admin/clients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Carregando...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/admin/clients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cliente não encontrado</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/clients')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Cliente</h1>
          <p className="text-gray-600">Gerencie as informações do cliente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Edição */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birth_date">Data de Nascimento</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date || ''}
                      onChange={(e) => handleInputChange('birth_date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status || 'new'}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Novo Lead</SelectItem>
                        <SelectItem value="interested">Interessado</SelectItem>
                        <SelectItem value="pending">Agendamento Pendente</SelectItem>
                        <SelectItem value="completed">Tatuagem Concluída</SelectItem>
                        <SelectItem value="returning">Retorno Esperado</SelectItem>
                        <SelectItem value="vip">VIP/Fidelidade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred_style">Estilo Preferido</Label>
                    <Select
                      value={formData.preferred_style || ''}
                      onValueChange={(value) => handleInputChange('preferred_style', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um estilo" />
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

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    placeholder="Observações sobre o cliente..."
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Jornada 99Tattoo */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Resumo do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Gasto:</span>
                  <div className="font-medium">R$ {client.total_spent.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Pedidos:</span>
                  <div className="font-medium">{client.total_orders}</div>
                </div>
                <div>
                  <span className="text-gray-600">Temperatura:</span>
                  <div className="font-medium capitalize">{client.temperature}</div>
                </div>
                <div>
                  <span className="text-gray-600">Score:</span>
                  <div className="font-medium">{client.temperature_score || 0}</div>
                </div>
              </div>
              
              {client.next_appointment_date && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">Próximo Agendamento</div>
                  <div className="text-sm text-blue-600">
                    {new Date(client.next_appointment_date).toLocaleDateString('pt-BR')}
                  </div>
                  {client.next_appointment_artist && (
                    <div className="text-xs text-blue-500">
                      com {client.next_appointment_artist}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <TattooJourney client={client} />
        </div>
      </div>
    </div>
  );
};

export default ClientEdit;
