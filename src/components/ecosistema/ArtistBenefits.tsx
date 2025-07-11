
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { artistBenefits } from "@/data/ecosistemaBenefits";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ArtistBenefits = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-white mb-6">
            Para{" "}
            <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              Tatuadores
            </span>{" "}
            e Estúdios
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Faça parte do maior ecossistema de tatuagem do Brasil e eleve 
            seu negócio a um novo patamar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {artistBenefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card key={index} className="group hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/tatuadores-da-nova-era">
            <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold px-8 py-3 text-lg group">
              Conheça a Comunidade Tatuadores da Nova Era
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArtistBenefits;
