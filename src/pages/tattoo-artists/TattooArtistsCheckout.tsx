import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import { useTattooArtistShop } from "@/contexts/TattooArtistShopContext";

const TattooArtistsCheckout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useTattooArtistShop();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleFinishOrder = () => {
    const orderNumber = `99TT${Date.now().toString().slice(-6)}`;
    
    toast({
      title: "Pedido realizado com sucesso!",
      description: `Seu pedido #${orderNumber} foi confirmado.`,
    });

    clearCart();
    navigate('/tatuadores-da-nova-era/shop');
  };

  if (cart.length === 0) {
    return (
      <TattooArtistLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Carrinho vazio</h1>
            <Button onClick={() => navigate('/tatuadores-da-nova-era/shop')}>
              Ir às Compras
            </Button>
          </div>
        </div>
      </TattooArtistLayout>
    );
  }

  return (
    <TattooArtistLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/tatuadores-da-nova-era/carrinho')}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Carrinho
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Dados de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Rua, número, bairro"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Sua cidade"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-red-600">{formatCurrency(getCartTotal())}</span>
                  </div>
                </div>

                <Button
                  onClick={handleFinishOrder}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalizar Pedido
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsCheckout;