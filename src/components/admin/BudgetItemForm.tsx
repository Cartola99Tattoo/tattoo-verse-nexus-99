
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IProjectBudgetItem, IProjectSmartGoal } from "@/services/interfaces/IProjectService";

interface BudgetItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: Omit<IProjectBudgetItem, 'id' | 'createdAt'>) => void;
  projectId: string;
  smartGoals?: IProjectSmartGoal[];
  editItem?: IProjectBudgetItem;
}

const BudgetItemForm = ({ open, onOpenChange, onSubmit, projectId, smartGoals = [], editItem }: BudgetItemFormProps) => {
  const [formData, setFormData] = useState({
    description: editItem?.description || '',
    estimatedCost: editItem?.estimatedCost || 0,
    realCost: editItem?.realCost || 0,
    status: editItem?.status || 'estimated' as const,
    smartGoalId: editItem?.smartGoalId || 'none'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectId,
      description: formData.description,
      estimatedCost: formData.estimatedCost,
      realCost: formData.realCost,
      status: formData.status,
      smartGoalId: formData.smartGoalId === 'none' ? undefined : formData.smartGoalId
    });
    onOpenChange(false);
    setFormData({ description: '', estimatedCost: 0, realCost: 0, status: 'estimated', smartGoalId: 'none' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-800">
            {editItem ? 'Editar Item de Orçamento' : 'Novo Item de Orçamento'}
          </DialogTitle>
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
              className="border-red-200 focus:border-red-400"
            />
          </div>

          {smartGoals.length > 0 && (
            <div className="space-y-2">
              <Label>Meta SMART Associada</Label>
              <Select value={formData.smartGoalId} onValueChange={(value) => setFormData({...formData, smartGoalId: value})}>
                <SelectTrigger className="border-red-200 focus:border-red-400">
                  <SelectValue placeholder="Selecionar meta SMART (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma meta associada</SelectItem>
                  {smartGoals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
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
                className="border-red-200 focus:border-red-400"
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
                className="border-red-200 focus:border-red-400"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
              <SelectTrigger className="border-red-200 focus:border-red-400">
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
            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
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
