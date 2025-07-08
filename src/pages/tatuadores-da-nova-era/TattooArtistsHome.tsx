
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Award, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const TattooArtistsHome = () => {
  const features = [
    {
      icon: Users,
      title: "Rede de Tatuadores",
      description: "Conecte-se com os melhores tatuadores do Brasil"
    },
    {
      icon: Calendar,
      title: "Agendamento Online",
      description: "Sistema completo de agendamento para seus clientes"
    },
    {
      icon: Award,
      title: "Certificação",
      description: "Certificados e validação profissional"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-white text-red-600 mb-6 px-4 py-2 text-lg font-bold">
                ⚡ Tatuadores da Nova Era
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Bem-vindo à <span className="text-white">Nova Era</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                A plataforma mais avançada para tatuadores profissionais
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/tatuadores-da-nova-era/artistas">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 px-8 py-4 text-lg font-bold">
                    Ver Tatuadores
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
                <Link to="/tatuadores-da-nova-era/blog">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg font-bold">
                    Blog
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-red-600 mb-6">
                Por que escolher a Nova Era?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto mb-6 flex items-center justify-center">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-red-600">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default TattooArtistsHome;
