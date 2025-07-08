
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Zap, Users, ShoppingCart, Calendar, BarChart } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Palette,
      title: "Design & Arte",
      description: "Ferramentas avançadas para criação e personalização de designs únicos",
      features: ["Templates profissionais", "Editor avançado", "Biblioteca de assets"]
    },
    {
      icon: Zap,
      title: "Automação",
      description: "Automatize processos repetitivos e foque no que realmente importa",
      features: ["Agendamentos automáticos", "Lembretes inteligentes", "Workflow otimizado"]
    },
    {
      icon: Users,
      title: "Gestão de Clientes",
      description: "Mantenha relacionamentos duradouros com seus clientes",
      features: ["Base de dados completa", "Histórico detalhado", "Comunicação integrada"]
    },
    {
      icon: ShoppingCart,
      title: "Loja Virtual",
      description: "Venda produtos e serviços através de sua própria loja online",
      features: ["Catálogo completo", "Pagamentos seguros", "Gestão de estoque"]
    },
    {
      icon: Calendar,
      title: "Agendamento",
      description: "Sistema completo de agendamento online para seus clientes",
      features: ["Agenda sincronizada", "Confirmações automáticas", "Cancelamentos inteligentes"]
    },
    {
      icon: BarChart,
      title: "Analytics",
      description: "Insights poderosos para tomar decisões baseadas em dados",
      features: ["Relatórios detalhados", "Métricas de performance", "Previsões de crescimento"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200">Serviços</span>
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Soluções completas para transformar seu estúdio de tatuagem em um negócio digital de sucesso
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="border-red-200 hover:shadow-lg transition-shadow hover:scale-105 transform duration-300">
              <CardHeader>
                <service.icon className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle className="text-xl font-bold text-gray-900">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Pronto para Transformar seu Estúdio?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de tatuadores que já revolucionaram seus negócios com nossas soluções
          </p>
          <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 text-lg">
            Começar Agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Services;
