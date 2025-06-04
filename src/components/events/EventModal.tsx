
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
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-black via-gray-900 to-black border-2 border-red-500 shadow-2xl shadow-red-500/25 p-0">
        {/* Hero Image/Header */}
        <div className="relative w-full h-56 sm:h-72 overflow-hidden">
          {event.featuredImage ? (
            <img
              src={event.featuredImage}
              alt={event.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
              <Calendar className="h-20 w-20 text-white opacity-60" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            <div className="flex gap-2 mb-3">
              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-none shadow-lg">
                {getEventTypeLabel(event.eventType)}
              </Badge>
              {event.isPublic && (
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none shadow-lg">
                  Aberto ao Público
                </Badge>
              )}
              {event.ticketProduct?.isEnabled && (
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-lg">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Venda de Ingressos
                </Badge>
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white shadow-text mb-2">
              {event.name}
            </h2>
            <p className="text-lg text-gray-200 line-clamp-2">
              {event.description}
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-0">
          <Tabs defaultValue="details" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full bg-gray-800 rounded-none border-b border-red-500/30">
              <TabsTrigger 
                value="details"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white rounded-none text-gray-300"
              >
                <Info className="h-4 w-4 mr-2" />
                Detalhes do Evento
              </TabsTrigger>
              <TabsTrigger 
                value="registration"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white rounded-none text-gray-300"
              >
                <Users className="h-4 w-4 mr-2" />
                Participação
              </TabsTrigger>
            </TabsList>
            
            {/* Details Tab */}
            <TabsContent value="details" className="p-6 bg-gradient-to-b from-gray-900 to-black">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Event main info - Left column */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="prose max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-4">Sobre o Evento</h3>
                    <div className="text-gray-300 leading-relaxed space-y-3 text-base">
                      <p>{event.detailedDescription || event.description}</p>
                    </div>
                  </div>
                  
                  {event.participatingArtists && event.participatingArtists.length > 0 && (
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-red-500/30">
                      <h4 className="font-bold text-xl text-white mb-4">Tatuadores Participantes</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {event.participatingArtists.map((artist, index) => (
                          <div key={index} className="bg-gradient-to-r from-red-600/20 to-red-800/20 text-white px-4 py-3 rounded-lg border border-red-500/30 flex items-center hover:from-red-600/30 hover:to-red-800/30 transition-all">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 mr-3 flex items-center justify-center text-sm font-bold">
                              {artist.charAt(0)}
                            </div>
                            <span className="font-medium">{artist}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {event.ticketLink && (
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-red-500/30">
                      <h4 className="font-bold text-white mb-3">Links Adicionais</h4>
                      <a 
                        href={event.ticketLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-red-400 hover:text-red-300 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5 mr-2" />
                        Link alternativo para inscrição
                      </a>
                    </div>
                  )}
                </div>
                
                {/* Event metadata - Right column */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-red-500/30 shadow-xl">
                    <h4 className="font-bold text-white mb-4 pb-3 border-b border-red-500/30">
                      Informações do Evento
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 text-gray-300">
                        <Calendar className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-semibold text-white">Data</div>
                          <div className="text-sm">
                            {new Date(event.startDate).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'long',
                              year: 'numeric',
                              weekday: 'long'
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
                      
                      <div className="flex items-start gap-3 text-gray-300">
                        <Clock className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-semibold text-white">Horário</div>
                          <div className="text-sm">{event.startTime} às {event.endTime}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 text-gray-300">
                        <MapPin className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-semibold text-white">Local</div>
                          <div className="text-sm">{event.location}</div>
                          {event.fullAddress && (
                            <div className="text-xs text-gray-400 mt-1">{event.fullAddress}</div>
                          )}
                        </div>
                      </div>
                      
                      {event.price !== undefined && (
                        <div className="flex items-start gap-3 text-gray-300">
                          <CreditCard className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                          <div>
                            <div className="font-semibold text-white">Investimento</div>
                            <div className="text-sm font-bold text-red-400">
                              {event.price > 0 
                                ? `R$ ${event.price.toFixed(2)}` 
                                : 'Gratuito'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Social share */}
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl border border-red-500/30">
                    <h4 className="text-white font-semibold mb-3">Compartilhar evento</h4>
                    <div className="flex gap-3">
                      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white">
                        <Instagram className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white">
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Registration Tab */}
            <TabsContent value="registration" className="p-6 bg-gradient-to-b from-gray-900 to-black">
              {formSubmitted ? (
                <div className="bg-gradient-to-br from-green-800/30 to-green-900/30 border border-green-500/50 rounded-xl p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Inscrição Realizada com Sucesso!</h3>
                  <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                    Obrigado pelo seu interesse! Enviaremos detalhes adicionais e lembretes sobre este evento para o seu email.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => setActiveTab('details')} variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
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
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {event.price === 0 ? 'Evento Gratuito!' : 'Demonstre seu interesse'}
                    </h3>
                    <p className="text-gray-300 max-w-lg mx-auto">
                      Preencha o formulário abaixo para garantir sua participação e receber detalhes adicionais sobre o evento.
                    </p>
                  </div>
                  
                  <form onSubmit={handleLeadSubmit} className="max-w-2xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-medium text-white">Nome Completo *</Label>
                        <Input
                          id="name"
                          value={leadData.name}
                          onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                          required
                          className="bg-gray-800 border-red-500/50 focus:border-red-500 text-white placeholder-gray-400"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-medium text-white">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={leadData.email}
                          onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                          required
                          className="bg-gray-800 border-red-500/50 focus:border-red-500 text-white placeholder-gray-400"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-medium text-white">Telefone (WhatsApp)</Label>
                      <Input
                        id="phone"
                        value={leadData.phone}
                        onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                        className="bg-gray-800 border-red-500/50 focus:border-red-500 text-white placeholder-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-medium text-white">Mensagem (opcional)</Label>
                      <Textarea
                        id="message"
                        value={leadData.message}
                        onChange={(e) => setLeadData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Perguntas ou comentários sobre o evento..."
                        rows={3}
                        className="bg-gray-800 border-red-500/50 focus:border-red-500 text-white placeholder-gray-400 resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg font-semibold py-3"
                      >
                        {isSubmitting ? 'Enviando...' : getCTAText()}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab('details')}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        Voltar
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center space-y-6 py-8">
                  <h3 className="text-2xl font-bold text-white">
                    Evento com Inscrição Paga
                  </h3>
                  <p className="text-gray-300 max-w-lg mx-auto">
                    Para participar deste evento, é necessário adquirir o ingresso através de nossa plataforma.
                  </p>
                  
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-red-500/30 max-w-md mx-auto shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-semibold text-white">Investimento:</span>
                      <span className="text-3xl font-bold text-red-400">
                        R$ {event.price.toFixed(2)}
                      </span>
                    </div>
                    
                    {event.ticketProduct?.ticketStock > 0 && (
                      <div className="text-sm text-gray-400 mb-6">
                        {event.ticketProduct.ticketStock} ingressos disponíveis
                      </div>
                    )}
                    
                    <Button
                      onClick={handleBuyTicket}
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Comprar Ingresso Agora
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-4">
                      Checkout via Stripe/Mercado Pago - Ambiente Seguro
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('details')}
                    className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-800"
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
