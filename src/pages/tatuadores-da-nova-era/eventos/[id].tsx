
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Users, Clock, Star, Tag, Share2, Heart, Bookmark, CheckCircle } from "lucide-react";
import TatuadoresLayout from "@/components/layouts/TatuadoresLayout";

// Mock data para eventos (mesmo da lista)
const mockEvents = [
  {
    id: "1",
    title: "Convenção Nacional de Tatuagem 2024",
    description: "O maior evento de tatuagem do país com artistas renomados, workshops e competições.",
    fullDescription: `
      <h2>Sobre o Evento</h2>
      <p>A Convenção Nacional de Tatuagem 2024 é o maior evento do segmento no Brasil, reunindo os melhores tatuadores, fornecedores e entusiastas da arte corporal em um só lugar.</p>
      
      <h3>Programação</h3>
      <ul>
        <li><strong>Sexta-feira (15/03):</strong> Credenciamento, abertura oficial e primeiros workshops</li>
        <li><strong>Sábado (16/03):</strong> Competições, palestras e demonstrações ao vivo</li>
        <li><strong>Domingo (17/03):</strong> Premiação e encerramento com shows especiais</li>
      </ul>
      
      <h3>Workshops Inclusos</h3>
      <ul>
        <li>Técnicas Avançadas de Sombreamento</li>
        <li>Color Realism: Do Conceito à Execução</li>
        <li>Fineline e Minimalismo</li>
        <li>Gestão de Estúdio e Marketing Digital</li>
      </ul>
      
      <h3>O que está incluído</h3>
      <ul>
        <li>Acesso a todos os workshops</li>
        <li>Material de apoio</li>
        <li>Coffee breaks</li>
        <li>Certificado de participação</li>
        <li>Kit com produtos exclusivos</li>
      </ul>
    `,
    date: "2024-03-15",
    endDate: "2024-03-17",
    location: "São Paulo Expo - SP",
    fullAddress: "Rodovia dos Imigrantes, 1,5 Km - Vila Água Funda, São Paulo - SP",
    category: "Convenção",
    price: "R$ 150,00",
    featured: true,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80",
    speakers: ["Carlos Mendoza", "Ana Silva", "Pedro Santos"],
    attendees: 2500,
    maxAttendees: 3000,
    tags: ["convenção", "workshops", "networking", "competição"],
    schedule: [
      { time: "09:00", activity: "Credenciamento" },
      { time: "10:00", activity: "Abertura Oficial" },
      { time: "11:00", activity: "Workshop: Realismo Avançado" },
      { time: "14:00", activity: "Competição de Tatuagem" },
      { time: "16:00", activity: "Palestra: Futuro da Tatuagem" },
      { time: "18:00", activity: "Networking" }
    ]
  }
];

const EventDetail = () => {
  const { id } = useParams();
  const event = mockEvents.find(e => e.id === id);

  if (!event) {
    return (
      <TatuadoresLayout>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Evento não encontrado</h1>
          <Link to="/tatuadores-da-nova-era/eventos">
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Eventos
            </Button>
          </Link>
        </div>
      </TatuadoresLayout>
    );
  }

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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/tatuadores-da-nova-era/eventos" className="hover:text-red-600 transition-colors">
            Eventos
          </Link>
          <span>/</span>
          <span className="text-red-600">{event.title}</span>
        </div>

        {/* Back Button */}
        <Link to="/tatuadores-da-nova-era/eventos">
          <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Eventos
          </Button>
        </Link>

        {/* Event Header */}
        <div className="space-y-4">
          <Badge className={getCategoryColor(event.category)}>
            {event.category}
          </Badge>
          
          <h1 className="text-4xl font-black text-red-800 leading-tight">
            {event.title}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            {event.description}
          </p>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  {new Date(event.date).toLocaleDateString('pt-BR')} - {new Date(event.endDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{event.attendees}/{event.maxAttendees} participantes</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                <Heart className="h-4 w-4 mr-1" />
                Favoritar
              </Button>
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                <Share2 className="h-4 w-4 mr-1" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-video overflow-hidden rounded-lg shadow-xl">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Detalhes do Evento</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-lg max-w-none prose-red prose-headings:text-red-800 prose-a:text-red-600 prose-strong:text-red-900"
                  dangerouslySetInnerHTML={{ __html: event.fullDescription }}
                />
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Programação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-red-50 border border-red-100">
                      <div className="flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-lg font-bold">
                        <Clock className="h-4 w-4 mr-1" />
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-900">{item.activity}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Speakers */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Palestrantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                        {speaker.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-900">{speaker}</h4>
                        <p className="text-sm text-gray-600">Tatuador Especialista</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Inscrição</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-black text-red-800 mb-2">{event.price}</div>
                  <p className="text-sm text-gray-600">Por pessoa</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Acesso completo ao evento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Todos os workshops inclusos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Certificado de participação</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Kit exclusivo</span>
                  </div>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Inscrever-se Agora
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Vagas limitadas: {event.maxAttendees - event.attendees} restantes
                </p>
              </CardContent>
            </Card>

            {/* Event Info */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Data</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString('pt-BR')} - {new Date(event.endDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Local</h4>
                  <p className="text-sm text-gray-600">{event.fullAddress}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Participantes</h4>
                  <p className="text-sm text-gray-600">{event.attendees} inscritos</p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="hover:bg-red-100 hover:text-red-800 transition-colors cursor-pointer">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TatuadoresLayout>
  );
};

export default EventDetail;
