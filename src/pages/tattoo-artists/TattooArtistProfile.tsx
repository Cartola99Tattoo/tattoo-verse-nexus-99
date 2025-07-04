
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MapPin, Star, Instagram, MessageCircle, Mail, Calendar, Award, Clock, Phone, Eye, Heart, Users, BarChart3, Target, Zap } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import { getTattooArtistById } from "@/data/mockTattooArtists";

const TattooArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const artist = id ? getTattooArtistById(id) : null;

  if (!artist) {
    return (
      <TattooArtistLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-black text-red-600 mb-4">Artista não encontrado</h1>
            <p className="text-gray-600 mb-6">O perfil solicitado não existe ou foi removido.</p>
            <Button 
              onClick={() => navigate('/tatuadores-da-nova-era/artistas')}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Diretório
            </Button>
          </div>
        </div>
      </TattooArtistLayout>
    );
  }

  // Calculate digitalization interest progress
  const getDigitalizationProgress = (interest: string) => {
    switch (interest) {
      case 'Muito Alto': return 100;
      case 'Alto': return 75;
      case 'Médio': return 50;
      case 'Baixo': return 25;
      default: return 0;
    }
  };

  return (
    <TattooArtistLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Header - Similar to user-profile */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/tatuadores-da-nova-era/artistas')}
              className="text-white hover:bg-white/10 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Diretório
            </Button>
            
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <Avatar className="w-48 h-48 lg:w-64 lg:h-64 border-4 border-white shadow-2xl">
                  <AvatarImage src={artist.avatar} alt={artist.name} />
                  <AvatarFallback className="text-4xl font-bold bg-red-500">
                    {artist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl lg:text-6xl font-black text-white mb-4">
                  {artist.name}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-red-200" />
                    <span className="text-red-100">
                      {artist.location.city}, {artist.location.state}
                    </span>
                  </div>
                  {artist.location.studio && (
                    <div className="flex items-center">
                      <span className="text-red-100">📍 {artist.location.studio}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-1 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-bold">{artist.stats.rating}</span>
                    <span className="text-red-100 ml-1">({artist.stats.reviews} avaliações)</span>
                  </div>
                </div>

                {/* Stats Grid - Similar to user-profile */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                    <div className="text-3xl font-black text-white">{artist.stats.experience}</div>
                    <div className="text-red-200 text-sm">Anos</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                    <div className="text-3xl font-black text-white">{artist.stats.worksCompleted}</div>
                    <div className="text-red-200 text-sm">Trabalhos</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                    <div className="text-3xl font-black text-white">{artist.stats.reviews}</div>
                    <div className="text-red-200 text-sm">Avaliações</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                    <div className={`text-3xl font-black ${artist.isAvailable ? 'text-green-400' : 'text-orange-400'}`}>
                      {artist.isAvailable ? '✓' : '⏱'}
                    </div>
                    <div className="text-red-200 text-sm">
                      {artist.isAvailable ? 'Disponível' : 'Ocupado'}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {artist.specialties.map(specialty => (
                    <Badge key={specialty} variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 px-3 py-1">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content with Tabs - Similar to user-profile */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
              <TabsTrigger value="qualification">Qualificação</TabsTrigger>
              <TabsTrigger value="contact">Contato</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Biography */}
                  <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
                    <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg">
                      <CardTitle className="text-2xl font-black text-red-600">Sobre o Artista</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-700 leading-relaxed text-lg">{artist.bio}</p>
                    </CardContent>
                  </Card>

                  {/* Recent Portfolio Preview */}
                  <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
                    <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg">
                      <CardTitle className="text-2xl font-black text-red-600 flex items-center">
                        <Eye className="h-6 w-6 mr-2" />
                        Trabalhos Recentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {artist.portfolio.slice(0, 6).map((work) => (
                          <div
                            key={work.id}
                            className="group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-red-glow transition-all duration-300 transform hover:scale-105"
                            onClick={() => setSelectedImage(work.image)}
                          >
                            <img
                              src={work.image}
                              alt={work.title}
                              className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        <Button 
                          variant="outline" 
                          onClick={() => document.querySelector('[value="portfolio"]')?.click()}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Ver Portfólio Completo ({artist.portfolio.length} trabalhos)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Contact */}
                  <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200">
                    <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 rounded-t-lg">
                      <CardTitle className="text-xl font-black text-red-600">Contato Rápido</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                        onClick={() => window.open(`https://wa.me/${artist.contact.whatsapp.replace(/\D/g, '')}`, '_blank')}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-pink-500 text-pink-600 hover:bg-pink-50"
                        onClick={() => window.open(`https://instagram.com/${artist.contact.instagram.replace('@', '')}`, '_blank')}
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Status */}
                  <Card className="shadow-xl bg-gradient-to-br from-white to-green-50 border-green-200">
                    <CardHeader className="bg-gradient-to-r from-green-100 to-green-200 rounded-t-lg">
                      <CardTitle className="text-xl font-black text-green-600 flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className={`text-center p-4 rounded-lg ${
                        artist.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        <div className="font-bold text-lg">
                          {artist.isAvailable ? '✅ Disponível' : '⏰ Agenda Cheia'}
                        </div>
                        <div className="text-sm mt-1">
                          {artist.isAvailable 
                            ? 'Aceitando novos projetos' 
                            : 'Lista de espera disponível'
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Specialties */}
                  <Card className="shadow-xl bg-gradient-to-br from-white to-blue-50 border-blue-200">
                    <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-t-lg">
                      <CardTitle className="text-xl font-black text-blue-600">Especialidades</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {artist.specialties.map(specialty => (
                          <div key={specialty} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                            <span className="font-medium text-blue-800">{specialty}</span>
                            <Star className="h-4 w-4 text-blue-600" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-8">
              <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
                <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg">
                  <CardTitle className="text-3xl font-black text-red-600 flex items-center">
                    <Eye className="h-8 w-8 mr-3" />
                    Portfólio Completo ({artist.portfolio.length} trabalhos)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {artist.portfolio.map((work) => (
                      <Dialog key={work.id}>
                        <DialogTrigger asChild>
                          <div className="group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-red-glow transition-all duration-300 transform hover:scale-105">
                            <img
                              src={work.image}
                              alt={work.title}
                              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="p-4 bg-white">
                              <h3 className="font-black text-gray-800 mb-2 text-lg">{work.title}</h3>
                              <p className="text-sm text-gray-600 mb-3">{work.description}</p>
                              <Badge variant="outline" className="text-red-600 border-red-300">
                                {work.style}
                              </Badge>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl bg-black/90 border-red-500">
                          <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                              <img
                                src={work.image}
                                alt={work.title}
                                className="w-full h-auto rounded-lg shadow-2xl"
                              />
                            </div>
                            <div className="lg:w-80 text-white space-y-4">
                              <h2 className="text-2xl font-black text-red-400">{work.title}</h2>
                              <p className="text-gray-300">{work.description}</p>
                              <Badge variant="outline" className="text-red-400 border-red-400">
                                {work.style}
                              </Badge>
                              <div className="pt-4 space-y-3">
                                <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900">
                                  <Heart className="h-4 w-4 mr-2" />
                                  Curtir Trabalho
                                </Button>
                                <Button variant="outline" className="w-full border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Solicitar Orçamento
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qualification" className="space-y-8">
              <Card className="shadow-xl bg-gradient-to-br from-white to-blue-50 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-t-lg">
                  <CardTitle className="text-3xl font-black text-blue-600 flex items-center">
                    <BarChart3 className="h-8 w-8 mr-3" />
                    Preferências e Qualificação do Estúdio
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Team Structure */}
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardHeader>
                        <CardTitle className="text-lg font-black text-purple-700 flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          Estrutura de Equipe
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-3">Quantos tatuadores trabalham em seu estúdio?</p>
                        <Badge className="bg-purple-500 text-white px-4 py-2 text-lg">
                          {artist.studioQualification.teamSize}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Appointment Management */}
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardHeader>
                        <CardTitle className="text-lg font-black text-green-700 flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          Gestão de Agendamentos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-3">Como gerencia seus agendamentos atualmente?</p>
                        <Badge className="bg-green-500 text-white px-4 py-2 text-lg">
                          {artist.studioQualification.appointmentManagement}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Marketing Channels */}
                    <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
                      <CardHeader>
                        <CardTitle className="text-lg font-black text-pink-700 flex items-center">
                          <Target className="h-5 w-5 mr-2" />
                          Canais de Divulgação
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-3">Principais canais de captação de clientes:</p>
                        <div className="flex flex-wrap gap-2">
                          {artist.studioQualification.marketingChannels.map((channel, index) => (
                            <Badge key={index} className="bg-pink-500 text-white">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Financial Control */}
                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                      <CardHeader>
                        <CardTitle className="text-lg font-black text-yellow-700 flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2" />
                          Controle Financeiro
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-3">Como organiza o controle financeiro?</p>
                        <Badge className="bg-yellow-500 text-white px-4 py-2 text-lg">
                          {artist.studioQualification.financialControl}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Stock Control */}
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <CardHeader>
                        <CardTitle className="text-lg font-black text-orange-700">Controle de Estoque</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-3">Realiza controle de estoque de materiais?</p>
                        <Badge className="bg-orange-500 text-white px-4 py-2 text-lg">
                          {artist.studioQualification.stockControl}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Growth Goals */}
                    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                      <CardHeader>
                        <CardTitle className="text-lg font-black text-red-700">Objetivos de Crescimento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-3">Principal objetivo para os próximos 12 meses:</p>
                        <Badge className="bg-red-500 text-white px-4 py-2 text-lg">
                          {artist.studioQualification.growthGoals}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Digitalization Interest - Featured */}
                  <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                    <CardHeader>
                      <CardTitle className="text-2xl font-black text-indigo-700 flex items-center">
                        <Zap className="h-6 w-6 mr-2" />
                        Interesse em Digitalização
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-gray-700 text-lg">
                        Nível de interesse em digitalizar processos do estúdio:
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className={`px-6 py-3 text-lg font-bold ${
                            artist.studioQualification.digitalizationInterest === 'Muito Alto' ? 'bg-green-500 text-white' :
                            artist.studioQualification.digitalizationInterest === 'Alto' ? 'bg-blue-500 text-white' :
                            artist.studioQualification.digitalizationInterest === 'Médio' ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                            {artist.studioQualification.digitalizationInterest}
                          </Badge>
                          <span className="text-2xl font-black text-indigo-600">
                            {getDigitalizationProgress(artist.studioQualification.digitalizationInterest)}%
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Potencial Cliente 99Tattoo</span>
                            <span>{getDigitalizationProgress(artist.studioQualification.digitalizationInterest)}%</span>
                          </div>
                          <Progress 
                            value={getDigitalizationProgress(artist.studioQualification.digitalizationInterest)} 
                            className="h-3"
                          />
                        </div>
                      </div>
                      
                      {getDigitalizationProgress(artist.studioQualification.digitalizationInterest) >= 75 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-green-800 font-medium">
                            🎯 <strong>Alto Potencial:</strong> Este tatuador demonstra grande interesse em soluções digitais e pode ser um excelente cliente para os produtos e serviços da 99Tattoo.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200">
                  <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 rounded-t-lg">
                    <CardTitle className="text-2xl font-black text-red-600">Informações de Contato</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-green-50 rounded-lg">
                        <MessageCircle className="h-6 w-6 mr-4 text-green-600" />
                        <div>
                          <div className="font-bold text-gray-800">WhatsApp</div>
                          <div className="text-gray-600">{artist.contact.whatsapp}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-pink-50 rounded-lg">
                        <Instagram className="h-6 w-6 mr-4 text-pink-600" />
                        <div>
                          <div className="font-bold text-gray-800">Instagram</div>
                          <div className="text-gray-600">{artist.contact.instagram}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                        <Mail className="h-6 w-6 mr-4 text-blue-600" />
                        <div>
                          <div className="font-bold text-gray-800">E-mail</div>
                          <div className="text-gray-600">{artist.contact.email}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                        onClick={() => window.open(`https://wa.me/${artist.contact.whatsapp.replace(/\D/g, '')}`, '_blank')}
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Conversar no WhatsApp
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-pink-500 text-pink-600 hover:bg-pink-50 py-3"
                        onClick={() => window.open(`https://instagram.com/${artist.contact.instagram.replace('@', '')}`, '_blank')}
                      >
                        <Instagram className="h-5 w-5 mr-2" />
                        Seguir no Instagram
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 py-3"
                        onClick={() => window.open(`mailto:${artist.contact.email}`, '_blank')}
                      >
                        <Mail className="h-5 w-5 mr-2" />
                        Enviar E-mail
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-xl bg-gradient-to-br from-white to-green-50 border-green-200">
                  <CardHeader className="bg-gradient-to-r from-green-100 to-green-200 rounded-t-lg">
                    <CardTitle className="text-2xl font-black text-green-600">Agendar Consulta</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className={`text-center p-6 rounded-lg mb-6 ${
                      artist.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      <div className="text-2xl font-black mb-2">
                        {artist.isAvailable ? '✅ Disponível para Novos Projetos' : '⏰ Agenda Temporariamente Cheia'}
                      </div>
                      <div>
                        {artist.isAvailable 
                          ? 'Entre em contato para agendar sua consulta gratuita' 
                          : 'Lista de espera disponível - entre em contato'
                        }
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Button 
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 font-bold py-4 text-lg"
                        disabled={!artist.isAvailable}
                      >
                        <Calendar className="h-5 w-5 mr-2" />
                        {artist.isAvailable ? 'Agendar Consulta Gratuita' : 'Entrar na Lista de Espera'}
                      </Button>
                      
                      <div className="text-center text-sm text-gray-600">
                        <p>📍 {artist.location.studio}</p>
                        <p>{artist.location.city}, {artist.location.state}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistProfile;
