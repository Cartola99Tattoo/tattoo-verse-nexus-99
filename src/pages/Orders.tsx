
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useOrders } from "@/hooks";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const Orders = () => {
  const { data: orders, isLoading, error } = useOrders();
  
  // Status badge color map
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>
          <div className="w-full h-64 flex items-center justify-center">
            <p>Carregando pedidos...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-600">Erro ao carregar seus pedidos. Por favor, tente novamente mais tarde.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>
        
        {orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map(order => (
              <Card key={order.id} className="overflow-hidden">
                <div className="bg-gray-100 p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Código do pedido</p>
                    <p className="font-medium">{order.reference_code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data</p>
                    <p className="font-medium">{format(new Date(order.created_at), 'dd/MM/yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium">R$ {order.total_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status === 'pending' && 'Pendente'}
                      {order.status === 'processing' && 'Em processamento'}
                      {order.status === 'completed' && 'Concluído'}
                      {order.status === 'cancelled' && 'Cancelado'}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Itens</h3>
                      <Separator className="my-2" />
                      <div className="space-y-2">
                        {order.items && order.items.map(item => (
                          <div key={item.id} className="flex justify-between items-center">
                            <div className="flex items-center">
                              {item.product && (
                                <div className="w-12 h-12 mr-3 rounded overflow-hidden">
                                  <img 
                                    src={item.product.images[0]} 
                                    alt={item.product.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{item.product?.name || 'Produto indisponível'}</p>
                                <p className="text-sm text-gray-500">
                                  Qtde: {item.quantity} x R$ {item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button asChild variant="outline" className="mr-2">
                        <Link to={`/orders/${order.id}`}>Ver Detalhes</Link>
                      </Button>
                      
                      {order.status === 'completed' && (
                        <Button>
                          <Link to={`/shop/${order.items?.[0]?.product_id}`}>Comprar Novamente</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Você ainda não fez nenhum pedido</h2>
            <p className="text-gray-600 mb-6">Explore nossa loja e encontre a tatuagem perfeita para você!</p>
            <Button asChild>
              <Link to="/shop">Explorar Tatuagens</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
