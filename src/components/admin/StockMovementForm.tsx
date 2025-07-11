
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { X, Minus, Plus, Loader } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface StockItem {
  id: string;
  name: string;
  brand: string;
  currentQuantity: number;
  unit: string;
}

interface StockMovement {
  type: 'entrada' | 'saida';
  quantity: number;
  reason: string;
  notes?: string;
}

interface StockMovementFormProps {
  item: StockItem;
  onClose: () => void;
  onSave: (movement: StockMovement) => void;
}

export default function StockMovementForm({ item, onClose, onSave }: StockMovementFormProps) {
  const [movementType, setMovementType] = useState<'entrada' | 'saida'>('saida');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasonOptions = {
    saida: [
      "Uso em procedimento",
      "Vencimento",
      "Perda/Dano",
      "Transferência",
      "Teste de qualidade",
      "Outro"
    ],
    entrada: [
      "Compra",
      "Devolução",
      "Transferência",
      "Doação",
      "Ajuste de inventário",
      "Outro"
    ]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave({
        type: movementType,
        quantity,
        reason,
        notes
      });
    } catch (error) {
      console.error("Error saving movement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const newQuantity = movementType === 'entrada' 
    ? item.currentQuantity + quantity 
    : item.currentQuantity - quantity;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[500px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-red-50 border-red-200">
        <DialogHeader>
          <DialogTitle className="text-red-800 font-black flex items-center justify-between pr-8">
            Movimentar Estoque
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pb-4">
          {/* Item Info */}
          <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
            <CardContent className="p-4">
              <h3 className="font-black text-red-800 text-lg mb-2 break-words">{item.name}</h3>
              <p className="text-red-600 text-sm mb-2">{item.brand}</p>
              <p className="text-red-700 font-medium">
                Estoque atual: <span className="font-black">{item.currentQuantity} {item.unit}</span>
              </p>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Movement Type */}
            <div className="space-y-3">
              <Label className="text-red-700 font-bold">Tipo de Movimentação</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={movementType === 'entrada' ? 'tattoo' : 'outline'}
                  onClick={() => setMovementType('entrada')}
                  className="flex items-center gap-2 justify-center h-12"
                >
                  <Plus size={16} />
                  Entrada
                </Button>
                <Button
                  type="button"
                  variant={movementType === 'saida' ? 'tattoo' : 'outline'}
                  onClick={() => setMovementType('saida')}
                  className="flex items-center gap-2 justify-center h-12"
                >
                  <Minus size={16} />
                  Saída
                </Button>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-red-700 font-bold">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={movementType === 'saida' ? item.currentQuantity : undefined}
                variant="tattoo"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                required
                className="h-12 text-base"
              />
              <div className="bg-red-50 p-3 rounded-md border border-red-200">
                <p className="text-sm text-red-700">
                  Novo estoque: <span className="font-bold">{newQuantity} {item.unit}</span>
                  {newQuantity < 0 && <span className="text-red-800 font-bold block mt-1">⚠️ ATENÇÃO: Estoque ficará negativo!</span>}
                </p>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-red-700 font-bold">Motivo</Label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="flex h-12 w-full rounded-md border border-red-200 bg-background px-3 py-2 text-base focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none"
                required
              >
                <option value="">Selecione um motivo</option>
                {reasonOptions[movementType].map((reasonOption) => (
                  <option key={reasonOption} value={reasonOption}>{reasonOption}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-red-700 font-bold">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Informações adicionais sobre a movimentação..."
                className="border-red-200 focus:border-red-600 focus:ring-red-200 min-h-[80px] resize-none"
                rows={3}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
                className="border-red-200 text-red-600 hover:bg-red-50 h-12 order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="tattoo"
                disabled={isSubmitting || newQuantity < 0}
                className="shadow-lg hover:shadow-xl transition-all duration-300 h-12 order-1 sm:order-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Confirmar Movimentação"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
