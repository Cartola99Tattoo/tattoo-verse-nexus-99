
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getClientService } from "@/services/serviceFactory";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar, Star, CreditCard, Clock, MessageSquare, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ClientInteractionForm from "@/components/admin/ClientInteractionForm";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isInteractionDialogOpen, setIsInteractionDialogOpen] = useState(false);
  
  const clientService = getClientService();

  // Buscar dados do cliente
  const { data: client, isLoading: clientLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.fetchClientById(id!),
    enabled: !!id,
  });

  // Buscar interações
  const { data: interactions = [], isLoading: interactionsLoading } = useQuery({
    queryKey: ['client-interactions', id],
    queryFn: () => clientService.fetchClientInteractions(id!),
    enabled: !!id,
  });

  // Buscar histórico de compras
  const { data: purchases = [], isLoading: purchasesLoading } = useQuery({
    queryKey: ['client-purchases', id],
    queryFn: () => clientService.fetchClientPurchaseHistory(id!),
    enabled: !!id,
  });

  // Buscar agendamentos
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['client-appointments', id],
    queryFn: () => clientService.fetchClientAppointments(id!),
    enabled: !!id,
  });

  if (clientLoading) {
    return (
      <AdminLayout title="Carregando..." description="">
        <div className="flex items-center justify-center p-8">
          <p>Carregando dados do cliente...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!client) {
    return (
      <AdminLayout title="Cliente não encontrado" description="">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Cliente não encontrado</p>
            <Button onClick={() => navigate('/admin/clients')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Clientes
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "bg-blue-100 text-blue-800 border-blue-300",
      active: "bg-green-100 text-green-800 border-green-300", 
      inactive: "bg-gray-100 text-gray-800 border-gray-300",
      vip: "bg-purple-100 text-purple-800 border-purple-300",
    };
    
    const labels = {
      new: "Novo",
      active: "Ativo",
      inactive: "Inativo", 
      vip: "VIP",
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getInteractionIcon = (type: string) => {
    const icons = {
      call: Phone,
      email: Mail,
      visit: MapPin,
      note: MessageSquare,
      appointment: Calendar,
      purchase: CreditCard,
    };
    
    return icons[type as keyof typeof icons] || MessageSquare;
  };

  return (
    <AdminLayout 
      title={client.name} 
      description="Perfil completo do cliente"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/admin/clients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Clientes
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar Cliente
          </Button>
        </div>

        {/* Informações Básicas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{client.name}</CardTitle>
                  <CardDescription>Informações do cliente</CardDescription>
                </div>
                {getStatusBadge(client.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{client.address}</span>
                  </div>
                )}
                {client.birth_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formatDate(client.birth_date)}</span>
                  </div>
                )}
              </div>
              
              {client.preferred_style && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Estilo Preferido</p>
                  <Badge variant="secondary">{client.preferred_style}</Badge>
                </div>
              )}
              
              {client.tags && client.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {client.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {client.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Observações</p>
                  <p className="text-sm">{client.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Gasto</span>
                  <span className="font-bold text-lg">{formatCurrency(client.total_spent)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total de Pedidos</span>
                  <Badge variant="secondary">{client.total_orders}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Ticket Médio</span>
                  <span className="font-medium">
                    {formatCurrency(client.total_orders > 0 ? client.total_spent / client.total_orders : 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Cliente desde</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{formatDate(client.created_at)}</p>
                <p className="text-sm text-gray-500">
                  {Math.floor((new Date().getTime() - new Date(client.created_at).getTime()) / (1000 * 60 * 60 * 24))} dias
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs com histórico detalhado */}
        <Tabs defaultValue="interactions" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-fit grid-cols-3">
              <TabsTrigger value="interactions">Interações</TabsTrigger>
              <TabsTrigger value="purchases">Compras</TabsTrigger>
              <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            </TabsList>
            
            <Dialog open={isInteractionDialogOpen} onOpenChange={setIsInteractionDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Interação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Nova Interação</DialogTitle>
                  <DialogDescription>
                    Adicione uma nova interação ou nota sobre o cliente
                  </DialogDescription>
                </DialogHeader>
                <ClientInteractionForm 
                  clientId={client.id}
                  onSuccess={() => {
                    setIsInteractionDialogOpen(false);
                    queryClient.invalidateQueries({ queryKey: ['client-interactions', id] });
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="interactions">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Interações</CardTitle>
                <CardDescription>
                  Todas as comunicações e notas sobre o cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                {interactionsLoading ? (
                  <p>Carregando interações...</p>
                ) : interactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhuma interação registrada</p>
                ) : (
                  <div className="space-y-4">
                    {interactions.map((interaction) => {
                      const IconComponent = getInteractionIcon(interaction.type);
                      return (
                        <div key={interaction.id} className="flex gap-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <IconComponent className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{interaction.title}</h4>
                              <span className="text-sm text-gray-500">
                                {formatDate(interaction.date)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{interaction.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Compras</CardTitle>
                <CardDescription>
                  Todas as tatuagens e produtos adquiridos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchasesLoading ? (
                  <p>Carregando compras...</p>
                ) : purchases.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhuma compra registrada</p>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{purchase.description}</h4>
                          <p className="text-sm text-gray-500">
                            {formatDate(purchase.date)} • {purchase.artist || 'Produto'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(purchase.amount)}</p>
                          <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
                            {purchase.status === 'completed' ? 'Concluído' : 'Pendente'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Agendamentos</CardTitle>
                <CardDescription>
                  Agendamentos passados e futuros
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <p>Carregando agendamentos...</p>
                ) : appointments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum agendamento registrado</p>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <div>
                            <h4 className="font-medium">{appointment.service}</h4>
                            <p className="text-sm text-gray-500">
                              {formatDate(appointment.date)} às {appointment.time} • {appointment.artist}
                            </p>
                          </div>
                        </div>
                        <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'}>
                          {appointment.status === 'completed' ? 'Concluído' : appointment.status === 'scheduled' ? 'Agendado' : 'Pendente'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ClientDetail;
