import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Heart, Share2, Minus, Plus, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import OptimizedCartButton from "@/components/shop/OptimizedCartButton";

const productData = {
  id: 1,
  name: "Dragão Oriental Exclusivo",
  artist: "Mariana Silva",
  category: "Colorido",
  price: 750,
  originalPrice: 900,
  rating: 4.9,
  reviews: 127,
  description: "Uma obra-prima de arte oriental que combina tradição e modernidade. Este design de dragão foi cuidadosamente elaborado pela nossa artista especialista Mariana Silva, incorporando elementos clássicos da cultura asiática com técnicas contemporâneas de tatuagem.",
  images: [
    "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543767271-7c5f36dc5310?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1562962230-16e4623d36e7?q=80&w=1974&auto=format&fit=crop"
  ],
  specifications: {
    size: "20cm x 30cm",
    estimatedTime: "6-8 horas",
    style: "Oriental/Colorido",
    complexity: "Alta",
    painLevel: "Médio-Alto",
    healingTime: "3-4 semanas"
  },
  included: [
    "Consulta personalizada",
    "Desenho customizado",
    "Sessão de tatuagem",
    "Kit de cuidados pós-tatuagem",
    "Retoque gratuito (se necessário)"
  ],
  relatedProducts: [
    {
      id: 2,
      name: "Mandala Geométrica",
      artist: "Rafael Costa",
      price: 550,
      image: "https://images.unsplash.com/photo-1562962230-16e4623d36e7?q=80&w=1974&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Leão Aquarela",
      artist: "Juliana Mendes",
      price: 850,
      image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1974&auto=format&fit=crop"
    }
  ]
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const discount = Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/shop')}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Loja
          </Button>
          <nav className="text-sm text-gray-600">
            <span>Loja</span>
            <span className="mx-2">/</span>
            <span className="text-red-600 font-medium">{productData.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={productData.images[selectedImage]}
                alt={productData.name}
                className="w-full h-96 object-cover rounded-lg shadow-xl"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                    selectedImage === index 
                      ? "ring-2 ring-red-600 shadow-lg transform scale-105" 
                      : "hover:shadow-md hover:scale-105"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Visualização ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge variant="tattoo" className="mb-2">
                {productData.category}
              </Badge>
              
              <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                {productData.name}
              </h1>
              
              <p className="text-lg text-gray-600 mb-4">
                Por <span className="font-medium text-red-600">{productData.artist}</span>
              </p>

              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-medium">{productData.rating}</span>
                  <span className="text-gray-600 ml-1">({productData.reviews} avaliações)</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-red-600">
                  R$ {productData.price}
                </span>
                {productData.originalPrice > productData.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      R$ {productData.originalPrice}
                    </span>
                    <Badge variant="destructive">
                      -{discount}%
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Ou em até 12x de R$ {Math.round(productData.price / 12)} sem juros
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-red-600 mb-2">Descrição</h3>
              <p className="text-gray-700 leading-relaxed">
                {productData.description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-red-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <OptimizedCartButton
                  productId={productData.id.toString()}
                  productName={productData.name}
                  price={productData.price}
                  variant="default"
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg hover:from-red-700 hover:to-red-900 hover:shadow-xl transform hover:scale-105"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="tattooOutline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoritar
                </Button>
                <Button variant="tattooOutline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <Truck className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-gray-700">Agendamento rápido</span>
              </div>
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <Shield className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-gray-700">Estúdio seguro</span>
              </div>
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <RotateCcw className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-gray-700">Retoque grátis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Specifications */}
          <Card variant="tattoo" className="shadow-xl">
            <CardHeader variant="red">
              <CardTitle className="text-xl font-bold text-red-600">Especificações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(productData.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What's Included */}
          <Card variant="tattoo" className="shadow-xl">
            <CardHeader variant="red">
              <CardTitle className="text-xl font-bold text-red-600">O que está incluído</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {productData.included.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Related Products */}
        <section>
          <h2 className="text-3xl font-bold text-red-600 mb-8">Recomendações</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productData.relatedProducts.map(product => (
              <Card 
                key={product.id} 
                variant="tattoo" 
                className="group cursor-pointer overflow-hidden shadow-xl hover:shadow-red-glow transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => navigate(`/shop/${product.id}`)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-red-600 mb-2 group-hover:text-red-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">Por {product.artist}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-red-600">R$ {product.price}</span>
                    <Button variant="tattooOutline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
