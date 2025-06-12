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
  Users, TrendingUp, FileText, Tag, Activity, Brain, CalendarPlus,
  Award, Star, Gift, Trophy, Crown, Zap
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import LeadQualificationForm from "./LeadQualificationForm";
import PageVisitsHistory from "./PageVisitsHistory";

interface CRMClientDetailProps {
  clientId: string;
  onClose: () => void;
  onOpenAppointmentForm?: (clientId: string, clientName: string) => void;
}

const CRMClientDetail: React.FC<CRMClientDetailProps> = ({ 
  clientId, 
  onClose, 
  onOpenAppointmentForm 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newInteraction, setNewInteraction] = useState("");
  const [isAddingInteraction, setIsAddingInteraction] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [selectedReward, setSelectedReward] = useState("");
  
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

  // Mutação para atualizar pontuação
  const updateLeadScoreMutation = useMutation({
    mutationFn: (score: number) => clientService.updateLeadScore(clientId, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-client', clientId] });
      toast({
        title: "Pontuação atualizada",
        description: "A pontuação do lead foi atualizada com sucesso.",
      });
    },
  });

  // Mutação para atualizar interesses
  const updateInterestsMutation = useMutation({
    mutationFn: (interests: string[]) => clientService.updateQualifiedInterests(clientId, interests),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-client', clientId] });
      toast({
        title: "Interesses atualizados",
        description: "Os interesses qualificados foram atualizados com sucesso.",
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

  const handleUpdateLeadScore = (score: number) => {
    updateLeadScoreMutation.mutate(score);
  };

  const handleUpdateInterests = (interests: string[]) => {
    updateInterestsMutation.mutate(interests);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      new: { variant: "secondary", label: "Novo Lead" },
      interested: { variant: "secondary", label: "Interessado" },
      pending: { variant: "secondary", label: "Proposta Enviada" },
      active: { variant: "secondary", label: "Em Negociação" },
      completed: { variant: "secondary", label: "Convertido" },
      inactive: { variant: "secondary", label: "Perdido" },
      returning: { variant: "secondary", label: "Retorno" },
      vip: { variant: "secondary", label: "VIP" },
    };
    
    const variant = variants[status as keyof typeof variants];
    return <Badge variant={variant?.variant as any}>{variant?.label || status}</Badge>;
  };

  const handleNewAppointment = () => {
    if (onOpenAppointmentForm && client) {
      onOpenAppointmentForm(client.id, client.name);
    }
  };

  const handleAddLoyaltyPoints = () => {
    if (loyaltyPoints > 0) {
      toast({
        title: "✨ Pontos adicionados!",
        description: `${loyaltyPoints} pontos foram adicionados ao cliente ${client?.name}`,
      });
      setLoyaltyPoints(0);
    }
  };

  const handleRedeemReward = () => {
    if (selectedReward) {
      const reward = mockLoyaltyData.rewardsAvailable.find(r => r.id === selectedReward);
      toast({
        title: "🎁 Recompensa resgatada!",
        description: `${reward?.name} foi resgatada para ${client?.name}`,
      });
      setSelectedReward("");
    }
  };

  // Mock loyalty data for demonstration
  const mockLoyaltyData = {
    totalPoints: 1250,
    currentLevel: "Ouro",
    nextLevel: "Platina",
    pointsToNextLevel: 250,
    rewardsUsed: 3,
    rewardsAvailable: [
      { id: '1', name: '10% de Desconto', cost: 100, available: true },
      { id: '2', name: 'Retoque Grátis', cost: 200, available: true },
      { id: '3', name: 'Sessão Premium', cost: 500, available: true },
      { id: '4', name: 'Design Personalizado', cost: 300, available: true },
    ]
  };

  const getLoyaltyBadge = (level: string) => {
    const levelConfig = {
      Bronze: { variant: "secondary", icon: Award, color: "text-amber-600" },
      Prata: { variant: "secondary", icon: Star, color: "text-gray-500" },
      Ouro: { variant: "tattoo", icon: Crown, color: "text-yellow-500" },
      Platina: { variant: "tattoo", icon: Trophy, color: "text-purple-600" },
    };
    
    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.Bronze;
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant as any} className="animate-pulse">
        <IconComponent className={`h-3 w-3 mr-1 ${config.color}`} />
        {level}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
          <div className="text-center py-8">Carregando dados do cliente...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!client) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
          <div className="text-center py-8">Cliente não encontrado</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-auto bg-gradient-to-br from-red-50 via-white to-red-50 border-red-200">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-red-600/5 pointer-events-none"></div>
        
        <DialogHeader className="relative z-10">
          <div className="flex items-center justify-between bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-4 rounded-lg shadow-lg -mx-6 -mt-6 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] animate-pulse"></div>
            <div className="relative z-10">
              <DialogTitle className="text-2xl font-black flex items-center gap-2">
                <User className="h-6 w-6" />
                Ficha 360° do Cliente
              </DialogTitle>
              <DialogDescription className="text-red-100 font-medium">
                Visão completa e qualificada de {client?.name}
              </DialogDescription>
            </div>
            <div className="flex gap-2 relative z-10">
              {onOpenAppointmentForm && (
                <Button 
                  onClick={handleNewAppointment}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Agendar Novo Compromisso
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
          {/* Coluna 1: Dados Pessoais e Status */}
          <div className="space-y-4">
            {/* Dados Pessoais */}
            <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-sm text-red-800">
                  <User className="h-4 w-4" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nome</label>
                  <div className="text-lg font-bold text-red-800">{client?.name}</div>
                </div>
                
                <div className="flex items-center gap-2 group">
                  <Mail className="h-4 w-4 text-red-500" />
                  <span className="text-sm">{client?.email}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.open(`mailto:${client?.email}`)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-100"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                
                {client?.phone && (
                  <div className="flex items-center gap-2 group">
                    <Phone className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{client.phone}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => window.open(`https://wa.me/${client.phone?.replace(/\D/g, '')}`)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-green-100"
                    >
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {/* ... keep existing code (address, creation date, last activity) */}
              </CardContent>
            </Card>

            {/* Status e Classificação */}
            <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-sm text-red-800">
                  <Target className="h-4 w-4" />
                  Status e Classificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
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
                      <Badge variant={client.temperature === 'hot' ? 'destructive' : client.temperature === 'warm' ? 'secondary' : 'secondary'}>
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

                {/* Origem do Lead */}
                {client.origin && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Origem do Lead</label>
                    <div className="mt-1">
                      <Badge variant="outline">{client.origin}</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna 2: Qualificação do Lead + Programa de Fidelidade */}
          <div className="space-y-4">
            <LeadQualificationForm
              client={client}
              onUpdateLeadScore={handleUpdateLeadScore}
              onUpdateInterests={handleUpdateInterests}
              isEditing={isEditing}
            />

            {/* Nova Seção: Programa de Fidelidade */}
            <Card className="shadow-xl bg-gradient-to-br from-white to-yellow-50 border-yellow-200 hover:shadow-2xl transition-all duration-300 animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-sm text-yellow-800">
                  <Trophy className="h-4 w-4" />
                  Programa de Fidelidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                {/* Status de Fidelidade */}
                <div className="text-center bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                  <div className="flex justify-center mb-2">
                    {getLoyaltyBadge(mockLoyaltyData.currentLevel)}
                  </div>
                  <div className="text-2xl font-black text-yellow-600 mb-1">
                    {mockLoyaltyData.totalPoints} pts
                  </div>
                  <div className="text-xs text-yellow-700">
                    {mockLoyaltyData.pointsToNextLevel} pts para {mockLoyaltyData.nextLevel}
                  </div>
                  
                  {/* Barra de Progresso */}
                  <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${((mockLoyaltyData.totalPoints % 500) / 500) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Gestão de Pontos */}
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Adicionar Pontos</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Pontos"
                        value={loyaltyPoints}
                        onChange={(e) => setLoyaltyPoints(Number(e.target.value))}
                        className="border-yellow-200 focus:border-yellow-500"
                      />
                      <Button 
                        onClick={handleAddLoyaltyPoints}
                        size="sm"
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  {/* Resgatar Recompensas */}
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Resgatar Recompensa</label>
                    <div className="space-y-2">
                      <Select value={selectedReward} onValueChange={setSelectedReward}>
                        <SelectTrigger className="border-yellow-200 focus:border-yellow-500">
                          <SelectValue placeholder="Escolher recompensa" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockLoyaltyData.rewardsAvailable.map((reward) => (
                            <SelectItem key={reward.id} value={reward.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{reward.name}</span>
                                <Badge variant="secondary" className="ml-2">
                                  {reward.cost} pts
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={handleRedeemReward}
                        size="sm"
                        disabled={!selectedReward}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg"
                      >
                        <Gift className="h-3 w-3 mr-1" />
                        Resgatar
                      </Button>
                    </div>
                  </div>

                  {/* Estatísticas Rápidas */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-yellow-200">
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">{mockLoyaltyData.rewardsUsed}</div>
                      <div className="text-xs text-yellow-700">Recompensas usadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">{mockLoyaltyData.rewardsAvailable.length}</div>
                      <div className="text-xs text-yellow-700">Disponíveis</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferências */}
            <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-sm text-red-800">
                  <Heart className="h-4 w-4" />
                  Preferências
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                {/* ... keep existing code (preferences) */}
              </CardContent>
            </Card>
          </div>

          {/* Coluna 3: Histórico de Interações */}
          <div className="space-y-4">
            <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm text-red-800">
                    <MessageSquare className="h-4 w-4" />
                    Histórico de Interações
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsAddingInteraction(!isAddingInteraction)}
                    className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
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
                        <Badge variant="secondary" className="mt-2">
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

          {/* Coluna 4: Histórico de Navegação e Agendamentos */}
          <div className="space-y-4">
            {/* Histórico de Visitas */}
            <PageVisitsHistory clientId={clientId} />

            {/* Próximos Agendamentos */}
            <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-sm text-red-800">
                  <Calendar className="h-4 w-4" />
                  Agendamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
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
                      <Badge variant="secondary" className="mt-2">
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {client.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
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
