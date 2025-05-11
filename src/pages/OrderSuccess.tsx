import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useOrder } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, ShoppingBag } from "lucide-react";

export default function OrderSuccess() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session, user, isLoading } = useAuth();
  const { data: order, isLoading: isLoadingOrder, error } = useOrder(id || "");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || isLoadingOrder) {
    return (
      <Layout>
        <div className="container py-12 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <p>Carregando detalhes do pedido...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
            <p className="mb-6">Não foi possível encontrar os detalhes do pedido solicitado.</p>
            <Button asChild>
              <Link to="/orders">Ver Meus Pedidos</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">Pedido Recebido!</h1>
            <p className="mt-2 text-lg text-gray-600">
              Obrigado pela sua compra. Seu pedido foi processado com sucesso.
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Número do Pedido:</span>
                  <span>{order.reference_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Data:</span>
                  <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Status:</span>
                  <span className="capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Método de Pagamento:</span>
                  <span className="capitalize">{order.payment_method}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold mb-4">Próximos Passos</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <ol className="space-y-4">
              <li className="flex items-start">
                <div className="rounded-full bg-green-100 p-2 mr-4">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Agendamento da Sessão</h3>
                  <p className="text-gray-600">
                    Nossa equipe entrará em contato para confirmar o agendamento da 
                    sua sessão de tatuagem de acordo com as preferências informadas.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-green-100 p-2 mr-4">
                  <ShoppingBag className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Preparação</h3>
                  <p className="text-gray-600">
                    Siga as orientações de preparação que enviaremos por email 
                    para garantir o melhor resultado para sua tatuagem.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                      {item.product?.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product?.name || "Produto"}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Sem imagem</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">
                        {item.product?.name || "Produto"}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Qtd: {item.quantity}
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>R$ {order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center space-x-4 mt-8">
            <Button asChild variant="outline">
              <Link to="/orders">Ver Meus Pedidos</Link>
            </Button>
            <Button asChild>
              <Link to="/shop">Continuar Comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
