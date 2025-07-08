
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";

const TattooArtistsShop = () => {
  const products = [
    {
      id: 1,
      name: "Kit Iniciante Tatuagem",
      price: "R$ 299,99",
      image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=300&fit=crop",
      rating: 4.8,
      category: "Equipamentos"
    },
    {
      id: 2,
      name: "Tintas Premium Set",
      price: "R$ 199,99",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop",
      rating: 4.9,
      category: "Tintas"
    },
    {
      id: 3,
      name: "Agulhas Profissionais",
      price: "R$ 89,99",
      image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=300&fit=crop",
      rating: 4.7,
      category: "Agulhas"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Loja <span className="text-white">99Tattoo</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                Equipamentos e suprimentos profissionais para tatuadores
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-red-600 mb-6">
                Produtos em Destaque
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map(product => (
                <Card key={product.id} className="bg-white border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="border-red-200 text-red-600">
                        {product.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-red-600">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-red-600">{product.price}</span>
                      <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Comprar
                      </Button>
                    </div>
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

export default TattooArtistsShop;
