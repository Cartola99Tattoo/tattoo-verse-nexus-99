
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Star, Instagram, MessageCircle, Mail, Calendar, Award, Clock, Phone, Eye, Heart } from "lucide-react";
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
              onClick={() => navigate('/tatuadores-da-nova-era')}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Início
            </Button>
          </div>
        </div>
      </TattooArtistLayout>
    );
  }

  return (
    <TattooArtistLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header com foto e informações principais */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-12">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/tatuadores-da-nova-era')}
              className="text-white hover:bg-white/10 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Artistas
            </Button>
            
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-white shadow-2xl mx-auto lg:mx-0"
                />
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

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-black text-white">{artist.stats.experience}</div>
                    <div className="text-red-200 text-sm">Anos</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-black text-white">{artist.stats.worksCompleted}</div>
                    <div className="text-red-200 text-sm">Trabalhos</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-black text-white">{artist.stats.reviews}</div>
                    <div className="text-red-200 text-sm">Avaliações</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className={`text-2xl font-black ${artist.isAvailable ? 'text-green-400' : 'text-orange-400'}`}>
                      {artist.isAvailable ? '✓' : '⏱'}
                    </div>
                    <div className="text-red-200 text-sm">
                      {artist.isAvailable ? 'Disponível' : 'Ocupado'}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
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

        {/* Conteúdo principal */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Conteúdo principal - 3 colunas */}
            <div className="xl:col-span-3 space-y-8">
              {/* Biografia */}
              <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
                <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg">
                  <CardTitle className="text-2xl font-black text-red-600">Sobre o Artista</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed text-lg">{artist.bio}</p>
                </CardContent>
              </Card>

              {/* Portfólio */}
              <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
                <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg">
                  <CardTitle className="text-2xl font-black text-red-600 flex items-center">
                    <Eye className="h-6 w-6 mr-2" />
                    Portfólio ({artist.portfolio.length} trabalhos)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                              <h3 className="font-bold text-gray-800 mb-1">{work.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{work.description}</p>
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
                              <div className="pt-4 space-y-2">
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
            </div>

            {/* Sidebar - 1 coluna */}
            <div className="space-y-6">
              {/* Contato */}
              <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200">
                <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 rounded-t-lg">
                  <CardTitle className="text-xl font-black text-red-600">Contato</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
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
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                    onClick={() => window.open(`mailto:${artist.contact.email}`, '_blank')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    E-mail
                  </Button>
                </CardContent>
              </Card>

              {/* Status e Agendamento */}
              <Card className="shadow-xl bg-gradient-to-br from-white to-green-50 border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-100 to-green-200 rounded-t-lg">
                  <CardTitle className="text-xl font-black text-green-600 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Agendamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className={`text-center p-3 rounded-lg ${
                    artist.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    <div className="font-bold">
                      {artist.isAvailable ? '✅ Disponível' : '⏰ Agenda Cheia'}
                    </div>
                    <div className="text-sm">
                      {artist.isAvailable 
                        ? 'Aceitando novos projetos' 
                        : 'Lista de espera disponível'
                      }
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 font-bold"
                    disabled={!artist.isAvailable}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {artist.isAvailable ? 'Agendar Consulta' : 'Entrar na Lista'}
                  </Button>
                </CardContent>
              </Card>

              {/* Especialidades */}
              <Card className="shadow-xl bg-gradient-to-br from-white to-blue-50 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-t-lg">
                  <CardTitle className="text-xl font-black text-blue-600">Especialidades</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {artist.specialties.map(specialty => (
                      <div key={specialty} className="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                        <span className="font-medium text-blue-800">{specialty}</span>
                        <Star className="h-4 w-4 text-blue-600" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Estatísticas */}
              <Card className="shadow-xl bg-gradient-to-br from-white to-purple-50 border-purple-200">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-t-lg">
                  <CardTitle className="text-xl font-black text-purple-600 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Estatísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Experiência</span>
                    <span className="font-bold text-purple-600">{artist.stats.experience} anos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trabalhos</span>
                    <span className="font-bold text-purple-600">{artist.stats.worksCompleted}+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avaliação</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-bold text-purple-600">{artist.stats.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reviews</span>
                    <span className="font-bold text-purple-600">{artist.stats.reviews}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistProfile;
