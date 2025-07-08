import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Star, Heart, Minus, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import { useTattooArtistShop } from "@/contexts/TattooArtistShopContext";
import CartSidebar from "@/components/tattoo-artists/CartSidebar";

const TattooArtistsProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, addToCart, isInCart } = useTattooArtistShop();
  const [quantity, setQuantity] = useState(1);

  const product = getProduct(Number(id));

  if (!product) {
    return (
      <TattooArtistLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
            <Button onClick={() => navigate('/tatuadores-da-nova-era/shop')}>
              Voltar à Loja
            </Button>
          </div>
        </div>
      </TattooArtistLayout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Produto adicionado!",
      description: `${quantity}x ${product.name} adicionado(s) ao carrinho.`,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <TattooArtistLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/tatuadores-da-nova-era/shop')}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à Loja
            </Button>
            
            <div className="hidden md:block">
              <CartSidebar>
                <Button variant="outline" size="icon" className="border-red-200 text-red-600 hover:bg-red-50">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </CartSidebar>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">por {product.artist}</p>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  <span className="text-gray-500">({product.reviews} avaliações)</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-red-600">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <span className="font-medium">Quantidade:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 p-0 rounded-full"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium px-4 py-2 bg-gray-50 rounded-lg min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10 p-0 rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={isInCart(product.id)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isInCart(product.id) ? 'Produto no Carrinho' : 'Adicionar ao Carrinho'}
                </Button>
              </div>
            </div>
          </div>

          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Descrição do Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{product.detailedDescription || product.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsProductDetail;