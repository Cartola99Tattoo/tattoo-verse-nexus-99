
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, Award, Share2, Minus, Plus, Package } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import { getProductById, mockProducts } from "@/data/mockProducts";
import { useToast } from "@/hooks/use-toast";

const TattooArtistsProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = id ? getProductById(id) : undefined;
  const relatedProducts = mockProducts.filter(p => p.id !== id && p.category === product?.category).slice(0, 4);

  if (!product) {
    return (
      <TattooArtistLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-white">
            <Package className="h-16 w-16 mx-auto mb-4 text-white/50" />
            <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
            <Button onClick={() => navigate("/tatuadores-da-nova-era/shop")}>
              Voltar à Loja
            </Button>
          </div>
        </div>
      </TattooArtistLayout>
    );
  }

  const handleAddToCart = () => {
    toast({
      title: "Produto adicionado ao carrinho!",
      description: `${quantity}x ${product.name} foi adicionado com sucesso.`,
    });
  };

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        <Button 
          onClick={() => navigate("/tatuadores-da-nova-era/shop")}
          variant="outline"
          className="mb-6 text-white border-white/30 hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar à Loja
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-red-500' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                  {product.category}
                </Badge>
                {product.isBestseller && (
                  <Badge className="bg-yellow-500 text-white">
                    <Award className="h-3 w-3 mr-1" />
                    Best Seller
                  </Badge>
                )}
                {product.isNew && (
                  <Badge className="bg-green-500 text-white">
                    Novo
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <p className="text-gray-300 mb-4">{product.brand}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-white">{product.rating}</span>
                <span className="text-gray-300">({product.reviews} avaliações)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-red-400">R$ {product.price.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">R$ {product.originalPrice.toFixed(2)}</span>
                    <Badge className="bg-red-100 text-red-800">-{discount}%</Badge>
                  </>
                )}
              </div>
              <p className="text-gray-300">em até 12x de R$ {(product.price / 12).toFixed(2)} sem juros</p>
              
              <div className="flex items-center gap-2 text-green-400">
                <Truck className="h-5 w-5" />
                <span>Frete Grátis para todo o Brasil</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Descrição</h3>
              <p className="text-gray-300 leading-relaxed">{product.detailedDescription}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Especificações Técnicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 bg-white/10 rounded-lg">
                    <span className="text-gray-400">{key}:</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 py-4 border-t border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-white">Quantidade:</span>
                <div className="flex items-center border border-gray-600 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-white hover:bg-white/10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-white">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-white hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <span className="text-gray-300">
                ({product.stockQuantity} disponíveis)
              </span>
            </div>

            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center justify-around text-sm text-gray-300 py-4 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Compra Protegida
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Garantia do Fabricante
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Entrega Expressa
              </div>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">Produtos Relacionados</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card 
                  key={relatedProduct.id} 
                  className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => navigate(`/tatuadores-da-nova-era/shop/${relatedProduct.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-3">
                      <img 
                        src={relatedProduct.images[0]} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                      {relatedProduct.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-red-600">R$ {relatedProduct.price.toFixed(2)}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">{relatedProduct.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsProductDetail;
