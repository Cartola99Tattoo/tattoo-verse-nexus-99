
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, Users, Clock, Star, Filter } from "lucide-react";
import TatuadoresLayout from "@/components/layouts/TatuadoresLayout";

// Mock data para eventos de tatuagem
const mockEvents = [
  {
    id: "1",
    title: "Convenção Nacional de Tatuagem 2024",
    description: "O maior evento de tatuagem do país com artistas renomados, workshops e competições.",
    date: "2024-03-15",
    endDate: "2024-03-17",
    location: "São Paulo Expo - SP",
    category: "Convenção",
    price: "R$ 150,00",
    featured: true,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
    speakers: ["Carlos Mendoza", "Ana Silva", "Pedro Santos"],
    attendees: 2500,
    tags: ["convenção", "workshops", "networking", "competição"]
  },
  {
    id: "2",
    title: "Workshop: Técnicas Avançadas de Realismo",
    description: "Aprenda as técnicas mais modernas para criar tatuagens realistas impressionantes.",
    date: "2024-02-28",
    endDate: "2024-02-28",
    location: "Instituto de Arte Corporal - RJ",
    category: "Workshop",
    price: "R$ 250,00",
    featured: true,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80",
    speakers: ["Marcus Vinicius"],
    attendees: 30,
    tags: ["realismo", "técnicas", "aprendizado"]
  },
  {
    id: "3",
    title: "Feira de Equipamentos e Materiais",
    description: "Conheça os lançamentos em equipamentos, tintas e materiais para tatuagem.",
    date: "2024-04-20",
    endDate: "2024-04-21",
    location: "Centro de Convenções - MG",
    category: "Feira",
    price: "Gratuito",
    featured: false,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
    speakers: [],
    attendees: 500,
    tags: ["equipamentos", "materiais", "lançamentos", "fornecedores"]
  },
  {
    id: "4",
    title: "Seminário: Marketing Digital para Tatuadores",
    description: "Estratégias eficazes para promover seu trabalho nas redes sociais e atrair mais clientes.",
    date: "2024-05-10",
    endDate: "2024-05-10",
    location: "Online - Transmissão ao vivo",
    category: "Seminário",
    price: "R$ 50,00",
    featured: false,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80",
    speakers: ["Fernanda Costa", "João Marketing"],
    attendees: 150,
    tags: ["marketing", "digital", "redes sociais", "negócios"]
  },
  {
    id: "5",
    title: "Festival Internacional de Arte Corporal",
    description: "Celebração da arte da tatuagem com artistas internacionais e performances ao vivo.",
    date: "2024-06-01",
    endDate: "2024-06-03",
    location: "Parque Villa-Lobos - SP",
    category: "Festival",
    price: "R$ 80,00",
    featured: true,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
    speakers: ["International Artists"],
    attendees: 1000,
    tags: ["internacional", "arte", "performances", "festival"]
  }
];

const categories = ["Todos", "Convenção", "Workshop", "Feira", "Seminário", "Festival"];

const Eventos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredEvents = filteredEvents.filter(event => event.featured);
  const regularEvents = filteredEvents.filter(event => !event.featured);

  const getCategoryColor = (category: string) => {
    const colors = {
      "Convenção": "bg-red-100 text-red-800",
      "Workshop": "bg-blue-100 text-blue-800",
      "Feira": "bg-green-100 text-green-800",
      "Seminário": "bg-purple-100 text-purple-800",
      "Festival": "bg-orange-100 text-orange-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <TatuadoresLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-red-800">Eventos para Tatuadores</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra workshops, convenções e eventos que vão elevar sua carreira na tatuagem
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-red-200 focus:border-red-600"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-red-600 hover:bg-red-700" : "border-red-200 text-red-600 hover:bg-red-50"}
              >
                <Filter className="h-3 w-3 mr-1" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-800">Eventos em Destaque</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden border-red-200 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Destaque
                    </Badge>
                    <Badge className={`absolute top-4 right-4 ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-red-900 hover:text-red-700 transition-colors">
                      <Link to={`/tatuadores-da-nova-era/eventos/${event.id}`}>
                        {event.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-red-600" />
                          <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                          {event.endDate !== event.date && (
                            <span> - {new Date(event.endDate).toLocaleDateString('pt-BR')}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span>{event.attendees} participantes</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-red-800">
                          {event.price}
                        </div>
                        <Link to={`/tatuadores-da-nova-era/eventos/${event.id}`}>
                          <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                            Ver Detalhes
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Events */}
        {regularEvents.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-800">Próximos Eventos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden border-red-200 hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className={`absolute top-4 right-4 ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-red-900 hover:text-red-700 transition-colors line-clamp-2">
                      <Link to={`/tatuadores-da-nova-era/eventos/${event.id}`}>
                        {event.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-800">{event.price}</span>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{event.attendees}</span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/tatuadores-da-nova-era/eventos/${event.id}`}>
                      <Button variant="outline" size="sm" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-500">Tente ajustar sua busca ou filtros</p>
          </div>
        )}
      </div>
    </TatuadoresLayout>
  );
};

export default Eventos;
