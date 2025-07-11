
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Package2, AlertTriangle, TrendingDown, TrendingUp, Minus, Edit, Trash, Package, ShoppingCart, Image as ImageIcon, ArrowDown, ArrowUp, Download, Check, X } from "lucide-react";
import StockItemForm from "@/components/admin/StockItemForm";
import StockMovementForm from "@/components/admin/StockMovementForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  sku?: string;
  supplier?: string;
  image?: string;
}

interface ShoppingListItem {
  id: string;
  name: string;
  brand: string;
  unit: string;
  currentQuantity: number;
  minimumStock: number;
  desiredQuantity: number;
  selected: boolean;
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
    status: 'sufficient',
    sku: 'TNT-001',
    supplier: 'Distribuidora ABC'
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
    status: 'critical',
    sku: 'AGL-007',
    supplier: 'Fornecedor XYZ'
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
    status: 'low',
    sku: 'LUV-P01',
    supplier: 'Higiene Total'
  }
];

const Stock = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sufficient':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Suficiente</Badge>;
      case 'low':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Baixo</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Crítico</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalItems = stockItems.filter(item => item.status === 'critical');
  const lowStockItems = stockItems.filter(item => item.status === 'low');

  const totalValue = stockItems.reduce((sum, item) => sum + (item.currentQuantity * item.averageCost), 0);

  const handleShoppingListGeneration = () => {
    // Convert all stock items to shopping list items
    const allItems = stockItems.map(item => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      unit: item.unit,
      currentQuantity: item.currentQuantity,
      minimumStock: item.minimumStock,
      desiredQuantity: item.currentQuantity <= item.minimumStock ? item.minimumStock * 2 : item.minimumStock,
      selected: item.currentQuantity <= item.minimumStock // Auto-select items with low stock
    }));
    
    setShoppingList(allItems);
    setShowShoppingListDialog(true);
  };

  const handleShoppingListItemToggle = (itemId: string, checked: boolean) => {
    setShoppingList(prev => prev.map(item => 
      item.id === itemId ? { ...item, selected: checked } : item
    ));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setShoppingList(prev => prev.map(item => 
      item.id === itemId ? { ...item, desiredQuantity: Math.max(1, quantity) } : item
    ));
  };

  const exportShoppingList = () => {
    const selectedItems = shoppingList.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      toast({
        title: "Lista vazia",
        description: "Selecione pelo menos um item para exportar.",
        variant: "destructive",
      });
      return;
    }

    let listContent = "LISTA DE COMPRAS - 99TATTOO\n";
    listContent += "================================\n\n";
    
    selectedItems.forEach(item => {
      listContent += `${item.name} (${item.brand})\n`;
      listContent += `Quantidade desejada: ${item.desiredQuantity} ${item.unit}\n`;
      listContent += `Estoque atual: ${item.currentQuantity} ${item.unit}\n`;
      listContent += `Estoque mínimo: ${item.minimumStock} ${item.unit}\n`;
      listContent += "---\n";
    });

    listContent += `\nTotal de itens: ${selectedItems.length}\n`;
    listContent += `Data: ${new Date().toLocaleDateString('pt-BR')}`;

    // Create and download the file
    const blob = new Blob([listContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lista-compras-99tattoo-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Lista exportada",
      description: "Lista de compras foi baixada com sucesso!",
    });

    setShowShoppingListDialog(false);
  };

  const handleSaveItem = (itemData: any) => {
    if (selectedItem) {
      // Update existing item
      setStockItems(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { ...item, ...itemData, status: getItemStatus(itemData.currentQuantity, itemData.minimumStock) }
          : item
      ));
      toast({
        title: "Item atualizado",
        description: "O item foi atualizado com sucesso.",
      });
    } else {
      // Add new item
      const newItem: StockItem = {
        ...itemData,
        id: Date.now().toString(),
        status: getItemStatus(itemData.currentQuantity, itemData.minimumStock)
      };
      setStockItems(prev => [...prev, newItem]);
      toast({
        title: "Item adicionado",
        description: "O item foi adicionado ao estoque com sucesso.",
      });
    }
    
    setShowItemForm(false);
    setSelectedItem(null);
  };

  const handleMovement = (movement: any) => {
    if (!selectedItem) return;

    const newQuantity = movement.type === 'entrada' 
      ? selectedItem.currentQuantity + movement.quantity
      : selectedItem.currentQuantity - movement.quantity;

    setStockItems(prev => prev.map(item => 
      item.id === selectedItem.id 
        ? { 
            ...item, 
            currentQuantity: newQuantity,
            status: getItemStatus(newQuantity, item.minimumStock)
          }
        : item
    ));

    toast({
      title: "Movimentação registrada",
      description: `${movement.type === 'entrada' ? 'Entrada' : 'Saída'} de ${movement.quantity} ${selectedItem.unit} registrada com sucesso.`,
    });

    setShowMovementForm(false);
    setSelectedItem(null);
  };

  const getItemStatus = (currentQuantity: number, minimumStock: number): 'sufficient' | 'low' | 'critical' => {
    if (currentQuantity <= 0) return 'critical';
    if (currentQuantity <= minimumStock) return 'critical';
    if (currentQuantity <= minimumStock * 1.5) return 'low';
    return 'sufficient';
  };

  const handleDeleteItem = () => {
    if (!selectedItem) return;

    setStockItems(prev => prev.filter(item => item.id !== selectedItem.id));
    toast({
      title: "Item excluído",
      description: "O item foi removido do estoque.",
    });

    setShowDeleteDialog(false);
    setSelectedItem(null);
  };

  const useItem = (item: StockItem) => {
    setSelectedItem(item);
    setShowMovementForm(true);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-red-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-black text-red-800 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Controle de Estoque 99Tattoo
          </h1>
          <p className="text-gray-600 mt-2">Gerencie todos os materiais e suprimentos do estúdio</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleShoppingListGeneration}
            variant="tattooSecondary"
            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <ShoppingCart className="h-4 w-4" />
            Fazer Lista de Compras
          </Button>
          <Button 
            onClick={() => {
              setSelectedItem(null);
              setShowItemForm(true);
            }}
            variant="tattoo"
            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Adicionar Item
          </Button>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card variant="tattooRed" className="hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Total de Itens</CardTitle>
            <Package2 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-red-800">{stockItems.length}</div>
          </CardContent>
        </Card>
        <Card variant="tattooRed" className="hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-red-800">R$ {totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card variant="tattooRed" className="hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Estoque Baixo</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-yellow-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>
        <Card variant="tattooRed" className="hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Estoque Crítico</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-red-600">{criticalItems.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {criticalItems.length > 0 && (
        <Card className="border-red-300 bg-gradient-to-r from-red-50 to-red-100 mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2 font-black">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Estoque Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalItems.map((item) => (
                <div key={item.id} className="text-red-700 font-medium">
                  <strong>{item.name}</strong> - Apenas {item.currentQuantity} {item.unit} restante(s)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="mb-6 shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200">
        <CardHeader className="pb-2 bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg">
          <CardTitle className="text-lg text-red-800 font-black">Buscar Itens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-red-400" />
            <Input
              placeholder="Buscar por nome, marca, categoria ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="tattoo"
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stock Items Cards */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-4 text-lg font-black text-red-800">Nenhum item encontrado</h2>
          <p className="mt-2 text-red-600">
            {searchTerm ? "Tente ajustar sua busca." : "Comece adicionando seu primeiro item ao estoque."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              variant="tattooRed" 
              className="group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <CardHeader className="p-0">
                {/* Image Container */}
                <div className="relative h-32 overflow-hidden rounded-t-lg bg-gradient-to-br from-red-100 to-red-200">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-red-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(item.status)}
                  </div>

                  {/* Recent Movement Indicator */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1">
                      <ArrowDown size={12} />
                      Saída
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Item Name and Brand */}
                  <div>
                    <h3 className="font-black text-red-800 text-lg leading-tight line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-red-600">{item.brand}</p>
                  </div>

                  {/* SKU and Category */}
                  <div className="space-y-1">
                    <p className="text-xs text-red-500">
                      <strong>SKU:</strong> {item.sku}
                    </p>
                    <p className="text-xs text-red-500">
                      <strong>Categoria:</strong> {item.category}
                    </p>
                  </div>

                  {/* Quantity Info */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-red-700">Quantidade:</span>
                      <span className="text-lg font-black text-red-800">
                        {item.currentQuantity} {item.unit}
                      </span>
                    </div>
                    <div className="text-xs text-red-500">
                      Mín: {item.minimumStock} {item.unit}
                    </div>
                  </div>

                  {/* Cost and Location */}
                  <div className="space-y-1">
                    <p className="text-xs text-red-500">
                      <strong>Custo:</strong> R$ {item.averageCost.toFixed(2)}
                    </p>
                    <p className="text-xs text-red-500">
                      <strong>Local:</strong> {item.location}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between gap-1 pt-2 border-t border-red-200">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => useItem(item)}
                      className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700"
                      title="Usar Item"
                    >
                      <Minus size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowItemForm(true);
                      }}
                      className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700"
                      title="Editar Item"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowDeleteDialog(true);
                      }}
                      className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700"
                      title="Excluir Item"
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Shopping List Dialog */}
      <Dialog open={showShoppingListDialog} onOpenChange={setShowShoppingListDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-red-50 border-red-200">
          <DialogHeader>
            <DialogTitle className="text-red-800 font-black flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Lista de Compras Completa
            </DialogTitle>
            <DialogDescription className="text-red-600">
              Selecione os itens que deseja incluir na lista de compras e ajuste as quantidades
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col max-h-[60vh]">
            <div className="overflow-y-auto flex-1 space-y-3 pr-2">
              {shoppingList.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                    item.selected 
                      ? 'bg-red-50 border-red-300 shadow-md' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={item.selected}
                      onCheckedChange={(checked) => handleShoppingListItemToggle(item.id, checked as boolean)}
                      className="border-red-300 text-red-600 focus:ring-red-200"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`item-${item.id}`} className="font-medium text-red-800 cursor-pointer">
                        {item.name}
                      </Label>
                      <p className="text-sm text-red-600">{item.brand}</p>
                      <p className="text-xs text-red-500">
                        Estoque atual: {item.currentQuantity} {item.unit} | 
                        Mínimo: {item.minimumStock} {item.unit}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`qty-${item.id}`} className="text-sm text-red-700 font-medium">
                      Qtd:
                    </Label>
                    <Input
                      id={`qty-${item.id}`}
                      type="number"
                      min="1"
                      value={item.desiredQuantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      className="w-20 h-8 text-center border-red-200 focus:border-red-400"
                      disabled={!item.selected}
                    />
                    <span className="text-sm text-red-600">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-red-200">
            <div className="text-sm text-red-600">
              {shoppingList.filter(item => item.selected).length} item(s) selecionado(s)
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowShoppingListDialog(false)}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                variant="tattoo"
                onClick={exportShoppingList}
                className="shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Lista
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modals */}
      {showItemForm && (
        <StockItemForm
          item={selectedItem}
          onClose={() => {
            setShowItemForm(false);
            setSelectedItem(null);
          }}
          onSave={handleSaveItem}
        />
      )}

      {showMovementForm && selectedItem && (
        <StockMovementForm
          item={selectedItem}
          onClose={() => {
            setShowMovementForm(false);
            setSelectedItem(null);
          }}
          onSave={handleMovement}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gradient-to-br from-white to-red-50 border-red-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-800 font-black">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-red-600">
              Tem certeza que deseja excluir o item "{selectedItem?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-red-200 text-red-600 hover:bg-red-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteItem}
              className="bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Stock;
