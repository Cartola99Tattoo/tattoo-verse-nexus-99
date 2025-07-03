
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

interface ComingSoonProps {
  title: string;
  description: string;
  pageType: string;
}

const ComingSoon = ({ title, description, pageType }: ComingSoonProps) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-12">
            <div className="mb-8">
              <Construction className="h-24 w-24 text-red-500 mx-auto mb-6" />
              <h1 className="text-4xl font-black text-gray-800 mb-4">{title}</h1>
              <p className="text-xl text-gray-600 mb-8">
                {description}
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-red-800 mb-2">Em Desenvolvimento</h3>
              <p className="text-red-700">
                Nossa equipe está trabalhando intensamente para trazer a melhor {pageType} para você. 
                Em breve, esta seção estará disponível com todas as funcionalidades.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 mb-6">
                Enquanto isso, você pode:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Link to="/tatuadores-da-nova-era/artistas">
                  <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50">
                    Explorar Artistas
                  </Button>
                </Link>
                <Link to="/tatuadores-da-nova-era/portfolio">
                  <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50">
                    Ver Portfólio
                  </Button>
                </Link>
              </div>

              <div className="border-t pt-6">
                <p className="text-sm text-gray-500 mb-4">Precisa entrar em contato?</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button size="sm" variant="outline" className="border-gray-300">
                    <Mail className="h-4 w-4 mr-2" />
                    contato@99tattoo.com.br
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-300">
                    <Phone className="h-4 w-4 mr-2" />
                    (11) 99999-9999
                  </Button>
                </div>
              </div>

              <Link to="/tatuadores-da-nova-era">
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold mt-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComingSoon;
