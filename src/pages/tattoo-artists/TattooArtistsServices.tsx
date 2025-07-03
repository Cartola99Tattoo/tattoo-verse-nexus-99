
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen, Building, ArrowRight, CheckCircle } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const mockServices = [
  {
    id: 1,
    title: "Consultoria em Digitalização",
    description: "Ajudamos seu estúdio a migrar para o mundo digital com estratégias personalizadas",
    type: "consultoria",
    duration: "2-4 horas",
    price: 299,
    requirements: [
      "Informações básicas do estúdio",
      "Objetivos de crescimento definidos",
      "Disponibilidade para implementação"
    ]
  },
  {
    id: 2,
    title: "Treinamento em Gestão Digital",
    description: "Capacitação completa para uso eficiente das ferramentas digitais",
    type: "treinamento",
    duration: "1 dia completo",
    price: 450,
    requirements: [
      "Equipe disponível para treinamento",
      "Computador ou tablet para cada participante",
      "Conexão com internet estável"
    ]
  },
  {
    id: 3,
    title: "Workshop de Marketing Digital",
    description: "Estratégias avançadas de marketing digital específicas para tatuadores",
    type: "workshop",
    duration: "4 horas",
    price: 180,
    requirements: [
      "Conhecimento básico de redes sociais",
      "Portfólio de trabalhos disponível",
      "Perfis nas principais plataformas"
    ]
  }
];

const TattooArtistsServices = () => {
  const serviceIcons = {
    consultoria: Building,
    treinamento: Users,
    workshop: BookOpen
  };

  const serviceColors = {
    consultoria: 'from-blue-500 to-blue-600',
    treinamento: 'from-green-500 to-green-600',
    workshop: 'from-purple-500 to-purple-600'
  };

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Nossos
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Serviços</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Consultoria especializada, treinamentos e workshops para elevar seu negócio na tatuagem
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {mockServices.map((service) => {
            const IconComponent = serviceIcons[service.type as keyof typeof serviceIcons];
            const colorClass = serviceColors[service.type as keyof typeof serviceColors];
            
            return (
              <Card key={service.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 group">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    {service.title}
                  </CardTitle>
                  <Badge className={`w-fit bg-gradient-to-r ${colorClass} text-white text-sm font-medium`}>
                    {service.type.charAt(0).toUpperCase() + service.type.slice(1)}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-red-500" />
                      <span className="font-medium">Duração:</span>
                      <span className="ml-2">{service.duration}</span>
                    </div>
                    
                    {service.requirements && service.requirements.length > 0 && (
                      <div>
                        <div className="font-medium text-gray-700 mb-2">Requisitos:</div>
                        <ul className="space-y-1">
                          {service.requirements.map((req, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-red-600">R$ {service.price}</div>
                        <div className="text-sm text-gray-500">Investimento</div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        Disponível
                      </Badge>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold">
                      Solicitar Serviço
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Seção de Benefícios */}
        <div className="mb-16">
          <Card className="bg-red-600/10 border-red-500/30">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Por que Escolher Nossos Serviços?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Experiência Comprovada</h3>
                  <p className="text-gray-300">Mais de 10 anos ajudando tatuadores a crescerem no mercado</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Metodologia Exclusiva</h3>
                  <p className="text-gray-300">Abordagem personalizada para cada perfil profissional</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Resultados Garantidos</h3>
                  <p className="text-gray-300">Acompanhamento contínuo e suporte pós-consultoria</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 border-none max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-white mb-6">Pronto para Transformar Seu Negócio?</h2>
              <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                Entre em contato conosco e descubra como podemos ajudar você a alcançar seus objetivos profissionais
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 font-bold">
                  <Users className="h-5 w-5 mr-2" />
                  Agendar Conversa
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Ver Depoimentos
                  <ArrowRight className="h-5 w-5 ml-2" />
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
