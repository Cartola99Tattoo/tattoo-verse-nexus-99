
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, ShoppingCart, ExternalLink, CheckCircle, Star } from "lucide-react";
import { IEvent } from "@/services/interfaces/IEventService";
import { getEventService } from "@/services/serviceFactory";
import { toast } from "@/hooks/use-toast";

interface EventModalProps {
  event: IEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const eventService = getEventService();

  if (!event) return null;

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name.trim() || !leadForm.email.trim()) {
      toast({
        title: "Erro",
        description: "Nome e e-mail são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await eventService.createEventLead({
        eventId: event.id,
        name: leadForm.name,
        email: leadForm.email,
        phone: leadForm.phone,
        message: leadForm.message
      });
      
      setSubmitted(true);
      toast({
        title: "Sucesso!",
        description: "Seu interesse foi registrado. Entraremos em contato em breve!",
      });
      
      setLeadForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar interesse. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyTicket = () => {
    if (event.ticketProduct?.productId) {
      // Simular redirecionamento para checkout
      toast({
        title: "Redirecionando...",
        description: "Você será direcionado para o checkout - Ambiente de Teste",
      });
      console.log('Redirecting to checkout with product:', event.ticketProduct.productId);
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'flash_day': return 'Flash Day';
      case 'workshop': return 'Workshop';
      case 'collection_launch': return 'Lançamento de Coleção';
      case 'exhibition': return 'Exposição';
      case 'other': return 'Outro';
      default: return type;
    }
  };

  const getCtaText = (eventType: string) => {
    switch (eventType) {
      case 'workshop': return 'Quero me Inscrever!';
      case 'flash_day': return 'Quero Participar!';
      case 'collection_launch': return 'Receber Lembrete!';
      default: return 'Tenho Interesse!';
    }
  };

  const ticketsRemaining = event.ticketProduct?.isEnabled ? 
    event.ticketProduct.ticketStock - (event.smartGoals?.find(g => g.title.toLowerCase().includes('ingresso'))?.currentValue || 0) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{event.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Banner Section */}
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
            {event.featuredImage ? (
              <img
                src={event.featuredImage}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                <Calendar className="h-24 w-24 text-white opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-white/90 text-purple-700 border-purple-200">
                  {getEventTypeLabel(event.eventType)}
                </Badge>
                {event.ticketProduct?.isEnabled && (
                  <Badge className="bg-green-100/90 text-green-800 border-green-200">
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Ingressos Disponíveis
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{event.name}</h1>
              <p className="text-lg text-white/90">{event.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Sobre o Evento</h2>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p>{event.detailedDescription || event.description}</p>
                </div>
              </div>

              {/* Event Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Data e Horário</span>
                  </div>
                  <p className="text-gray-700">
                    {new Date(event.startDate).toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-gray-600">
                    das {event.startTime} às {event.endTime}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Local</span>
                  </div>
                  <p className="text-gray-700">{event.location}</p>
                  {event.fullAddress && (
                    <p className="text-gray-600 text-sm">{event.fullAddress}</p>
                  )}
                </div>
              </div>

              {/* Participating Artists */}
              {event.participatingArtists && event.participatingArtists.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Tatuadores Participantes
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.participatingArtists.map((artist, index) => (
                      <div key={index} className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-100 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {artist.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{artist}</h4>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">Artista</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Ticket Purchase / Lead Form */}
            <div className="space-y-6">
              {/* Ticket Purchase Section */}
              {event.ticketProduct?.isEnabled && event.price && event.price > 0 && (
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 shadow-lg">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-green-800">
                      <ShoppingCart className="h-6 w-6" />
                      <span className="font-bold text-lg">Ingressos Disponíveis</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-green-600">
                        R$ {event.ticketProduct.productPrice.toFixed(2)}
                      </div>
                      {ticketsRemaining > 0 && (
                        <p className="text-sm text-orange-600 font-medium">
                          Apenas {ticketsRemaining} ingressos restantes!
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleBuyTicket}
                      disabled={ticketsRemaining <= 0}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {ticketsRemaining > 0 ? 'Comprar Ingresso Agora' : 'Esgotado'}
                    </Button>

                    <p className="text-xs text-gray-600">
                      💳 Checkout via Stripe/Mercado Pago - Ambiente de Teste
                    </p>
                  </div>
                </div>
              )}

              {/* Lead Capture Form */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-200 shadow-lg">
                {!submitted ? (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-purple-800 mb-2">
                        {event.ticketProduct?.isEnabled ? 'Receber Novidades' : getCtaText(event.eventType)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {event.ticketProduct?.isEnabled 
                          ? 'Seja notificado sobre novidades e promoções'
                          : 'Deixe seus dados e entraremos em contato!'
                        }
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          value={leadForm.name}
                          onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={leadForm.email}
                          onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={leadForm.phone}
                          onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="(11) 99999-9999"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Mensagem</Label>
                        <Textarea
                          id="message"
                          value={leadForm.message}
                          onChange={(e) => setLeadForm(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Deixe uma mensagem (opcional)"
                          rows={3}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? 'Enviando...' : getCtaText(event.eventType)}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                    <div>
                      <h3 className="text-lg font-bold text-green-800 mb-2">
                        Interesse Registrado!
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Obrigado! Entraremos em contato em breve com mais informações sobre o evento.
                      </p>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          onClick={() => setSubmitted(false)}
                          className="w-full"
                        >
                          Registrar Outro Interesse
                        </Button>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                          <span>Siga-nos:</span>
                          <Button variant="ghost" size="sm" className="text-purple-600">
                            Instagram
                          </Button>
                          <Button variant="ghost" size="sm" className="text-purple-600">
                            Facebook
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* External Link */}
              {event.ticketLink && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => window.open(event.ticketLink, '_blank')}
                    className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Link Externo do Evento
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
