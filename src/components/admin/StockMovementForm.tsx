
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Package, Minus } from "lucide-react";

interface StockItem {
  id: string;
  name: string;
  brand: string;
  currentQuantity: number;
  unit: string;
}

interface StockMovement {
  type: "entrada" | "saida";
  quantity: number;
  reason: string;
  supplier?: string;
  cost?: number;
  user?: string;
  date: string;
}

interface StockMovementFormProps {
  item: StockItem;
  onClose: () => void;
  onSave: (movement: StockMovement) => void;
}

const StockMovementForm = ({ item, onClose, onSave }: StockMovementFormProps) => {
  const [formData, setFormData] = useState<StockMovement>({
    type: "entrada",
    quantity: 0,
    reason: "",
    supplier: "",
    cost: 0,
    user: "",
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof StockMovement, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {formData.type === "entrada" ? (
              <Package className="h-5 w-5 text-green-600" />
            ) : (
              <Minus className="h-5 w-5 text-red-600" />
            )}
            Movimentação de Estoque
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.brand}</p>
            <p className="text-sm text-gray-600">
              Estoque atual: {item.currentQuantity} {item.unit}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Tipo de Movimentação *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "entrada" | "saida") => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-green-600" />
                      Entrada (Recebimento)
                    </div>
                  </SelectItem>
                  <SelectItem value="saida">
                    <div className="flex items-center gap-2">
                      <Minus className="h-4 w-4 text-red-600" />
                      Saída (Consumo)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantidade *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", parseFloat(e.target.value) || 0)}
                  placeholder={`Em ${item.unit}`}
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              </div>
            </div>

            {formData.type === "entrada" && (
              <>
                <div>
                  <Label htmlFor="supplier">Fornecedor</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier || ""}
                    onChange={(e) => handleChange("supplier", e.target.value)}
                    placeholder="Nome do fornecedor"
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Custo Total (R$)</Label>
                  <Input
                    id="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost || ""}
                    onChange={(e) => handleChange("cost", parseFloat(e.target.value) || 0)}
                    placeholder="Valor total da compra"
                  />
                </div>
              </>
            )}

            {formData.type === "saida" && (
              <div>
                <Label htmlFor="user">Tatuador/Usuário</Label>
                <Input
                  id="user"
                  value={formData.user || ""}
                  onChange={(e) => handleChange("user", e.target.value)}
                  placeholder="Quem utilizou o material"
                />
              </div>
            )}

            <div>
              <Label htmlFor="reason">Observações *</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                placeholder={
                  formData.type === "entrada" 
                    ? "Ex: Reposição de estoque, pedido #123"
                    : "Ex: Tatuagem cliente João, sessão da tarde"
                }
                rows={3}
                required
              />
            </div>

            {formData.quantity > 0 && (
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Novo estoque:</strong> {
                    formData.type === "entrada" 
                      ? item.currentQuantity + formData.quantity
                      : item.currentQuantity - formData.quantity
                  } {item.unit}
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className={
                  formData.type === "entrada" 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                Registrar {formData.type === "entrada" ? "Entrada" : "Saída"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockMovementForm;
