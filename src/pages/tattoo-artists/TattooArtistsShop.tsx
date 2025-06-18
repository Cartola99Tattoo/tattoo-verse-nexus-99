
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Star, ShoppingCart, Search, Filter } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getTattooArtistService } from "@/services/serviceFactory";

const categories = [
  { value: 'todos', label: 'Todos os Produtos' },
  { value: 'equipamentos', label: 'Equipamentos' },
  { value: 'tintas', label: 'Tintas' },
  { value: 'agulhas', label: 'Agulhas' },
  { value: 'descartaveis', label: 'Descartáveis' },
  { value: 'acessorios', label: 'Acessórios' }
];

const TattooArtistsShop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  const { data: products = [], loading } = useDataQuery(
    () => getTattooArtistService().getProfessionalProducts(
      selectedCategory === 'todos' ? undefined : selectedCategory
    ),
    [selectedCategory]
  );

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Loja 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Profissional</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Materiais de qualidade premium com preços especiais para tatuadores profissionais
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30"
              />
            </div>
            
            <div className="flex gap-4 items-center">
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
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                    {product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <Package className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-xs">
                      {categories.find(cat => cat.value === product.category)?.label || product.category}
                    </Badge>
                    {product.professional_only && (
                      <Badge variant="outline" className="text-xs border-red-300 text-red-600">
                        Profissional
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{product.description}</p>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    <div className="font-medium">Marca: {product.brand}</div>
                    <div>Estoque: {product.stock_quantity} unidades</div>
                  </div>

                  {product.specifications && product.specifications.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-medium text-gray-700 mb-1">Especificações:</div>
                      <div className="flex flex-wrap gap-1">
                        {product.specifications.slice(0, 2).map((spec, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500 line-through">R$ {product.price.toFixed(2)}</div>
                        <div className="text-xl font-bold text-red-600">R$ {product.professional_price.toFixed(2)}</div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        {Math.round((1 - product.professional_price / product.price) * 100)}% OFF
                      </Badge>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-300">Tente ajustar os filtros de busca</p>
          </div>
        )}

        {/* Vantagens para Profissionais */}
        <div className="mt-16">
          <Card className="bg-red-600/10 border-red-500/30">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Vantagens Exclusivas para Profissionais</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Star className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Preços Especiais</h3>
                  <p className="text-gray-300">Até 25% de desconto em todos os produtos</p>
                </div>
                <div className="text-center">
                  <Package className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Produtos Premium</h3>
                  <p className="text-gray-300">Acesso exclusivo a marcas profissionais</p>
                </div>
                <div className="text-center">
                  <ShoppingCart className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Entrega Rápida</h3>
                  <p className="text-gray-300">Prioridade na entrega para profissionais</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsShop;
