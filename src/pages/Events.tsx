
import React, { useState } from 'react';
import { useDataQuery } from '@/hooks/useDataQuery';
import { getEventService } from '@/services/serviceFactory';
import { IEvent } from '@/services/interfaces/IEventService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, ShoppingCart, Star, Zap, Heart, Target, CheckCircle, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import EventModal from '@/components/events/EventModal';
import EventB2BForm from '@/components/events/EventB2BForm';

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [showB2BForm, setShowB2BForm] = useState(false);
  const eventService = getEventService();

  const { data: eventsData = [], loading } = useDataQuery<IEvent[]>(
    () => eventService.fetchPublicEvents(),
    []
  );

  // Ensure events is always an array
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
    return eventDate >= today;
  };

  const upcomingEvents = events.filter(isEventUpcoming).slice(0, 6);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-red-900 to-black">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552627019-947c3789ffb5?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-red-900/50 to-black/80"></div>
          
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-red-400 to-white bg-clip-text text-transparent leading-tight">
              Viva a Arte na Pele
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold mb-8 text-white">
              Eventos Memoráveis com a 99Tattoo
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Descubra nossos próximos encontros ou leve a experiência única da tatuagem para o seu evento. 
              <span className="text-red-400 font-semibold"> Inovação, arte e memórias eternas.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={() => scrollToSection('upcoming-events')}
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-4 px-8 text-lg shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Calendar className="h-6 w-6 mr-3" />
                Conheça Nossos Próximos Eventos
              </Button>
              
              <Button
                onClick={() => scrollToSection('b2b-section')}
                variant="outline"
                className="border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold py-4 px-8 text-lg shadow-2xl backdrop-blur-sm bg-black/30 transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Target className="h-6 w-6 mr-3" />
                Leve a 99Tattoo Para o Seu Evento!
              </Button>
            </div>
          </div>
        </section>

        {/* Differentiation Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                Não é Apenas Tatuagem. É Experiência. É 99Tattoo.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* O Comum */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-300 mb-6 text-center">O Comum</h3>
                <div className="space-y-4">
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
                </div>
                <p className="text-center text-gray-500 mt-6 italic">
                  "Mais do mesmo, sem inspiração..."
                </p>
              </div>

              {/* O Marcante com 99Tattoo */}
              <div className="bg-gradient-to-br from-red-900 via-red-800 to-black p-8 rounded-2xl border-2 border-red-500 shadow-2xl shadow-red-500/25">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">O Marcante com 99Tattoo</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <Zap className="h-6 w-6" />
                    </div>
                    <span>Atendimento exclusivo e ágil</span>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="h-6 w-6" />
                    </div>
                    <span>Designs que contam histórias únicas</span>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <span>Artistas selecionados e ambiente premium</span>
                  </div>
                </div>
                <p className="text-center text-red-200 mt-6 font-semibold text-lg">
                  "Criamos arte que conecta, em eventos que surpreendem."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section id="upcoming-events" className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                Onde A Arte da 99Tattoo Irá Te Encontrar
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl">
                    <div className="h-64 bg-gray-700"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-700 rounded"></div>
                      </div>
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
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                          <Calendar className="h-16 w-16 text-white opacity-60" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-none shadow-lg">
                          {getEventTypeLabel(event.eventType)}
                        </Badge>
                        {event.ticketProduct?.isEnabled && (
                          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none shadow-lg">
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            R$ {event.ticketProduct.productPrice.toFixed(2)}
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
                              month: 'short',
                              year: 'numeric'
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
                        onClick={() => setSelectedEvent(event)}
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Ver Mais Detalhes / Comprar Ingresso
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="h-24 w-24 mx-auto mb-6 text-red-500 opacity-60" />
                <h3 className="text-2xl font-bold text-white mb-4">Novos eventos em breve!</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Estamos preparando eventos incríveis para você. Acompanhe nossas redes sociais para novidades!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* B2B Section */}
        <section id="b2b-section" className="py-20 bg-gradient-to-b from-black to-red-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                Transforme Seu Evento em Uma Experiência Inesquecível
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                Oferecemos projetos de tatuagem personalizados para eventos corporativos, festas, casamentos, festivais e convenções.
              </p>
            </div>

            {/* Segments */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-red-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-500/25 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">Eventos Corporativos</h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  <span className="text-red-400 font-semibold">Branding na Pele:</span> Tatuagens personalizadas para sua marca e colaboradores.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-red-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-500/25 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">Festas e Casamentos</h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  <span className="text-red-400 font-semibold">Celebre Marcando:</span> Uma lembrança artística e exclusiva para seus convidados.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-red-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-500/25 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-4">Festivais e Convenções</h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  <span className="text-red-400 font-semibold">Engajamento Artístico:</span> Atração única que conecta e entretém seu público.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Button
                onClick={() => setShowB2BForm(true)}
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-4 px-12 text-lg shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Target className="h-6 w-6 mr-3" />
                Solicitar Orçamento Personalizado
              </Button>
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
