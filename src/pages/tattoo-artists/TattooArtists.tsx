
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Award, ShoppingCart, Calendar, Star, ArrowRight } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const TattooArtists = () => {
  const features = [
    {
      icon: Users,
      title: "Rede de Profissionais",
      description: "Conecte-se com outros tatuadores e construa sua rede profissional",
      link: "/tatuadores-da-nova-era/artistas"
    },
    {
      icon: ShoppingCart,
      title: "Loja Especializada",
      description: "Acesso exclusivo a produtos profissionais com preços especiais",
      link: "/tatuadores-da-nova-era/shop"
    },
    {
      icon: Calendar,
      title: "Gestão de Agenda",
      description: "Ferramentas avançadas para gerenciar seus agendamentos",
      link: "/tatuadores-da-nova-era/servicos"
    },
    {
      icon: Award,
      title: "Certificações",
      description: "Programas de certificação e desenvolvimento profissional",
      link: "/tatuadores-da-nova-era/servicos"
    }
  ];

  const stats = [
    { number: "500+", label: "Tatuadores Ativos" },
    { number: "10k+", label: "Trabalhos Realizados" },
    { number: "50+", label: "Cidades Atendidas" },
    { number: "4.9", label: "Avaliação Média", icon: Star }
  ];

  return (
    <TattooArtistLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Tatuadores da <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200">Nova Era</span>
              </h1>
              <p className="text-xl text-red-100 max-w-3xl mx-auto mb-8">
                Plataforma exclusiva para tatuadores profissionais que buscam revolucionar seus estúdios com tecnologia de ponta
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/tatuadores-da-nova-era/artistas">
                  <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 text-lg font-bold">
                    Conhecer Artistas
                  </Button>
                </Link>
                <Link to="/tatuadores-da-nova-era/shop">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-bold">
                    Explorar Loja
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-4xl font-black text-red-600">{stat.number}</span>
                    {stat.icon && <stat.icon className="h-6 w-6 text-yellow-500 ml-1 fill-yellow-500" />}
                  </div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-900 mb-4">
                Tudo que Você Precisa em Um Só Lugar
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Descubra as ferramentas e recursos exclusivos desenvolvidos especialmente para tatuadores profissionais
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-red-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <feature.icon className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <CardTitle className="text-lg font-bold text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <Link to={feature.link}>
                      <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                        Explorar
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-black mb-4">
              Faça Parte da Revolução Digital
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Junte-se aos tatuadores que já estão transformando seus estúdios com nossas soluções inovadoras
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 text-lg font-bold">
                Cadastrar Estúdio
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-bold">
                Saber Mais
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtists;
