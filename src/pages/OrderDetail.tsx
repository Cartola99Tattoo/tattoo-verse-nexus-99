
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useOrder } from "@/hooks";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrder(id || "");
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Detalhes do Pedido</h1>
          <div className="w-full h-64 flex items-center justify-center">
            <p>Carregando detalhes do pedido...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Detalhes do Pedido</h1>
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-600">Erro ao carregar os detalhes do pedido. Por favor, tente novamente mais tarde.</p>
            <Button asChild variant="outline" className="mt-2">
              <Link to="/orders">Voltar para pedidos</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };
  
  // Format status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'processing': return 'Em processamento';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/orders" className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 inline mr-1" />
            Voltar para pedidos
          </Link>
          <h1 className="text-3xl font-bold">Pedido #{order.reference_code}</h1>
        </div>
        
        {/* Resumo do Pedido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Data do pedido</p>
                  <p className="font-medium">{format(new Date(order.created_at), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Método de pagamento</p>
                  <p className="font-medium">{order.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Itens do pedido */}
              <div className="space-y-4">
                {order.items && order.items.map(item => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-7 flex items-center">
                      {item.product && (
                        <div className="w-16 h-16 rounded overflow-hidden mr-3">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{item.product?.name || 'Produto indisponível'}</h3>
                        {item.product?.artist && (
                          <p className="text-sm text-gray-500">Por {typeof item.product.artist === 'string' 
                            ? item.product.artist 
                            : item.product.artist.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <p className="text-sm text-gray-500">Preço</p>
                      <p>R$ {item.price.toFixed(2)}</p>
                    </div>
                    <div className="col-span-1 text-center">
                      <p className="text-sm text-gray-500">Qtde</p>
                      <p>{item.quantity}</p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-end">
                <div className="w-1/3">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>R$ {order.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Frete:</span>
                    <span>Grátis</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>R$ {order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Informações de Agendamento */}
          {order.scheduling_preferences && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Agendamento da Sessão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.scheduling_preferences.preferred_date_1 && (
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                      <div>
                        <p className="font-medium">Primeira opção de data</p>
                        <p className="text-gray-600">{format(new Date(order.scheduling_preferences.preferred_date_1), "dd/MM/yyyy")}</p>
                        <p className="text-gray-600">{format(new Date(order.scheduling_preferences.preferred_date_1), "HH:mm")}</p>
                      </div>
                    </div>
                  )}
                  
                  {order.scheduling_preferences.preferred_date_2 && (
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                      <div>
                        <p className="font-medium">Segunda opção de data</p>
                        <p className="text-gray-600">{format(new Date(order.scheduling_preferences.preferred_date_2), "dd/MM/yyyy")}</p>
                        <p className="text-gray-600">{format(new Date(order.scheduling_preferences.preferred_date_2), "HH:mm")}</p>
                      </div>
                    </div>
                  )}
                  
                  {order.scheduling_preferences.preferred_date_3 && (
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                      <div>
                        <p className="font-medium">Terceira opção de data</p>
                        <p className="text-gray-600">{format(new Date(order.scheduling_preferences.preferred_date_3), "dd/MM/yyyy")}</p>
                        <p className="text-gray-600">{format(new Date(order.scheduling_preferences.preferred_date_3), "HH:mm")}</p>
                      </div>
                    </div>
                  )}
                  
                  {order.scheduling_preferences.notes && (
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                      <div>
                        <p className="font-medium">Observações:</p>
                        <p className="text-gray-600">{order.scheduling_preferences.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">Status do agendamento</p>
                  <Badge variant="outline" className="bg-gray-100">
                    Aguardando confirmação
                  </Badge>
                  <p className="text-sm text-gray-500 mt-2">
                    Você receberá um e-mail quando o estúdio confirmar sua sessão.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Endereços */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {order.shipping_address && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Endereço de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{order.shipping_address.street}, {order.shipping_address.number}</p>
                {order.shipping_address.complement && (
                  <p>{order.shipping_address.complement}</p>
                )}
                <p>
                  {order.shipping_address.city} - {order.shipping_address.state}, {order.shipping_address.zip_code}
                </p>
                <p>{order.shipping_address.country}</p>
              </CardContent>
            </Card>
          )}
          
          {order.billing_address && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Endereço de Cobrança</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{order.billing_address.street}, {order.billing_address.number}</p>
                {order.billing_address.complement && (
                  <p>{order.billing_address.complement}</p>
                )}
                <p>
                  {order.billing_address.city} - {order.billing_address.state}, {order.billing_address.zip_code}
                </p>
                <p>{order.billing_address.country}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
