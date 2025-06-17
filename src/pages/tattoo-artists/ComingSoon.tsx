
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

interface ComingSoonProps {
  title: string;
  description: string;
  pageType?: string;
}

const ComingSoon = ({ title, description, pageType = "página" }: ComingSoonProps) => {
  return (
    <TattooArtistLayout>
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
    </TattooArtistLayout>
  );
};

export default ComingSoon;
