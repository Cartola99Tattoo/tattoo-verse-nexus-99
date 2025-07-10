
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Calendar, 
  Star, 
  Heart,
  Share2,
  MessageCircle,
  Instagram,
  Phone,
  Mail,
  Award,
  Users,
  Clock,
  Palette,
  Image as ImageIcon,
  Video,
  BookOpen
} from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const TattooArtistsProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Mock data for the artist profile
  const mockArtist = {
    id: id || "1",
    name: "João Silva Santos",
    username: "@joaosilva_tattoo",
    bio: "Tatuador profissional especializado em realismo e blackwork. 15 anos de experiência transformando pele em arte. Localizado em São Paulo, SP.",
    avatar: "/placeholder.svg",
    coverImage: "/placeholder.svg",
    location: "São Paulo, SP",
    joinDate: "2018",
    verified: true,
    stats: {
      followers: 45200,
      following: 892,
      tattoos: 1247,
      rating: 4.9,
      reviews: 342
    },
    specialties: ["Realismo", "Blackwork", "Tradicional Americano", "Fineline"],
    contact: {
      phone: "(11) 99999-9999",
      email: "joao@tattoo.com",
      instagram: "@joaosilva_tattoo"
    },
    portfolio: [
      { id: 1, image: "/placeholder.svg", title: "Retrato Realista", likes: 245, comments: 18 },
      { id: 2, image: "/placeholder.svg", title: "Blackwork Geométrico", likes: 189, comments: 12 },
      { id: 3, image: "/placeholder.svg", title: "Tradicional Americano", likes: 298, comments: 24 },
      { id: 4, image: "/placeholder.svg", title: "Fineline Floral", likes: 156, comments: 8 },
      { id: 5, image: "/placeholder.svg", title: "Realismo Animal", likes: 367, comments: 31 },
      { id: 6, image: "/placeholder.svg", title: "Blackwork Mandala", likes: 203, comments: 15 }
    ],
    reviews: [
      {
        id: 1,
        client: "Maria Silva",
        rating: 5,
        comment: "Trabalho incrível! Superou todas as minhas expectativas. João é um verdadeiro artista.",
        date: "2024-01-15",
        tattoo: "Retrato Realista"
      },
      {
        id: 2,
        client: "Carlos Santos",
        rating: 5,
        comment: "Profissional excepcional, muito atencioso e técnica impecável. Recomendo!",
        date: "2024-01-10",
        tattoo: "Blackwork Geométrico"
      },
      {
        id: 3,
        client: "Ana Oliveira",
        rating: 4,
        comment: "Muito bom trabalho, ambiente limpo e seguro. Voltarei em breve!",
        date: "2024-01-05",
        tattoo: "Fineline Floral"
      }
    ]
  };

  return (
    <TattooArtistLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
        {/* Cover Photo */}
        <div className="relative h-64 bg-gradient-to-r from-red-600 to-red-800 overflow-hidden">
          <img 
            src={mockArtist.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
          {/* Profile Header */}
          <Card className="mb-8 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <img 
                    src={mockArtist.avatar} 
                    alt={mockArtist.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-2xl"
                  />
                  {mockArtist.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full">
                      <Award className="h-4 w-4" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {mockArtist.name}
                        {mockArtist.verified && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800">Verificado</Badge>
                        )}
                      </h1>
                      <p className="text-red-600 font-medium mb-2">{mockArtist.username}</p>
                      <div className="flex items-center gap-4 text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{mockArtist.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Desde {mockArtist.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={`${
                          isFollowing 
                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                            : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                        }`}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                        {isFollowing ? 'Seguindo' : 'Seguir'}
                      </Button>
                      <Button variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Mensagem
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {mockArtist.bio}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{mockArtist.stats.followers.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Seguidores</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{mockArtist.stats.following}</div>
                      <div className="text-sm text-gray-500">Seguindo</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{mockArtist.stats.tattoos}</div>
                      <div className="text-sm text-gray-500">Tatuagens</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold text-gray-900">{mockArtist.stats.rating}</span>
                      </div>
                      <div className="text-sm text-gray-500">Avaliação</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{mockArtist.stats.reviews}</div>
                      <div className="text-sm text-gray-500">Avaliações</div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2">
                    {mockArtist.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="border-red-300 text-red-700">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content Tabs */}
          <Tabs defaultValue="portfolio" className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="portfolio" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Portfólio
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Avaliações
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Sobre
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contato
              </TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockArtist.portfolio.map((item) => (
                  <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {item.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {item.comments}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {mockArtist.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{review.client}</h4>
                          <p className="text-sm text-gray-500">Tatuagem: {review.tattoo}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('pt-BR')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="about" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Sobre o Artista</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {mockArtist.bio}
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Com mais de 15 anos de experiência no mundo da tatuagem, João desenvolveu um estilo único que combina 
                      técnicas tradicionais com inovações modernas. Especializado em realismo e blackwork, cada peça é 
                      cuidadosamente planejada e executada com precisão artística.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Participante ativo da comunidade tattoo, João já foi premiado em diversas convenções nacionais e 
                      internacionais. Seu compromisso com a excelência e atenção aos detalhes fazem dele uma referência 
                      no segmento.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Informações de Contato</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-red-600" />
                      <span>{mockArtist.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-red-600" />
                      <span>{mockArtist.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Instagram className="h-5 w-5 text-red-600" />
                      <span>{mockArtist.contact.instagram}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-red-600" />
                      <span>{mockArtist.location}</span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Consulta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsProfile;
