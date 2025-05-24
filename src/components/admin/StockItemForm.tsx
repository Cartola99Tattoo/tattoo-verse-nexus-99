
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

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
}

interface StockItemFormProps {
  item?: StockItem | null;
  onClose: () => void;
  onSave: (item: StockItem) => void;
}

const categories = [
  "Tintas",
  "Agulhas",
  "Máquinas",
  "Higiene",
  "Descartáveis",
  "Pós-Tatuagem",
  "Biqueiras",
  "Luvas",
  "Outros"
];

const units = [
  "ml",
  "unidade",
  "caixa",
  "rolo",
  "pacote",
  "litro",
  "kg",
  "g"
];

const StockItemForm = ({ item, onClose, onSave }: StockItemFormProps) => {
  const [formData, setFormData] = useState<StockItem>({
    name: "",
    brand: "",
    category: "",
    description: "",
    currentQuantity: 0,
    unit: "unidade",
    averageCost: 0,
    minimumStock: 0,
    location: "",
    ...item
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof StockItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {item ? "Editar Item do Estoque" : "Adicionar Novo Item"}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Item *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Ex: Tinta Preta Premium"
                  required
                />
              </div>
              <div>
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  placeholder="Ex: World Famous"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unit">Unidade de Medida *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleChange("unit", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
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
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Descrição detalhada do item..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentQuantity">Quantidade Atual *</Label>
                <Input
                  id="currentQuantity"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.currentQuantity}
                  onChange={(e) => handleChange("currentQuantity", parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="minimumStock">Estoque Mínimo *</Label>
                <Input
                  id="minimumStock"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.minimumStock}
                  onChange={(e) => handleChange("minimumStock", parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="averageCost">Custo Médio (R$)</Label>
                <Input
                  id="averageCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.averageCost}
                  onChange={(e) => handleChange("averageCost", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Localização no Estúdio</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Ex: Armário 2, Prateleira 3"
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                {item ? "Atualizar" : "Adicionar"} Item
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockItemForm;
