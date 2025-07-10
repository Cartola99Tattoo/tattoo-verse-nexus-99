
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Heart, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Sobre a <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200">99Tattoo</span>
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Conectando tatuadores profissionais com a tecnologia que precisam para crescer e prosperar no mercado moderno
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle className="text-red-600">Nossa Missão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Empoderar tatuadores com ferramentas digitais para expandir seus negócios
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Award className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle className="text-red-600">Excelência</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Comprometidos com a qualidade e inovação em cada solução
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle className="text-red-600">Paixão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Movidos pela paixão pela arte da tatuagem e tecnologia
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Target className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle className="text-red-600">Visão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Ser a principal plataforma para tatuadores profissionais
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa História</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            A 99Tattoo nasceu da necessidade de conectar o mundo tradicional da tatuagem com as possibilidades infinitas da tecnologia moderna. 
            Criamos um ecossistema completo onde tatuadores podem encontrar as ferramentas, produtos e recursos necessários para elevar 
            seus estúdios ao próximo nível.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
