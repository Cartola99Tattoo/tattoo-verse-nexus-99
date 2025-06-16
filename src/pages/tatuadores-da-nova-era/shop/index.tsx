
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingCart, Star, Filter, Grid, List } from "lucide-react";
import TatuadoresLayout from "@/components/layouts/TatuadoresLayout";

// Mock data para produtos profissionais
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
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=400&q=80",
    features: ["Vegana", "Esterilizada", "Alta Pigmentação", "Aprovada ANVISA"]
  },
  {
    id: "2",
    name: "Máquina Rotativa Wireless Elite",
    description: "Máquina sem fio com bateria de longa duração e motor japonês",
    price: 1299.90,
    originalPrice: null,
    category: "Máquinas",
    brand: "Elite Tattoo",
    rating: 4.9,
    reviews: 89,
    inStock: true,
    isNew: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=400&q=80",
    features: ["Sem Fio", "Motor Japonês", "Baixa Vibração", "Grip Ergonômico"]
  },
  {
    id: "3",
    name: "Cartuchos Profissionais Mixed Pack",
    description: "Pack com 50 cartuchos variados para diferentes técnicas",
    price: 189.90,
    originalPrice: 219.90,
    category: "Agulhas",
    brand: "ProNeedle",
    rating: 4.7,
    reviews: 234,
    inStock: true,
    isNew: false,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=400&q=80",
    features: ["Esterilizados", "Descartáveis", "Membrana de Segurança", "Variados"]
  },
  {
    id: "4",
    name: "Creme Anestésico Professional",
    description: "Anestésico tópico de longa duração para procedimentos extensos",
    price: 89.90,
    originalPrice: null,
    category: "Anestésicos",
    brand: "MedTattoo",
    rating: 4.6,
    reviews: 98,
    inStock: false,
    isNew: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=400&q=80",
    features: ["Longa Duração", "Aprovado ANVISA", "Sem Efeitos Colaterais", "Aplicação Fácil"]
  },
  {
    id: "5",
    name: "Kit Aftercare Premium",
    description: "Kit completo para cuidados pós-tatuagem profissional",
    price: 159.90,
    originalPrice: 189.90,
    category: "Pós-cuidado",
    brand: "TattooHeal",
    rating: 4.8,
    reviews: 145,
    inStock: true,
    isNew: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=400&q=80",
    features: ["Cicatrização Rápida", "Hidratante", "Proteção UV", "Hipoalergênico"]
  },
  {
    id: "6",
    name: "Papel Transfer Premium A4",
    description: "Papel transfer de alta qualidade para desenhos detalhados",
    price: 45.90,
    originalPrice: null,
    category: "Materiais",
    brand: "TransferPro",
    rating: 4.5,
    reviews: 67,
    inStock: true,
    isNew: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=400&q=80",
    features: ["Alta Definição", "Fácil Aplicação", "100 Folhas", "Ecológico"]
  }
];

const categories = ["Todos", "Tintas", "Máquinas", "Agulhas", "Anestésicos", "Pós-cuidado", "Materiais"];
const sortOptions = [
  { value: "relevance", label: "Mais Relevantes" },
  { value: "price_asc", label: "Menor Preço" },
  { value: "price_desc", label: "Maior Preço" },
  { value: "rating", label: "Melhor Avaliado" },
  { value: "newest", label: "Mais Recentes" }
];

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default:
        return 0;
    }
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };

  return (
    <TatuadoresLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-red-800">Loja Profissional</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Materiais e equipamentos de alta qualidade para tatuadores profissionais
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-red-200 focus:border-red-600"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] border-red-200 focus:border-red-600">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] border-red-200 focus:border-red-600">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex border border-red-200 rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-red-600 hover:bg-red-700 rounded-r-none" : "rounded-r-none"}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-red-600 hover:bg-red-700 rounded-l-none" : "rounded-l-none"}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-gray-600">
          {sortedProducts.length} produto{sortedProducts.length !== 1 ? 's' : ''} encontrado{sortedProducts.length !== 1 ? 's' : ''}
        </div>

        {/* Products Grid/List */}
        <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {sortedProducts.map((product) => (
            <Card key={product.id} className={`overflow-hidden border-red-200 hover:shadow-lg transition-shadow ${viewMode === "list" ? "md:flex" : ""}`}>
              <div className={`relative overflow-hidden ${viewMode === "list" ? "md:w-48 md:flex-shrink-0" : "aspect-square"}`}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 space-y-1">
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

                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary" className="bg-gray-800 text-white">
                      Fora de Estoque
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <CardHeader className={viewMode === "list" ? "pb-2" : ""}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                      <CardTitle className="text-lg text-red-900 line-clamp-2">
                        <Link to={`/tatuadores-da-nova-era/shop/${product.id}`} className="hover:text-red-700 transition-colors">
                          {product.name}
                        </Link>
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="ml-2 border-red-200 text-red-600">
                      {product.category}
                    </Badge>
                  </div>
                  
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews} avaliações)
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {product.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Price */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-red-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">ou 12x de {formatPrice(product.price / 12)} sem juros</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.inStock ? "Adicionar ao Carrinho" : "Indisponível"}
                    </Button>
                    <Link to={`/tatuadores-da-nova-era/shop/${product.id}`}>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* No results */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Tente ajustar sua busca ou filtros</p>
          </div>
        )}
      </div>
    </TatuadoresLayout>
  );
};

export default Shop;
