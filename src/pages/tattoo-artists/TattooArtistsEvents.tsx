
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Star, Search, Filter, Clock, Ticket } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const mockEvents = [
  {
    id: 1,
    title: "Convention Internacional de Tatuagem",
    description: "O maior evento de tatuagem do Brasil com workshops, competições e networking",
    date: "2024-08-15",
    time: "09:00",
    location: "São Paulo Convention Center",
    category: "convention",
    price: 250,
    maxParticipants: 500,
    currentParticipants: 342,
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=200&fit=crop",
    organizer: "99Tattoo Events",
    featured: true
  },
  {
    id: 2,
    title: "Workshop: Técnicas de Sombreamento",
    description: "Aprenda técnicas avançadas de sombreamento com mestres da tatuagem",
    date: "2024-07-22",
    time: "14:00",
    location: "Estúdio Ink Masters",
    category: "workshop",
    price: 180,
    maxParticipants: 25,
    currentParticipants: 18,
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e7?w=400&h=200&fit=crop",
    organizer: "Ink Masters Academy",
    featured: false
  },
  {
    id: 3,
    title: "Masterclass: Realismo em Tatuagem",
    description: "Domine as técnicas de realismo com artistas renomados internacionalmente",
    date: "2024-09-10",
    time: "10:00",
    location: "Centro de Convenções RJ",
    category: "masterclass",
    price: 320,
    maxParticipants: 40,
    currentParticipants: 35,
    image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=400&h=200&fit=crop",
    organizer: "International Tattoo Masters",
    featured: true
  }
];

const TattooArtistsEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: 'all', label: 'Todos os Eventos' },
    { value: 'convention', label: 'Convenções' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'masterclass', label: 'Masterclass' },
    { value: 'competition', label: 'Competições' },
  ];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'convention': return 'bg-purple-100 text-purple-800';
      case 'workshop': return 'bg-blue-100 text-blue-800';
      case 'masterclass': return 'bg-red-100 text-red-800';
      case 'competition': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Eventos para
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Tatuadores</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Participe dos melhores eventos, workshops e convenções de tatuagem do país
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30"
              />
            </div>
            
            <div className="flex gap-4 items-center">
              <Filter className="h-5 w-5 text-white" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="text-white">
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Lista de Eventos */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={`text-xs ${getCategoryColor(event.category)} font-medium`}>
                    {categories.find(cat => cat.value === event.category)?.label}
                  </Badge>
                  {event.featured && (
                    <Badge className="text-xs bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Destaque
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">{event.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-red-500" />
                    {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-red-500" />
                    {event.currentParticipants}/{event.maxParticipants} participantes
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-red-600">
                    R$ {event.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    por {event.organizer}
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                  <Ticket className="h-4 w-4 mr-2" />
                  Inscrever-se
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-300">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsEvents;
