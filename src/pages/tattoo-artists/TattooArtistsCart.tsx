import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  ShoppingBag,
  Trash2,
  CreditCard,
  Shield,
  Truck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import { useTattooArtistShop } from "@/contexts/TattooArtistShopContext";

const TattooArtistsCart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useTattooArtistShop();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleRemoveItem = (productId: number, productName: string) => {
    removeFromCart(productId);
    toast({
      title: "Produto removido",
      description: `${productName} foi removido do carrinho.`,
      duration: 2000,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Carrinho limpo",
      description: "Todos os produtos foram removidos do carrinho.",
      duration: 2000,
    });
  };

  const handleCheckout = () => {
    navigate('/tatuadores-da-nova-era/checkout');
  };

  // Simulação de cálculo de frete
  const shippingCost = getCartTotal() >= 200 ? 0 : 25.90;
  const finalTotal = getCartTotal() + shippingCost;

  if (cart.length === 0) {
    return (
      <TattooArtistLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/tatuadores-da-nova-era/shop')}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar à Loja
              </Button>
            </div>

            {/* Empty State */}
            <div className="text-center py-20">
              <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-gray-400" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Que tal explorar nossa seleção de produtos incríveis para tatuadores?
              </p>
              <Button 
                onClick={() => navigate('/tatuadores-da-nova-era/shop')}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-8 py-3"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Continuar Comprando
              </Button>
            </div>
          </div>
        </div>
      </TattooArtistLayout>
    );
  }

  return (
    <TattooArtistLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/tatuadores-da-nova-era/shop')}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar Comprando
            </Button>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                {getCartCount()} {getCartCount() === 1 ? 'item' : 'itens'}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearCart}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Carrinho
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de Produtos */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <ShoppingCart className="h-6 w-6 text-red-600" />
                    Carrinho de Compras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">por {item.artist}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0 rounded-full"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium px-3 py-1 bg-white rounded-lg border min-w-[50px] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0 rounded-full"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">
                          {formatCurrency(item.price)} cada
                        </div>
                        <div className="text-xl font-bold text-red-600">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Valores */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({getCartCount()} {getCartCount() === 1 ? 'item' : 'itens'}):</span>
                      <span>{formatCurrency(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Frete:</span>
                      <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                        {shippingCost === 0 ? 'GRÁTIS' : formatCurrency(shippingCost)}
                      </span>
                    </div>
                    {shippingCost === 0 && (
                      <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                        🎉 Frete grátis para compras acima de R$ 200!
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-red-600">{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Garantias */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Compra 100% segura</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span>Entrega rápida e confiável</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CreditCard className="h-4 w-4 text-purple-600" />
                      <span>Múltiplas formas de pagamento</span>
                    </div>
                  </div>

                  {/* Botão Finalizar */}
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 text-lg"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Finalizar Compra
                  </Button>

                  {/* Continuar Comprando */}
                  <Button
                    onClick={() => navigate('/tatuadores-da-nova-era/shop')}
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Continuar Comprando
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsCart;