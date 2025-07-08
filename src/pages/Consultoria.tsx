
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Clock, Award, ArrowRight } from "lucide-react";

const Consultoria = () => {
  const services = [
    {
      title: "Consultoria para Tatuadores",
      description: "Ajudamos tatuadores a expandir seus negócios e melhorar suas técnicas",
      price: "R$ 299/mês",
      features: ["Marketing digital", "Gestão de clientes", "Técnicas avançadas", "Suporte 24/7"]
    },
    {
      title: "Consultoria para Estúdios",
      description: "Soluções completas para gestão e crescimento de estúdios de tatuagem",
      price: "R$ 599/mês",
      features: ["Gestão financeira", "Treinamento de equipe", "Padronização de processos", "Marketing especializado"]
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
                🚀 Consultoria Especializada
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Consultoria <span className="text-white">99Tattoo</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                Transforme seu negócio na área de tatuagem com nossa consultoria especializada
              </p>
              
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 px-8 py-4 text-lg font-bold">
                Agendar Consultoria
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-red-600 mb-6">
                Nossos Serviços
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <Card key={index} className="bg-white border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-red-600">{service.title}</CardTitle>
                    <p className="text-gray-600">{service.description}</p>
                    <div className="text-3xl font-black text-red-600">{service.price}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900">
                      Contratar Agora
                    </Button>
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

export default Consultoria;
