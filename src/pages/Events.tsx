
import React, { useState } from 'react';
import { useDataQuery } from '@/hooks/useDataQuery';
import { getEventService } from '@/services/serviceFactory';
import { IEvent } from '@/services/interfaces/IEventService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, ShoppingCart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import EventModal from '@/components/events/EventModal';

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
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

  const upcomingEvents = events.filter(isEventUpcoming);
  const pastEvents = events.filter(event => !isEventUpcoming(event));

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Eventos 99Tattoo</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Participe dos nossos eventos exclusivos, workshops e Flash Days
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse overflow-hidden">
                  <div className="h-64 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Eventos 99Tattoo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Participe dos nossos eventos exclusivos, workshops especializados e Flash Days únicos. 
              Uma experiência completa no mundo da tatuagem.
            </p>
          </div>

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Calendar className="h-8 w-8 text-purple-600" />
                Próximos Eventos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50 border-2 hover:border-purple-200 transform hover:-translate-y-2">
                    <div className="relative h-64 overflow-hidden">
                      {event.featuredImage ? (
                        <img
                          src={event.featuredImage}
                          alt={event.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                          <Calendar className="h-16 w-16 text-white opacity-60" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-white/90 text-purple-700 border-purple-200 shadow-lg">
                          {getEventTypeLabel(event.eventType)}
                        </Badge>
                        {event.ticketProduct?.isEnabled && (
                          <Badge className="bg-green-100/90 text-green-800 border-green-200 shadow-lg">
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            R$ {event.ticketProduct.productPrice.toFixed(2)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                          {event.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Calendar className="h-4 w-4 text-purple-600 flex-shrink-0" />
                          <span>
                            {new Date(event.startDate).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Clock className="h-4 w-4 text-purple-600 flex-shrink-0" />
                          <span>{event.startTime} às {event.endTime}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <MapPin className="h-4 w-4 text-purple-600 flex-shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        
                        {event.participatingArtists && event.participatingArtists.length > 0 && (
                          <div className="flex items-center gap-3 text-sm text-gray-700">
                            <Users className="h-4 w-4 text-purple-600 flex-shrink-0" />
                            <span>{event.participatingArtists.length} artista(s) participando</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <Button
                          onClick={() => setSelectedEvent(event)}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Calendar className="h-8 w-8 text-gray-500" />
                Eventos Anteriores
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pastEvents.slice(0, 4).map((event) => (
                  <Card key={event.id} className="group overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 opacity-75 hover:opacity-100">
                    <div className="relative h-48 overflow-hidden">
                      {event.featuredImage ? (
                        <img
                          src={event.featuredImage}
                          alt={event.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                          <Calendar className="h-12 w-12 text-white opacity-60" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge variant="outline" className="bg-white/90 text-gray-700 border-gray-300">
                          {getEventTypeLabel(event.eventType)}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
                        {event.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {new Date(event.startDate).toLocaleDateString('pt-BR')}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEvent(event)}
                        className="w-full text-xs"
                      >
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {events.length === 0 && (
            <div className="text-center py-16">
              <Calendar className="h-24 w-24 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nenhum evento disponível</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Estamos preparando eventos incríveis para você. Acompanhe nossas redes sociais para novidades!
              </p>
            </div>
          )}
        </div>
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </Layout>
  );
};

export default Events;
