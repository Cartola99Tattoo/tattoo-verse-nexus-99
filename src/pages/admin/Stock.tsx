
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Package2, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StockItemForm from "@/components/admin/StockItemForm";
import StockMovementForm from "@/components/admin/StockMovementForm";

interface StockItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  currentQuantity: number;
  unit: string;
  averageCost: number;
  minimumStock: number;
  location: string;
  status: 'sufficient' | 'low' | 'critical';
}

const mockStockItems: StockItem[] = [
  {
    id: '1',
    name: 'Tinta Preta Premium',
    brand: 'World Famous',
    category: 'Tintas',
    description: 'Tinta preta de alta qualidade para tatuagem',
    currentQuantity: 15,
    unit: 'ml',
    averageCost: 45.00,
    minimumStock: 5,
    location: 'Armário 1, Prateleira 2',
    status: 'sufficient'
  },
  {
    id: '2',
    name: 'Agulhas RL 07',
    brand: 'Cheyenne',
    category: 'Agulhas',
    description: 'Agulhas round liner 07',
    currentQuantity: 3,
    unit: 'unidade',
    averageCost: 12.50,
    minimumStock: 10,
    location: 'Armário 2, Gaveta 1',
    status: 'critical'
  },
  {
    id: '3',
    name: 'Luvas Nitrilo P',
    brand: 'Supermax',
    category: 'Higiene',
    description: 'Luvas de nitrilo sem pó tamanho P',
    currentQuantity: 8,
    unit: 'caixa',
    averageCost: 25.00,
    minimumStock: 5,
    location: 'Armário 3, Prateleira 1',
    status: 'low'
  }
];

const Stock = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sufficient':
        return <Badge className="bg-green-100 text-green-800">Suficiente</Badge>;
      case 'low':
        return <Badge className="bg-yellow-100 text-yellow-800">Baixo</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Crítico</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalItems = stockItems.filter(item => item.status === 'critical');
  const lowStockItems = stockItems.filter(item => item.status === 'low');

  const totalValue = stockItems.reduce((sum, item) => sum + (item.currentQuantity * item.averageCost), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Crítico</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalItems.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {criticalItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Estoque Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalItems.map((item) => (
                <div key={item.id} className="text-red-700">
                  <strong>{item.name}</strong> - Apenas {item.currentQuantity} {item.unit} restante(s)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Itens do Estoque</TabsTrigger>
          <TabsTrigger value="movements">Movimentações</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          {/* Search and Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar itens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
            <Button 
              onClick={() => setShowItemForm(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>

          {/* Stock Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Itens em Estoque</CardTitle>
              <CardDescription>
                Gerencie todos os suprimentos do seu estúdio de tatuagem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Custo Médio</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.brand}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        {item.currentQuantity} {item.unit}
                        <div className="text-xs text-gray-500">
                          Mín: {item.minimumStock} {item.unit}
                        </div>
                      </TableCell>
                      <TableCell>R$ {item.averageCost.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-sm">{item.location}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowItemForm(true);
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowMovementForm(true);
                            }}
                          >
                            Movimentar
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

        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Movimentações de Estoque</CardTitle>
              <CardDescription>
                Histórico de entradas e saídas de materiais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Funcionalidade de movimentações em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showItemForm && (
        <StockItemForm
          item={selectedItem}
          onClose={() => {
            setShowItemForm(false);
            setSelectedItem(null);
          }}
          onSave={(item) => {
            // Implement save logic here
            setShowItemForm(false);
            setSelectedItem(null);
          }}
        />
      )}

      {showMovementForm && selectedItem && (
        <StockMovementForm
          item={selectedItem}
          onClose={() => {
            setShowMovementForm(false);
            setSelectedItem(null);
          }}
          onSave={(movement) => {
            // Implement movement logic here
            setShowMovementForm(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default Stock;
