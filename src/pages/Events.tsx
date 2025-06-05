
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Clock, Users, Star, ArrowRight, Check, Phone, Mail, User, Building, CalendarDays, Zap, Heart, Trophy, Sparkles, Camera, Music, Coffee } from "lucide-react";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getEventService } from "@/services/serviceFactory";
import { IEvent } from "@/services/interfaces/IEventService";
import { toast } from "@/hooks/use-toast";

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [customEventForm, setCustomEventForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    estimatedDate: '',
    description: ''
  });
  const [eventLeadForm, setEventLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const eventService = getEventService();

  const { data: allEvents, loading } = useDataQuery<IEvent[]>(
    () => eventService.fetchEvents(),
    []
  );

  // Filtrar eventos públicos e ativos, ordenados por data
  const publicEvents = (allEvents || [])
    .filter(event => event.isPublic && event.status === 'active')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const handleEventDetails = (event: IEvent) => {
    setSelectedEvent(event);
    // Scroll suave para a seção de detalhes
    setTimeout(() => {
      const detailsSection = document.getElementById('event-details');
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCustomEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio
    console.log('Custom event form submitted:', customEventForm);
    toast({
      title: "Solicitação Enviada!",
      description: "Entraremos em contato em breve com uma proposta personalizada.",
    });
    setCustomEventForm({
      name: '',
      email: '',
      phone: '',
      eventType: '',
      estimatedDate: '',
      description: ''
    });
  };

  const handleEventLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    
    try {
      await eventService.createEventLead({
        eventId: selectedEvent.id,
        name: eventLeadForm.name,
        email: eventLeadForm.email,
        phone: eventLeadForm.phone,
        message: eventLeadForm.message
      });
      
      toast({
        title: "Interesse Registrado!",
        description: "Você receberá todas as atualizações sobre este evento.",
      });
      
      setEventLeadForm({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar interesse. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleTicketPurchase = () => {
    if (!selectedEvent?.ticketProduct?.productId) return;
    
    // Simular redirecionamento para checkout com produto pré-selecionado
    toast({
      title: "Redirecionando...",
      description: "Você será redirecionado para o checkout.",
    });
    
    // Em um cenário real, aqui seria feito o redirecionamento para /checkout
    // com o produto do ingresso adicionado ao carrinho
    console.log('Redirecting to checkout with product:', selectedEvent.ticketProduct.productId);
  };

  const formatEventDate = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    const formattedDate = date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${formattedDate}, às ${timeStr}`;
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-900 via-red-800 to-black text-white py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
            Eventos 99Tattoo
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
            Experiências únicas de tatuagem que conectam arte, cultura e comunidade
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>Eventos Exclusivos</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Users className="h-5 w-5 text-red-300" />
              <span>Artistas Renomados</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Calendar className="h-5 w-5 text-blue-300" />
              <span>Datas Especiais</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção: A Essência da Tatuagem em Eventos */}
      <div className="py-16 bg-gradient-to-br from-white to-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
              Transforme Seu Evento Com a Arte da Tatuagem: Uma Experiência Inesquecível!
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Descubra como a 99Tattoo pode elevar seu evento comum para uma experiência extraordinária que seus convidados nunca esquecerão
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Eventos Comuns */}
            <Card className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <Coffee className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-700">Eventos Comuns</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Atrações genéricas e previsíveis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Pouco engajamento dos participantes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Memórias que se desvanecem rapidamente</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Falta de diferencial competitivo</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Eventos com Tatuagens 99Tattoo */}
            <Card className="p-8 bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Eventos com Tatuagens 99Tattoo
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Experiência imersiva e única</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Memórias duradouras na pele</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Diferencial que gera buzz</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Engajamento profundo e autêntico</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Próximos Eventos Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
              Junte-se a Nós! Próximos Eventos 99Tattoo Perto de Você
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra nossos próximos eventos e seja parte de experiências únicas no mundo da tatuagem
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : publicEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-red-50 border-2 border-red-100 hover:border-red-300 transform hover:-translate-y-2 group"
                >
                  <div className="relative h-64 overflow-hidden">
                    {event.featuredImage ? (
                      <img
                        src={event.featuredImage}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                        <Calendar className="h-16 w-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-semibold shadow-lg">
                        {event.eventType === 'flash_day' ? 'Flash Day' :
                         event.eventType === 'workshop' ? 'Workshop' :
                         event.eventType === 'collection_launch' ? 'Lançamento' :
                         event.eventType === 'exhibition' ? 'Exposição' : 'Evento'}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      {event.price && event.price > 0 ? (
                        <Badge className="bg-green-600 text-white px-3 py-1 text-sm font-semibold shadow-lg">
                          R$ {event.price.toFixed(2)}
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-600 text-white px-3 py-1 text-sm font-semibold shadow-lg">
                          Gratuito
                        </Badge>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {event.name}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="h-4 w-4 text-red-600" />
                        <span>{formatEventDate(event.startDate, event.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span>{event.location}</span>
                      </div>
                      {event.participatingArtists && event.participatingArtists.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="h-4 w-4 text-red-600" />
                          <span className="line-clamp-1">
                            {event.participatingArtists.slice(0, 2).join(', ')}
                            {event.participatingArtists.length > 2 && ` +${event.participatingArtists.length - 2}`}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {truncateText(event.description)}
                    </p>

                    <Button
                      onClick={() => handleEventDetails(event)}
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <span>Ver Mais Detalhes</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Calendar className="h-24 w-24 mx-auto mb-6 text-red-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Nenhum evento futuro encontrado no momento
                </h3>
                <p className="text-gray-600 mb-6">
                  Fique de olho em nossas redes sociais para novidades! Ou que tal trazer a 99Tattoo para o seu evento?
                </p>
                <Button
                  onClick={() => {
                    const contactSection = document.getElementById('custom-events-form');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Solicitar Evento Customizado
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Section */}
      {selectedEvent && (
        <div id="event-details" className="py-16 bg-gradient-to-br from-red-50 to-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <div className="relative h-80 overflow-hidden">
                {selectedEvent.featuredImage ? (
                  <img
                    src={selectedEvent.featuredImage}
                    alt={selectedEvent.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                    <Calendar className="h-32 w-32 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{selectedEvent.name}</h1>
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-red-600 text-white px-3 py-1">
                      {selectedEvent.eventType === 'flash_day' ? 'Flash Day' :
                       selectedEvent.eventType === 'workshop' ? 'Workshop' :
                       selectedEvent.eventType === 'collection_launch' ? 'Lançamento' :
                       selectedEvent.eventType === 'exhibition' ? 'Exposição' : 'Evento'}
                    </Badge>
                    {selectedEvent.price && selectedEvent.price > 0 ? (
                      <Badge className="bg-green-600 text-white px-3 py-1">
                        R$ {selectedEvent.price.toFixed(2)}
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-600 text-white px-3 py-1">
                        Gratuito
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Detalhes do Evento</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {selectedEvent.detailedDescription || selectedEvent.description}
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-red-600" />
                        <div>
                          <div className="font-semibold text-gray-900">Data e Horário</div>
                          <div className="text-gray-700">
                            {formatEventDate(selectedEvent.startDate, selectedEvent.startTime)}
                            {selectedEvent.endTime && selectedEvent.endTime !== selectedEvent.startTime && 
                              ` até ${selectedEvent.endTime}`
                            }
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-red-600" />
                        <div>
                          <div className="font-semibold text-gray-900">Local</div>
                          <div className="text-gray-700">{selectedEvent.location}</div>
                          {selectedEvent.fullAddress && (
                            <div className="text-sm text-gray-600">{selectedEvent.fullAddress}</div>
                          )}
                        </div>
                      </div>

                      {selectedEvent.participatingArtists && selectedEvent.participatingArtists.length > 0 && (
                        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                          <Users className="h-5 w-5 text-red-600 mt-1" />
                          <div>
                            <div className="font-semibold text-gray-900">Tatuadores Participantes</div>
                            <div className="text-gray-700">
                              {selectedEvent.participatingArtists.join(', ')}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Participação</h2>
                    
                    {selectedEvent.price && selectedEvent.price > 0 && selectedEvent.ticketProduct?.isEnabled ? (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 mb-6">
                        <h3 className="text-lg font-bold text-green-800 mb-2">Ingressos Disponíveis</h3>
                        <p className="text-green-700 mb-4">
                          Garante sua vaga neste evento exclusivo!
                        </p>
                        <div className="text-2xl font-bold text-green-800 mb-4">
                          R$ {selectedEvent.price.toFixed(2)}
                        </div>
                        <Button
                          onClick={handleTicketPurchase}
                          className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Comprar Ingresso Agora
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-bold text-blue-800 mb-2">Registre seu Interesse</h3>
                        <p className="text-blue-700 mb-4">
                          Este evento é gratuito! Registre seu interesse para receber todas as atualizações.
                        </p>
                        
                        <form onSubmit={handleEventLeadSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Input
                                placeholder="Seu nome"
                                value={eventLeadForm.name}
                                onChange={(e) => setEventLeadForm({...eventLeadForm, name: e.target.value})}
                                required
                                className="border-blue-200 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <Input
                                type="email"
                                placeholder="Seu e-mail"
                                value={eventLeadForm.email}
                                onChange={(e) => setEventLeadForm({...eventLeadForm, email: e.target.value})}
                                required
                                className="border-blue-200 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <Input
                            placeholder="Telefone (opcional)"
                            value={eventLeadForm.phone}
                            onChange={(e) => setEventLeadForm({...eventLeadForm, phone: e.target.value})}
                            className="border-blue-200 focus:border-blue-500"
                          />
                          <Textarea
                            placeholder="Mensagem (opcional)"
                            value={eventLeadForm.message}
                            onChange={(e) => setEventLeadForm({...eventLeadForm, message: e.target.value})}
                            className="border-blue-200 focus:border-blue-500"
                            rows={3}
                          />
                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Quero Ser Notificado!
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Seção: Leve a 99Tattoo para o Seu Evento */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
              Seu Evento, Sua Arte: A 99Tattoo Cria Experiências Exclusivas para Você
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Oferecemos consultoria especializada para transformar seu evento em uma experiência única e inesquecível
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Corporativos */}
            <Card className="p-8 bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-blue-800">Eventos Corporativos</h3>
                <p className="text-gray-600 mb-4">
                  Team buildings, lançamentos de produto e convenções empresariais com experiências de tatuagem personalizadas.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Branding personalizado</li>
                  <li>• Experiências exclusivas</li>
                  <li>• Engajamento de equipe</li>
                </ul>
              </div>
            </Card>

            {/* Festas e Casamentos */}
            <Card className="p-8 bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-pink-600 to-pink-800 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-pink-800">Festas e Casamentos</h3>
                <p className="text-gray-600 mb-4">
                  Celebrações especiais com tatuagens temáticas que eternizam momentos únicos na vida dos seus convidados.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Designs personalizados</li>
                  <li>• Memórias duradouras</li>
                  <li>• Experiência romântica</li>
                </ul>
              </div>
            </Card>

            {/* Festivais e Convenções */}
            <Card className="p-8 bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-lg">
                  <Music className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-purple-800">Festivais e Convenções</h3>
                <p className="text-gray-600 mb-4">
                  Participação em grandes eventos culturais com estações de tatuagem que atraem multidões e geram buzz.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Alcance massivo</li>
                  <li>• Experiência cultural</li>
                  <li>• Marketing viral</li>
                </ul>
              </div>
            </Card>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-6 text-gray-900">Nossos Benefícios Exclusivos</h3>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Consultoria Especializada</h4>
                <p className="text-sm text-gray-600">Planejamento completo do seu evento</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Artistas Selecionados</h4>
                <p className="text-sm text-gray-600">Profissionais experientes e qualificados</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Logística Completa</h4>
                <p className="text-sm text-gray-600">Cuidamos de todos os detalhes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Marketing Integrado</h4>
                <p className="text-sm text-gray-600">Divulgação e promoção do evento</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Events Form Section */}
      <div id="custom-events-form" className="py-16 bg-gradient-to-br from-black to-red-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
              Transforme Seu Evento. Fale Conosco!
            </h2>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Quer levar a experiência 99Tattoo para o seu evento? Criamos experiências personalizadas e inesquecíveis.
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-red-300 shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleCustomEventSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-red-100">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-300" />
                      <Input
                        placeholder="Seu nome completo"
                        value={customEventForm.name}
                        onChange={(e) => setCustomEventForm({...customEventForm, name: e.target.value})}
                        required
                        className="pl-10 bg-white/20 border-red-300 text-white placeholder-red-200 focus:border-red-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-red-100">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-300" />
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={customEventForm.email}
                        onChange={(e) => setCustomEventForm({...customEventForm, email: e.target.value})}
                        required
                        className="pl-10 bg-white/20 border-red-300 text-white placeholder-red-200 focus:border-red-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-red-100">Telefone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-300" />
                      <Input
                        placeholder="(11) 99999-9999"
                        value={customEventForm.phone}
                        onChange={(e) => setCustomEventForm({...customEventForm, phone: e.target.value})}
                        className="pl-10 bg-white/20 border-red-300 text-white placeholder-red-200 focus:border-red-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-red-100">Data Estimada</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-300" />
                      <Input
                        type="date"
                        value={customEventForm.estimatedDate}
                        onChange={(e) => setCustomEventForm({...customEventForm, estimatedDate: e.target.value})}
                        className="pl-10 bg-white/20 border-red-300 text-white focus:border-red-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-red-100">Tipo de Evento</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-300 z-10" />
                    <Select value={customEventForm.eventType} onValueChange={(value) => setCustomEventForm({...customEventForm, eventType: value})}>
                      <SelectTrigger className="pl-10 bg-white/20 border-red-300 text-white focus:border-red-400">
                        <SelectValue placeholder="Selecione o tipo de evento" />
                      </SelectTrigger>
                      <SelectContent className="bg-red-950 border-red-700 text-white">
                        <SelectItem value="flash_day">Flash Day</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="convention">Convenção</SelectItem>
                        <SelectItem value="corporate">Evento Corporativo</SelectItem>
                        <SelectItem value="private">Evento Privado</SelectItem>
                        <SelectItem value="festival">Festival</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-red-100">Descrição do Evento</label>
                  <Textarea
                    placeholder="Conte-nos mais sobre seu evento, público esperado, local, etc..."
                    value={customEventForm.description}
                    onChange={(e) => setCustomEventForm({...customEventForm, description: e.target.value})}
                    rows={4}
                    className="bg-white/20 border-red-300 text-white placeholder-red-200 focus:border-red-400"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-lg font-semibold"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Receber Proposta Personalizada
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Events;
