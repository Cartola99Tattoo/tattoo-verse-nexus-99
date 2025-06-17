
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Star, ShoppingCart } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const TattooArtistsShop = () => {
  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Loja para 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Profissionais</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Materiais de qualidade, equipamentos profissionais e produtos exclusivos para tatuadores
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {/* Preview Products */}
          {[
            {
              name: "Kit Agulhas Premium",
              price: "R$ 149,90",
              category: "Agulhas",
              rating: 4.9
            },
            {
              name: "Máquina Rotativa Pro",
              price: "R$ 890,00",
              category: "Máquinas",
              rating: 4.8
            },
            {
              name: "Tintas Black Label Set",
              price: "R$ 280,00",
              category: "Tintas",
              rating: 5.0
            },
            {
              name: "Filme Protetor (100un)",
              price: "R$ 45,90",
              category: "Descartáveis",
              rating: 4.7
            }
          ].map((product, index) => (
            <Card key={index} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-3">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
                <div className="text-sm text-red-600 font-semibold">{product.category}</div>
                <CardTitle className="text-lg font-bold text-gray-900">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-1 mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-red-600">{product.price}</span>
                  <ShoppingCart className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="bg-red-600/10 border-red-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Loja em Desenvolvimento!</h2>
              <p className="text-gray-300 text-lg mb-6">
                Estamos criando uma experiência de compra única para tatuadores profissionais. 
                Em breve você terá acesso aos melhores produtos com preços exclusivos.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-gray-300">
                  <Package className="h-6 w-6 text-red-400 mx-auto mb-2" />
                  <div>Produtos Premium</div>
                </div>
                <div className="text-gray-300">
                  <Star className="h-6 w-6 text-red-400 mx-auto mb-2" />
                  <div>Preços Especiais</div>
                </div>
                <div className="text-gray-300">
                  <ShoppingCart className="h-6 w-6 text-red-400 mx-auto mb-2" />
                  <div>Entrega Rápida</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsShop;
