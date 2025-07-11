
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getClientService } from "@/services/serviceFactory";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  User, Phone, Mail, MapPin, Calendar, Clock, MessageSquare, 
  Edit, Save, X, Plus, ExternalLink, Target, Heart, Briefcase,
  Users, TrendingUp, FileText, Tag, Activity, Brain, CalendarPlus,
  Award, Star, Gift, Trophy, Crown, Zap, History, ShoppingBag
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
        <DialogContent className="max-w-[95vw] sm:max-w-7xl max-h-[90vh] overflow-auto">
          <div className="text-center py-8">Carregando dados do cliente...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!client) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] sm:max-w-7xl max-h-[90vh] overflow-auto">
          <div className="text-center py-8">Cliente não encontrado</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-7xl max-h-[95vh] overflow-auto bg-gradient-to-br from-red-50 via-white to-red-50 border-red-200">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-red-600/5 pointer-events-none"></div>
        
        <DialogHeader className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-4 lg:p-6 rounded-lg shadow-lg -mx-6 -mt-6 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] animate-pulse"></div>
            <div className="relative z-10 mb-4 lg:mb-0">
              <DialogTitle className="text-xl lg:text-2xl font-black flex items-center gap-2">
                <User className="h-5 w-5 lg:h-6 lg:w-6" />
                Ficha 360° do Cliente
              </DialogTitle>
              <DialogDescription className="text-red-100 font-medium">
                Visão completa e qualificada de {client?.name}
              </DialogDescription>
            </div>
            <div className="flex flex-wrap gap-2 relative z-10">
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

        {/* Layout de Perfil Social - Cards Organizados */}
        <div className="space-y-6 relative z-10">
          {/* Seção Superior - Perfil Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card Perfil Principal */}
            <Card className="lg:col-span-2 shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 rounded-t-lg pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${client?.name}`} />
                    <AvatarFallback className="bg-red-600 text-white text-lg font-bold">
                      {client?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-red-800">{client?.name}</h2>
                    <p className="text-red-600 font-medium">{client?.email}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getStatusBadge(client.status)}
                      {client.temperature && (
                        <Badge variant={client.temperature === 'hot' ? 'destructive' : client.temperature === 'warm' ? 'secondary' : 'secondary'}>
                          {client.temperature === 'hot' ? '🔥 Quente' : client.temperature === 'warm' ? '🔶 Morno' : '❄️ Frio'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {client?.phone && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                      <Phone className="h-4 w-4 text-red-600" />
                      <div>
                        <span className="text-sm text-gray-600">Telefone</span>
                        <div className="font-medium">{client.phone}</div>
                      </div>
                    </div>
                  )}
                  
                  {client?.address && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <div>
                        <span className="text-sm text-gray-600">Endereço</span>
                        <div className="font-medium text-sm">{client.address}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <Calendar className="h-4 w-4 text-red-600" />
                    <div>
                      <span className="text-sm text-gray-600">Cliente desde</span>
                      <div className="font-medium">{formatDate(client.created_at)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <Activity className="h-4 w-4 text-red-600" />
                    <div>
                      <span className="text-sm text-gray-600">Última atividade</span>
                      <div className="font-medium">{formatDate(client.updated_at || client.created_at)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Resumo Financeiro */}
            <Card className="shadow-xl bg-gradient-to-br from-white to-green-50 border-green-200 hover:shadow-2xl transition-all duration-300 animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-green-100 to-green-200 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-sm text-green-800">
                  <Briefcase className="h-4 w-4" />
                  Resumo Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-black text-green-600 mb-1">
                      {formatCurrency(client.total_spent)}
                    </div>
                    <p className="text-sm text-green-700 font-medium">Total investido</p>
                  </div>
                  
                  <Separator className="bg-green-200" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{client.total_orders}</div>
                      <p className="text-xs text-green-700">Pedidos</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">
                        {client.total_orders > 0 ? formatCurrency(client.total_spent / client.total_orders) : formatCurrency(0)}
                      </div>
                      <p className="text-xs text-green-700">Ticket médio</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seção Intermediária - Programa de Fidelidade e Qualificação */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card Programa de Fidelidade */}
            <Card className="shadow-xl bg-gradient-to-br from-white to-yellow-50 border-yellow-200 hover:shadow-2xl transition-all duration-300 animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-sm text-yellow-800">
                  <Trophy className="h-4 w-4" />
                  Programa de Fidelidade
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Status de Fidelidade */}
                <div className="text-center bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200 mb-4">
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

            {/* Card Qualificação do Lead */}
            <LeadQualificationForm
              client={client}
              onUpdateLeadScore={handleUpdateLeadScore}
              onUpdateInterests={handleUpdateInterests}
              isEditing={isEditing}
            />
          </div>

          {/* Seção Inferior - Históricos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card Histórico de Interações */}
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
                <div className="space-y-3 max-h-80 overflow-auto">
                  {interactions.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma interação registrada</p>
                    </div>
                  ) : (
                    interactions.map((interaction) => (
                      <div key={interaction.id} className="border-l-4 border-red-500 pl-4 pb-3 bg-white rounded-r-lg p-3 shadow-sm">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-red-800">{interaction.title}</h4>
                          <span className="text-xs text-gray-500">{formatDate(interaction.date)}</span>
                        </div>
                        {interaction.description && (
                          <p className="text-sm text-gray-600 mt-1 mb-2">{interaction.description}</p>
                        )}
                        <Badge variant="secondary" className="mt-1">
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

            {/* Card Agendamentos e Histórico */}
            <div className="space-y-4">
              {/* Próximos Agendamentos */}
              <Card className="shadow-xl bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:shadow-2xl transition-all duration-300 animate-fade-in">
                <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-sm text-blue-800">
                    <Calendar className="h-4 w-4" />
                    Próximos Agendamentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {client.next_appointment_date ? (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Próximo Agendamento</span>
                      </div>
                      <div className="font-medium">{formatDate(client.next_appointment_date)}</div>
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
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum agendamento futuro</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Histórico de Navegação */}
              <PageVisitsHistory clientId={clientId} />
            </div>
          </div>

          {/* Cards Adicionais se houver informações */}
          {(client.notes || (client.tags && client.tags.length > 0)) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Observações */}
              {client.notes && (
                <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-sm text-gray-800">
                      <FileText className="h-4 w-4" />
                      Observações
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded border">{client.notes}</div>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {client.tags && client.tags.length > 0 && (
                <Card className="shadow-xl bg-gradient-to-br from-white to-purple-50 border-purple-200 hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-sm text-purple-800">
                      <Tag className="h-4 w-4" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {client.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CRMClientDetail;
