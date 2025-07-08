
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Phone, Mail, Calendar, MessageCircle, Heart } from "lucide-react";

const TattooArtistProfile = () => {
  const { artistId } = useParams();

  // Mock data baseado no ID
  const artist = {
    id: artistId,
    name: "Marina Santos",
    specialty: "Fine Line & Minimalismo",
    rating: 4.9,
    reviewsCount: 127,
    location: "São Paulo, SP",
    phone: "(11) 99999-9999",
    email: "marina@99tattoo.com.br",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b002?w=150&h=150&fit=crop&crop=face",
    bio: "Especialista em tatuagens delicadas e minimalistas. Com mais de 8 anos de experiência, Marina é reconhecida por sua precisão e atenção aos detalhes.",
    portfolio: [
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop"
    ],
    services: [
      { name: "Tatuagem Fine Line", price: "R$ 300-800" },
      { name: "Tatuagem Minimalista", price: "R$ 250-600" },
      { name: "Retoque", price: "R$ 150-300" }
    ],
    availability: "Segunda a Sexta: 9h às 18h"
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header do Perfil */}
        <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                <AvatarImage src={artist.image} alt={artist.name} />
                <AvatarFallback className="bg-red-500 text-white text-2xl">
                  {artist.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{artist.name}</h1>
                <p className="text-red-100 mb-4 text-lg">{artist.specialty}</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{artist.rating} ({artist.reviewsCount} avaliações)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{artist.location}</span>
                  </div>
                </div>

                <p className="text-red-100 mb-6">{artist.bio}</p>
                
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-white text-red-600 hover:bg-red-50">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Consulta
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Conversar
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                    <Heart className="h-4 w-4 mr-2" />
                    Favoritar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conteúdo Principal */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="portfolio" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white border-2 border-red-200 rounded-xl p-1">
                <TabsTrigger value="portfolio" className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold">
                  Portfólio
                </TabsTrigger>
                <TabsTrigger value="services" className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold">
                  Serviços
                </TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold">
                  Contato
                </TabsTrigger>
              </TabsList>

              {/* Portfólio */}
              <TabsContent value="portfolio">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {artist.portfolio.map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                      <img 
                        src={image} 
                        alt={`Trabalho ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Serviços */}
              <TabsContent value="services">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {artist.services.map((service, index) => (
                    <Card key={index} className="bg-white border-2 border-red-200 shadow-xl">
                      <CardHeader>
                        <CardTitle className="text-red-600">{service.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-red-600">{service.price}</span>
                          <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900">
                            Agendar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Contato */}
              <TabsContent value="contact">
                <Card className="bg-white border-2 border-red-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-red-600">Informações de Contato</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-red-600" />
                      <span>{artist.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-red-600" />
                      <span>{artist.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-red-600" />
                      <span>{artist.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-red-600" />
                      <span>{artist.availability}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default TattooArtistProfile;
