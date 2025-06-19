import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker";
import { getProductService } from "@/services/serviceFactory";
import { formatDate } from "@/lib/utils";
import { Package, Search, Filter, Plus, TrendingDown, AlertTriangle, CheckCircle, BarChart3, Package2, Boxes, Eye, Edit, Trash2, RefreshCcw } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

// Interface for stock items with all necessary properties
interface StockItem {
  id: number;
  name: string;
  category: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  unit_price: number;
  supplier: string;
  last_restock: string;
  status: string;
  location: string;
  sku: string;
  description: string;
}

const NaveMaeStock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  const stockService = getProductService();
  const { data: stockData, isLoading } = useQuery({
    queryKey: ['stock', categoryFilter, statusFilter, searchTerm],
    queryFn: () => stockService.fetchProducts(),
  });

  // Mock data completo para demonstração
  const mockStockItems: StockItem[] = [
    {
      id: 1,
      name: "Máquina Rotativa Premium",
      category: "Equipamentos",
      current_stock: 5,
      min_stock: 3,
      max_stock: 20,
      unit_price: 850.00,
      supplier: "TattooTech Brasil",
      last_restock: "2024-07-10",
      status: "low_stock",
      location: "Estoque Principal - A1",
      sku: "MTR-001",
      description: "Máquina rotativa profissional para tatuagem"
    },
    {
      id: 2,
      name: "Kit Tintas Coloridas 12 Cores",
      category: "Tintas",
      current_stock: 25,
      min_stock: 10,
      max_stock: 50,
      unit_price: 320.00,
      supplier: "ColorInk Pro",
      last_restock: "2024-07-15",
      status: "in_stock",
      location: "Estoque Principal - B2",
      sku: "TIN-012",
      description: "Set completo com 12 cores profissionais"
    },
    {
      id: 3,
      name: "Agulhas Descartáveis Pacote 50un",
      category: "Descartáveis",
      current_stock: 2,
      min_stock: 5,
      max_stock: 100,
      unit_price: 45.00,
      supplier: "SafeNeedle Corp",
      last_restock: "2024-06-20",
      status: "critical",
      location: "Estoque Principal - C1",
      sku: "AGU-050",
      description: "Pacote com 50 agulhas esterilizadas"
    },
    {
      id: 4,
      name: "Luvas Nitrilo Caixa 100un",
      category: "Proteção",
      current_stock: 0,
      min_stock: 10,
      max_stock: 200,
      unit_price: 65.00,
      supplier: "ProSafe Medical",
      last_restock: "2024-05-15",
      status: "out_of_stock",
      location: "Estoque Principal - D1",
      sku: "LUV-100",
      description: "Luvas de nitrilo para proteção"
    },
    {
      id: 5,
      name: "Papel Filme Protetor",
      category: "Proteção", 
      current_stock: 15,
      min_stock: 8,
      max_stock: 30,
      unit_price: 25.00,
      supplier: "CleanTattoo Supplies",
      last_restock: "2024-07-18",
      status: "in_stock",
      location: "Estoque Principal - D2",
      sku: "PAP-001",
      description: "Papel filme para proteção de superfícies"
    }
  ];

  // Convert API data to stock items format if needed, or use mock data
  const allStockItems: StockItem[] = mockStockItems;

  const filteredItems = allStockItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalItems = allStockItems.length;
  const inStock = allStockItems.filter(item => item.status === 'in_stock').length;
  const lowStock = allStockItems.filter(item => item.status === 'low_stock').length;
  const outOfStock = allStockItems.filter(item => item.status === 'out_of_stock').length;
  const criticalStock = allStockItems.filter(item => item.status === 'critical').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock': return <CheckCircle className="h-4 w-4" />;
      case 'low_stock': return <AlertTriangle className="h-4 w-4" />;
      case 'out_of_stock': return <Package className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStockLevel = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Header com gradiente 99Tattoo */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-black rounded-xl shadow-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-wider">ESTOQUE 99TATTOO</h1>
              <p className="text-red-100 mt-2">Controle total do inventário</p>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total de Itens</p>
                  <p className="text-3xl font-bold text-blue-800">{totalItems}</p>
                </div>
                <Package2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Em Estoque</p>
                  <p className="text-3xl font-bold text-green-800">{inStock}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Estoque Baixo</p>
                  <p className="text-3xl font-bold text-yellow-800">{lowStock}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Sem Estoque</p>
                  <p className="text-3xl font-bold text-red-800">{outOfStock}</p>
                </div>
                <Package className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Crítico</p>
                  <p className="text-3xl font-bold text-purple-800">{criticalStock}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Controles */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="w-full lg:w-96 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-red-200 focus:border-red-500"
                />
              </div>
              
              <div className="flex gap-4 items-center flex-wrap">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48 border-red-200 focus:border-red-500">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                    <SelectItem value="Tintas">Tintas</SelectItem>
                    <SelectItem value="Descartáveis">Descartáveis</SelectItem>
                    <SelectItem value="Proteção">Proteção</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 border-red-200 focus:border-red-500">
                    <Filter className="h-4 w-4 mr-2 text-red-600" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="in_stock">Em Estoque</SelectItem>
                    <SelectItem value="low_stock">Estoque Baixo</SelectItem>
                    <SelectItem value="out_of_stock">Sem Estoque</SelectItem>
                    <SelectItem value="critical">Crítico</SelectItem>
                  </SelectContent>
                </Select>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Adicionar Item ao Estoque</DialogTitle>
                      <DialogDescription>
                        Preencha os dados do novo item
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Input placeholder="Nome do produto" />
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                          <SelectItem value="Tintas">Tintas</SelectItem>
                          <SelectItem value="Descartáveis">Descartáveis</SelectItem>
                          <SelectItem value="Proteção">Proteção</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="SKU" />
                      <Input placeholder="Quantidade inicial" type="number" />
                      <Input placeholder="Estoque mínimo" type="number" />
                      <Input placeholder="Preço unitário" type="number" step="0.01" />
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Salvar Item
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs para diferentes visualizações */}
        <Tabs defaultValue="cards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cards">Visualização em Cards</TabsTrigger>
            <TabsTrigger value="table">Visualização em Tabela</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold line-clamp-2">{item.name}</CardTitle>
                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      </div>
                      <div className="flex gap-2 flex-col items-end">
                        <Badge className={`text-xs ${getStatusColor(item.status)} font-medium`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(item.status)}
                            {item.status === 'in_stock' ? 'Em Estoque' :
                             item.status === 'low_stock' ? 'Estoque Baixo' :
                             item.status === 'out_of_stock' ? 'Sem Estoque' : 'Crítico'}
                          </div>
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    {/* Nível do estoque visual */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Estoque Atual</span>
                        <span className="font-bold">{item.current_stock} / {item.max_stock}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.current_stock <= item.min_stock ? 'bg-red-500' : 
                            item.current_stock <= item.min_stock * 2 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${getStockLevel(item.current_stock, item.min_stock, item.max_stock)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Preço Unitário:</span>
                        <span className="font-bold text-red-600">R$ {item.unit_price?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fornecedor:</span>
                        <span className="font-medium">{item.supplier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Localização:</span>
                        <span className="font-medium">{item.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Último Reabastecimento:</span>
                        <span className="font-medium">
                          {item.last_restock ? new Date(item.last_restock).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">
                        <strong>Descrição:</strong> {item.description}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalhes do Item</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div><strong>Nome:</strong> {item.name}</div>
                            <div><strong>SKU:</strong> {item.sku}</div>
                            <div><strong>Categoria:</strong> {item.category}</div>
                            <div><strong>Estoque Atual:</strong> {item.current_stock}</div>
                            <div><strong>Estoque Mínimo:</strong> {item.min_stock}</div>
                            <div><strong>Estoque Máximo:</strong> {item.max_stock}</div>
                            <div><strong>Preço Unitário:</strong> R$ {item.unit_price?.toFixed(2)}</div>
                            <div><strong>Fornecedor:</strong> {item.supplier}</div>
                            <div><strong>Localização:</strong> {item.location}</div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <RefreshCcw className="h-3 w-3 mr-1" />
                        Reabastecer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table" className="space-y-6">
            <Card className="shadow-xl">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{item.current_stock}</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  item.current_stock <= item.min_stock ? 'bg-red-500' : 
                                  item.current_stock <= item.min_stock * 2 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${getStockLevel(item.current_stock, item.min_stock, item.max_stock)}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                            {item.status === 'in_stock' ? 'Em Estoque' :
                             item.status === 'low_stock' ? 'Estoque Baixo' :
                             item.status === 'out_of_stock' ? 'Sem Estoque' : 'Crítico'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-red-600">
                          R$ {item.unit_price?.toFixed(2)}
                        </TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <RefreshCcw className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-red-600" />
                    Distribuição por Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Em Estoque</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: `${(inStock/totalItems)*100}%`}}></div>
                        </div>
                        <span className="text-sm font-bold">{inStock}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Estoque Baixo</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${(lowStock/totalItems)*100}%`}}></div>
                        </div>
                        <span className="text-sm font-bold">{lowStock}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sem Estoque</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{width: `${(outOfStock/totalItems)*100}%`}}></div>
                        </div>
                        <span className="text-sm font-bold">{outOfStock}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Boxes className="h-5 w-5 text-red-600" />
                    Valor Total do Estoque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-red-600">
                      R$ {allStockItems.reduce((acc, item) => acc + (item.current_stock * item.unit_price), 0).toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">Valor total dos produtos em estoque</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Maior investimento:</span>
                        <span className="font-bold">R$ 4.250,00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Giro médio mensal:</span>
                        <span className="font-bold">85%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Itens a reabastecer:</span>
                        <span className="font-bold text-red-600">{lowStock + outOfStock + criticalStock}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

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
