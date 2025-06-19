
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Filter, Plus, Star, ShoppingCart, Eye, Edit, Trash2 } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockProducts = [
  {
    id: 1,
    name: "Máquina Rotativa Premium",
    description: "Máquina rotativa profissional para tatuagem",
    price: 850.00,
    category: "Equipamentos",
    status: "available",
    stock: 15,
    rating: 4.8,
    reviews: 24,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=300&fit=crop",
    featured: true
  },
  {
    id: 2,
    name: "Kit Tintas Coloridas",
    description: "Set completo com 12 cores profissionais",
    price: 320.00,
    category: "Tintas",
    status: "available", 
    stock: 8,
    rating: 4.9,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop",
    featured: false
  },
  {
    id: 3,
    name: "Agulhas Descartáveis",
    description: "Pacote com 50 agulhas esterilizadas",
    price: 45.00,
    category: "Descartáveis",
    status: "low_stock",
    stock: 3,
    rating: 4.7,
    reviews: 31,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop",
    featured: false
  }
];

const NaveMaeProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'discontinued': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalProducts = mockProducts.length;
  const availableProducts = mockProducts.filter(p => p.status === 'available').length;
  const lowStockProducts = mockProducts.filter(p => p.status === 'low_stock').length;
  const featuredProducts = mockProducts.filter(p => p.featured).length;

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total de Produtos</p>
                  <p className="text-3xl font-bold text-blue-800">{totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Disponíveis</p>
                  <p className="text-3xl font-bold text-green-800">{availableProducts}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Estoque Baixo</p>
                  <p className="text-3xl font-bold text-yellow-800">{lowStockProducts}</p>
                </div>
                <Package className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Em Destaque</p>
                  <p className="text-3xl font-bold text-purple-800">{featuredProducts}</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-96 relative">
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
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                    <SelectItem value="Tintas">Tintas</SelectItem>
                    <SelectItem value="Descartáveis">Descartáveis</SelectItem>
                    <SelectItem value="Acessórios">Acessórios</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="low_stock">Estoque Baixo</SelectItem>
                    <SelectItem value="out_of_stock">Sem Estoque</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Produtos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-3">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex gap-1">
                    <Badge className={`text-xs ${getStatusColor(product.status)}`}>
                      {product.status === 'available' ? 'Disponível' :
                       product.status === 'low_stock' ? 'Estoque Baixo' :
                       product.status === 'out_of_stock' ? 'Sem Estoque' : 'Descontinuado'}
                    </Badge>
                    {product.featured && (
                      <Badge className="text-xs bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg font-bold line-clamp-2">{product.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estoque:</span>
                    <span className="text-sm font-medium">{product.stock} unidades</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avaliação:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="text-2xl font-bold text-purple-600 mb-4">
                  R$ {product.price.toFixed(2)}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca' 
                : 'Adicione o primeiro produto ao catálogo'
              }
            </p>
          </div>
        )}
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeProducts;
