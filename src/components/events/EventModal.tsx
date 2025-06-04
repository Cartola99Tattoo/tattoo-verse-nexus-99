
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IEvent } from '@/services/interfaces/IEventService';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ShoppingCart, 
  X,
  Check,
  Info,
  CreditCard,
  Instagram,
  Facebook,
  Twitter,
  ExternalLink
} from 'lucide-react';
import { getEventService } from '@/services/serviceFactory';
import { toast } from '@/hooks/use-toast';

interface EventModalProps {
  event: IEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  const [activeTab, setActiveTab] = useState('details');
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const eventService = getEventService();

  if (!event) return null;

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'flash_day': return 'Flash Day';
      case 'workshop': return 'Workshop';
      case 'collection_launch': return 'Lançamento';
      case 'exhibition': return 'Exposição';
      case 'other': return 'Outro';
      default: return type;
    }
  };

  const handleBuyTicket = () => {
    // Simular redirecionamento para checkout
    toast({
      title: "Redirecionando para o checkout",
      description: "Preparando seu ingresso para o evento. Aguarde um momento.",
    });
    
    // Aqui seria o redirecionamento real para a loja
    console.log('Redirecionando para checkout com produto:', event.ticketProduct);
    
    // Simulação de redirecionamento após 1.5 segundos
    setTimeout(() => {
      toast({
        title: "Checkout pronto!",
        description: "Você será redirecionado para finalizar sua compra."
      });
    }, 1500);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.name.trim() || !leadData.email.trim()) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await eventService.createEventLead({
        eventId: event.id,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        message: leadData.message
      });

      toast({
        title: "Sucesso!",
        description: "Sua inscrição foi realizada com sucesso! Entraremos em contato em breve.",
      });

      setLeadData({ name: '', email: '', phone: '', message: '' });
      setFormSubmitted(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar inscrição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCTAText = () => {
    switch (event.eventType) {
      case 'flash_day': return 'Quero Participar!';
      case 'workshop': return 'Inscrever-me!';
      case 'exhibition': return 'Receber Lembrete!';
      default: return 'Tenho Interesse!';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-gray-50 to-white border border-red-100 shadow-2xl p-0">
        {/* Hero Image/Header */}
        <div className="relative w-full h-48 sm:h-64 overflow-hidden">
          {event.featuredImage ? (
            <img
              src={event.featuredImage}
              alt={event.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
              <Calendar className="h-16 w-16 text-white opacity-60" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            <div className="flex gap-2 mb-2">
              <Badge className="bg-red-100 text-red-800 border-red-200">
                {getEventTypeLabel(event.eventType)}
              </Badge>
              {event.isPublic && (
                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                  Aberto ao Público
                </Badge>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white shadow-text">
              {event.name}
            </h2>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-0">
          <Tabs defaultValue="details" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full bg-gray-100 rounded-none border-b">
              <TabsTrigger 
                value="details"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-50 data-[state=active]:to-red-100 data-[state=active]:text-red-800 rounded-none"
              >
                <Info className="h-4 w-4 mr-2" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger 
                value="registration"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-50 data-[state=active]:to-red-100 data-[state=active]:text-red-800 rounded-none"
              >
                <Users className="h-4 w-4 mr-2" />
                Participação
              </TabsTrigger>
            </TabsList>
            
            {/* Details Tab */}
            <TabsContent value="details" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Event main info - Left column */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900">Sobre o Evento</h3>
                    <div className="text-gray-700 leading-relaxed space-y-2">
                      <p>{event.detailedDescription || event.description}</p>
                    </div>
                  </div>
                  
                  {event.participatingArtists && event.participatingArtists.length > 0 && (
                    <div>
                      <h4 className="font-medium text-lg text-gray-900 mb-3">Tatuadores Participantes</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {event.participatingArtists.map((artist, index) => (
                          <div key={index} className="bg-red-50 text-red-800 px-3 py-2 rounded border border-red-200 flex items-center">
                            <div className="w-6 h-6 rounded-full bg-red-200 mr-2 flex items-center justify-center text-sm font-medium">
                              {artist.charAt(0)}
                            </div>
                            <span className="text-sm">{artist}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {event.ticketLink && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-900">Links Externos</h4>
                      <a 
                        href={event.ticketLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-red-700 hover:text-red-900 mt-2"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Link alternativo para inscrição
                      </a>
                    </div>
                  )}
                </div>
                
                {/* Event metadata - Right column */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Informações do Evento
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 text-gray-700">
                        <Calendar className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium">Data</div>
                          <div className="text-sm">
                            {new Date(event.startDate).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'long',
                              year: 'numeric'
                            })}
                            {event.endDate !== event.startDate && (
                              <> até {new Date(event.endDate).toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: 'long',
                                year: 'numeric'
                              })}</>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 text-gray-700">
                        <Clock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium">Horário</div>
                          <div className="text-sm">{event.startTime} às {event.endTime}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 text-gray-700">
                        <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium">Local</div>
                          <div className="text-sm">{event.location}</div>
                          {event.fullAddress && (
                            <div className="text-xs text-gray-500">{event.fullAddress}</div>
                          )}
                        </div>
                      </div>
                      
                      {event.price !== undefined && (
                        <div className="flex items-start gap-3 text-gray-700">
                          <CreditCard className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium">Investimento</div>
                            <div className="text-sm">
                              {event.price > 0 
                                ? `R$ ${event.price.toFixed(2)}` 
                                : 'Gratuito'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {event.price && event.price > 0 && event.ticketProduct?.isEnabled && (
                    <Button
                      onClick={handleBuyTicket}
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Comprar Ingresso
                    </Button>
                  )}
                  
                  {/* Social share */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Compartilhar evento</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
                        <Instagram className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Registration Tab */}
            <TabsContent value="registration" className="p-6">
              {formSubmitted ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Inscrição Realizada com Sucesso!</h3>
                  <p className="text-green-700 mb-6">
                    Obrigado pelo seu interesse! Enviaremos detalhes adicionais e lembretes sobre este evento para o seu email.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => setActiveTab('details')} variant="outline">
                      Voltar aos Detalhes
                    </Button>
                    <Button 
                      onClick={onClose} 
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              ) : event.price === 0 || !event.ticketProduct?.isEnabled ? (
                <div>
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {event.price === 0 ? 'Evento Gratuito!' : 'Demonstre seu interesse'}
                    </h3>
                    <p className="text-gray-600 max-w-lg mx-auto">
                      Preencha o formulário abaixo para garantir sua participação e receber detalhes adicionais sobre o evento.
                    </p>
                  </div>
                  
                  <form onSubmit={handleLeadSubmit} className="max-w-2xl mx-auto space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-medium">Nome Completo *</Label>
                        <Input
                          id="name"
                          value={leadData.name}
                          onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                          required
                          className="border-red-200 focus:border-red-500 bg-white"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-medium">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={leadData.email}
                          onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                          required
                          className="border-red-200 focus:border-red-500 bg-white"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-medium">Telefone (WhatsApp)</Label>
                      <Input
                        id="phone"
                        value={leadData.phone}
                        onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                        className="border-red-200 focus:border-red-500 bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-medium">Mensagem (opcional)</Label>
                      <Textarea
                        id="message"
                        value={leadData.message}
                        onChange={(e) => setLeadData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Perguntas ou comentários sobre o evento..."
                        rows={3}
                        className="border-red-200 focus:border-red-500 bg-white resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg"
                      >
                        {isSubmitting ? 'Enviando...' : getCTAText()}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab('details')}
                        className="border-gray-300"
                      >
                        Voltar
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center space-y-6 py-8">
                  <h3 className="text-xl font-bold text-gray-900">
                    Evento com Inscrição Paga
                  </h3>
                  <p className="text-gray-600 max-w-lg mx-auto">
                    Para participar deste evento, é necessário adquirir o ingresso através de nossa plataforma.
                  </p>
                  
                  <div className="bg-gradient-to-r from-red-50 to-gray-50 p-6 rounded-lg border border-red-200 max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold text-gray-900">Investimento:</span>
                      <span className="text-2xl font-bold text-red-600">
                        R$ {event.price.toFixed(2)}
                      </span>
                    </div>
                    
                    {event.ticketProduct?.ticketStock > 0 && (
                      <div className="text-sm text-gray-600 mb-4">
                        {event.ticketProduct.ticketStock} ingressos disponíveis
                      </div>
                    )}
                    
                    <Button
                      onClick={handleBuyTicket}
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Comprar Ingresso Agora
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Checkout via Stripe/Mercado Pago - Ambiente Seguro
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('details')}
                    className="mt-4"
                  >
                    Voltar aos Detalhes
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
