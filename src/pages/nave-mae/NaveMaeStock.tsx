
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Filter, Plus, TrendingUp, TrendingDown, AlertTriangle, Archive } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockStockItems = [
  {
    id: 1,
    name: "Máquina Rotativa Premium",
    category: "Equipamentos",
    currentStock: 15,
    minStock: 5,
    maxStock: 30,
    lastMovement: "2024-07-15",
    movementType: "in",
    supplier: "TattooTech Supply",
    location: "Estoque Principal",
    cost: 680.00,
    sellPrice: 850.00
  },
  {
    id: 2,
    name: "Tinta Preta Premium",
    category: "Tintas",
    currentStock: 3,
    minStock: 10,
    maxStock: 50,
    lastMovement: "2024-07-18",
    movementType: "out",
    supplier: "Color Ink Pro",
    location: "Estoque Principal",
    cost: 25.00,
    sellPrice: 45.00
  },
  {
    id: 3,
    name: "Agulhas Round Liner",
    category: "Descartáveis",
    currentStock: 120,
    minStock: 50,
    maxStock: 200,
    lastMovement: "2024-07-19",
    movementType: "in",
    supplier: "Needle Masters",
    location: "Estoque Filial",
    cost: 1.20,
    sellPrice: 2.50
  }
];

const NaveMaeStock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStockStatus = (item) => {
    if (item.currentStock <= item.minStock) return 'low';
    if (item.currentStock >= item.maxStock * 0.8) return 'high';
    return 'normal';
  };

  const filteredItems = mockStockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const status = getStockStatus(item);
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'low' && status === 'low') ||
                         (statusFilter === 'normal' && status === 'normal') ||
                         (statusFilter === 'high' && status === 'high');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (item) => {
    const status = getStockStatus(item);
    switch (status) {
      case 'low': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-blue-100 text-blue-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (item) => {
    const status = getStockStatus(item);
    switch (status) {
      case 'low': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <TrendingUp className="h-4 w-4" />;
      case 'normal': return <Package className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const totalItems = mockStockItems.length;
  const lowStockItems = mockStockItems.filter(item => getStockStatus(item) === 'low').length;
  const normalStockItems = mockStockItems.filter(item => getStockStatus(item) === 'normal').length;
  const totalValue = mockStockItems.reduce((acc, item) => acc + (item.currentStock * item.cost), 0);

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total de Itens</p>
                  <p className="text-3xl font-bold text-blue-800">{totalItems}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Estoque Baixo</p>
                  <p className="text-3xl font-bold text-red-800">{lowStockItems}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Estoque Normal</p>
                  <p className="text-3xl font-bold text-green-800">{normalStockItems}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Valor Total</p>
                  <p className="text-3xl font-bold text-purple-800">R$ {totalValue.toLocaleString()}</p>
                </div>
                <Archive className="h-8 w-8 text-purple-600" />
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
                  placeholder="Buscar itens..."
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
                    <SelectItem value="low">Estoque Baixo</SelectItem>
                    <SelectItem value="normal">Estoque Normal</SelectItem>
                    <SelectItem value="high">Estoque Alto</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Movimentação
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Estoque */}
        <div className="grid gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getStatusColor(item).replace('text-', 'bg-').replace('100', '500')}/10`}>
                      {getStatusIcon(item)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category} • {item.location}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(item)}`}>
                    {getStockStatus(item) === 'low' ? 'Estoque Baixo' :
                     getStockStatus(item) === 'high' ? 'Estoque Alto' : 'Estoque Normal'}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Estoque Atual</p>
                    <p className="text-2xl font-bold text-gray-900">{item.currentStock}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</p>
                    <p className="text-lg font-bold text-red-600">{item.minStock}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Estoque Máximo</p>
                    <p className="text-lg font-bold text-blue-600">{item.maxStock}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Valor Total</p>
                    <p className="text-lg font-bold text-green-600">R$ {(item.currentStock * item.cost).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Informações Comerciais</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Custo unitário:</span>
                        <span className="text-sm font-medium">R$ {item.cost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Preço de venda:</span>
                        <span className="text-sm font-medium">R$ {item.sellPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Margem:</span>
                        <span className="text-sm font-medium text-green-600">
                          {Math.round(((item.sellPrice - item.cost) / item.cost) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Última Movimentação</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {item.movementType === 'in' ? 
                          <TrendingUp className="h-4 w-4 text-green-500" /> : 
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        }
                        <span className="text-sm">
                          {item.movementType === 'in' ? 'Entrada' : 'Saída'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(item.lastMovement).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-sm text-gray-600">
                        Fornecedor: {item.supplier}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Ver Histórico
                  </Button>
                  <Button size="sm" variant="outline">
                    Nova Entrada
                  </Button>
                  <Button size="sm" variant="outline">
                    Nova Saída
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Editar Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum item encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca' 
                : 'Adicione o primeiro item ao estoque'
              }
            </p>
          </div>
        )}
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeStock;
