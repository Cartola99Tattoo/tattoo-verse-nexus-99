
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

interface ComingSoonProps {
  title: string;
  description: string;
  pageType?: string;
}

const ComingSoon = ({ title, description, pageType = "página" }: ComingSoonProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-red-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">99</span>
              </div>
              <span className="text-xl font-bold text-white">Tattoo</span>
              <span className="text-red-400 text-sm ml-2">Para Tatuadores</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Wrench className="h-10 w-10 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{title}</h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {description}
              </p>
              
              <div className="space-y-4">
                <p className="text-gray-500">
                  Esta {pageType} estará disponível em breve com recursos exclusivos para tatuadores profissionais.
                </p>
                
                <Link to="/tatuadores-da-nova-era">
                  <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-8 py-3">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar à Página Principal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
