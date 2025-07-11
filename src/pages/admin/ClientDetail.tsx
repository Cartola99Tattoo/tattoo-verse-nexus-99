import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getClientService } from "@/services/serviceFactory";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Plus, MessageSquare, ShoppingBag, Clock } from "lucide-react";
import ClientInteractionForm from "@/components/admin/ClientInteractionForm";
import TattooJourney from "@/components/admin/TattooJourney";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isInteractionDialogOpen, setIsInteractionDialogOpen] = useState(false);
  
  const clientService = getClientService();

  // Buscar dados do cliente
  const { data: client, isLoading: clientLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => id ? clientService.fetchClientById(id) : null,
    enabled: !!id,
  });

  // Buscar interações do cliente
  const { data: interactions = [], isLoading: interactionsLoading } = useQuery({
    queryKey: ['client-interactions', id],
    queryFn: () => id ? clientService.fetchClientInteractions(id) : [],
    enabled: !!id,
  });

  // Buscar histórico de compras
  const { data: purchases = [], isLoading: purchasesLoading } = useQuery({
    queryKey: ['client-purchases', id],
    queryFn: () => id ? clientService.fetchClientPurchaseHistory(id) : [],
    enabled: !!id,
  });

  // Buscar agendamentos
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['client-appointments', id],
    queryFn: () => id ? clientService.fetchClientAppointments(id) : [],
    enabled: !!id,
  });

  if (clientLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando dados do cliente...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-600 mb-4">Cliente não encontrado</p>
        <Button onClick={() => navigate('/admin/clients')}>
          Voltar para lista de clientes
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      vip: "bg-purple-100 text-purple-800",
      interested: "bg-yellow-100 text-yellow-800",
      pending: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      returning: "bg-purple-100 text-purple-800",
    };
    
    const labels = {
      new: "Novo",
      active: "Ativo",
      inactive: "Inativo", 
      vip: "VIP",
      interested: "Interessado",
      pending: "Pendente",
      completed: "Concluído",
      returning: "Retorno",
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/clients')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Clientes
        </Button>
        
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
                Adicione uma nova interação com {client.name}
              </DialogDescription>
            </DialogHeader>
            <ClientInteractionForm 
              clientId={client.id}
              onSuccess={() => setIsInteractionDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Informações do Cliente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Básicas */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{client.name}</h3>
              {getStatusBadge(client.status)}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{client.email}</span>
              </div>
              
              {client.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{client.phone}</span>
                </div>
              )}
              
              {client.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{client.address}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Cliente desde {formatDate(client.created_at)}</span>
              </div>
            </div>

            {client.preferred_style && (
              <div>
                <h4 className="font-medium text-sm mb-2">Estilo Preferido</h4>
                <Badge variant="outline">{client.preferred_style}</Badge>
              </div>
            )}

            {client.tags && client.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {client.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo Financeiro */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(client.total_spent)}
              </div>
              <p className="text-sm text-gray-500">Total gasto</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">{client.total_orders}</div>
                <p className="text-xs text-gray-500">Pedidos</p>
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {client.total_orders > 0 ? formatCurrency(client.total_spent / client.total_orders) : formatCurrency(0)}
                </div>
                <p className="text-xs text-gray-500">Ticket médio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jornada 99Tattoo */}
        <TattooJourney client={client} />
      </div>

      {/* Tabs com Históricos */}
      <Tabs defaultValue="interactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="interactions">
            <MessageSquare className="h-4 w-4 mr-2" />
            Interações
          </TabsTrigger>
          <TabsTrigger value="purchases">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Histórico de Compras
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <Clock className="h-4 w-4 mr-2" />
            Agendamentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interactions">
          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Histórico de Interações</CardTitle>
              <CardDescription>
                Registro de todas as comunicações e interações com o cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {interactionsLoading ? (
                <div className="text-center py-4">Carregando interações...</div>
              ) : interactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma interação registrada ainda
                </div>
              ) : (
                <div className="space-y-4">
                  {interactions.map((interaction) => (
                    <div key={interaction.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{interaction.title}</h4>
                        <Badge variant="outline">{interaction.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{interaction.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(interaction.date)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Histórico de Compras</CardTitle>
              <CardDescription>
                Todos os produtos e serviços adquiridos pelo cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {purchasesLoading ? (
                <div className="text-center py-4">Carregando compras...</div>
              ) : purchases.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma compra registrada ainda
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.map((purchase, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{purchase.product_name || 'Produto'}</h4>
                        <Badge>{formatCurrency(purchase.amount || 0)}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{purchase.description || 'Sem descrição'}</p>
                      <p className="text-xs text-gray-500 mt-2">{formatDate(purchase.date || new Date().toISOString())}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Histórico de Agendamentos</CardTitle>
              <CardDescription>
                Sessões de tatuagem agendadas e realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="text-center py-4">Carregando agendamentos...</div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum agendamento registrado ainda
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{appointment.title || 'Sessão de Tatuagem'}</h4>
                        <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'}>
                          {appointment.status || 'Agendado'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{appointment.description || 'Sessão de tatuagem'}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Data: {formatDate(appointment.date || new Date().toISOString())}</span>
                        {appointment.artist && <span>Artista: {appointment.artist}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetail;
