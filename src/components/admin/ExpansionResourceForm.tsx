
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IProjectExpansionResource, IProjectSmartGoal } from "@/services/interfaces/IProjectService";

interface ExpansionResourceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (resource: Omit<IProjectExpansionResource, 'id' | 'createdAt'>) => void;
  projectId: string;
  smartGoals?: IProjectSmartGoal[];
  editResource?: IProjectExpansionResource;
}

const ExpansionResourceForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  projectId, 
  smartGoals = [],
  editResource 
}: ExpansionResourceFormProps) => {
  const [formData, setFormData] = useState({
    resource: editResource?.resource || '',
    justification: editResource?.justification || '',
    estimatedCost: editResource?.estimatedCost || 0,
    status: editResource?.status || 'planning' as const,
    smartGoalId: editResource?.smartGoalId || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectId,
      resource: formData.resource,
      justification: formData.justification,
      estimatedCost: formData.estimatedCost,
      status: formData.status,
      smartGoalId: formData.smartGoalId || undefined
    });
    onOpenChange(false);
    setFormData({ 
      resource: '', 
      justification: '', 
      estimatedCost: 0, 
      status: 'planning',
      smartGoalId: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-800">
            {editResource ? 'Editar Recurso de Expansão' : 'Novo Recurso de Expansão'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resource">Recurso *</Label>
            <Input
              id="resource"
              value={formData.resource}
              onChange={(e) => setFormData({...formData, resource: e.target.value})}
              placeholder="Ex: Novo equipamento de tatuagem"
              required
              className="border-red-200 focus:border-red-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="justification">Justificativa</Label>
            <Textarea
              id="justification"
              value={formData.justification}
              onChange={(e) => setFormData({...formData, justification: e.target.value})}
              placeholder="Justifique a necessidade deste recurso..."
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
                  <SelectItem value="">Nenhuma meta associada</SelectItem>
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
              <Label htmlFor="estimatedCost">Custo Estimado (R$)</Label>
              <Input
                id="estimatedCost"
                type="number"
                step="0.01"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({...formData, estimatedCost: parseFloat(e.target.value) || 0})}
                className="border-red-200 focus:border-red-400"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                <SelectTrigger className="border-red-200 focus:border-red-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planejamento</SelectItem>
                  <SelectItem value="researching">Pesquisando</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="acquired">Adquirido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
              {editResource ? 'Atualizar' : 'Adicionar'} Recurso
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

export default ExpansionResourceForm;
