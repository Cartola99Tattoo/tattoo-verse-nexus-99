
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  ShoppingCart, 
  Star, 
  Filter,
  Heart,
  Eye,
  Package,
  Palette,
  Shirt,
  Coffee,
  Bookmark,
  Zap,
  Brush,
  Monitor,
  BookOpen,
  Headphones,
  Wrench
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import { useTattooArtistShop } from "@/contexts/TattooArtistShopContext";
import CartSidebar from "@/components/tattoo-artists/CartSidebar";

const TattooArtistsShop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const { products, addToCart, isInCart } = useTattooArtistShop();
  const navigate = useNavigate();

  // Função para adicionar produto ao carrinho
  const handleAddToCart = (product: any) => {
    try {
      addToCart(product);
      toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao seu carrinho.`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    }
  };

  // Função para visualizar detalhes do produto
  const handleViewProduct = (productId: number) => {
    navigate(`/tatuadores-da-nova-era/produto/${productId}`);
  };

  const categories = [
    { value: "all", label: "Todas as Categorias", icon: <Package className="h-4 w-4" /> },
    { value: "machines", label: "Máquinas", icon: <Zap className="h-4 w-4" /> },
    { value: "inks", label: "Tintas", icon: <Palette className="h-4 w-4" /> },
    { value: "needles", label: "Agulhas", icon: <Package className="h-4 w-4" /> },
    { value: "courses", label: "Cursos", icon: <BookOpen className="h-4 w-4" /> },
    { value: "software", label: "Software", icon: <Monitor className="h-4 w-4" /> },
    { value: "designs", label: "Designs", icon: <Brush className="h-4 w-4" /> },
    { value: "accessories", label: "Acessórios", icon: <Wrench className="h-4 w-4" /> },
    { value: "clothing", label: "Roupas", icon: <Shirt className="h-4 w-4" /> },
    { value: "services", label: "Serviços", icon: <Headphones className="h-4 w-4" /> }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'low' && product.price <= 100) ||
                        (priceFilter === 'medium' && product.price > 100 && product.price <= 300) ||
                        (priceFilter === 'high' && product.price > 300);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Mais Vendido': return 'bg-green-100 text-green-800';
      case 'Desconto': return 'bg-red-100 text-red-800';
      case 'Novo': return 'bg-blue-100 text-blue-800';
      case 'Profissional': return 'bg-purple-100 text-purple-800';
      case 'Limitado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TattooArtistLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Loja Tatuadores da Nova Era
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Equipamentos profissionais, cursos especializados e produtos exclusivos para tatuadores que buscam excelência e inovação
            </p>
            
            {/* Mini Cart Button */}
            <div className="fixed top-20 right-4 z-40 md:hidden">
              <CartSidebar>
                <Button size="icon" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </CartSidebar>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="w-full lg:w-96 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-4 items-center">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            {category.icon}
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Faixa de Preço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Preços</SelectItem>
                      <SelectItem value="low">Até R$ 100</SelectItem>
                      <SelectItem value="medium">R$ 100 - R$ 300</SelectItem>
                      <SelectItem value="high">Acima de R$ 300</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  
                  {/* Desktop Cart Button */}
                  <div className="hidden md:block">
                    <CartSidebar>
                      <Button variant="outline" size="icon" className="border-red-200 text-red-600 hover:bg-red-50">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </CartSidebar>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.badge && (
                      <Badge className={`${getBadgeColor(product.badge)} font-medium`}>
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" variant="secondary" className="p-2">
                      <Heart className={`h-4 w-4 ${product.favorited ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button size="sm" variant="secondary" className="p-2" onClick={() => handleViewProduct(product.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-red-600 transition-colors">
                        {product.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">por {product.artist}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews} avaliações)</span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-red-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          R$ {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart(product.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isInCart(product.id) ? 'No Carrinho' : 'Adicionar'}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleViewProduct(product.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-500">
                Ajuste os filtros de busca para encontrar o que você procura
              </p>
            </div>
          )}
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsShop;
