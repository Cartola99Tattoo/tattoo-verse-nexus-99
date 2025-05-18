
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import TattooDetailsForm from "@/components/shop/TattooDetailsForm";

// Etapas do checkout
type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

// Tipo para informações de envio
type ShippingInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes?: string;
};

// Tipo para preferências de agendamento
type SchedulingPreferences = {
  preferredDate1?: string;
  preferredDate2?: string;
  preferredDate3?: string;
  preferredArtist?: string;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getTattooDetails } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  
  // Estados para formulários
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  
  const [schedulingPreferences, setSchedulingPreferences] = useState<SchedulingPreferences>({});
  
  // Estado para diálogo de detalhes da tatuagem
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [currentTattooId, setCurrentTattooId] = useState<number | null>(null);
  
  // Verificar se todos os produtos do tipo tatuagem têm detalhes completos
  const [allTattooDetailsComplete, setAllTattooDetailsComplete] = useState(true);
  
  // Verificar se há tatuagens com categoria de inspiração
  const hasTattooWithInspiration = cart.items.some(
    item => item.product_type === 'tattoo' && item.category_type === 'inspiration'
  );
  
  // Verificar se há produtos físicos no carrinho
  const hasPhysicalProducts = cart.items.some(item => item.product_type === 'product');
  
  // Verificar se há tatuagens no carrinho
  const hasTattoos = cart.items.some(item => item.product_type === 'tattoo');
  
  // Efeito para verificar se todos os detalhes de tatuagens estão completos
  useEffect(() => {
    const tattooItems = cart.items.filter(item => item.product_type === 'tattoo');
    
    if (tattooItems.length === 0) {
      setAllTattooDetailsComplete(true);
      return;
    }
    
    const allComplete = tattooItems.every(item => {
      const details = getTattooDetails(item.id);
      return (
        details.bodyPart && 
        details.artDescription && 
        details.estimatedTime && 
        details.estimatedSessions && 
        details.estimatedSessions > 0 &&
        (details.size !== "Personalizado" || (details.size === "Personalizado" && details.customSize))
      );
    });
    
    setAllTattooDetailsComplete(allComplete);
  }, [cart.items, getTattooDetails]);
  
  // Manipuladores de eventos
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de processamento de pagamento
    setTimeout(() => {
      setCurrentStep('confirmation');
    }, 1500);
  };
  
  const handleFinish = () => {
    // Simulação de finalização de pedido
    toast({
      title: "Pedido concluído com sucesso!",
      description: "Você receberá um email com os detalhes do pedido em breve.",
    });
    clearCart();
    navigate('/');
  };
  
  const openTattooDetailsDialog = (productId: number) => {
    setCurrentTattooId(productId);
    setDetailsDialogOpen(true);
  };
  
  const handleTattooDetailsComplete = () => {
    setDetailsDialogOpen(false);
  };
  
  // Verificação de carrinho vazio
  if (cart.items.length === 0 && currentStep !== 'confirmation') {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-600 mb-6">
              Adicione algumas tatuagens ao carrinho antes de finalizar a compra.
            </p>
            <Button asChild className="bg-red-500 hover:bg-red-600">
              <a href="/shop">Voltar à loja</a>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>
        
        {/* Indicador de progresso */}
        <div className="max-w-3xl mx-auto mb-8">
          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cart" disabled={currentStep !== 'cart'}>
                Carrinho
              </TabsTrigger>
              <TabsTrigger value="shipping" disabled={currentStep !== 'shipping'}>
                Informações
              </TabsTrigger>
              <TabsTrigger value="payment" disabled={currentStep !== 'payment'}>
                Pagamento
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coluna principal (formulários) */}
            <div className="md:col-span-2">
              {/* Etapa 1: Revisão do carrinho */}
              {currentStep === 'cart' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Revise seu pedido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cart.items.map((item) => {
                        const isTattoo = item.product_type === 'tattoo';
                        const tattooDetails = isTattoo ? getTattooDetails(item.id) : null;
                        
                        return (
                          <div key={item.id} className="flex border-b pb-4">
                            <div className="w-20 h-20 rounded-md overflow-hidden mr-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-gray-500 text-sm">
                                Artista: {item.artist} • Categoria: {item.category}
                              </p>
                              
                              {/* Mostrar detalhes da tatuagem se for uma tatuagem */}
                              {isTattoo && (
                                <div className="mt-2">
                                  {tattooDetails && Object.keys(tattooDetails).length > 0 ? (
                                    <div className="text-sm space-y-1 border-l-2 border-red-300 pl-2 mt-2">
                                      {tattooDetails.bodyPart && (
                                        <p>Local: <span className="font-medium">{tattooDetails.bodyPart}</span></p>
                                      )}
                                      
                                      {tattooDetails.size && (
                                        <p>Tamanho: <span className="font-medium">
                                          {tattooDetails.size === "Personalizado" 
                                            ? tattooDetails.customSize 
                                            : tattooDetails.size}
                                        </span></p>
                                      )}
                                      
                                      {tattooDetails.artDescription && (
                                        <p>Descrição: <span className="font-medium">
                                          {tattooDetails.artDescription.length > 50 
                                            ? tattooDetails.artDescription.substring(0, 50) + "..." 
                                            : tattooDetails.artDescription}
                                        </span></p>
                                      )}
                                      
                                      {tattooDetails.estimatedTime && (
                                        <p>Tempo estimado: <span className="font-medium">{tattooDetails.estimatedTime}</span></p>
                                      )}
                                      
                                      {tattooDetails.estimatedSessions && (
                                        <p>Sessões estimadas: <span className="font-medium">{tattooDetails.estimatedSessions}</span></p>
                                      )}
                                      
                                      <Button 
                                        variant="link" 
                                        className="text-red-500 p-0 h-auto"
                                        onClick={() => openTattooDetailsDialog(item.id)}
                                      >
                                        Editar detalhes
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-500 border-red-500 mt-2"
                                      onClick={() => openTattooDetailsDialog(item.id)}
                                    >
                                      Adicionar detalhes da tatuagem
                                    </Button>
                                  )}
                                </div>
                              )}
                              
                              <div className="flex justify-between mt-2">
                                <span>Qtd: {item.quantity}</span>
                                <span className="font-bold">
                                  R$ {(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {hasTattoos && (
                      <Alert className="mt-6 bg-blue-50 border-blue-100">
                        <Info className="h-5 w-5 text-blue-500" />
                        <AlertDescription className="text-blue-800">
                          Tatuagens são procedimentos artísticos e personalizados para que cada traço da sua tattoo seja único e exclusivo. 
                          Ao reservar essa arte você estará garantindo uma obra de arte feita especialmente para você. 
                          Todos os direitos autorais precisam ser preservados e essa arte só poderá ser tatuada e reproduzida pelo artista.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {!allTattooDetailsComplete && hasTattoos && (
                      <Alert className="mt-4 bg-yellow-50 border-yellow-100">
                        <Info className="h-5 w-5 text-yellow-500" />
                        <AlertDescription className="text-yellow-800">
                          Por favor, preencha todos os detalhes obrigatórios das tatuagens para prosseguir com o checkout.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex justify-end mt-6">
                      <Button 
                        onClick={() => setCurrentStep('shipping')} 
                        className="bg-red-500 hover:bg-red-600"
                        disabled={!allTattooDetailsComplete && hasTattoos}
                      >
                        Continuar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Etapa 2: Informações de envio */}
              {currentStep === 'shipping' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Informações de Contato</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome completo</Label>
                          <Input
                            id="name"
                            value={shippingInfo.name}
                            onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={shippingInfo.email}
                            onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                          required
                        />
                      </div>
                      
                      {/* Endereço apenas para produtos físicos */}
                      {hasPhysicalProducts && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="address">Endereço</Label>
                            <Input
                              id="address"
                              value={shippingInfo.address}
                              onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2 col-span-2">
                              <Label htmlFor="city">Cidade</Label>
                              <Input
                                id="city"
                                value={shippingInfo.city}
                                onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state">Estado</Label>
                              <Input
                                id="state"
                                value={shippingInfo.state}
                                onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="zipCode">CEP</Label>
                              <Input
                                id="zipCode"
                                value={shippingInfo.zipCode}
                                onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                                required
                              />
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* Preferências de agendamento */}
                      {hasTattoos && (
                        <div className="mt-8 border-t pt-6">
                          <h3 className="text-lg font-bold mb-4">Preferências de Agendamento</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="date1">Data preferencial 1</Label>
                              <Input
                                id="date1"
                                type="date"
                                value={schedulingPreferences.preferredDate1 || ''}
                                onChange={(e) => setSchedulingPreferences({
                                  ...schedulingPreferences, 
                                  preferredDate1: e.target.value
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="date2">Data preferencial 2</Label>
                              <Input
                                id="date2"
                                type="date"
                                value={schedulingPreferences.preferredDate2 || ''}
                                onChange={(e) => setSchedulingPreferences({
                                  ...schedulingPreferences, 
                                  preferredDate2: e.target.value
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="date3">Data preferencial 3</Label>
                              <Input
                                id="date3"
                                type="date"
                                value={schedulingPreferences.preferredDate3 || ''}
                                onChange={(e) => setSchedulingPreferences({
                                  ...schedulingPreferences, 
                                  preferredDate3: e.target.value
                                })}
                              />
                            </div>
                          </div>
                          
                          {/* Mostrar campo de artista preferencial apenas para tatuagens com categoria "inspiration" */}
                          {hasTattooWithInspiration && (
                            <div className="mt-4 space-y-2">
                              <Label htmlFor="preferredArtist">Artista preferencial (opcional)</Label>
                              <Input
                                id="preferredArtist"
                                value={schedulingPreferences.preferredArtist || ''}
                                onChange={(e) => setSchedulingPreferences({
                                  ...schedulingPreferences, 
                                  preferredArtist: e.target.value
                                })}
                                placeholder="Se você tem preferência por algum artista específico"
                              />
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="notes">Observações adicionais (opcional)</Label>
                        <Textarea
                          id="notes"
                          value={shippingInfo.notes || ''}
                          onChange={(e) => setShippingInfo({...shippingInfo, notes: e.target.value})}
                          placeholder="Informações adicionais, personalização desejada, etc."
                        />
                      </div>
                      
                      <div className="flex justify-between mt-6">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setCurrentStep('cart')}
                        >
                          Voltar
                        </Button>
                        <Button type="submit" className="bg-red-500 hover:bg-red-600">
                          Continuar para Pagamento
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {/* Etapa 3: Pagamento */}
              {currentStep === 'payment' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="space-y-4"
                        defaultValue="credit_card"
                      >
                        <div className="flex items-center space-x-3 border p-4 rounded-lg">
                          <RadioGroupItem value="credit_card" id="credit_card" />
                          <Label htmlFor="credit_card" className="flex-grow">Cartão de crédito</Label>
                        </div>
                        <div className="flex items-center space-x-3 border p-4 rounded-lg">
                          <RadioGroupItem value="pix" id="pix" />
                          <Label htmlFor="pix" className="flex-grow">Pix</Label>
                        </div>
                        <div className="flex items-center space-x-3 border p-4 rounded-lg">
                          <RadioGroupItem value="boleto" id="boleto" />
                          <Label htmlFor="boleto" className="flex-grow">Boleto bancário</Label>
                        </div>
                      </RadioGroup>
                      
                      {/* Campos de cartão de crédito */}
                      {paymentMethod === 'credit_card' && (
                        <div className="space-y-4 border-t pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="card_number">Número do cartão</Label>
                            <Input id="card_number" placeholder="0000 0000 0000 0000" required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="card_expiry">Validade</Label>
                              <Input id="card_expiry" placeholder="MM/AA" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="card_cvc">CVC</Label>
                              <Input id="card_cvc" placeholder="000" required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="card_name">Nome no cartão</Label>
                            <Input id="card_name" required />
                          </div>
                        </div>
                      )}
                      
                      {/* Instruções para Pix */}
                      {paymentMethod === 'pix' && (
                        <div className="border p-4 rounded-lg bg-gray-50 text-center">
                          <p className="mb-4">Você receberá as instruções para pagamento via Pix após finalizar o pedido.</p>
                        </div>
                      )}
                      
                      {/* Instruções para Boleto */}
                      {paymentMethod === 'boleto' && (
                        <div className="border p-4 rounded-lg bg-gray-50 text-center">
                          <p className="mb-4">O boleto será gerado após a confirmação do pedido e enviado para seu e-mail.</p>
                        </div>
                      )}
                      
                      <div className="flex justify-between mt-6">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setCurrentStep('shipping')}
                        >
                          Voltar
                        </Button>
                        <Button type="submit" className="bg-red-500 hover:bg-red-600">
                          Finalizar Pedido
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {/* Etapa 4: Confirmação */}
              {currentStep === 'confirmation' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Pedido Concluído com Sucesso!</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="bg-green-50 p-4 rounded-lg mb-6">
                      <svg
                        className="mx-auto h-12 w-12 text-green-500 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="font-bold text-lg mb-2">
                        Obrigado pela sua compra!
                      </h3>
                      <p className="text-gray-700 mb-2">
                        Seu pedido foi recebido e está sendo processado.
                      </p>
                      <p className="text-gray-700">
                        Você receberá um e-mail de confirmação e entramos em contato para confirmar o agendamento.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleFinish} 
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Voltar à Página Inicial
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Coluna lateral (resumo do pedido) */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.items.map((item) => {
                      const isTattoo = item.product_type === 'tattoo';
                      const tattooDetails = isTattoo ? getTattooDetails(item.id) : null;
                      
                      return (
                        <div key={item.id} className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span>
                              {item.quantity}x {item.name} 
                              {isTattoo && <span className="text-xs text-red-500"> (Tatuagem)</span>}
                              {item.product_type === 'product' && <span className="text-xs text-blue-500"> (Produto)</span>}
                            </span>
                            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          
                          {isTattoo && tattooDetails && (
                            <div className="text-xs text-gray-500 pl-4">
                              {tattooDetails.bodyPart && <div>Local: {tattooDetails.bodyPart}</div>}
                              {tattooDetails.size && (
                                <div>
                                  Tamanho: {tattooDetails.size === "Personalizado" ? tattooDetails.customSize : tattooDetails.size}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>R$ {cart.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Diálogo para adicionar/editar detalhes da tatuagem */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Detalhes da Tatuagem</DialogTitle>
          {currentTattooId !== null && (
            <TattooDetailsForm
              productId={currentTattooId}
              onSubmit={handleTattooDetailsComplete}
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Checkout;
