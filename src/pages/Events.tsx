import React, { useState } from 'react';
import { useDataQuery } from '@/hooks/useDataQuery';
import { getEventService } from '@/services/serviceFactory';
import { IEvent } from '@/services/interfaces/IEventService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ShoppingCart, 
  Star, 
  Zap, 
  Heart, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Award, 
  Coffee,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  Check,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import EventModal from '@/components/events/EventModal';
import EventB2BForm from '@/components/events/EventB2BForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [showB2BForm, setShowB2BForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [customEventFormData, setCustomEventFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    estimatedDate: '',
    description: ''
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
  const [leadFormSubmitted, setLeadFormSubmitted] = useState(false);
  const [customFormSubmitted, setCustomFormSubmitted] = useState(false);
  
  const eventService = getEventService();

  const { data: eventsData = [], loading } = useDataQuery<IEvent[]>(
    () => eventService.fetchPublicEvents(),
    []
  );

  // Ensure events is always an array and filter for active, future, public events
  const events = Array.isArray(eventsData) ? eventsData : [];

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

  const isEventUpcoming = (event: IEvent) => {
    const eventDate = new Date(event.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today && event.status === 'active' && event.isPublic;
  };

  const filteredEvents = events
    .filter(isEventUpcoming)
    .filter(event => activeTab === 'all' || event.eventType === activeTab);

  const upcomingEvents = filteredEvents.slice(0, 6);

  const scrollToEventDetails = (event: IEvent) => {
    setSelectedEvent(event);
    const element = document.getElementById('event-details');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContactForm = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBuyTicket = () => {
    if (!selectedEvent) return;
    
    toast({
      title: "Redirecionando para o checkout",
      description: "Preparando seu ingresso para o evento. Aguarde um momento.",
    });
    
    console.log('Redirecionando para checkout com produto:', selectedEvent.ticketProduct);
    
    setTimeout(() => {
      toast({
        title: "Checkout pronto!",
        description: "Você será redirecionado para finalizar sua compra."
      });
    }, 1500);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !leadFormData.name.trim() || !leadFormData.email.trim()) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingLead(true);
    try {
      await eventService.createEventLead({
        eventId: selectedEvent.id,
        name: leadFormData.name,
        email: leadFormData.email,
        phone: leadFormData.phone,
        message: leadFormData.message
      });

      toast({
        title: "Sucesso!",
        description: "Sua inscrição foi realizada com sucesso! Entraremos em contato em breve.",
      });

      setLeadFormData({ name: '', email: '', phone: '', message: '' });
      setLeadFormSubmitted(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar inscrição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleCustomEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEventFormData.name.trim() || !customEventFormData.email.trim()) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingCustom(true);
    try {
      // Simular envio dos dados para o serviço de clientes
      console.log('Enviando dados do formulário de evento customizado:', customEventFormData);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Proposta solicitada com sucesso!",
        description: "Recebemos sua solicitação. Nossa equipe entrará em contato em até 24 horas.",
      });

      setCustomEventFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        estimatedDate: '',
        description: ''
      });
      setCustomFormSubmitted(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingCustom(false);
    }
  };

  const getCTAText = () => {
    if (!selectedEvent) return 'Tenho Interesse!';
    switch (selectedEvent.eventType) {
      case 'flash_day': return 'Quero Participar!';
      case 'workshop': return 'Inscrever-me!';
      case 'exhibition': return 'Receber Lembrete!';
      default: return 'Tenho Interesse!';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-red-900 to-black">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552627019-947c3789ffb5?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-red-900/50 to-black/80"></div>
          
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-red-400 to-white bg-clip-text text-transparent leading-tight">
              99Tattoo em Seu Evento: Transforme Momentos em Obras de Arte Vivas
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold mb-8 text-white">
              Onde Experiência e Arte Se Encontram
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Leve a autenticidade e a energia da tatuagem para seu corporativo, festa, casamento, 
              festival ou convenção. <span className="text-red-400 font-semibold">Crie experiências que ficam marcadas na pele e na memória.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={() => {
                  const element = document.getElementById('upcoming-events');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-4 px-8 text-lg shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Calendar className="h-6 w-6 mr-3" />
                Conheça Nossos Próximos Eventos
              </Button>
              
              <Button
                onClick={scrollToContactForm}
                variant="outline"
                className="border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold py-4 px-8 text-lg shadow-2xl backdrop-blur-sm bg-black/30 transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Target className="h-6 w-6 mr-3" />
                Quero Tatuagens Marcantes no Meu Evento!
              </Button>
            </div>
          </div>
        </section>

        {/* Differentiation Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                Transforme Seu Evento Com a Arte da Tatuagem: Uma Experiência Inesquecível!
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                A tatuagem vai além de uma atração comum - é uma experiência pessoal, um registro 
                de um momento especial e um diferencial que transforma seu evento em algo memorável.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-300 mb-6 text-center">Eventos Comuns</h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6" />
                    </div>
                    <span>Filas intermináveis e espera demorada</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6" />
                    </div>
                    <span>Designs genéricos e sem personalidade</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6" />
                    </div>
                    <span>Sensação de que falta algo na experiência</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <Coffee className="h-6 w-6" />
                    </div>
                    <span>Atrações repetitivas e sem inovação</span>
                  </div>
                </div>
                <p className="text-center text-gray-500 mt-8 italic">
                  "Mais do mesmo, sem inspiração... Eventos que são esquecidos no dia seguinte."
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-900 via-red-800 to-black p-8 rounded-2xl border-2 border-red-500 shadow-2xl shadow-red-500/25 transform hover:-translate-y-2 transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Eventos com a 99Tattoo</h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <Zap className="h-6 w-6" />
                    </div>
                    <span>Experiência imersiva e interativa com os convidados</span>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="h-6 w-6" />
                    </div>
                    <span>Designs que contam histórias únicas e personalizadas</span>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <span>Artistas selecionados e ambiente premium diferenciado</span>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <Award className="h-6 w-6" />
                    </div>
                    <span>Memórias tangíveis que duram para a vida toda</span>
                  </div>
                </div>
                <p className="text-center text-red-200 mt-8 font-semibold text-lg">
                  "Criamos arte que conecta, em eventos que surpreendem e deixam marcas eternas."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section id="upcoming-events" className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                Junte-se a Nós! Próximos Eventos 99Tattoo Perto de Você
              </h2>
              <p className="text-xl text-gray-300">
                Participe dos nossos próximos eventos e vivencie uma experiência única com a arte da tatuagem.
              </p>
            </div>

            {/* Event Type Tabs */}
            <div className="mb-10 flex justify-center">
              <Tabs 
                defaultValue="all" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full max-w-2xl"
              >
                <TabsList className="bg-gray-800 border border-gray-700 w-full grid grid-cols-3 md:grid-cols-5">
                  <TabsTrigger 
                    value="all"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-800 data-[state=active]:to-red-900 data-[state=active]:text-white"
                  >
                    Todos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="flash_day"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-800 data-[state=active]:to-red-900 data-[state=active]:text-white"
                  >
                    Flash Day
                  </TabsTrigger>
                  <TabsTrigger 
                    value="workshop"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-800 data-[state=active]:to-red-900 data-[state=active]:text-white"
                  >
                    Workshops
                  </TabsTrigger>
                  <TabsTrigger 
                    value="exhibition"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-800 data-[state=active]:to-red-900 data-[state=active]:text-white"
                  >
                    Exposições
                  </TabsTrigger>
                  <TabsTrigger 
                    value="collection_launch"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-800 data-[state=active]:to-red-900 data-[state=active]:text-white"
                  >
                    Lançamentos
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-700">
                    <div className="h-64 bg-gray-700"></div>
                    <div className="p-6">
                      <div className="h-5 bg-gray-700 rounded mb-3"></div>
                      <div className="h-4 bg-gray-700 rounded mb-4 w-2/3"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                      </div>
                      <div className="h-10 bg-gray-700 rounded mt-6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-500 border border-gray-700 hover:border-red-500 transform hover:-translate-y-2">
                    <div className="relative h-64 overflow-hidden">
                      {event.featuredImage ? (
                        <img
                          src={event.featuredImage}
                          alt={event.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                          <Calendar className="h-16 w-16 text-white opacity-60" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-none shadow-lg">
                          {getEventTypeLabel(event.eventType)}
                        </Badge>
                        {event.price && event.price > 0 && (
                          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none shadow-lg">
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            R$ {event.price.toFixed(2)}
                          </Badge>
                        )}
                        {event.price === 0 && (
                          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-lg">
                            Gratuito
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                        {event.name}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Calendar className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span>
                            {new Date(event.startDate).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'long',
                              year: 'numeric',
                              weekday: 'long'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Clock className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span>{event.startTime} às {event.endTime}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        
                        {event.participatingArtists && event.participatingArtists.length > 0 && (
                          <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Users className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <span>{event.participatingArtists.length} artista(s) participando</span>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => scrollToEventDetails(event)}
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Ver Mais Detalhes
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-fade-in">
                <Calendar className="h-24 w-24 mx-auto mb-6 text-red-500 opacity-60" />
                <h3 className="text-2xl font-bold text-white mb-4">Novos eventos em breve!</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-8">
                  Estamos preparando eventos incríveis para você. Enquanto isso, que tal trazer a 99Tattoo para o seu evento?
                </p>
                <Button
                  onClick={scrollToContactForm}
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 px-8 shadow-lg"
                >
                  <Target className="h-5 w-5 mr-2" />
                  Quero a 99Tattoo no Meu Evento!
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Event Details Section */}
        {selectedEvent && (
          <section id="event-details" className="py-20 bg-gradient-to-b from-black to-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-red-500/30 shadow-2xl overflow-hidden">
                {/* Event Header */}
                <div className="relative h-72 overflow-hidden">
                  {selectedEvent.featuredImage ? (
                    <img
                      src={selectedEvent.featuredImage}
                      alt={selectedEvent.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                      <Calendar className="h-20 w-20 text-white opacity-60" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                    <div className="flex gap-2 mb-4">
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-none shadow-lg">
                        {getEventTypeLabel(selectedEvent.eventType)}
                      </Badge>
                      {selectedEvent.isPublic && (
                        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none shadow-lg">
                          Aberto ao Público
                        </Badge>
                      )}
                      {selectedEvent.ticketProduct?.isEnabled && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-lg">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Venda de Ingressos
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-4xl font-bold text-white shadow-text mb-3">
                      {selectedEvent.name}
                    </h2>
                    <p className="text-lg text-gray-200">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Event Details - Left column */}
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Sobre o Evento</h3>
                        <div className="text-gray-300 leading-relaxed space-y-3 text-base">
                          <p>{selectedEvent.detailedDescription || selectedEvent.description}</p>
                        </div>
                      </div>
                      
                      {selectedEvent.participatingArtists && selectedEvent.participatingArtists.length > 0 && (
                        <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl border border-red-500/30">
                          <h4 className="font-bold text-xl text-white mb-4">Tatuadores Participantes</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selectedEvent.participatingArtists.map((artist, index) => (
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
                      
                      {selectedEvent.ticketLink && (
                        <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl border border-red-500/30">
                          <h4 className="font-bold text-white mb-3">Links Adicionais</h4>
                          <a 
                            href={selectedEvent.ticketLink} 
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
                    
                    {/* Event metadata and actions - Right column */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl border border-red-500/30 shadow-xl">
                        <h4 className="font-bold text-white mb-4 pb-3 border-b border-red-500/30">
                          Informações do Evento
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 text-gray-300">
                            <Calendar className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                            <div>
                              <div className="font-semibold text-white">Data</div>
                              <div className="text-sm">
                                {new Date(selectedEvent.startDate).toLocaleDateString('pt-BR', { 
                                  day: '2-digit', 
                                  month: 'long',
                                  year: 'numeric',
                                  weekday: 'long'
                                })}
                                {selectedEvent.endDate !== selectedEvent.startDate && (
                                  <> até {new Date(selectedEvent.endDate).toLocaleDateString('pt-BR', { 
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
                              <div className="text-sm">{selectedEvent.startTime} às {selectedEvent.endTime}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 text-gray-300">
                            <MapPin className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                            <div>
                              <div className="font-semibold text-white">Local</div>
                              <div className="text-sm">{selectedEvent.location}</div>
                              {selectedEvent.fullAddress && (
                                <div className="text-xs text-gray-400 mt-1">{selectedEvent.fullAddress}</div>
                              )}
                            </div>
                          </div>
                          
                          {selectedEvent.price !== undefined && (
                            <div className="flex items-start gap-3 text-gray-300">
                              <CreditCard className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                              <div>
                                <div className="font-semibold text-white">Investimento</div>
                                <div className="text-sm font-bold text-red-400">
                                  {selectedEvent.price > 0 
                                    ? `R$ ${selectedEvent.price.toFixed(2)}` 
                                    : 'Gratuito'}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Section */}
                      {leadFormSubmitted ? (
                        <div className="bg-gradient-to-br from-green-800/30 to-green-900/30 border border-green-500/50 rounded-xl p-6 text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">Interesse Registrado!</h3>
                          <p className="text-gray-300 text-sm">
                            Obrigado! Entraremos em contato com mais detalhes sobre o evento.
                          </p>
                        </div>
                      ) : selectedEvent.price === 0 || !selectedEvent.ticketProduct?.isEnabled ? (
                        <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl border border-red-500/30">
                          <h4 className="text-white font-bold mb-4 text-center">
                            {selectedEvent.price === 0 ? 'Evento Gratuito!' : 'Demonstre seu interesse'}
                          </h4>
                          
                          <form onSubmit={handleLeadSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="font-medium text-white">Nome Completo *</Label>
                              <Input
                                id="name"
                                value={leadFormData.name}
                                onChange={(e) => setLeadFormData(prev => ({ ...prev, name: e.target.value }))}
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
                                value={leadFormData.email}
                                onChange={(e) => setLeadFormData(prev => ({ ...prev, email: e.target.value }))}
                                required
                                className="bg-gray-800 border-red-500/50 focus:border-red-500 text-white placeholder-gray-400"
                                placeholder="seu@email.com"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="font-medium text-white">Telefone</Label>
                              <Input
                                id="phone"
                                value={leadFormData.phone}
                                onChange={(e) => setLeadFormData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="(11) 99999-9999"
                                className="bg-gray-800 border-red-500/50 focus:border-red-500 text-white placeholder-gray-400"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="message" className="font-medium text-white">Mensagem</Label>
                              <Textarea
                                id="message"
                                value={leadFormData.message}
                                onChange={(e) => setLeadFormData(prev => ({ ...prev, message: e.target.value }))}
                                placeholder="Perguntas ou comentários..."
                                rows={3}
                                className="bg-gray-800 border-red-500/50 focus:border-red-500 text-white placeholder-gray-400 resize-none"
                              />
                            </div>

                            <Button
                              type="submit"
                              disabled={isSubmittingLead}
                              className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg font-semibold py-3"
                            >
                              {isSubmittingLead ? 'Enviando...' : getCTAText()}
                            </Button>
                          </form>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl border border-red-500/30 text-center">
                          <h4 className="text-xl font-bold text-white mb-4">
                            Evento com Inscrição Paga
                          </h4>
                          
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-semibold text-white">Investimento:</span>
                            <span className="text-2xl font-bold text-red-400">
                              R$ {selectedEvent.price.toFixed(2)}
                            </span>
                          </div>
                          
                          {selectedEvent.ticketProduct?.ticketStock > 0 && (
                            <div className="text-sm text-gray-400 mb-6">
                              {selectedEvent.ticketProduct.ticketStock} ingressos disponíveis
                            </div>
                          )}
                          
                          <Button
                            onClick={handleBuyTicket}
                            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Comprar Ingresso Agora
                          </Button>
                          <p className="text-xs text-gray-500 text-center mt-3">
                            Checkout seguro via plataforma integrada
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* B2B Section */}
        <section className="py-20 bg-gradient-to-b from-black to-red-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                Seu Evento, Sua Arte: A 99Tattoo Cria Experiências Exclusivas para Você
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                Oferecemos projetos de tatuagem personalizados para eventos corporativos, festas, casamentos, 
                festivais e convenções. Cada evento é único, e nossa arte também.
              </p>
            </div>

            {/* Segments */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-red-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-500/25 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">Eventos Corporativos</h3>
                <p className="text-gray-300 text-center leading-relaxed mb-4">
                  <span className="text-red-400 font-semibold">Branding na Pele:</span> Tatuagens personalizadas para sua marca e colaboradores.
                </p>
                <ul className="text-gray-400 space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Ativação de marca exclusiva</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Flash tattoos com sua identidade visual</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Experiência compartilhável nas redes sociais</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-red-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-500/25 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">Festas e Casamentos</h3>
                <p className="text-gray-300 text-center leading-relaxed mb-4">
                  <span className="text-red-400 font-semibold">Celebre Marcando:</span> Uma lembrança artística e exclusiva para seus convidados.
                </p>
                <ul className="text-gray-400 space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Designs personalizados para a ocasião</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Artistas especializados em minitatuagens</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Cabine fotográfica para registrar o momento</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-red-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-500/25 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">Festivais e Convenções</h3>
                <p className="text-gray-300 text-center leading-relaxed mb-4">
                  <span className="text-red-400 font-semibold">Engajamento Artístico:</span> Atração única que conecta e entretém seu público.
                </p>
                <ul className="text-gray-400 space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Estações múltiplas para atender grandes públicos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Integração com programação do evento</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span>Experiência completa de tattoo studio</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Benefícios Chave */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-red-500/30 text-center">
                <Sparkles className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-white text-sm">Consultoria especializada desde a concepção</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-red-500/30 text-center">
                <Users className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-white text-sm">Artistas selecionados para cada tema</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-red-500/30 text-center">
                <CheckCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-white text-sm">Logística e infraestrutura completa</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-red-500/30 text-center">
                <Target className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-white text-sm">Marketing e divulgação personalizada</p>
              </div>
            </div>
          </div>
        </section>

        {/* Depoimentos Section */}
        <section className="py-20 bg-gradient-to-b from-red-900 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                O Que Nossos Clientes Dizem
              </h2>
              <p className="text-xl text-gray-300">
                Histórias reais de quem transformou seus eventos com a 99Tattoo.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-red-500/30 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-xl font-bold">
                    MF
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Marina Ferreira</h4>
                    <p className="text-gray-400 text-sm">Festa de Lançamento - Revista Digital</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">
                  "Contratar a 99Tattoo para nosso evento de lançamento foi a melhor decisão. Os convidados adoraram a experiência, as redes sociais bombaram com as fotos, e nossa marca ficou literalmente marcada na pele dos participantes!"
                </p>
                <div className="mt-4 flex">
                  <Star className="h-5 w-5 text-red-500" />
                  <Star className="h-5 w-5 text-red-500" />
                  <Star className="h-5 w-5 text-red-500" />
                  <Star className="h-5 w-5 text-red-500" />
                  <Star className="h-5 w-5 text-red-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-red-500/30 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-xl font-bold">
                    RC
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Rafael Costa</h4>
                    <p className="text-gray-400 text-sm">Festival de Música - Organização</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">
                  "Tivemos filas enormes no estande da 99Tattoo durante todo o festival. A equipe foi extremamente profissional e os designs exclusivos para o evento foram um sucesso absoluto entre os participantes!"
                </p>
                <div className="mt-4 flex">
                  <Star className="h-5 w-5 text-red-500" />
                  <Star className="h-5 w-5 text-red-500" />
                  <Star className="h-5 w-5 text-red-500" />
                  <Star className="h-5 w-5 text-red-500" />
                  <Star className="h-5 w-5 text-red-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-red-500/30 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-xl font-bold">
                    LP
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Luiza Pereira</h4>
                    <p className="text-gray-400 text-sm">Casamento Temático</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">
                  "Nosso casamento tinha um tema muito especial para nós, e a 99Tattoo conseguiu traduzir isso em pequenas obras de arte para nossos convidados. Foi personalizado, elegante e muito mais memorável que qualquer lembrancinha tradicional."
                </p>
                <div className="mt-4 flex">
                  <Star className="h-5 w-5 text-red-500" />
                  <Star className="h-5 w-5 text-red-500" />
                  <Star className="h-5 w-5 text-red-500" />
                  <Star className="h-5 w-5 text-red-500" />
                  <Star className="h-5 w-5 text-red-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="py-20 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                Transforme Seu Evento. Fale Conosco!
              </h2>
              <p className="text-xl text-gray-300">
                Conte-nos sobre sua ideia e receba uma proposta personalizada para levar a arte da 99Tattoo ao seu evento.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-red-500/30 shadow-2xl">
              {customFormSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Proposta Solicitada com Sucesso!</h3>
                  <p className="text-gray-300 text-lg mb-8">
                    Recebemos sua solicitação. Nossa equipe entrará em contato em até 24 horas com uma proposta personalizada para seu evento.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => setCustomFormSubmitted(false)}
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      Fazer Nova Solicitação
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCustomEventSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="custom-name" className="font-medium text-white">Nome Completo *</Label>
                      <Input
                        id="custom-name"
                        value={customEventFormData.name}
                        onChange={(e) => setCustomEventFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="bg-gray-800 border-red-500/50 focus:border-red-500 text-white placeholder-gray-400"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-email" className="font-medium text-white">Email *</Label>
                      <Input
                        id="custom-email"
                        type="email"
                        value={customEventFormData.email}
                        onChange={(e) => setCustomEventFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="bg-gray-800 border-red-500/50 focus:border-red-500 text-white placeholder-gray-400"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="custom-phone" className="font-medium text-white">Telefone</Label>
                      <Input
                        id="custom-phone"
                        value={customEventFormData.phone}
                        onChange={(e) => setCustomEventFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                        className="bg-gray-800 border-red-500/50 focus:border-red-500 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-event-type" className="font-medium text-white">Tipo de Evento</Label>
                      <select
                        id="custom-event-type"
                        value={customEventFormData.eventType}
                        onChange={(e) => setCustomEventFormData(prev => ({ ...prev, eventType: e.target.value }))}
                        className="w-full bg-gray-800 border border-red-500/50 focus:border-red-500 text-white rounded-md px-3 py-2"
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="corporativo">Corporativo</option>
                        <option value="festa-casamento">Festa/Casamento</option>
                        <option value="festival-convencao">Festival/Convenção</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-estimated-date" className="font-medium text-white">Data Estimada do Evento</Label>
                    <Input
                      id="custom-estimated-date"
                      type="date"
                      value={customEventFormData.estimatedDate}
                      onChange={(e) => setCustomEventFormData(prev => ({ ...prev, estimatedDate: e.target.value }))}
                      className="bg-gray-800 border-red-500/50 focus:border-red-500 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-description" className="font-medium text-white">Descrição do Evento / Ideia *</Label>
                    <Textarea
                      id="custom-description"
                      value={customEventFormData.description}
                      onChange={(e) => setCustomEventFormData(prev => ({ ...prev, description: e.target.value }))}
                      required
                      placeholder="Conte-nos sobre seu evento, número estimado de participantes, expectativas, localização, orçamento aproximado, e qualquer ideia específica que tenha em mente..."
                      rows={5}
                      className="bg-gray-800 border-red-500/50 focus:border-red-500 text-white placeholder-gray-400 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmittingCustom}
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-4 text-lg shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmittingCustom ? 'Enviando...' : 'Receber Proposta Personalizada'}
                    <Target className="h-5 w-5 ml-2" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <EventB2BForm
        isOpen={showB2BForm}
        onClose={() => setShowB2BForm(false)}
      />
    </Layout>
  );
};

export default Events;
