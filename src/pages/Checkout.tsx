
import { useState, useRef } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info, Calendar as CalendarIcon, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Etapas do checkout
type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

// Tipo para imagens de referência
type ReferenceImage = {
  file: File;
  preview: string;
};

// Tipo para preferências de horários
type TimePreference = 'morning' | 'afternoon' | 'evening' | 'any';

// Tipo para informações da tatuagem
type TattooInfo = {
  artist: string;
  style: string;
  size: string;
  bodyLocation: string;
  description: string;
  referenceImages: ReferenceImage[];
};

// Tipo para informações de contato
type ContactInfo = {
  name: string;
  email: string;
  phone: string;
};

// Tipo para preferências de agendamento
type SchedulingPreferences = {
  selectedDates: Date[];
  timePreference: TimePreference;
  isFlexible: boolean;
  healthInfo: string;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados para formulários
  const [tattooInfo, setTattooInfo] = useState<TattooInfo>({
    artist: '',
    style: '',
    size: '',
    bodyLocation: '',
    description: '',
    referenceImages: [],
  });
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
  });
  
  const [schedulingPreferences, setSchedulingPreferences] = useState<SchedulingPreferences>({
    selectedDates: [],
    timePreference: 'any',
    isFlexible: false,
    healthInfo: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  
  // Lista de artistas disponíveis
  const availableArtists = [
    { id: "1", name: "João Silva", specialties: ["Realismo", "Black Work"] },
    { id: "2", name: "Maria Oliveira", specialties: ["Old School", "Aquarela"] },
    { id: "3", name: "Carlos Souza", specialties: ["Minimalista", "Geométrico"] },
    { id: "4", name: "Ana Pereira", specialties: ["Fine Line", "Aquarela"] },
  ];
  
  // Lista de estilos de tatuagem
  const tattooStyles = [
    "Realismo", "Minimalista", "Old School", "Aquarela", 
    "Tradicional", "Neo Tradicional", "Black Work", "Geométrico",
    "Fine Line", "Pontilhismo", "Tribal", "Oriental"
  ];
  
  // Lista de tamanhos de tatuagem
  const tattooSizes = [
    "Pequeno (até 10cm)",
    "Médio (10-20cm)",
    "Grande (20-30cm)",
    "Extra Grande (acima de 30cm)"
  ];
  
  // Lista de locais do corpo
  const bodyLocations = [
    "Braço - Bíceps", "Braço - Antebraço", "Costas - Superior", "Costas - Inferior",
    "Perna - Coxa", "Perna - Panturrilha", "Tornozelo", "Pé", "Costelas", 
    "Abdômen", "Peito", "Pescoço", "Mão", "Pulso", "Ombro", "Nuca"
  ];
  
  // Preferências de horários
  const timePreferences = [
    { value: 'morning', label: 'Manhã (8h - 12h)' },
    { value: 'afternoon', label: 'Tarde (12h - 18h)' },
    { value: 'evening', label: 'Final da tarde (18h - 20h)' },
    { value: 'any', label: 'Qualquer horário' },
  ];
  
  // Manipuladores de eventos para upload de imagens
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Verificar se já atingiu o limite de 3 imagens
    if (tattooInfo.referenceImages.length + files.length > 3) {
      toast({
        title: "Limite de imagens",
        description: "Você pode enviar no máximo 3 imagens de referência.",
        variant: "destructive",
      });
      return;
    }
    
    // Verificar tipo e tamanho dos arquivos
    const validFiles = Array.from(files).filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        toast({
          title: "Tipo de arquivo inválido",
          description: `${file.name} não é uma imagem válida. Apenas JPG, PNG, GIF e WEBP são aceitos.`,
          variant: "destructive",
        });
      } else if (!isValidSize) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o tamanho máximo de 5MB.`,
          variant: "destructive",
        });
      }
      
      return isValidType && isValidSize;
    });
    
    // Criar previews para os arquivos válidos e adicionar ao estado
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setTattooInfo({
      ...tattooInfo,
      referenceImages: [...tattooInfo.referenceImages, ...newImages]
    });
    
    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const newImages = [...tattooInfo.referenceImages];
    // Revogar URL para evitar vazamento de memória
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setTattooInfo({ ...tattooInfo, referenceImages: newImages });
  };
  
  // Validações de formulários
  const validateTattooInfo = (): boolean => {
    const { artist, style, size, bodyLocation } = tattooInfo;
    
    if (!artist || !style || !size || !bodyLocation) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios sobre a tatuagem.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const validateContactInfo = (): boolean => {
    const { name, email, phone } = contactInfo;
    
    if (!name || !email || !phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos de contato.",
        variant: "destructive",
      });
      return false;
    }
    
    // Validação simples de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, forneça um endereço de email válido.",
        variant: "destructive",
      });
      return false;
    }
    
    // Validação simples de telefone brasileiro
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "Telefone inválido",
        description: "Por favor, forneça um número de telefone válido no formato (XX) XXXXX-XXXX.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const validateSchedulingPreferences = (): boolean => {
    if (schedulingPreferences.selectedDates.length < 3) {
      toast({
        title: "Datas insuficientes",
        description: "Por favor, selecione pelo menos 3 datas preferenciais para o agendamento.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const validatePayment = (): boolean => {
    if (!acceptedTerms) {
      toast({
        title: "Termos e condições",
        description: "Você precisa aceitar os termos e condições para prosseguir.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  // Manipuladores para navegação entre etapas
  const handleTattooInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateTattooInfo()) {
      setCurrentStep('shipping');
    }
  };
  
  const handleContactInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateContactInfo() && validateSchedulingPreferences()) {
      setCurrentStep('payment');
    }
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      // Simulação de processamento de pagamento
      setTimeout(() => {
        setCurrentStep('confirmation');
      }, 1500);
    }
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
  
  // Formatação de telefone brasileiro
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      let formattedValue = '';
      
      if (value.length > 0) {
        formattedValue = `(${value.substring(0, 2)}`;
      }
      if (value.length > 2) {
        formattedValue += `) ${value.substring(2, value.length > 6 ? 7 : value.length)}`;
      }
      if (value.length > 7) {
        formattedValue += `-${value.substring(7, 11)}`;
      }
      
      setContactInfo({ ...contactInfo, phone: formattedValue });
    }
  };
  
  // Formatação das datas selecionadas
  const formatSelectedDates = () => {
    if (schedulingPreferences.selectedDates.length === 0) {
      return "Nenhuma data selecionada";
    }
    
    return schedulingPreferences.selectedDates
      .slice(0, 3)
      .map(date => format(date, "dd/MM/yyyy"))
      .join(", ") + 
      (schedulingPreferences.selectedDates.length > 3 ? ` e mais ${schedulingPreferences.selectedDates.length - 3}` : "");
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
        <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Agendamento</h1>
        
        {/* Indicador de progresso */}
        <div className="max-w-3xl mx-auto mb-8">
          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cart" disabled={currentStep !== 'cart'}>
                Informações da Tatuagem
              </TabsTrigger>
              <TabsTrigger value="shipping" disabled={currentStep !== 'shipping'}>
                Contato e Agendamento
              </TabsTrigger>
              <TabsTrigger value="payment" disabled={currentStep !== 'payment'}>
                Pagamento e Confirmação
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coluna principal (formulários) */}
            <div className="md:col-span-2">
              {/* Etapa 1: Revisão do carrinho e informações da tatuagem */}
              {currentStep === 'cart' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes da Tatuagem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      <h3 className="text-lg font-semibold">Itens no Carrinho</h3>
                      {cart.items.map((item) => (
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
                            <div className="flex justify-between mt-2">
                              <span>Qtd: {item.quantity}</span>
                              <span className="font-bold">
                                R$ {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Alert className="mb-6 bg-blue-50 border-blue-100">
                      <Info className="h-5 w-5 text-blue-500" />
                      <AlertDescription className="text-blue-800">
                        Por favor, forneça informações detalhadas sobre a sua tatuagem para que possamos prepará-la adequadamente.
                        Estas informações são essenciais para o agendamento da sua sessão.
                      </AlertDescription>
                    </Alert>
                    
                    <form onSubmit={handleTattooInfoSubmit} className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="artist" className="font-medium">
                            Artista Preferencial <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={tattooInfo.artist}
                            onValueChange={(value) => setTattooInfo({...tattooInfo, artist: value})}
                          >
                            <SelectTrigger id="artist" className="w-full">
                              <SelectValue placeholder="Selecione um artista" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableArtists.map((artist) => (
                                <SelectItem key={artist.id} value={artist.id}>
                                  {artist.name} ({artist.specialties.join(", ")})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="style" className="font-medium">
                            Estilo da Tatuagem <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={tattooInfo.style}
                            onValueChange={(value) => setTattooInfo({...tattooInfo, style: value})}
                          >
                            <SelectTrigger id="style" className="w-full">
                              <SelectValue placeholder="Selecione um estilo" />
                            </SelectTrigger>
                            <SelectContent>
                              {tattooStyles.map((style) => (
                                <SelectItem key={style} value={style}>
                                  {style}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="size" className="font-medium">
                            Tamanho Aproximado <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={tattooInfo.size}
                            onValueChange={(value) => setTattooInfo({...tattooInfo, size: value})}
                          >
                            <SelectTrigger id="size" className="w-full">
                              <SelectValue placeholder="Selecione um tamanho" />
                            </SelectTrigger>
                            <SelectContent>
                              {tattooSizes.map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bodyLocation" className="font-medium">
                            Local no Corpo <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={tattooInfo.bodyLocation}
                            onValueChange={(value) => setTattooInfo({...tattooInfo, bodyLocation: value})}
                          >
                            <SelectTrigger id="bodyLocation" className="w-full">
                              <SelectValue placeholder="Selecione uma localização" />
                            </SelectTrigger>
                            <SelectContent>
                              {bodyLocations.map((location) => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description" className="font-medium">
                            Descrição Detalhada da Ideia
                          </Label>
                          <Textarea
                            id="description"
                            value={tattooInfo.description}
                            onChange={(e) => setTattooInfo({...tattooInfo, description: e.target.value})}
                            placeholder="Descreva sua ideia de tatuagem em detalhes, incluindo cores, significado, etc."
                            className="min-h-[120px]"
                            maxLength={1000}
                          />
                          <p className="text-xs text-gray-500 text-right">
                            {tattooInfo.description.length}/1000 caracteres
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="font-medium">
                            Imagens de Referência (até 3)
                          </Label>
                          <div className="mt-2">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/jpeg,image/png,image/gif,image/webp"
                              className="hidden"
                              multiple
                            />
                            <div 
                              onClick={handleUploadClick}
                              className={`
                                border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                                ${tattooInfo.referenceImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                              `}
                            >
                              <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-sm font-medium">
                                Clique para enviar imagens de referência
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                JPG, PNG, GIF ou WEBP (máx. 5MB cada)
                              </p>
                            </div>
                            
                            {tattooInfo.referenceImages.length > 0 && (
                              <div className="mt-4 grid grid-cols-3 gap-4">
                                {tattooInfo.referenceImages.map((image, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={image.preview}
                                      alt={`Referência ${index + 1}`}
                                      className="h-24 w-full object-cover rounded-md"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveImage(index)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                      aria-label="Remover imagem"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <Button type="submit" className="bg-red-500 hover:bg-red-600">
                          Continuar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {/* Etapa 2: Informações de contato e agendamento */}
              {currentStep === 'shipping' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contato e Preferências de Agendamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactInfoSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Informações de Contato</h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="font-medium">
                              Nome completo <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="name"
                              value={contactInfo.name}
                              onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email" className="font-medium">
                              Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={contactInfo.email}
                              onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="font-medium">
                              Telefone <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="phone"
                              value={contactInfo.phone}
                              onChange={handlePhoneChange}
                              placeholder="(00) 00000-0000"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6 space-y-4">
                        <h3 className="text-lg font-semibold">Preferências de Agendamento</h3>
                        
                        <div className="space-y-2">
                          <Label className="font-medium block mb-2">
                            Datas Preferenciais <span className="text-red-500">*</span>
                            <span className="text-sm font-normal text-gray-500 ml-2">
                              (Selecione pelo menos 3 datas)
                            </span>
                          </Label>
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !schedulingPreferences.selectedDates.length && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {schedulingPreferences.selectedDates.length > 0 ? (
                                  formatSelectedDates()
                                ) : (
                                  <span>Selecione as datas preferenciais</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="multiple"
                                selected={schedulingPreferences.selectedDates}
                                onSelect={(dates) => {
                                  setSchedulingPreferences({
                                    ...schedulingPreferences,
                                    selectedDates: dates || []
                                  });
                                }}
                                disabled={(date) => {
                                  // Desabilitar datas no passado e limite de até dois meses à frente
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  
                                  const twoMonthsLater = new Date();
                                  twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);
                                  
                                  return date < today || date > twoMonthsLater;
                                }}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          
                          {schedulingPreferences.selectedDates.length > 0 && 
                           schedulingPreferences.selectedDates.length < 3 && (
                            <p className="text-sm text-amber-600 mt-1">
                              Por favor, selecione pelo menos 3 datas diferentes
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="timePreference" className="font-medium">
                            Horários Preferenciais
                          </Label>
                          <Select
                            value={schedulingPreferences.timePreference}
                            onValueChange={(value: TimePreference) => 
                              setSchedulingPreferences({
                                ...schedulingPreferences, 
                                timePreference: value
                              })
                            }
                          >
                            <SelectTrigger id="timePreference" className="w-full">
                              <SelectValue placeholder="Selecione um horário preferencial" />
                            </SelectTrigger>
                            <SelectContent>
                              {timePreferences.map((timeOption) => (
                                <SelectItem key={timeOption.value} value={timeOption.value}>
                                  {timeOption.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="flexible" 
                            checked={schedulingPreferences.isFlexible}
                            onCheckedChange={(checked) => 
                              setSchedulingPreferences({
                                ...schedulingPreferences,
                                isFlexible: checked === true
                              })
                            }
                          />
                          <label
                            htmlFor="flexible"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Tenho flexibilidade de horário
                          </label>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <Label htmlFor="healthInfo" className="font-medium">
                            Informações Adicionais de Saúde (opcional)
                          </Label>
                          <Textarea
                            id="healthInfo"
                            value={schedulingPreferences.healthInfo}
                            onChange={(e) => 
                              setSchedulingPreferences({
                                ...schedulingPreferences,
                                healthInfo: e.target.value
                              })
                            }
                            placeholder="Alergias, condições de saúde, medicações ou outras informações relevantes para o procedimento..."
                            className="min-h-[80px]"
                          />
                        </div>
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
                    <CardTitle>Pagamento e Confirmação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Método de Pagamento</h3>
                        <Alert className="bg-blue-50 border-blue-100 mb-4">
                          <Info className="h-5 w-5 text-blue-500" />
                          <AlertDescription className="text-blue-800">
                            Este valor é uma estimativa inicial. O orçamento final será confirmado pelo artista
                            após avaliação detalhada da sua solicitação.
                          </AlertDescription>
                        </Alert>
                        
                        <RadioGroup
                          value={paymentMethod}
                          onValueChange={setPaymentMethod}
                          className="space-y-4"
                          defaultValue="credit_card"
                        >
                          <div className="flex items-center space-x-3 border p-4 rounded-lg">
                            <RadioGroupItem value="credit_card" id="credit_card" />
                            <Label htmlFor="credit_card" className="flex-grow">
                              <div className="font-medium">Cartão de crédito</div>
                              <p className="text-sm text-gray-500">
                                Pagamento seguro processado com criptografia SSL
                              </p>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 border p-4 rounded-lg">
                            <RadioGroupItem value="pix" id="pix" />
                            <Label htmlFor="pix" className="flex-grow">
                              <div className="font-medium">Pix</div>
                              <p className="text-sm text-gray-500">
                                Transferência instantânea
                              </p>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 border p-4 rounded-lg">
                            <RadioGroupItem value="boleto" id="boleto" />
                            <Label htmlFor="boleto" className="flex-grow">
                              <div className="font-medium">Boleto bancário</div>
                              <p className="text-sm text-gray-500">
                                Vencimento em 3 dias úteis
                              </p>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      {/* Campos de cartão de crédito */}
                      {paymentMethod === 'credit_card' && (
                        <div className="space-y-4 border-t pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="card_number" className="font-medium">Número do cartão</Label>
                            <Input id="card_number" placeholder="0000 0000 0000 0000" required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="card_expiry" className="font-medium">Validade</Label>
                              <Input id="card_expiry" placeholder="MM/AA" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="card_cvc" className="font-medium">CVC</Label>
                              <Input id="card_cvc" placeholder="000" required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="card_name" className="font-medium">Nome no cartão</Label>
                            <Input id="card_name" required />
                          </div>
                        </div>
                      )}
                      
                      {/* Instruções para Pix */}
                      {paymentMethod === 'pix' && (
                        <div className="border-t pt-4">
                          <div className="border p-4 rounded-lg bg-gray-50 text-center">
                            <p className="mb-4">Você receberá as instruções para pagamento via Pix após finalizar o pedido.</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Instruções para Boleto */}
                      {paymentMethod === 'boleto' && (
                        <div className="border-t pt-4">
                          <div className="border p-4 rounded-lg bg-gray-50 text-center">
                            <p className="mb-4">O boleto será gerado após a confirmação do pedido e enviado para seu e-mail.</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Termos e condições */}
                      <div className="border-t pt-4">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold mb-2">Termos e Condições</h4>
                          <ul className="text-sm space-y-2 list-disc pl-5">
                            <li>O valor exibido é uma estimativa inicial e pode ser ajustado após avaliação detalhada pelo artista.</li>
                            <li>A política de cancelamento permite reagendamentos com até 48h de antecedência sem custo adicional.</li>
                            <li>O cliente é responsável por informar condições de saúde que possam afetar o procedimento.</li>
                            <li>A arte da tatuagem possui direitos autorais e não pode ser reproduzida sem autorização.</li>
                            <li>Uma taxa de sinal de 20% não reembolsável será cobrada para garantir o agendamento.</li>
                          </ul>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="terms" 
                            checked={acceptedTerms}
                            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                            required
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Eu li e aceito os termos e condições <span className="text-red-500">*</span>
                          </label>
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
                    <div className="bg-green-50 p-6 rounded-lg mb-6">
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
                      <h3 className="font-bold text-lg mb-4">
                        Obrigado pela sua reserva!
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Seu agendamento foi recebido e está sendo processado.
                      </p>
                      <p className="text-gray-700 mb-3">
                        Um de nossos artistas entrará em contato em até 48 horas para confirmar
                        os detalhes da sua tatuagem e o agendamento.
                      </p>
                      <p className="text-gray-700 font-medium">
                        Número do pedido: #{Math.floor(100000 + Math.random() * 900000)}
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
              <Card className="sticky top-4">
                <CardHeader className="border-b">
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    
                    {/* Exibir detalhes da tatuagem quando preenchidos */}
                    {currentStep !== 'cart' && (
                      <div className="border-t pt-4 mt-2 space-y-2 text-sm">
                        <h4 className="font-semibold text-gray-700">Detalhes da Tatuagem</h4>
                        
                        {tattooInfo.artist && (
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-gray-500 col-span-1">Artista:</span>
                            <span className="col-span-2">
                              {availableArtists.find(a => a.id === tattooInfo.artist)?.name || tattooInfo.artist}
                            </span>
                          </div>
                        )}
                        
                        {tattooInfo.style && (
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-gray-500 col-span-1">Estilo:</span>
                            <span className="col-span-2">{tattooInfo.style}</span>
                          </div>
                        )}
                        
                        {tattooInfo.size && (
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-gray-500 col-span-1">Tamanho:</span>
                            <span className="col-span-2">{tattooInfo.size}</span>
                          </div>
                        )}
                        
                        {tattooInfo.bodyLocation && (
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-gray-500 col-span-1">Local:</span>
                            <span className="col-span-2">{tattooInfo.bodyLocation}</span>
                          </div>
                        )}
                        
                        {tattooInfo.referenceImages.length > 0 && (
                          <div className="mt-2">
                            <span className="text-gray-500 block mb-1">Referências:</span>
                            <div className="grid grid-cols-3 gap-1">
                              {tattooInfo.referenceImages.map((image, index) => (
                                <img
                                  key={index}
                                  src={image.preview}
                                  alt={`Referência ${index + 1}`}
                                  className="h-12 w-full object-cover rounded-sm"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Exibir informações de agendamento quando preenchidas */}
                    {currentStep === 'payment' && (
                      <div className="border-t pt-4 mt-2 space-y-2 text-sm">
                        <h4 className="font-semibold text-gray-700">Agendamento</h4>
                        
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-500 col-span-1">Datas:</span>
                          <span className="col-span-2">{formatSelectedDates()}</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-500 col-span-1">Horário:</span>
                          <span className="col-span-2">
                            {timePreferences.find(t => t.value === schedulingPreferences.timePreference)?.label || 'Qualquer horário'}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between font-bold">
                        <span>Estimativa Inicial</span>
                        <span>R$ {cart.totalPrice.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        *O valor final será determinado após avaliação do artista
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
