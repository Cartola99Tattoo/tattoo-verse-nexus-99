import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Palette, Award, Star, MapPin, Instagram, MessageCircle } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import { getAllTattooArtists, getAvailableTattooArtists } from "@/data/mockTattooArtists";

const TattooArtistsLanding = () => {
  const allArtists = getAllTattooArtists();
  const availableArtists = getAvailableTattooArtists();
  const featuredArtists = allArtists.slice(0, 3); // Featured artists for homepage

  return (
    <TattooArtistLayout>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="hero-overlay absolute inset-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="text-gradient-red">Tatuadores</span>
              <br />
              da Nova Era
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed">
              Conecte-se com os melhores tatuadores do Brasil. Encontre o artista perfeito para transformar sua ideia em arte permanente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/tatuadores-da-nova-era/artistas">
                <Button size="lg" className="btn-gradient text-lg px-8 py-4 shadow-2xl">
                  <Users className="h-5 w-5 mr-2" />
                  Explorar Artistas
                </Button>
              </Link>
              <Link to="/tatuadores-da-nova-era/portfolio">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-4">
                  <Palette className="h-5 w-5 mr-2" />
                  Ver Portfólio
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-black text-red-400">{allArtists.length}+</div>
                <div className="text-red-200">Artistas Cadastrados</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-black text-red-400">{availableArtists.length}</div>
                <div className="text-red-200">Disponíveis Agora</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-black text-red-400">15+</div>
                <div className="text-red-200">Estilos Diferentes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-4">
              Artistas em <span className="text-gradient-red">Destaque</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conheça alguns dos nossos tatuadores mais talentosos e experientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredArtists.map((artist) => (
              <Card key={artist.id} className="card-artist hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative">
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold ${
                    artist.isAvailable 
                      ? 'bg-green-500 text-white' 
                      : 'bg-orange-500 text-white'
                  }`}>
                    {artist.isAvailable ? '✅ Disponível' : '⏰ Ocupado'}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-2xl font-black text-gray-800 mb-2">{artist.name}</h3>
                  
                  <div className="flex items-center mb-3">
                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                    <span className="text-gray-600">
                      {artist.location.city}, {artist.location.state}
                    </span>
                  </div>

                  <div className="flex items-center mb-4">
                    <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">{artist.stats.rating}</span>
                    <span className="text-gray-500 ml-1">({artist.stats.reviews} avaliações)</span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{artist.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {artist.specialties.slice(0, 3).map(specialty => (
                      <Badge key={specialty} variant="outline" className="border-red-300 text-red-600">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Link to={`/tatuadores-da-nova-era/perfil/${artist.id}`}>
                      <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 font-bold">
                        Ver Perfil Completo
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => window.open(`https://wa.me/${artist.contact.whatsapp.replace(/\D/g, '')}`, '_blank')}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-pink-500 text-pink-600 hover:bg-pink-50"
                        onClick={() => window.open(`https://instagram.com/${artist.contact.instagram.replace('@', '')}`, '_blank')}
                      >
                        <Instagram className="h-4 w-4 mr-1" />
                        Instagram
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/tatuadores-da-nova-era/artistas">
              <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-4">
                Ver Todos os {allArtists.length} Artistas
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20 section-bg-red">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-4">
              Estilos & <span className="text-gradient-red">Especialidades</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encontre o artista especializado no estilo perfeito para sua tatuagem
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['Realismo', 'Blackwork', 'Old School', 'Oriental', 'Aquarela', 'Geometric', 'Fine Line', 'Biomecânico', 'Neo Traditional', 'Dotwork'].map((style) => (
              <Link key={style} to={`/tatuadores-da-nova-era/artistas?specialty=${style}`}>
                <Card className="card-interactive text-center p-4 hover:shadow-red-glow">
                  <div className="text-3xl mb-2">🎨</div>
                  <h3 className="font-bold text-gray-800">{style}</h3>
                  <p className="text-sm text-gray-600">
                    {allArtists.filter(a => a.specialties.includes(style)).length} artistas
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">
            Pronto para Encontrar seu <span className="text-gradient-red">Artista Ideal?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Navegue por centenas de portfólios, compare estilos e encontre o tatuador perfeito para dar vida à sua ideia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tatuadores-da-nova-era/artistas">
              <Button size="lg" className="btn-gradient text-lg px-8 py-4 shadow-2xl">
                <Users className="h-5 w-5 mr-2" />
                Explorar Todos os Artistas
              </Button>
            </Link>
            <Link to="/tatuadores-da-nova-era/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4">
                <MessageCircle className="h-5 w-5 mr-2" />
                Fale Conosco
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </TattooArtistLayout>
  );
};

export default TattooArtistsLanding;
