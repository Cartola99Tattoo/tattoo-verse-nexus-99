
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, ShoppingCart, MapPin, CreditCard, CheckCircle, Package } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import { useCart } from "@/contexts/ShopCartContext";
import { useToast } from "@/hooks/use-toast";

const TattooArtistsCheckout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState("");

  // Mock data for logged tattoo artist
  const [shippingData, setShippingData] = useState({
    fullName: "João Silva Santos",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    zipCode: "01310-100",
    address: "Av. Paulista, 1578",
    number: "1578",
    complement: "Sala 401",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
  });

  const [paymentData, setPaymentData] = useState({
    method: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });

  if (cart.items.length === 0 && currentStep < 4) {
    return (
      <TattooArtistLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-white">
            <Package className="h-16 w-16 mx-auto mb-4 text-white/50" />
            <h1 className="text-2xl font-bold mb-4">Carrinho vazio</h1>
            <p className="text-gray-300 mb-6">Adicione produtos ao carrinho antes de finalizar a compra.</p>
            <Button onClick={() => navigate("/tatuadores-da-nova-era/shop")}>
              Ir para a Loja
            </Button>
          </div>
        </div>
      </TattooArtistLayout>
    );
  }

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinishOrder = () => {
    const orderNum = `TT${Date.now().toString().slice(-6)}`;
    setOrderNumber(orderNum);
    setCurrentStep(4);
    clearCart();
    toast({
      title: "Pedido realizado com sucesso!",
      description: `Seu pedido #${orderNum} foi confirmado.`,
    });
  };

  const steps = [
    { number: 1, title: "Revisão", icon: ShoppingCart },
    { number: 2, title: "Envio", icon: MapPin },
    { number: 3, title: "Pagamento", icon: CreditCard },
    { number: 4, title: "Confirmação", icon: CheckCircle },
  ];

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        <Button 
          onClick={() => navigate("/tatuadores-da-nova-era/shop")}
          variant="outline"
          className="mb-6 text-white border-white/30 hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar à Loja
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`flex items-center ${
                  currentStep >= step.number ? 'text-red-400' : 'text-gray-500'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.number 
                      ? 'border-red-400 bg-red-400 text-white' 
                      : 'border-gray-500 text-gray-500'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="ml-2 font-medium hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-red-400' : 'bg-gray-600'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Cart Review */}
          {currentStep === 1 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Revisão do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h3 className="font-bold text-white">{item.name}</h3>
                      <p className="text-gray-300">{item.category}</p>
                      <p className="text-red-400 font-bold">R$ {item.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">Qtd: {item.quantity}</p>
                      <p className="text-red-400 font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between text-white mb-2">
                    <span>Subtotal:</span>
                    <span>R$ {cart.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white mb-2">
                    <span>Frete:</span>
                    <span className="text-green-400">Grátis</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-red-400">
                    <span>Total:</span>
                    <span>R$ {cart.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button onClick={handleNextStep} className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                  Próximo: Informações de Envio
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Shipping Information */}
          {currentStep === 2 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Informações de Envio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-white">Nome Completo</Label>
                    <Input
                      id="fullName"
                      value={shippingData.fullName}
                      onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                      className="bg-white/20 border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingData.email}
                      onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                      className="bg-white/20 border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">Telefone</Label>
                    <Input
                      id="phone"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                      className="bg-white/20 border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-white">CEP</Label>
                    <Input
                      id="zipCode"
                      value={shippingData.zipCode}
                      onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                      className="bg-white/20 border-white/30 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-white">Endereço</Label>
                    <Input
                      id="address"
                      value={shippingData.address}
                      onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                      className="bg-white/20 border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="number" className="text-white">Número</Label>
                    <Input
                      id="number"
                      value={shippingData.number}
                      onChange={(e) => setShippingData({...shippingData, number: e.target.value})}
                      className="bg-white/20 border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="complement" className="text-white">Complemento</Label>
                    <Input
                      id="complement"
                      value={shippingData.complement}
                      onChange={(e) => setShippingData({...shippingData, complement: e.target.value})}
                      className="bg-white/20 border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="neighborhood" className="text-white">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={shippingData.neighborhood}
                      onChange={(e) => setShippingData({...shippingData, neighborhood: e.target.value})}
                      className="bg-white/20 border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-white">Cidade</Label>
                    <Input
                      id="city"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                      className="bg-white/20 border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-white">Estado</Label>
                    <Select value={shippingData.state} onValueChange={(value) => setShippingData({...shippingData, state: value})}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="SP" className="text-white">São Paulo</SelectItem>
                        <SelectItem value="RJ" className="text-white">Rio de Janeiro</SelectItem>
                        <SelectItem value="MG" className="text-white">Minas Gerais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handlePrevStep} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <Button onClick={handleNextStep} className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                    Próximo: Pagamento
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="paymentMethod" className="text-white">Método de Pagamento</Label>
                  <Select value={paymentData.method} onValueChange={(value) => setPaymentData({...paymentData, method: value})}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue placeholder="Selecione o método de pagamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="credit" className="text-white">Cartão de Crédito</SelectItem>
                      <SelectItem value="boleto" className="text-white">Boleto Bancário</SelectItem>
                      <SelectItem value="pix" className="text-white">PIX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentData.method === "credit" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="cardNumber" className="text-white">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                        className="bg-white/20 border-white/30 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="cardName" className="text-white">Nome no Cartão</Label>
                      <Input
                        id="cardName"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                        className="bg-white/20 border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardExpiry" className="text-white">Validade</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/AA"
                        value={paymentData.cardExpiry}
                        onChange={(e) => setPaymentData({...paymentData, cardExpiry: e.target.value})}
                        className="bg-white/20 border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvv" className="text-white">CVV</Label>
                      <Input
                        id="cardCvv"
                        placeholder="000"
                        value={paymentData.cardCvv}
                        onChange={(e) => setPaymentData({...paymentData, cardCvv: e.target.value})}
                        className="bg-white/20 border-white/30 text-white"
                      />
                    </div>
                  </div>
                )}

                {paymentData.method === "boleto" && (
                  <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <p className="text-white">
                      Após finalizar o pedido, você receberá o boleto bancário por e-mail.
                      O prazo de vencimento é de 3 dias úteis.
                    </p>
                  </div>
                )}

                {paymentData.method === "pix" && (
                  <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                    <p className="text-white">
                      Após finalizar o pedido, você receberá o código PIX por e-mail.
                      O pagamento deve ser efetuado em até 30 minutos.
                    </p>
                  </div>
                )}

                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between text-xl font-bold text-red-400 mb-4">
                    <span>Total a Pagar:</span>
                    <span>R$ {cart.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handlePrevStep} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <Button onClick={handleFinishOrder} className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
                    Finalizar Pedido
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Order Confirmation */}
          {currentStep === 4 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
              <CardContent className="py-12">
                <CheckCircle className="h-24 w-24 text-green-400 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-white mb-4">Pedido Realizado com Sucesso!</h1>
                <p className="text-xl text-gray-300 mb-6">
                  Número do Pedido: <span className="font-bold text-red-400">#{orderNumber}</span>
                </p>
                <div className="bg-white/5 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                  <h3 className="font-bold text-white mb-4">Resumo do Pedido:</h3>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex justify-between">
                      <span>Itens:</span>
                      <span>{cart.totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-bold text-red-400">R$ {cart.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Entrega:</span>
                      <span>5-7 dias úteis</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mb-8">
                  Você receberá um e-mail de confirmação em breve com os detalhes do seu pedido e informações de rastreamento.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/tatuadores-da-nova-era/shop")} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                    Continuar Comprando
                  </Button>
                  <Button onClick={() => navigate("/tatuadores-da-nova-era")} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Voltar ao Início
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsCheckout;
