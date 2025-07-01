
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { clientBenefits } from "@/data/ecosistemaBenefits";

const ClientBenefits = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-gray-800 mb-6">
            Para Você que Quer se{" "}
            <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Tatuar
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra por que milhares de pessoas escolhem a 99Tattoo para realizar 
            seus sonhos em arte corporal
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {clientBenefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card key={index} className="group hover:shadow-2xl hover:shadow-red-200 transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white to-red-50 border-red-200">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClientBenefits;
