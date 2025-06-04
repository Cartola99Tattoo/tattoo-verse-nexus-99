
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { IEvent } from '@/services/interfaces/IEventService';
import { Calendar, MapPin, Clock, Users, ShoppingCart, X } from 'lucide-react';
import { getEventService } from '@/services/serviceFactory';
import { toast } from '@/hooks/use-toast';

interface EventModalProps {
  event: IEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
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
      title: "Redirecionando...",
      description: "Você será redirecionado para o checkout em instantes!",
    });
    
    // Aqui seria o redirecionamento real para a loja
    console.log('Redirecionando para checkout com produto:', event.ticketProduct);
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
      setShowLeadForm(false);
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {event.name}
              </DialogTitle>
              <div className="flex gap-2 mb-4">
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  {getEventTypeLabel(event.eventType)}
                </Badge>
                {event.isPublic && (
                  <Badge variant="outline" className="border-green-200 text-green-700">
                    Aberto ao Público
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Imagem e informações principais */}
          <div className="space-y-4">
            {event.featuredImage ? (
              <img
                src={event.featuredImage}
                alt={event.name}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-16 w-16 text-white opacity-60" />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="h-5 w-5 text-red-600" />
                <span className="font-medium">
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
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="h-5 w-5 text-red-600" />
                <span>{event.startTime} às {event.endTime}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium">{event.location}</div>
                  {event.fullAddress && (
                    <div className="text-sm text-gray-500">{event.fullAddress}</div>
                  )}
                </div>
              </div>

              {event.participatingArtists && event.participatingArtists.length > 0 && (
                <div className="flex items-start gap-3 text-gray-700">
                  <Users className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Tatuadores Participantes:</div>
                    <div className="grid grid-cols-1 gap-1">
                      {event.participatingArtists.map((artist, index) => (
                        <div key={index} className="text-sm bg-red-50 text-red-800 px-2 py-1 rounded border border-red-200">
                          {artist}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Descrição e ações */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre o Evento</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {event.detailedDescription || event.description}
              </p>
            </div>

            {/* Preço e ingresso */}
            {event.price && event.price > 0 && (
              <div className="bg-gradient-to-r from-red-50 to-gray-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-gray-900">Investimento:</span>
                  <span className="text-2xl font-bold text-red-600">
                    R$ {event.price.toFixed(2)}
                  </span>
                </div>
                
                {event.ticketProduct?.isEnabled && (
                  <div className="space-y-3">
                    {event.ticketProduct.ticketStock > 0 && (
                      <div className="text-sm text-gray-600">
                        {event.ticketProduct.ticketStock} ingressos disponíveis
                      </div>
                    )}
                    <Button
                      onClick={handleBuyTicket}
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Comprar Ingresso Agora
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Checkout via Stripe/Mercado Pago - Ambiente de Teste
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Formulário de lead ou botão de interesse */}
            {!showLeadForm ? (
              <div className="space-y-3">
                <Button
                  onClick={() => setShowLeadForm(true)}
                  variant="outline"
                  className="w-full border-red-200 text-red-700 hover:bg-red-50 py-3 font-semibold"
                >
                  {getCTAText()}
                </Button>
                {event.price === 0 && (
                  <p className="text-sm text-center text-gray-600">
                    Evento gratuito! Demonstre seu interesse para receber mais informações.
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-4">Demonstrar Interesse</h4>
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        value={leadData.name}
                        onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="border-red-200 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={leadData.email}
                        onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="border-red-200 focus:border-red-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                    <Input
                      id="phone"
                      value={leadData.phone}
                      onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                      className="border-red-200 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mensagem (opcional)</Label>
                    <Textarea
                      id="message"
                      value={leadData.message}
                      onChange={(e) => setLeadData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Conte-nos mais sobre seu interesse..."
                      rows={3}
                      className="border-red-200 focus:border-red-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Interesse'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowLeadForm(false)}
                      className="border-gray-300"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Links adicionais */}
            {event.ticketLink && (
              <div className="text-center">
                <a
                  href={event.ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 text-sm underline"
                >
                  Link alternativo para inscrição
                </a>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
