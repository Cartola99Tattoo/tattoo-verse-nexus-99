import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Search, Filter, Star, ShoppingCart, Eye, Heart, Truck, Shield, Award, Tag } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const mockProducts = [
  {
    id: 1,
    name: "Máquina Rotativa Premium Dragon",
    description: "Máquina rotativa profissional de alta precisão para tatuagem",
    price: 1200.00,
    originalPrice: 1500.00,
    category: "Equipamentos",
    brand: "DragonTech",
    rating: 4.9,
    reviews: 156,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop"
    ],
    features: ["Motor silencioso", "Ajuste de profundidade", "Peso balanceado", "Garantia 2 anos"],
    bestseller: true,
    freeShipping: true,
    discount: 20
  },
  {
    id: 2,
    name: "Kit Tintas Coloridas Professional 24 Cores",
    description: "Set completo com 24 cores vibrantes e duradouras",
    price: 480.00,
    originalPrice: 600.00,
    category: "Tintas",
    brand: "ColorPro",
    rating: 4.8,
    reviews: 203,
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop"
    ],
    features: ["24 cores diferentes", "Fórmula vegana", "Longa duração", "Certificado ANVISA"],
    bestseller: false,
    freeShipping: true,
    discount: 20
  },
  {
    id: 3,
    name: "Agulhas Descartáveis Sterile Pack 100un",
    description: "Pacote com 100 agulhas esterilizadas de alta qualidade",
    price: 85.00,
    originalPrice: 100.00,
    category: "Descartáveis",
    brand: "SafeNeedle",
    rating: 4.7,
    reviews: 89,
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop"
    ],
    features: ["100% estéril", "Diversos tamanhos", "Embalagem individual", "Aprovado pela ANVISA"],
    bestseller: false,
    freeShipping: false,
    discount: 15
  },
  {
    id: 4,
    name: "Fonte de Energia Digital Pro 2.0",
    description: "Fonte de energia digital com controle preciso de voltagem",
    price: 650.00,
    originalPrice: 800.00,
    category: "Equipamentos",
    brand: "PowerTech",
    rating: 4.9,
    reviews: 134,
    stock: 6,
    images: [
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop"
    ],
    features: ["Display digital", "Controle preciso", "Proteção contra surtos", "Design compacto"],
    bestseller: true,
    freeShipping: true,
    discount: 19
  },
  {
    id: 5,
    name: "Kit Proteção Completo Studio",
    description: "Kit completo de proteção para estúdio profissional",
    price: 120.00,
    originalPrice: 150.00,
    category: "Proteção",
    brand: "SafeStudio",
    rating: 4.6,
    reviews: 67,
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop"
    ],
    features: ["Luvas nitrilo", "Papel filme", "Máscaras", "Álcool gel 70%"],
    bestseller: false,
    freeShipping: false,
    discount: 20
  },
  {
    id: 6,
    name: "Transfer Paper Professional A4 100fls",
    description: "Papel transfer profissional para transferência de desenhos",
    price: 45.00,
    originalPrice: 60.00,
    category: "Materiais",
    brand: "TransferPro",
    rating: 4.5,
    reviews: 45,
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=400&h=400&fit=crop"
    ],
    features: ["100 folhas A4", "Alta definição", "Fácil transferência", "Não mancha"],
    bestseller: false,
    freeShipping: false,
    discount: 25
  }
];

const TattooArtistsShop = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'Equipamentos', label: 'Equipamentos' },
    { value: 'Tintas', label: 'Tintas' },
    { value: 'Descartáveis', label: 'Descartáveis' },
    { value: 'Proteção', label: 'Proteção' },
    { value: 'Materiais', label: 'Materiais' },
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Mais Relevantes' },
    { value: 'price_asc', label: 'Menor Preço' },
    { value: 'price_desc', label: 'Maior Preço' },
    { value: 'rating', label: 'Melhor Avaliação' },
    { value: 'newest', label: 'Mais Novos' },
  ];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return b.id - a.id;
      default: return 0;
    }
  });

  const bestsellers = mockProducts.filter(p => p.bestseller);
  const totalProducts = mockProducts.length;
  const avgRating = totalProducts > 0 ? mockProducts.reduce((acc, p) => acc + p.rating, 0) / totalProducts : 0;

  const handleProductClick = (productId) => {
    navigate(`/tatuadores-da-nova-era/shop/${productId}`);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const ProductModal = ({ product, onClose }) => (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product?.name}</DialogTitle>
          <DialogDescription>{product?.brand}</DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={product?.images?.[0]} 
                alt={product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            {(product?.images?.length || 0) > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, index) => (
                  <div key={index} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product?.reviews} avaliações)</span>
              </div>
              
              <p className="text-gray-700">{product?.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-red-600">R$ {product?.price?.toFixed(2)}</span>
                {((product?.originalPrice || 0) > (product?.price || 0)) && (
                  <>
                    <span className="text-lg text-gray-500 line-through">R$ {product?.originalPrice?.toFixed(2)}</span>
                    <Badge className="bg-red-100 text-red-800">-{product?.discount}%</Badge>
                  </>
                )}
              </div>
              {product?.freeShipping && (
                <div className="flex items-center gap-2 text-green-600">
                  <Truck className="h-4 w-4" />
                  <span className="text-sm">Frete Grátis</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Características:</h4>
              <ul className="space-y-1">
                {product?.features?.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                onClick={() => addToCart(product)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Button variant="outline">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Compra Protegida
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                Garantia do Fabricante
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Loja dos
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Tatuadores</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Equipamentos e materiais profissionais para elevar sua arte
          </p>
        </div>

        {/* Estatísticas da Loja */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{totalProducts}</div>
              <div className="text-gray-300">Produtos Disponíveis</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">{bestsellers.length}</div>
              <div className="text-gray-300">Mais Vendidos</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{avgRating.toFixed(1)}★</div>
              <div className="text-gray-300">Avaliação Média</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{cart.length}</div>
              <div className="text-gray-300">Itens no Carrinho</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="w-full lg:w-96 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30"
              />
            </div>
            
            <div className="flex gap-4 items-center flex-wrap">
              <Filter className="h-5 w-5 text-white" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="text-white">
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Produtos em Grade */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4 relative">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    {product.bestseller && (
                      <Badge className="bg-red-500 text-white font-medium text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        Best Seller
                      </Badge>
                    )}
                    {product.discount > 0 && (
                      <Badge className="bg-green-500 text-white font-medium text-xs">
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>
                  {product.freeShipping && (
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-blue-500 text-white text-xs">
                        <Truck className="h-3 w-3 mr-1" />
                        Frete Grátis
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start mb-2">
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</CardTitle>
                <p className="text-xs text-gray-500 mb-3">{product.brand}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">R$ {product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    R$ {product.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    em até 12x sem juros
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{product.reviews} avaliações</span>
                  <span className={`font-medium ${product.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>
                    {product.stock < 5 ? `Só ${product.stock} restantes!` : 'Em estoque'}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver Detalhes
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Comprar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-300">Tente ajustar os filtros de busca</p>
          </div>
        )}

        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsShop;
