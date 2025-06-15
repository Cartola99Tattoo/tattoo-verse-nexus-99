
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, Loader } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface StockItem {
  id?: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  currentQuantity: number;
  unit: string;
  averageCost: number;
  minimumStock: number;
  location: string;
  sku?: string;
  supplier?: string;
  image?: string;
}

interface StockItemFormProps {
  item?: StockItem | null;
  onClose: () => void;
  onSave: (item: StockItem) => void;
}

export default function StockItemForm({ item, onClose, onSave }: StockItemFormProps) {
  const [formData, setFormData] = useState<StockItem>({
    name: item?.name || "",
    brand: item?.brand || "",
    category: item?.category || "",
    description: item?.description || "",
    currentQuantity: item?.currentQuantity || 0,
    unit: item?.unit || "unidade",
    averageCost: item?.averageCost || 0,
    minimumStock: item?.minimumStock || 1,
    location: item?.location || "",
    sku: item?.sku || "",
    supplier: item?.supplier || "",
    image: item?.image || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Tintas",
    "Agulhas",
    "Higiene",
    "Equipamentos",
    "Descartáveis",
    "Cuidados Pós-Tatuagem",
    "Materiais de Limpeza",
    "Outros"
  ];

  const units = [
    "unidade",
    "ml",
    "litro",
    "grama",
    "kg",
    "caixa",
    "pacote",
    "metro"
  ];

  const handleInputChange = (field: keyof StockItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-red-50 border-red-200">
        <DialogHeader>
          <DialogTitle className="text-red-800 font-black flex items-center justify-between">
            {item ? "Editar Item do Estoque" : "Adicionar Item ao Estoque"}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 text-red-600 hover:text-red-800"
            >
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-black text-red-800 text-lg">Informações Básicas</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-red-700 font-bold">Nome do Item</Label>
                    <Input
                      id="name"
                      variant="tattoo"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ex: Tinta Preta Premium"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sku" className="text-red-700 font-bold">SKU/Código</Label>
                    <Input
                      id="sku"
                      variant="tattoo"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      placeholder="Ex: TNT-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand" className="text-red-700 font-bold">Marca</Label>
                    <Input
                      id="brand"
                      variant="tattoo"
                      value={formData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                      placeholder="Ex: World Famous"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-red-700 font-bold">Categoria</Label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-red-200 bg-background px-3 py-2 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-red-700 font-bold">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descrição detalhada do item"
                    className="border-red-200 focus:border-red-600 focus:ring-red-200"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Estoque e Preços */}
            <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-black text-red-800 text-lg">Estoque e Preços</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="quantity" className="text-red-700 font-bold">Quantidade Atual</Label>
                    <Input
                      id="quantity"
                      type="number"
                      variant="tattoo"
                      value={formData.currentQuantity}
                      onChange={(e) => handleInputChange("currentQuantity", parseInt(e.target.value) || 0)}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="unit" className="text-red-700 font-bold">Unidade</Label>
                    <select
                      value={formData.unit}
                      onChange={(e) => handleInputChange("unit", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-red-200 bg-background px-3 py-2 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none"
                      required
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="minStock" className="text-red-700 font-bold">Estoque Mínimo</Label>
                    <Input
                      id="minStock"
                      type="number"
                      variant="tattoo"
                      value={formData.minimumStock}
                      onChange={(e) => handleInputChange("minimumStock", parseInt(e.target.value) || 1)}
                      placeholder="1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cost" className="text-red-700 font-bold">Custo Médio (R$)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      variant="tattoo"
                      value={formData.averageCost}
                      onChange={(e) => handleInputChange("averageCost", parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="supplier" className="text-red-700 font-bold">Fornecedor</Label>
                    <Input
                      id="supplier"
                      variant="tattoo"
                      value={formData.supplier}
                      onChange={(e) => handleInputChange("supplier", e.target.value)}
                      placeholder="Ex: Distribuidora ABC"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Localização e Imagem */}
            <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-black text-red-800 text-lg">Localização e Imagem</h3>
                
                <div>
                  <Label htmlFor="location" className="text-red-700 font-bold">Localização no Estoque</Label>
                  <Input
                    id="location"
                    variant="tattoo"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Ex: Armário 1, Prateleira 2"
                    required
                  />
                </div>

                <div>
                  <Label className="text-red-700 font-bold">Imagem do Item</Label>
                  <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-red-400" />
                    <p className="mt-2 text-sm text-red-600">
                      Arraste e solte uma imagem aqui ou clique para selecionar
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                      PNG, JPG, GIF até 5MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="tattoo"
                disabled={isSubmitting}
                className="shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  item ? "Atualizar Item" : "Adicionar Item"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
