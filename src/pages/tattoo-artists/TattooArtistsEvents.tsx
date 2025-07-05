
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, Star, Ticket } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const mockEvents = [
  {
    id: 1,
    title: "Convenção Nacional 99Tattoo 2024",
    description: "O maior encontro de tatuadores do Brasil com workshops, competições e muito networking",
    type: "Convenção",
    date: "2024-08-15",
    endDate: "2024-08-17",
    time: "09:00",
    location: "São Paulo Convention Center",
    address: "Rua do Convento, 1000 - São Paulo, SP",
    price: 450,
    capacity: 5000,
    registered: 3200,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    featured: true,
    highlights: [
      "Workshops com mestres internacionais",
      "Competição nacional de tatuagem",
      "Feira de equipamentos e produtos",
      "Networking premium"
    ]
  },
  {
    id: 2,
    title: "Workshop: Técnicas Avançadas de Realismo",
    description: "Workshop intensivo com João Silva Santos, mestre em realismo",
    type: "Workshop",
    date: "2024-07-25",
    endDate: "2024-07-26",
    time: "14:00",
    location: "Black Art Studio",
    address: "Rua Augusta, 1234 - São Paulo, SP",
    price: 850,
    capacity: 20,
    registered: 18,
    image: "https://images.unsplash.com/photo-1564131072-6c4d41e23ba6?w=400&h=250&fit=crop",
    featured: false,
    highlights: [
      "16 horas de treinamento intensivo",
      "Certificado de participação",
      "Material incluso",
      "Acompanhamento personalizado"
    ]
  },
  {
    id: 3,
    title: "Feira de Equipamentos TattooExpo",
    description: "Exposição dos melhores produtos e lançamentos do mercado de tatuagem",
    type: "Feira",
    date: "2024-08-05",
    endDate: "2024-08-07",
    time: "10:00",
    location: "Centro de Exposições Rio",
    address: "Av. Salgado Filho, 100 - Rio de Janeiro, RJ",
    price: 0,
    capacity: 10000,
    registered: 6800,
    image: "https://images.unsplash.com/photo-1606830713264-f1b9f00a0e4d?w=400&h=250&fit=crop",
    featured: false,
    highlights: [
      "Entrada gratuita",
      "Mais de 200 expositores",
      "Demonstrações ao vivo",
      "Descontos exclusivos"
    ]
  },
  {
    id: 4,
    title: "Competição de Aquarela Tattoo",
    description: "Primeira competição nacional especializada em tatuagens aquarela",
    type: "Competição",
    date: "2024-09-12",
    endDate: "2024-09-12",
    time: "13:00",
    location: "Aquarela Ink Studio",
    address: "Av. Copacabana, 567 - Rio de Janeiro, RJ",
    price: 200,
    capacity: 50,
    registered: 35,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=250&fit=crop",
    featured: false,
    highlights: [
      "Premiação de R$ 10.000",
      "Jurados especialistas",
      "Categoria profissional e iniciante",
      "Transmissão ao vivo"
    ]
  }
];

const TattooArtistsEvents = () => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Convenção': return 'bg-purple-100 text-purple-800';
      case 'Workshop': return 'bg-blue-100 text-blue-800';
      case 'Feira': return 'bg-green-100 text-green-800';
      case 'Competição': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const featuredEvent = mockEvents.find(event => event.featured);
  const regularEvents = mockEvents.filter(event => !event.featured);

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Eventos <span className="text-red-400">99Tattoo</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Participe dos melhores eventos de tatuagem do Brasil e eleve sua carreira ao próximo nível
          </p>
        </div>

        {/* Evento em Destaque */}
        {featuredEvent && (
          <Card className="mb-12 bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-80 md:h-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-l-lg overflow-hidden">
                <img 
                  src={featuredEvent.image} 
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-red-500 text-white">Evento Principal</Badge>
                  <Badge className={getTypeColor(featuredEvent.type)}>
                    {featuredEvent.type}
                  </Badge>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {featuredEvent.title}
                </h2>
                
                <p className="text-gray-600 mb-6">
                  {featuredEvent.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="font-medium">
                        {new Date(featuredEvent.date).toLocaleDateString('pt-BR')}
                        {featuredEvent.endDate !== featuredEvent.date && (
                          <> - {new Date(featuredEvent.endDate).toLocaleDateString('pt-BR')}</>
                        )}
                      </div>
                      <div className="text-xs">{featuredEvent.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="font-medium">{featuredEvent.location}</div>
                      <div className="text-xs">{featuredEvent.address}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="font-medium">{featuredEvent.registered} / {featuredEvent.capacity}</div>
                      <div className="text-xs">Inscritos</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Ticket className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="font-medium">
                        {featuredEvent.price > 0 ? `R$ ${featuredEvent.price}` : 'Gratuito'}
                      </div>
                      <div className="text-xs">Investimento</div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Destaques:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {featuredEvent.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                  Inscrever-se Agora
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Próximos Eventos */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Próximos Eventos</h2>
          <p className="text-gray-300">Não perca essas oportunidades únicas de aprendizado e networking</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularEvents.map((event) => (
            <Card key={event.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {event.title}
                </CardTitle>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="h-3 w-3" />
                    {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Users className="h-3 w-3" />
                    {event.registered}/{event.capacity} inscritos
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h5 className="font-semibold text-gray-900 text-sm">Destaques:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {event.highlights.slice(0, 2).map((highlight, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="h-2 w-2 text-yellow-500" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-red-600">
                    {event.price > 0 ? `R$ ${event.price}` : 'Gratuito'}
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                    Inscrever-se
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-to-r from-red-600/10 to-red-700/10 border-red-500/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Quer organizar um evento?
              </h3>
              <p className="text-gray-300 mb-6">
                Compartilhe seu conhecimento com a comunidade 99Tattoo e ajude outros tatuadores a evoluir.
              </p>
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                Propor Evento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsEvents;
