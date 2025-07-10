
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Package, 
  Plus, 
  Minus, 
  ShoppingCart, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  CheckCircle,
  X,
  Archive
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface StockItem {
  id: string;
  name: string;
  currentQuantity: number;
  unit: string;
  description: string;
  lowStockAlert: number;
  lastUpdated: string;
}

interface StockMovement {
  id: string;
  itemId: string;
  type: 'add' | 'use';
  quantity: number;
  date: string;
  reason: string;
}

const StockManagementTool = () => {
  const navigate = useNavigate();
  
  // Mock data - Materiais típicos de estúdio de tatuagem
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: '1',
      name: 'Tinta Preta Dinâmica',
      currentQuantity: 2,
      unit: 'ml',
      description: 'Tinta preta premium para contornos e sombreados',
      lowStockAlert: 5,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'Agulha RL 7',
      currentQuantity: 8,
      unit: 'unidades',
      description: 'Agulhas descartáveis para linhas',
      lowStockAlert: 10,
      lastUpdated: '2024-01-14'
    },
    {
      id: '3',
      name: 'Luvas Nitrílicas M',
      currentQuantity: 3,
      unit: 'caixas',
      description: 'Luvas descartáveis sem látex',
      lowStockAlert: 5,
      lastUpdated: '2024-01-13'
    },
    {
      id: '4',
      name: 'Vaselina',
      currentQuantity: 1,
      unit: 'unidades',
      description: 'Vaselina para proteção da pele',
      lowStockAlert: 3,
      lastUpdated: '2024-01-12'
    },
    {
      id: '5',
      name: 'Filme Protetor',
      currentQuantity: 15,
      unit: 'metros',
      description: 'Filme transparente para proteção',
      lowStockAlert: 10,
      lastUpdated: '2024-01-11'
    },
    {
      id: '6',
      name: 'Batoques M',
      currentQuantity: 4,
      unit: 'unidades',
      description: 'Batoques descartáveis médios',
      lowStockAlert: 10,
      lastUpdated: '2024-01-10'
    },
    {
      id: '7',
      name: 'Papel Toalha',
      currentQuantity: 20,
      unit: 'rolos',
      description: 'Papel toalha para limpeza',
      lowStockAlert: 15,
      lastUpdated: '2024-01-09'
    }
  ]);

  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    currentQuantity: 0,
    unit: 'unidades',
    description: '',
    lowStockAlert: 5
  });

  const unitOptions = [
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'unidades', label: 'Unidades' },
    { value: 'caixas', label: 'Caixas' },
    { value: 'rolos', label: 'Rolos' },
    { value: 'metros', label: 'Metros' },
    { value: 'gramas', label: 'Gramas (g)' },
    { value: 'litros', label: 'Litros (L)' }
  ];

  // Calcular estatísticas
  const totalItems = stockItems.length;
  const lowStockItems = stockItems.filter(item => item.currentQuantity <= item.lowStockAlert);
  const criticalItems = stockItems.filter(item => item.currentQuantity <= item.lowStockAlert * 0.5);

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do item é obrigatório",
        variant: "destructive"
      });
      return;
    }

    const item: StockItem = {
      id: Date.now().toString(),
      name: newItem.name,
      currentQuantity: newItem.currentQuantity,
      unit: newItem.unit,
      description: newItem.description,
      lowStockAlert: newItem.lowStockAlert,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setStockItems(prev => [...prev, item]);
    setNewItem({
      name: '',
      currentQuantity: 0,
      unit: 'unidades',
      description: '',
      lowStockAlert: 5
    });
    setIsAddItemModalOpen(false);
    
    toast({
      title: "Item adicionado!",
      description: `${item.name} foi adicionado ao estoque`,
    });
  };

  const handleUpdateQuantity = (itemId: string, type: 'add' | 'use', quantity: number) => {
    if (quantity <= 0) return;

    setStockItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQuantity = type === 'add' 
          ? item.currentQuantity + quantity 
          : Math.max(0, item.currentQuantity - quantity);
        
        return {
          ...item,
          currentQuantity: newQuantity,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));

    // Adicionar movimento ao histórico
    const movement: StockMovement = {
      id: Date.now().toString(),
      itemId,
      type,
      quantity,
      date: new Date().toISOString(),
      reason: type === 'add' ? 'Reposição de estoque' : 'Uso em tatuagem'
    };

    setMovements(prev => [...prev, movement]);

    const item = stockItems.find(i => i.id === itemId);
    toast({
      title: "Estoque atualizado!",
      description: `${type === 'add' ? 'Adicionado' : 'Removido'} ${quantity} ${item?.unit} de ${item?.name}`,
    });
  };

  const handleDeleteItem = (itemId: string) => {
    const item = stockItems.find(i => i.id === itemId);
    setStockItems(prev => prev.filter(i => i.id !== itemId));
    
    toast({
      title: "Item removido!",
      description: `${item?.name} foi removido do estoque`,
    });
  };

  const generateShoppingList = () => {
    const shoppingList = lowStockItems.map(item => ({
      ...item,
      suggestedQuantity: (item.lowStockAlert * 2) - item.currentQuantity
    }));

    if (shoppingList.length === 0) {
      toast({
        title: "Estoque ok!",
        description: "Nenhum item precisa ser reposto no momento",
      });
      return;
    }

    // Simular criação de lista de compras
    toast({
      title: "Lista de compras gerada!",
      description: `${shoppingList.length} itens adicionados à lista`,
    });
  };

  const navigateToShop = () => {
    navigate('/tatuadores-da-nova-era/shop');
    toast({
      title: "Redirecionando para a loja",
      description: "Encontre os produtos que você precisa",
    });
  };

  const getStockStatus = (item: StockItem) => {
    if (item.currentQuantity <= item.lowStockAlert * 0.5) {
      return { status: 'critical', color: 'bg-red-100 text-red-800', label: 'Crítico' };
    } else if (item.currentQuantity <= item.lowStockAlert) {
      return { status: 'low', color: 'bg-yellow-100 text-yellow-800', label: 'Baixo' };
    } else {
      return { status: 'ok', color: 'bg-green-100 text-green-800', label: 'Suficiente' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Itens</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crítico</p>
                <p className="text-2xl font-bold text-red-600">{criticalItems.length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <X className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Principais */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Item</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Tinta Preta Premium"
                  className="rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newItem.currentQuantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, currentQuantity: parseInt(e.target.value) || 0 }))}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unidade</Label>
                  <Select value={newItem.unit} onValueChange={(value) => setNewItem(prev => ({ ...prev, unit: value }))}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do item..."
                  className="rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="alert">Alerta de Estoque Baixo</Label>
                <Input
                  id="alert"
                  type="number"
                  value={newItem.lowStockAlert}
                  onChange={(e) => setNewItem(prev => ({ ...prev, lowStockAlert: parseInt(e.target.value) || 0 }))}
                  className="rounded-lg"
                />
              </div>
              <Button onClick={handleAddItem} className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                Adicionar Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button 
          onClick={generateShoppingList}
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Gerar Lista de Compras
        </Button>

        <Button 
          onClick={navigateToShop}
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          <Archive className="h-4 w-4 mr-2" />
          Ir para Loja
        </Button>
      </div>

      {/* Lista de Itens */}
      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="text-red-600">Itens em Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stockItems.map(item => {
              const status = getStockStatus(item);
              return (
                <div key={item.id} className="bg-white border border-red-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <Badge className={status.color}>{status.label}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsEditModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-gray-900">
                        {item.currentQuantity} {item.unit}
                      </span>
                      <span className="text-sm text-gray-500">
                        Alerta: {item.lowStockAlert} {item.unit}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const quantity = prompt('Quantidade a adicionar:');
                            if (quantity) handleUpdateQuantity(item.id, 'add', parseInt(quantity));
                          }}
                          className="border-green-200 text-green-600 hover:bg-green-50"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const quantity = prompt('Quantidade a usar:');
                            if (quantity) handleUpdateQuantity(item.id, 'use', parseInt(quantity));
                          }}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Compras */}
      {lowStockItems.length > 0 && (
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Lista de Compras Sugerida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      Atual: {item.currentQuantity} {item.unit} | 
                      Sugerido: {(item.lowStockAlert * 2) - item.currentQuantity} {item.unit}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={navigateToShop}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                  >
                    Comprar na Loja
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockManagementTool;
