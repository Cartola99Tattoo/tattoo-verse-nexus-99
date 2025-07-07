
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, MapPin, Mail, Phone, Heart, MessageCircle, Star, Settings, Edit } from "lucide-react";

const mockUserData = {
  id: 1,
  name: "Ana Silva Santos",
  email: "ana.silva@email.com",
  phone: "(11) 99999-9999",
  location: "São Paulo, SP",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b002?w=150&h=150&fit=crop&crop=face",
  joinDate: "2023-03-15",
  bio: "Apaixonada por arte corporal e sempre em busca da próxima tatuagem perfeita. Adoro acompanhar as tendências e descobrir novos tatuadores talentosos.",
  preferences: {
    styles: ["Minimalista", "Fine Line", "Aquarela", "Geométrico"],
    bodyParts: ["Braço", "Costas", "Perna"],
    budget: "R$ 500 - R$ 2000"
  },
  stats: {
    tattoos: 5,
    reviews: 12,
    favorites: 8,
    following: 23
  },
  tattoos: [
    {
      id: 1,
      name: "Rosa Minimalista",
      artist: "Marina Santos",
      date: "2024-01-15",
      location: "Braço direito",
      style: "Fine Line",
      image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=300&fit=crop",
      rating: 5,
      review: "Trabalho incrível! A Marina capturou exatamente o que eu queria. Processo muito tranquilo e resultado perfeito."
    },
    {
      id: 2,
      name: "Mandala Geométrica",
      artist: "Carlos Montenegro",
      date: "2023-11-20",
      location: "Costas",
      style: "Geométrico",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop",
      rating: 5,
      review: "Precisão incrível nos detalhes. Carlos é um verdadeiro artista!"
    }
  ],
  favorites: [
    {
      id: 1,
      name: "João Silva Santos",
      specialty: "Realismo",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      location: "São Paulo, SP"
    },
    {
      id: 2,
      name: "Maria Fernanda Costa",
      specialty: "Aquarela",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b002?w=150&h=150&fit=crop&crop=face",
      location: "Rio de Janeiro, RJ"
    }
  ]
};

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header do Perfil */}
        <Card className="mb-8 bg-gradient-to-r from-red-600 to-red-800 text-white border-none shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                <AvatarImage src={mockUserData.avatar} alt={mockUserData.name} />
                <AvatarFallback className="bg-red-500 text-white text-2xl">
                  {mockUserData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{mockUserData.name}</h1>
                <p className="text-red-100 mb-4 text-lg">{mockUserData.bio}</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{mockUserData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{mockUserData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{mockUserData.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Desde {new Date(mockUserData.joinDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockUserData.stats.tattoos}</div>
                    <div className="text-red-100 text-sm">Tatuagens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockUserData.stats.reviews}</div>
                    <div className="text-red-100 text-sm">Avaliações</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockUserData.stats.favorites}</div>
                    <div className="text-red-100 text-sm">Favoritos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockUserData.stats.following}</div>
                    <div className="text-red-100 text-sm">Seguindo</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo Principal */}
        <Tabs defaultValue="tattoos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-red-200 rounded-xl p-1">
            <TabsTrigger value="tattoos" className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold">
              Minhas Tatuagens
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold">
              Favoritos
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold">
              Preferências
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold">
              Atividade
            </TabsTrigger>
          </TabsList>

          {/* Minhas Tatuagens */}
          <TabsContent value="tattoos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockUserData.tattoos.map(tattoo => (
                <Card key={tattoo.id} className="overflow-hidden bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={tattoo.image} 
                      alt={tattoo.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-red-600">{tattoo.name}</h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < tattoo.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Artista:</span>
                        <span className="font-semibold">{tattoo.artist}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data:</span>
                        <span>{new Date(tattoo.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Local:</span>
                        <span>{tattoo.location}</span>
                      </div>
                    </div>
                    
                    <Badge className="bg-red-100 text-red-600 mb-3">{tattoo.style}</Badge>
                    
                    <p className="text-gray-700 text-sm leading-relaxed">{tattoo.review}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tatuadores Favoritos */}
          <TabsContent value="favorites" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockUserData.favorites.map(artist => (
                <Card key={artist.id} className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-red-200">
                      <AvatarImage src={artist.image} alt={artist.name} />
                      <AvatarFallback className="bg-red-100 text-red-600">
                        {artist.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-xl font-bold text-red-600 mb-2">{artist.name}</h3>
                    <p className="text-gray-600 mb-3">{artist.specialty}</p>
                    
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{artist.rating}</span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4">{artist.location}</p>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white">
                        <Heart className="h-4 w-4 mr-2" />
                        Favorito
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Preferências */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-red-600">Estilos Preferidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockUserData.preferences.styles.map(style => (
                      <Badge key={style} className="bg-red-100 text-red-600 px-3 py-1">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-red-600">Locais do Corpo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockUserData.preferences.bodyParts.map(part => (
                      <Badge key={part} className="bg-red-100 text-red-600 px-3 py-1">
                        {part}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-red-600">Orçamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-gray-700">
                    {mockUserData.preferences.budget}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Faixa de preço que você está disposto(a) a investir em uma nova tatuagem
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Atividade */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-red-600">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <Heart className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold">Favoritou um tatuador</p>
                      <p className="text-sm text-gray-600">Há 2 dias</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-semibold">Avaliou uma tatuagem</p>
                      <p className="text-sm text-gray-600">Há 1 semana</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <User className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold">Atualizou o perfil</p>
                      <p className="text-sm text-gray-600">Há 2 semanas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
