
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users, Shield, Zap, Award, CheckCircle, ArrowRight } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const mockServices = [
  {
    id: 1,
    name: "Tatuagem Realista",
    description: "Técnica avançada de realismo com sombreados perfeitos e detalhes impressionantes",
    price: "A partir de R$ 350",
    duration: "4-8 horas",
    difficulty: "Avançado",
    popularity: 95,
    image: "https://images.unsplash.com/photo-1564131072-6c4d41e23ba6?w=300&h=200&fit=crop",
    features: [
      "Consulta prévia gratuita",
      "Desenho personalizado",
      "Acompanhamento pós-tatuagem",
      "Retoque gratuito em 30 dias"
    ]
  },
  {
    id: 2,
    name: "Tatuagem Aquarela",
    description: "Estilo único com cores vibrantes e efeitos de tinta aquarela",
    price: "A partir de R$ 280",
    duration: "3-6 horas",
    difficulty: "Intermediário",
    popularity: 87,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=200&fit=crop",
    features: [
      "Cores exclusivas importadas",
      "Técnica especializada",
      "Certificado de autenticidade",
      "Garantia de qualidade"
    ]
  },
  {
    id: 3,
    name: "Blackwork",
    description: "Tatuagens em preto sólido com padrões geométricos e ornamentais",
    price: "A partir de R$ 200",
    duration: "2-5 horas",
    difficulty: "Intermediário",
    popularity: 82,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    features: [
      "Padrões únicos",
      "Tinta premium",
      "Desenho sob medida",
      "Acabamento perfeito"
    ]
  },
  {
    id: 4,
    name: "Fine Line",
    description: "Tatuagens delicadas com traços finos e detalhes minimalistas",
    price: "A partir de R$ 150",
    duration: "1-3 horas",
    difficulty: "Especializado",
    popularity: 78,
    image: "https://images.unsplash.com/photo-1565058379802-bbe93b2b2a98?w=300&h=200&fit=crop",
    features: [
      "Precisão milimétrica",
      "Agulhas especiais",
      "Cicatrização rápida",
      "Estilo minimalista"
    ]
  }
];

const additionalServices = [
  {
    name: "Consultoria de Design",
    description: "Criação de desenhos personalizados",
    price: "R$ 100",
    icon: <Award className="h-6 w-6" />
  },
  {
    name: "Cobertura de Tatuagem",
    description: "Renovação de tatuagens antigas",
    price: "A partir de R$ 250",
    icon: <Shield className="h-6 w-6" />
  },
  {
    name: "Sessão de Retoque",
    description: "Manutenção e ajustes",
    price: "R$ 80",
    icon: <Zap className="h-6 w-6" />
  }
];

const TattooArtistsServices = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-800';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      case 'Especializado': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Nossos <span className="text-red-400">Serviços</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubra os serviços de tatuagem oferecidos pelos melhores profissionais da rede 99Tattoo
          </p>
        </div>

        {/* Serviços Principais */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {mockServices.map((service) => (
            <Card key={service.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {service.name}
                  </CardTitle>
                  <Badge className={getDifficultyColor(service.difficulty)}>
                    {service.difficulty}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-semibold text-red-600">{service.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {service.duration}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Popularidade</span>
                    <span className="text-sm font-medium">{service.popularity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-600 to-red-700 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${service.popularity}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Incluso no serviço:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                  Agendar Consulta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Serviços Adicionais */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Serviços Adicionais</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <div className="text-xl font-bold text-red-600 mb-4">{service.price}</div>
                  <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-50">
                    Solicitar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Diferenciais */}
        <Card className="mb-16 bg-gradient-to-r from-red-600/10 to-red-700/10 border-red-500/20">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Por que escolher a 99Tattoo?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-red-100 text-red-600 rounded-full">
                    <Users className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Profissionais Certificados</h3>
                <p className="text-gray-300">
                  Todos os nossos tatuadores possuem certificação e anos de experiência comprovada
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-red-100 text-red-600 rounded-full">
                    <Shield className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Segurança Total</h3>
                <p className="text-gray-300">
                  Materiais esterilizados, ambiente higienizado e protocolos de segurança rigorosos
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-red-100 text-red-600 rounded-full">
                    <Star className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Qualidade Garantida</h3>
                <p className="text-gray-300">
                  Garantia em todos os trabalhos e acompanhamento completo do processo de cicatrização
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-red-600/10 to-red-700/10 border-red-500/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Pronto para sua próxima tatuagem?
              </h3>
              <p className="text-gray-300 mb-6">
                Entre em contato conosco e agende uma consulta gratuita para discutir seu projeto
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                  Agendar Consulta
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Ver Portfólio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsServices;
