
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ShoppingCart, Star, Heart, Share2, Truck, Shield, CreditCard, CheckCircle } from "lucide-react";
import TatuadoresLayout from "@/components/layouts/TatuadoresLayout";

// Mock data (mesmo da página da loja)
const mockProducts = [
  {
    id: "1",
    name: "Kit Tintas Professional Black & Grey",
    description: "Set completo com 12 tons de preto e cinza para trabalhos realistas",
    price: 299.90,
    originalPrice: 349.90,
    category: "Tintas",
    brand: "TattooSupply Pro",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    isNew: false,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80"
    ],
    features: ["Vegana", "Esterilizada", "Alta Pigmentação", "Aprovada ANVISA"],
    specifications: {
      "Composição": "Pigmentos vegetais e minerais",
      "Volume": "12 frascos de 30ml",
      "Validade": "3 anos",
      "Origem": "Nacional",
      "Certificação": "ANVISA, FDA"
    },
    description_full: `
      <p>O Kit Tintas Professional Black & Grey foi desenvolvido especificamente para tatuadores que trabalham com realismo e estilos que exigem precisão em tons de cinza.</p>
      
      <h3>Características principais:</h3>
      <ul>
        <li>12 tons diferentes de preto e cinza cuidadosamente selecionados</li>
        <li>Pigmentação intensa e duradoura</li>
        <li>Fórmula vegana e hipoalergênica</li>
        <li>Esterilização por raios gama</li>
        <li>Aprovação ANVISA para uso profissional</li>
      </ul>
      
      <h3>Tons inclusos:</h3>
      <p>Jet Black, Medium Black, Light Black, Dark Grey, Medium Grey, Light Grey, Warm Grey, Cool Grey, Silver, Charcoal, Smoke Grey, e Stone Grey.</p>
      
      <h3>Recomendações de uso:</h3>
      <p>Ideal para trabalhos de realismo, retratos, paisagens em preto e cinza, e técnicas de sombreamento avançadas. Compatível com todas as máquinas rotativas e bobinas.</p>
    `,
    shipping: {
      weight: "0.5kg",
      dimensions: "25x15x8cm",
      freeShipping: true,
      deliveryTime: "3-5 dias úteis"
    }
  }
  // ... outros produtos
];

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <TatuadoresLayout>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Produto não encontrado</h1>
          <Link to="/tatuadores-da-nova-era/shop">
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à Loja
            </Button>
          </Link>
        </div>
      </TatuadoresLayout>
    );
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };

  return (
    <TatuadoresLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/tatuadores-da-nova-era/shop" className="hover:text-red-600 transition-colors">
            Loja
          </Link>
          <span>/</span>
          <Link to={`/tatuadores-da-nova-era/shop?category=${product.category}`} className="hover:text-red-600 transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-red-600">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link to="/tatuadores-da-nova-era/shop">
          <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Loja
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index ? 'border-red-600' : 'border-gray-200'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-gray-500">{product.brand}</p>
                  <h1 className="text-3xl font-black text-red-800">{product.name}</h1>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-red-200 text-red-600">
                  {product.category}
                </Badge>
                {product.isNew && (
                  <Badge className="bg-green-600 text-white">Novo</Badge>
                )}
                {product.isBestSeller && (
                  <Badge className="bg-yellow-600 text-white">Best Seller</Badge>
                )}
                {product.originalPrice && (
                  <Badge variant="destructive" className="bg-red-600">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} avaliações)
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-red-800">Características</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2 p-4 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-gray-600">ou 12x de {formatPrice(product.price / 12)} sem juros</p>
              <p className="text-sm text-green-600 font-medium">
                💳 5% de desconto no PIX: {formatPrice(product.price * 0.95)}
              </p>
            </div>

            {/* Purchase Section */}
            <div className="space-y-4 p-4 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Quantidade:</span>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.inStock ? "Adicionar ao Carrinho" : "Produto Indisponível"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-red-600 text-red-600 hover:bg-red-50 text-lg py-6"
                  disabled={!product.inStock}
                >
                  Comprar Agora
                </Button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Truck className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Frete Grátis</p>
                  <p className="text-sm text-green-600">Entrega {product.shipping.deliveryTime}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Garantia</p>
                  <p className="text-sm text-blue-600">12 meses</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800">Pagamento</p>
                  <p className="text-sm text-purple-600">Até 12x sem juros</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="border-red-200">
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Descrição</TabsTrigger>
                <TabsTrigger value="specifications">Especificações</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div 
                  className="prose max-w-none prose-red prose-headings:text-red-800"
                  dangerouslySetInnerHTML={{ __html: product.description_full }}
                />
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">{product.rating}</div>
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">{product.reviews} avaliações</p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Mock reviews */}
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="font-medium">João Silva</span>
                        <span className="text-gray-500 text-sm">há 2 semanas</span>
                      </div>
                      <p className="text-gray-600">
                        Excelente qualidade! As tintas têm ótima pigmentação e o resultado final ficou perfeito. 
                        Recomendo para qualquer tatuador que trabalha com realismo.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                        <span className="font-medium">Maria Santos</span>
                        <span className="text-gray-500 text-sm">há 1 mês</span>
                      </div>
                      <p className="text-gray-600">
                        Produto chegou rapidamente e bem embalado. A qualidade é muito boa, 
                        único ponto é que poderia vir com mais tons intermediários.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </TatuadoresLayout>
  );
};

export default ProductDetail;
