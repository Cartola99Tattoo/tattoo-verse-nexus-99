
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Users, Calendar, Award, Zap, Shield, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const services = [
    {
      icon: Users,
      title: "Encontre Tatuadores Incríveis",
      description: "Acesse o maior catálogo de tatuadores profissionais do Brasil",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Calendar,
      title: "Agendamento Inteligente",
      description: "Sistema de agendamento que conecta você ao tatuador ideal",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Award,
      title: "Qualidade Garantida",
      description: "Todos os profissionais são verificados e avaliados",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Ambiente seguro com pagamento protegido",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      text: "Encontrei o tatuador perfeito para minha primeira tattoo. Processo super tranquilo!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b002?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "João Santos",
      text: "Plataforma incrível! Me ajudou a expandir minha clientela como tatuador.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Ana Costa",
      text: "Melhor investimento que fiz. Consegui agendar com um dos melhores tatuadores de SP!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-black via-gray-900 to-red-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1565058379802-bbe93b2b2a98?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
          <div className="relative container mx-auto px-4 z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-red-600 text-white mb-6 px-4 py-2 text-lg font-bold">
                🔥 A Revolução da Tatuagem Chegou
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-white to-red-300 bg-clip-text text-transparent">
                99Tattoo
              </h1>
              
              <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-300 leading-relaxed">
                Conectando você aos <span className="text-red-400 font-bold">melhores tatuadores</span> do Brasil
              </p>
              
              <p className="text-lg md:text-xl mb-12 text-gray-400 max-w-3xl mx-auto">
                A plataforma mais completa para quem quer fazer uma tatuagem incrível ou expandir sua carreira como tatuador profissional.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/artists">
                  <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-red-glow transition-all duration-300 transform hover:scale-105">
                    <Users className="mr-2 h-6 w-6" />
                    Encontrar Tatuadores
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg font-bold shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Award className="mr-2 h-6 w-6" />
                    Sou Tatuador
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-wrap justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>+10.000 Tatuadores</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-400" />
                  <span>+50.000 Clientes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <span>+100.000 Tatuagens</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                Por que escolher a <span className="text-red-600">99Tattoo</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Oferecemos tudo que você precisa para uma experiência perfeita na sua jornada da tatuagem
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="group bg-white hover:bg-gradient-to-br hover:from-white hover:to-red-50 border-2 border-gray-200 hover:border-red-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-full ${service.color} mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-red-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
                Números que Impressionam
              </h2>
              <p className="text-xl text-red-100">
                Veja o impacto que estamos causando no mundo da tatuagem
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-black mb-4">10K+</div>
                <div className="text-red-100 text-lg">Tatuadores Cadastrados</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-black mb-4">50K+</div>
                <div className="text-red-100 text-lg">Clientes Satisfeitos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-black mb-4">100K+</div>
                <div className="text-red-100 text-lg">Tatuagens Realizadas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-black mb-4">4.9</div>
                <div className="text-red-100 text-lg">Avaliação Média</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                O que nossos <span className="text-red-600">usuários dizem</span>
              </h2>
              <p className="text-xl text-gray-600">
                Histórias reais de pessoas que transformaram suas vidas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white border-2 border-gray-200 hover:border-red-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        <div className="flex gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-red-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
              Pronto para começar sua <span className="text-red-400">jornada</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Junte-se a milhares de pessoas que já encontraram o tatuador perfeito ou expandiram sua carreira conosco
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/artists">
                <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-red-glow transition-all duration-300 transform hover:scale-105">
                  Encontrar Tatuadores
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg font-bold shadow-xl transition-all duration-300 transform hover:scale-105">
                  Cadastrar como Tatuador
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
