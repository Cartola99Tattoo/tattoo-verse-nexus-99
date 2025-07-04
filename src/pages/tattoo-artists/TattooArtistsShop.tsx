
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Filter, Star, ShoppingCart, Eye, Heart, Truck, Shield, Award } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import { mockProducts, getCategories, Product } from "@/data/mockProducts";
import { useToast } from "@/hooks/use-toast";

const TattooArtistsShop = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("relevance");

  const categories = getCategories().map(cat => ({ value: cat, label: cat }));

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
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0);
      default: return 0;
    }
  });

  const bestsellers = mockProducts.filter(p => p.isBestseller);
  const totalProducts = mockProducts.length;
  const avgRating = totalProducts > 0 ? mockProducts.reduce((acc, p) => acc + p.rating, 0) / totalProducts : 0;

  const handleProductClick = (productId: string) => {
    navigate(`/tatuadores-da-nova-era/shop/${productId}`);
  };

  const addToCart = (product: Product) => {
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho com sucesso.`,
    });
  };

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
              <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-gray-300">Satisfação</div>
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
          
          <div className="flex items-center justify-between pt-4 border-t border-white/20 mt-4">
            <div className="text-white">
              Mostrando <span className="font-bold text-red-400">{sortedProducts.length}</span> de <span className="font-bold">{totalProducts}</span> produtos
            </div>
          </div>
        </div>

        {/* Produtos em Grade */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="pb-3">
                <div 
                  className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4 relative cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    {product.isBestseller && (
                      <Badge className="bg-red-500 text-white font-medium text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        Best Seller
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge className="bg-green-500 text-white font-medium text-xs">
                        Novo
                      </Badge>
                    )}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <Badge className="bg-orange-500 text-white font-medium text-xs">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-blue-500 text-white text-xs">
                      <Truck className="h-3 w-3 mr-1" />
                      Frete Grátis
                    </Badge>
                  </div>
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
                <CardTitle 
                  className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-red-600"
                  onClick={() => handleProductClick(product.id)}
                >
                  {product.name}
                </CardTitle>
                <p className="text-xs text-gray-500 mb-3">{product.brand}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    {product.originalPrice && product.originalPrice > product.price && (
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
                  <span className={`font-medium ${product.stockQuantity < 5 ? 'text-red-500' : 'text-green-600'}`}>
                    {product.inStock ? (product.stockQuantity < 5 ? `Só ${product.stockQuantity} restantes!` : 'Em estoque') : 'Esgotado'}
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
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    {product.inStock ? 'Comprar' : 'Esgotado'}
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
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsShop;
