
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, Award, Share2, Minus, Plus } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const mockProducts = [
  {
    id: 1,
    name: "Máquina Rotativa Premium Dragon",
    description: "Máquina rotativa profissional de alta precisão para tatuagem. Desenvolvida com tecnologia de ponta para garantir a melhor performance em seus trabalhos. Motor silencioso e durável, ideal para sessões longas.",
    fullDescription: "Esta máquina rotativa representa o que há de mais avançado em tecnologia para tatuagem. Construída com materiais de primeira qualidade, oferece precisão milimétrica e controle total sobre o processo. O motor rotativo de alta performance garante movimentos suaves e consistentes, reduzindo a fadiga do tatuador e proporcionando maior conforto ao cliente. Seu design ergonômico foi pensado para longas sessões de trabalho, mantendo o equilíbrio perfeito entre peso e funcionalidade.",
    price: 1200.00,
    originalPrice: 1500.00,
    category: "Equipamentos",
    brand: "DragonTech",
    rating: 4.9,
    reviews: 156,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=600&fit=crop"
    ],
    features: ["Motor silencioso de alta performance", "Ajuste de profundidade preciso", "Peso perfeitamente balanceado", "Garantia estendida de 2 anos", "Design ergonômico profissional", "Compatível com diversos tipos de agulhas"],
    specifications: {
      "Voltagem": "110V - 220V",
      "Frequência": "50-60 Hz",
      "Peso": "180g",
      "Material": "Liga de alumínio aeronáutico",
      "Stroke": "3.5mm ajustável",
      "Conexão": "RCA padrão"
    },
    bestseller: true,
    freeShipping: true,
    discount: 20
  }
];

const TattooArtistsProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(0);

  // In a real app, this would fetch the product by ID
  const product = mockProducts[0]; // Using mock data

  if (!product) {
    return (
      <TattooArtistLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
            <Button onClick={() => navigate("/tatuadores-da-nova-era/shop")}>
              Voltar à Loja
            </Button>
          </div>
        </div>
      </TattooArtistLayout>
    );
  }

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

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
                    className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-red-500' : 'border-transparent'
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
              <Badge className="mb-4 bg-gradient-to-r from-red-500 to-red-600 text-white">
                {product.category}
              </Badge>
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
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">R$ {product.originalPrice.toFixed(2)}</span>
                    <Badge className="bg-red-100 text-red-800">-{product.discount}%</Badge>
                  </>
                )}
              </div>
              <p className="text-gray-300">em até 12x de R$ {(product.price / 12).toFixed(2)} sem juros</p>
              
              {product.freeShipping && (
                <div className="flex items-center gap-2 text-green-400">
                  <Truck className="h-5 w-5" />
                  <span>Frete Grátis para todo o Brasil</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Descrição</h3>
              <p className="text-gray-300 leading-relaxed">{product.fullDescription}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Características Principais</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Especificações Técnicas</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="text-gray-400">{key}:</span>
                    <span className="text-white ml-2">{value}</span>
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
              <span className="text-gray-300">({product.stock} disponíveis)</span>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Adicionar ao Carrinho
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
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsProductDetail;
