
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getClientService } from "@/services/serviceFactory";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  User, Phone, Mail, MapPin, Calendar, Clock, MessageSquare, 
  Edit, Save, X, Plus, ExternalLink, Target, Heart, Briefcase,
  Users, TrendingUp, FileText, Tag
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CRMClientDetailProps {
  clientId: string;
  onClose: () => void;
}

const CRMClientDetail: React.FC<CRMClientDetailProps> = ({ clientId, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newInteraction, setNewInteraction] = useState("");
  const [isAddingInteraction, setIsAddingInteraction] = useState(false);
  
  const queryClient = useQueryClient();
  const clientService = getClientService();

  // Buscar dados do cliente
  const { data: client, isLoading } = useQuery({
    queryKey: ['crm-client', clientId],
    queryFn: () => clientService.fetchClientById(clientId),
  });

  // Buscar interações do cliente
  const { data: interactions = [] } = useQuery({
    queryKey: ['client-interactions', clientId],
    queryFn: () => clientService.fetchClientInteractions(clientId),
  });

  // Buscar agendamentos do cliente
  const { data: appointments = [] } = useQuery({
    queryKey: ['client-appointments', clientId],
    queryFn: () => clientService.fetchClientAppointments(clientId),
  });

  // Mutação para adicionar interação
  const addInteractionMutation = useMutation({
    mutationFn: (interactionData: any) => clientService.createClientInteraction(interactionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-interactions', clientId] });
      setNewInteraction("");
      setIsAddingInteraction(false);
      toast({
        title: "Interação adicionada",
        description: "A nova interação foi registrada com sucesso.",
      });
    },
  });

  // Mutação para atualizar cliente
  const updateClientMutation = useMutation({
    mutationFn: (updates: any) => clientService.updateClient(clientId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-client', clientId] });
      setIsEditing(false);
      toast({
        title: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados com sucesso.",
      });
    },
  });

  const handleAddInteraction = () => {
    if (!newInteraction.trim()) return;
    
    addInteractionMutation.mutate({
      client_id: clientId,
      type: 'note',
      title: 'Anotação do tatuador',
      description: newInteraction,
      date: new Date().toISOString(),
      user_id: 'current-user', // Mock
    });
  };

  const handleStatusChange = (newStatus: string) => {
    updateClientMutation.mutate({ status: newStatus });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      new: { variant: "tattooInfo", label: "Novo Lead" },
      interested: { variant: "tattooWarning", label: "Interessado" },
      pending: { variant: "tattooWarning", label: "Proposta Enviada" },
      active: { variant: "tattooSuccess", label: "Em Negociação" },
      completed: { variant: "tattooSuccess", label: "Convertido" },
      inactive: { variant: "secondary", label: "Perdido" },
      returning: { variant: "tattoo", label: "Retorno" },
      vip: { variant: "tattoo", label: "VIP" },
    };
    
    const variant = variants[status as keyof typeof variants];
    return <Badge variant={variant?.variant as any}>{variant?.label || status}</Badge>;
  };

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <div className="text-center py-8">Carregando dados do cliente...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!client) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <div className="text-center py-8">Cliente não encontrado</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Ficha Completa do Cliente</DialogTitle>
              <DialogDescription>
                Visão 360° de {client.name}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="tattooOutline" 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Dados Pessoais e Status */}
          <div className="space-y-4">
            {/* Dados Pessoais */}
            <Card variant="tattoo">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nome</label>
                  <div className="text-lg font-medium">{client.name}</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{client.email}</span>
                  <Button variant="ghost" size="sm" onClick={() => window.open(`mailto:${client.email}`)}>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{client.phone}</span>
                    <Button variant="ghost" size="sm" onClick={() => window.open(`https://wa.me/${client.phone?.replace(/\D/g, '')}`)}>
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {client.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{client.address}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Cliente desde {formatDate(client.created_at)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Status e Classificação */}
            <Card variant="tattoo">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Status e Classificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status Atual</label>
                  <div className="mt-1">
                    {isEditing ? (
                      <Select value={client.status} onValueChange={handleStatusChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Novo Lead</SelectItem>
                          <SelectItem value="interested">Interessado</SelectItem>
                          <SelectItem value="pending">Proposta Enviada</SelectItem>
                          <SelectItem value="active">Em Negociação</SelectItem>
                          <SelectItem value="completed">Convertido</SelectItem>
                          <SelectItem value="inactive">Perdido</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getStatusBadge(client.status)
                    )}
                  </div>
                </div>
                
                {client.temperature && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Temperatura</label>
                    <div className="mt-1">
                      <Badge variant={client.temperature === 'hot' ? 'destructive' : client.temperature === 'warm' ? 'tattooWarning' : 'tattooInfo'}>
                        {client.temperature === 'hot' ? '🔥 Quente' : client.temperature === 'warm' ? '🔶 Morno' : '❄️ Frio'}
                      </Badge>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Valor Total Gasto</label>
                  <div className="text-lg font-medium text-green-600">{formatCurrency(client.total_spent)}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Total de Pedidos</label>
                  <div className="text-lg font-medium">{client.total_orders}</div>
                </div>
              </CardContent>
            </Card>

            {/* Preferências */}
            <Card variant="tattoo">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Preferências
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Estilo Preferido</label>
                  <div>{client.preferred_style || 'Não definido'}</div>
                </div>
                
                {client.preferred_artist_id && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tatuador Preferido</label>
                    <div>Tatuador ID: {client.preferred_artist_id}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna 2: Histórico de Interações */}
          <div className="space-y-4">
            <Card variant="tattoo">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Histórico de Interações
                  </CardTitle>
                  <Button 
                    variant="tattooOutline" 
                    size="sm"
                    onClick={() => setIsAddingInteraction(!isAddingInteraction)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Formulário para nova interação */}
                {isAddingInteraction && (
                  <div className="mb-4 p-4 border border-red-200 rounded-lg bg-red-50">
                    <Textarea
                      placeholder="Descreva a interação (ex: Ligação realizada, proposta enviada, feedback recebido...)"
                      value={newInteraction}
                      onChange={(e) => setNewInteraction(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddInteraction} disabled={addInteractionMutation.isPending}>
                        <Save className="h-3 w-3 mr-1" />
                        Salvar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsAddingInteraction(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Lista de interações */}
                <div className="space-y-3 max-h-96 overflow-auto">
                  {interactions.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      Nenhuma interação registrada
                    </div>
                  ) : (
                    interactions.map((interaction) => (
                      <div key={interaction.id} className="border-l-4 border-red-500 pl-4 pb-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{interaction.title}</h4>
                          <span className="text-xs text-gray-500">{formatDate(interaction.date)}</span>
                        </div>
                        {interaction.description && (
                          <p className="text-sm text-gray-600 mt-1">{interaction.description}</p>
                        )}
                        <Badge variant="tattooSecondary" className="mt-2">
                          {interaction.type === 'call' ? 'Ligação' :
                           interaction.type === 'email' ? 'Email' :
                           interaction.type === 'visit' ? 'Visita' :
                           interaction.type === 'note' ? 'Anotação' :
                           interaction.type === 'appointment' ? 'Agendamento' :
                           interaction.type === 'purchase' ? 'Compra' : interaction.type}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 3: Agendamentos e Próximos Passos */}
          <div className="space-y-4">
            {/* Próximos Agendamentos */}
            <Card variant="tattoo">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agendamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {client.next_appointment_date ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Próximo Agendamento</span>
                    </div>
                    <div>{formatDate(client.next_appointment_date)}</div>
                    {client.next_appointment_artist && (
                      <div className="text-sm text-gray-600">Com: {client.next_appointment_artist}</div>
                    )}
                    {client.appointment_status && (
                      <Badge variant="tattooWarning" className="mt-2">
                        {client.appointment_status}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    Nenhum agendamento futuro
                  </div>
                )}

                {/* Histórico de agendamentos */}
                {appointments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Histórico</h4>
                    <div className="space-y-2 max-h-32 overflow-auto">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="text-sm border-l-2 border-gray-300 pl-2">
                          <div>{formatDate(appointment.date)}</div>
                          <div className="text-gray-600">{appointment.service_type}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações do Lead */}
            {client.notes && (
              <Card variant="tattoo">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Observações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm whitespace-pre-wrap">{client.notes}</div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {client.tags && client.tags.length > 0 && (
              <Card variant="tattoo">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {client.tags.map((tag, index) => (
                      <Badge key={index} variant="tattooSecondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CRMClientDetail;
