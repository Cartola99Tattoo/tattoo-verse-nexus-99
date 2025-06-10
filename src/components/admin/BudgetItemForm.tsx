
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IProjectBudgetItem } from "@/services/interfaces/IProjectService";

interface BudgetItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: Omit<IProjectBudgetItem, 'id' | 'createdAt'>) => void;
  projectId: string;
  editItem?: IProjectBudgetItem;
}

const BudgetItemForm = ({ open, onOpenChange, onSubmit, projectId, editItem }: BudgetItemFormProps) => {
  const [formData, setFormData] = useState({
    description: editItem?.description || '',
    estimatedCost: editItem?.estimatedCost || 0,
    realCost: editItem?.realCost || 0,
    status: editItem?.status || 'estimated' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectId,
      description: formData.description,
      estimatedCost: formData.estimatedCost,
      realCost: formData.realCost,
      status: formData.status
    });
    onOpenChange(false);
    setFormData({ description: '', estimatedCost: 0, realCost: 0, status: 'estimated' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editItem ? 'Editar Item de Orçamento' : 'Novo Item de Orçamento'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva o item do orçamento..."
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Custo Estimado (R$) *</Label>
              <Input
                id="estimatedCost"
                type="number"
                step="0.01"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({...formData, estimatedCost: parseFloat(e.target.value) || 0})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="realCost">Custo Real (R$)</Label>
              <Input
                id="realCost"
                type="number"
                step="0.01"
                value={formData.realCost}
                onChange={(e) => setFormData({...formData, realCost: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estimated">Estimado</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {editItem ? 'Atualizar' : 'Adicionar'} Item
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetItemForm;
