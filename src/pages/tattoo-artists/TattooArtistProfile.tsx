
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, MapPin, Star, Instagram, Facebook, Phone, Mail, Calendar, Award, Clock, User, Building2, TrendingUp, Target } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import { getTattooArtistById } from "@/data/mockTattooArtists";

const TattooArtistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const artist = getTattooArtistById(id || "1");

  if (!artist) {
    return (
      <TattooArtistLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tatuador não encontrado</h1>
          <Button onClick={() => navigate('/tatuadores-da-nova-era')} className="bg-gradient-to-r from-red-600 to-red-700">
            Voltar
          </Button>
        </div>
      </TattooArtistLayout>
    );
  }

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/tatuadores-da-nova-era')}
          className="text-white hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-red-600/10 to-red-700/10 border-red-500/20 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <Avatar className="w-32 h-32 border-4 border-red-500">
                <AvatarImage src={artist.avatar} alt={artist.name} />
                <AvatarFallback className="bg-red-600 text-white text-2xl">
                  {artist.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">{artist.name}</h1>
                <p className="text-xl text-red-200 mb-4">{artist.specialties.join(' • ')}</p>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center text-red-100">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{artist.location.city}, {artist.location.state}</span>
                  </div>
                  <div className="flex items-center text-red-100">
                    <Building2 className="h-5 w-5 mr-2" />
                    <span>{artist.location.studio}</span>
                  </div>
                  <div className="flex items-center text-red-100">
                    <Star className="h-5 w-5 mr-1 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-medium">{artist.rating}</span>
                    <span className="ml-1">({artist.reviews} avaliações)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{artist.stats.experience}</div>
                    <div className="text-sm text-red-200">Anos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{artist.stats.worksCompleted}</div>
                    <div className="text-sm text-red-200">Trabalhos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{artist.stats.reviews}</div>
                    <div className="text-sm text-red-200">Avaliações</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{artist.stats.rating}</div>
                    <div className="text-sm text-red-200">Nota Média</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Consulta
                  </Button>
                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20">
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Portfólio
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Sobre
            </TabsTrigger>
            <TabsTrigger value="studio" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Estúdio
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Contato
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Portfólio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artist.portfolio.map((work, index) => (
                    <div
                      key={work.id}
                      className="group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={() => setSelectedImage(index)}
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                        <img
                          src={work.image}
                          alt={work.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="font-bold text-gray-900 mb-1">{work.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{work.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="border-red-500 text-red-600">
                            {work.style}
                          </Badge>
                          <span className="text-xs text-gray-500">{work.year}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Biografia</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-6">{artist.bio}</p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-red-500" />
                      <span className="text-gray-700">{artist.experience} de experiência</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-5 w-5 mr-3 text-red-500" />
                      <span className="text-gray-700">Certificado profissional</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-3 text-red-500" />
                      <span className="text-gray-700">{artist.isAvailable ? 'Disponível' : 'Agenda cheia'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Especialidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {artist.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="justify-center py-2 border-red-500 text-red-600">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Studio Qualification Tab */}
          <TabsContent value="studio">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Qualificação do Estúdio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Tamanho do Estúdio</h4>
                      <p className="text-gray-700">{artist.studioQualification.studioSize}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Faturamento Anual</h4>
                      <p className="text-gray-700">{artist.studioQualification.yearlyRevenue}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Gestão de Clientes</h4>
                      <p className="text-gray-700">{artist.studioQualification.clientManagement}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Marketing</h4>
                      <p className="text-gray-700">{artist.studioQualification.marketingApproach}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Interesse em Digitalização</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Nível de interesse</span>
                          <span>90%</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Principais Desafios</h4>
                      <div className="space-y-1">
                        {artist.studioQualification.mainChallenges.map((challenge, index) => (
                          <Badge key={index} variant="secondary" className="mr-2 mb-1">
                            {challenge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 mr-3 text-red-500" />
                    <div>
                      <div className="font-medium text-gray-900">Telefone</div>
                      <div className="text-gray-600">{artist.contact.phone}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 mr-3 text-red-500" />
                    <div>
                      <div className="font-medium text-gray-900">E-mail</div>
                      <div className="text-gray-600">{artist.contact.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Instagram className="h-5 w-5 mr-3 text-red-500" />
                    <div>
                      <div className="font-medium text-gray-900">Instagram</div>
                      <div className="text-gray-600">{artist.contact.instagram}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 mr-3 text-red-500" />
                    <div>
                      <div className="font-medium text-gray-900">Endereço</div>
                      <div className="text-gray-600">
                        {artist.address?.address}, {artist.address?.number}<br/>
                        {artist.address?.neighborhood} - {artist.address?.city}, {artist.address?.state}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Agendamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  
                  <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Consulta
                  </Button>
                  
                  <Button variant="outline" className="w-full border-purple-500 text-purple-600 hover:bg-purple-50">
                    <Instagram className="h-4 w-4 mr-2" />
                    Ver Instagram
                  </Button>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Horário de Atendimento</h4>
                    <p className="text-blue-700 text-sm">Segunda a Sexta: 9h às 18h</p>
                    <p className="text-blue-700 text-sm">Sábado: 9h às 16h</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistProfile;
