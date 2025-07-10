
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Filter, Plus, AlertTriangle, TrendingUp, Warehouse } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockStockItems = [
  {
    id: 1,
    name: "Máquina Rotativa Premium",
    category: "Equipamentos",
    sku: "MRP-001",
    currentStock: 15,
    minStock: 5,
    maxStock: 50,
    unitPrice: 850.00,
    totalValue: 12750.00,
    location: "Armazém Central - SP",
    supplier: "TattooTech Ltda",
    lastUpdate: "2024-07-15",
    status: "adequate"
  },
  {
    id: 2,
    name: "Kit Tintas Coloridas Premium",
    category: "Tintas",
    sku: "KTC-002",
    currentStock: 3,
    minStock: 10,
    maxStock: 100,
    unitPrice: 320.00,
    totalValue: 960.00,
    location: "Armazém Central - SP",
    supplier: "ColorInk Brasil",
    lastUpdate: "2024-07-18",
    status: "low"
  },
  {
    id: 3,
    name: "Agulhas Descartáveis Premium",
    category: "Descartáveis",
    sku: "ADP-003",
    currentStock: 0,
    minStock: 20,
    maxStock: 200,
    unitPrice: 45.00,
    totalValue: 0.00,
    location: "Armazém Central - SP",
    supplier: "SterileTech",
    lastUpdate: "2024-07-19",
    status: "out_of_stock"
  },
  {
    id: 4,
    name: "Cartuchos para Máquina",
    category: "Acessórios",
    sku: "CPM-004",
    currentStock: 75,
    minStock: 30,
    maxStock: 150,
    unitPrice: 25.00,
    totalValue: 1875.00,
    location: "Armazém Central - RJ",
    supplier: "TattooSupply Pro",
    lastUpdate: "2024-07-16",
    status: "high"
  }
];

const NaveMaeStock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredItems = mockStockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'adequate': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-blue-100 text-blue-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'adequate': return 'Adequado';
      case 'low': return 'Estoque Baixo';
      case 'high': return 'Estoque Alto';
      case 'out_of_stock': return 'Sem Estoque';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'out_of_stock':
      case 'low':
        return <AlertTriangle className="h-4 w-4" />;
      case 'high':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const totalItems = mockStockItems.length;
  const lowStockItems = mockStockItems.filter(item => item.status === 'low' || item.status === 'out_of_stock').length;
  const totalValue = mockStockItems.reduce((acc, item) => acc + item.totalValue, 0);

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
                  <p className="text-red-600 text-sm font-medium">Alertas de Estoque</p>
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
                  <p className="text-green-600 text-sm font-medium">Valor Total</p>
                  <p className="text-3xl font-bold text-green-800">R$ {(totalValue / 1000).toFixed(1)}k</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Locais</p>
                  <p className="text-3xl font-bold text-purple-800">2</p>
                </div>
                <Warehouse className="h-8 w-8 text-purple-600" />
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
                    <SelectItem value="adequate">Adequado</SelectItem>
                    <SelectItem value="low">Estoque Baixo</SelectItem>
                    <SelectItem value="high">Estoque Alto</SelectItem>
                    <SelectItem value="out_of_stock">Sem Estoque</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Estoque */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        {item.category}
                      </Badge>
                      <Badge className={`${getStatusColor(item.status)} flex items-center gap-1`}>
                        {getStatusIcon(item.status)}
                        {getStatusText(item.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">SKU: {item.sku}</p>
                    <p className="text-sm text-gray-600">Fornecedor: {item.supplier}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-6 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{item.currentStock}</div>
                    <div className="text-xs text-gray-500">Atual</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-medium text-red-600">{item.minStock}</div>
                    <div className="text-xs text-gray-500">Mínimo</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-medium text-green-600">{item.maxStock}</div>
                    <div className="text-xs text-gray-500">Máximo</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">R$ {item.unitPrice.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Preço Unit.</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">R$ {item.totalValue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Valor Total</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-800">{item.location}</div>
                    <div className="text-xs text-gray-500">Localização</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-4">
                  <span className="text-gray-600">
                    Última atualização: {new Date(item.lastUpdate).toLocaleDateString('pt-BR')}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Ver Histórico
                    </Button>
                    <Button size="sm" variant="outline">
                      Movimentar
                    </Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      Editar
                    </Button>
                  </div>
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
