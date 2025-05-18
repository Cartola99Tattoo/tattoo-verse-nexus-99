
import React, { useState, useEffect } from "react";
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
import { Info, CreditCard, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import TattooDetailsForm from "@/components/shop/TattooDetailsForm";
import SchedulingPreferencesForm from "@/components/shop/SchedulingPreferencesForm";
import { TattooDetails, SchedulingPreferences } from "@/services/interfaces/IProductService";
import CheckoutSummary from "@/components/shop/CheckoutSummary";
import TattooCopyrightNotice from "@/components/shop/TattooCopyrightNotice";

// Etapas do checkout
type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

// Tipo para informações de contato
type ContactInfo = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, updateTattooDetails, updateSchedulingPreferences } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Estados para formulários
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  
  // Lista de artistas disponíveis (em um sistema real, isso viria do backend)
  const availableArtists = ["João Silva", "Maria Souza", "Pedro Alves", "Ana Lima"];

  // Verificar se há tatuagens no carrinho
  const hasTattoos = cart.items.some(item => item.product_type === 'tattoo');
  
  // Verificar se há produtos físicos no carrinho
  const hasPhysicalProducts = cart.items.some(item => item.product_type === 'product');
  
  // Verificar se há tatuagens do tipo inspiração no carrinho
  const hasInspirationTattoos = cart.items.some(
    item => item.product_type === 'tattoo' && item.category_type === 'inspiration'
  );
  
  // Verificar se todos os detalhes de tatuagem obrigatórios estão preenchidos
  const allTattooDetailsComplete = hasTattoos ? 
    !cart.items.some(item => 
      item.product_type === 'tattoo' && 
      (!item.tattoo_details || 
       !item.tattoo_details.bodyPart || 
       !item.tattoo_details.size || 
       !item.tattoo_details.style || 
       !item.tattoo_details.estimatedTime || 
       !item.tattoo_details.estimatedSessions)
    ) : true;
  
  // Verificar se todas as preferências de agendamento estão preenchidas
  const allSchedulingPreferencesComplete = hasTattoos ?
    !cart.items.some(item =>
      item.product_type === 'tattoo' &&
      (!item.scheduling_preferences ||
       !item.scheduling_preferences.preferredDates ||
       item.scheduling_preferences.preferredDates.length < 3 ||
       !item.scheduling_preferences.preferredTime)
    ) : true;
  
  // Manipuladores de eventos
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de campos básicos antes de prosseguir
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Validação de campos de endereço para produtos físicos
    if (hasPhysicalProducts && (!contactInfo.address || !contactInfo.city || !contactInfo.state || !contactInfo.zipCode)) {
      toast({
        title: "Endereço incompleto",
        description: "Por favor, preencha todos os campos de endereço.",
        variant: "destructive"
      });
      return;
    }
    
    // Verificar se todas as preferências de agendamento estão preenchidas para tatuagens
    if (hasTattoos && !allSchedulingPreferencesComplete) {
      toast({
        title: "Preferências de agendamento incompletas",
        description: "Por favor, preencha todas as preferências de agendamento para suas tatuagens.",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentStep('payment');
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      toast({
        title: "Termos e condições",
        description: "Por favor, aceite os termos e condições para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulação de processamento de pagamento
    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      setCurrentStep('confirmation');
      window.scrollTo(0, 0);
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
  
  // Handler para atualizar detalhes da tatuagem
  const handleUpdateTattooDetails = (id: number, details: TattooDetails) => {
    updateTattooDetails(id, details);
    setEditingItemId(null);
    
    toast({
      title: "Detalhes atualizados",
      description: "Os detalhes da sua tatuagem foram atualizados com sucesso.",
    });
  };
  
  // Handler para atualizar preferências de agendamento
  const handleUpdateSchedulingPreferences = (id: number, preferences: SchedulingPreferences) => {
    updateSchedulingPreferences(id, preferences);
    
    toast({
      title: "Preferências de agendamento atualizadas",
      description: "Suas preferências de agendamento foram atualizadas com sucesso.",
    });
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

  // Rolar para o topo da página ao mudar de etapa
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

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
                    <div className="space-y-6">
                      {cart.items.map((item) => (
                        <div key={item.id} className="border rounded-md p-4">
                          <div className="flex flex-col border-b pb-4">
                            <div className="flex">
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
                                <div className="flex justify-between mt-2">
                                  <span>Qtd: {item.quantity}</span>
                                  <span className="font-bold">
                                    R$ {(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                                {/* Mostrar tipo do produto */}
                                {item.product_type && (
                                  <div className="mt-2">
                                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100">
                                      {item.product_type === 'tattoo' ? 'Tatuagem' : 'Produto'}
                                    </span>
                                    {item.category_type && (
                                      <span className="inline-block ml-2 px-2 py-1 text-xs rounded-full bg-gray-100">
                                        {item.category_type === 'exclusive' ? 'Arte Exclusiva' : 'Inspiração'}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Detalhes da tatuagem se existirem */}
                            {item.product_type === 'tattoo' && item.tattoo_details && editingItemId !== item.id && (
                              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                                <div className="flex justify-between items-center mb-3">
                                  <h5 className="text-sm font-semibold">Detalhes da Tatuagem</h5>
                                  <button
                                    onClick={() => setEditingItemId(item.id)}
                                    className="text-xs text-blue-600 hover:underline"
                                  >
                                    Editar detalhes
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  {item.tattoo_details.style && (
                                    <div>
                                      <span className="font-medium">Estilo:</span> {item.tattoo_details.style}
                                    </div>
                                  )}
                                  {item.tattoo_details.bodyPart && (
                                    <div>
                                      <span className="font-medium">Parte do corpo:</span> {item.tattoo_details.bodyPart}
                                    </div>
                                  )}
                                  {item.tattoo_details.size && (
                                    <div>
                                      <span className="font-medium">Tamanho:</span> {item.tattoo_details.size}
                                    </div>
                                  )}
                                  {item.tattoo_details.estimatedTime && (
                                    <div>
                                      <span className="font-medium">Tempo estimado:</span> {item.tattoo_details.estimatedTime}
                                    </div>
                                  )}
                                  {item.tattoo_details.estimatedSessions && (
                                    <div>
                                      <span className="font-medium">Sessões estimadas:</span> {item.tattoo_details.estimatedSessions}
                                    </div>
                                  )}
                                  {item.tattoo_details.preferredArtist && (
                                    <div>
                                      <span className="font-medium">Artista preferido:</span> {item.tattoo_details.preferredArtist}
                                    </div>
                                  )}
                                </div>
                                
                                {item.tattoo_details.description && (
                                  <div className="mt-3">
                                    <span className="font-medium">Descrição:</span>
                                    <p className="text-sm text-gray-700 mt-1">{item.tattoo_details.description}</p>
                                  </div>
                                )}
                                
                                {/* Reference images */}
                                {item.tattoo_details.referenceImages && item.tattoo_details.referenceImages.length > 0 && (
                                  <div className="mt-3">
                                    <span className="font-medium">Imagens de referência:</span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {item.tattoo_details.referenceImages.map((img, idx) => (
                                        <div key={idx} className="w-16 h-16 rounded-md overflow-hidden">
                                          <img 
                                            src={img} 
                                            alt={`Referência ${idx + 1}`} 
                                            className="w-full h-full object-cover" 
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Tattoo details form (if editing) */}
                            {item.product_type === 'tattoo' && editingItemId === item.id && (
                              <TattooDetailsForm
                                initialDetails={item.tattoo_details}
                                artistName={item.artist}
                                availableArtists={availableArtists}
                                onSave={(details) => handleUpdateTattooDetails(item.id, details)}
                              />
                            )}

                            {/* Add details button if product is a tattoo and no details are provided yet */}
                            {item.product_type === 'tattoo' && !item.tattoo_details && editingItemId !== item.id && (
                              <div className="mt-4">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setEditingItemId(item.id)}
                                  className="w-full"
                                >
                                  Adicionar detalhes da tatuagem
                                </Button>
                              </div>
                            )}
                            
                            {/* Copyright notice for tattoos */}
                            {item.product_type === 'tattoo' && (
                              <TattooCopyrightNotice artistName={item.artist} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {hasTattoos && !allTattooDetailsComplete && (
                      <Alert className="mt-6 bg-amber-50 border-amber-100">
                        <Info className="h-5 w-5 text-amber-500" />
                        <AlertDescription className="text-amber-800">
                          Por favor, preencha todos os detalhes obrigatórios para suas tatuagens antes de prosseguir.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {hasTattoos && allTattooDetailsComplete && (
                      <Alert className="mt-6 bg-blue-50 border-blue-100">
                        <Info className="h-5 w-5 text-blue-500" />
                        <AlertDescription className="text-blue-800">
                          Após a confirmação do pagamento, o artista entrará em contato para discutir os 
                          detalhes da sua tatuagem, agendar a sessão e fornecer um orçamento final. 
                          Este valor é uma estimativa inicial.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex justify-end mt-6">
                      <Button 
                        onClick={() => setCurrentStep('shipping')} 
                        className="bg-red-500 hover:bg-red-600"
                        disabled={hasTattoos && !allTattooDetailsComplete}
                      >
                        Continuar para Informações
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Etapa 2: Informações de contato */}
              {currentStep === 'shipping' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Informações de Contato</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      {/* Informações básicas de contato (sempre exibidas) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome completo*</Label>
                          <Input
                            id="name"
                            value={contactInfo.name}
                            onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email*</Label>
                          <Input
                            id="email"
                            type="email"
                            value={contactInfo.email}
                            onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone*</Label>
                          <Input
                            id="phone"
                            value={contactInfo.phone}
                            onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                            required
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                          
                        {/* Campos de endereço (somente se houver produtos físicos) */}
                        {hasPhysicalProducts && (
                          <div className="space-y-2">
                            <Label htmlFor="address">Endereço*</Label>
                            <Input
                              id="address"
                              value={contactInfo.address || ''}
                              onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                              required={hasPhysicalProducts}
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Mais campos de endereço (somente se houver produtos físicos) */}
                      {hasPhysicalProducts && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="city">Cidade*</Label>
                            <Input
                              id="city"
                              value={contactInfo.city || ''}
                              onChange={(e) => setContactInfo({...contactInfo, city: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">Estado*</Label>
                            <Input
                              id="state"
                              value={contactInfo.state || ''}
                              onChange={(e) => setContactInfo({...contactInfo, state: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">CEP*</Label>
                            <Input
                              id="zipCode"
                              value={contactInfo.zipCode || ''}
                              onChange={(e) => setContactInfo({...contactInfo, zipCode: e.target.value})}
                              required
                              placeholder="00000-000"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Preferências de agendamento - exibir apenas para tatuagens */}
                      {hasTattoos && (
                        <div className="mt-8 border-t pt-6">
                          <h3 className="text-lg font-bold mb-4">Preferências de Agendamento</h3>
                          
                          {cart.items.filter(item => item.product_type === 'tattoo').map((item) => (
                            <div 
                              key={`scheduling-${item.id}`} 
                              className="mb-6 p-4 bg-gray-50 rounded-md"
                            >
                              <h4 className="font-medium mb-4">
                                Agendamento para: {item.name} 
                                {item.tattoo_details?.preferredArtist && (
                                  <span className="text-sm text-gray-600 ml-2">
                                    (com {item.tattoo_details.preferredArtist})
                                  </span>
                                )}
                              </h4>
                              
                              <SchedulingPreferencesForm
                                initialPreferences={item.scheduling_preferences}
                                onSave={(prefs) => handleUpdateSchedulingPreferences(item.id, prefs)}
                              />
                            </div>
                          ))}
                          
                          <Alert className="mt-4 bg-blue-50 border-blue-100">
                            <Info className="h-5 w-5 text-blue-500" />
                            <AlertDescription className="text-blue-800">
                              Por favor, selecione pelo menos 3 datas preferenciais para cada tatuagem. 
                              O estúdio entrará em contato para confirmar o agendamento com base na disponibilidade dos artistas.
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                      
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="notes">Observações adicionais (opcional)</Label>
                        <Textarea
                          id="notes"
                          value={contactInfo.notes || ''}
                          onChange={(e) => setContactInfo({...contactInfo, notes: e.target.value})}
                          placeholder="Informações adicionais que você considere relevantes"
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
                          <Label htmlFor="credit_card" className="flex-grow flex items-center">
                            <CreditCard className="mr-2 h-4 w-4" /> Cartão de crédito
                          </Label>
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
                      
                      {/* Termos e condições */}
                      <div className="border-t pt-4 mt-6">
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="terms" 
                            checked={acceptedTerms}
                            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                            required
                            className="mt-1"
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Li e aceito os <a href="#" className="text-blue-600 hover:underline">termos e condições</a> do estúdio,
                            incluindo a política de cancelamento, responsabilidade sobre condições de saúde, direitos autorais da arte e
                            concordo que o valor exibido é uma estimativa inicial.
                            {hasTattoos && (
                              <p className="mt-1 text-xs text-gray-600">
                                Estou ciente que o artista entrará em contato para confirmar os detalhes da tatuagem e que o valor 
                                final pode ser ajustado após avaliação presencial da complexidade do projeto.
                              </p>
                            )}
                          </label>
                        </div>
                      </div>
                      
                      {/* Informações de segurança */}
                      <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                        <div className="bg-green-100 p-1 rounded-full">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Pagamento processado com segurança.</p>
                          <p>Todas as transações são criptografadas e seus dados estão protegidos.</p>
                          <p className="mt-1 text-xs">Em breve: integração com Stripe para processamento de pagamentos.</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-6">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setCurrentStep('shipping')}
                        >
                          Voltar
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-red-500 hover:bg-red-600"
                          disabled={processingPayment}
                        >
                          {processingPayment ? "Processando..." : "Finalizar Pedido"}
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
                    <div className="bg-green-50 p-6 rounded-lg mb-6">
                      <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      
                      <h3 className="font-bold text-xl mb-2">
                        Obrigado pela sua compra!
                      </h3>
                      <p className="text-gray-700 mb-2">
                        Seu pedido foi recebido e está sendo processado.
                      </p>
                      <p className="text-gray-700">
                        Você receberá um e-mail de confirmação{hasTattoos ? " e entraremos em contato para confirmar o agendamento" : ""}.
                      </p>
                      
                      {hasTattoos && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-md text-left">
                          <p className="text-sm font-medium text-blue-800 mb-2">Próximos passos:</p>
                          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                            <li>Nosso artista analisará sua solicitação de tatuagem</li>
                            <li>Entraremos em contato para confirmar detalhes e disponibilidade</li>
                            <li>Agendaremos sua sessão conforme as datas indicadas</li>
                            <li>O artista preparará os desenhos para sua aprovação</li>
                            <li>Na data agendada, realizaremos sua tatuagem</li>
                          </ol>
                        </div>
                      )}
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
              <CheckoutSummary 
                items={cart.items}
                totalPrice={cart.totalPrice}
                hasTattoos={hasTattoos}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
