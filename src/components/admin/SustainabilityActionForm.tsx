
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IProjectSustainabilityAction, IProjectSmartGoal } from "@/services/interfaces/IProjectService";

interface SustainabilityActionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (action: Omit<IProjectSustainabilityAction, 'id' | 'createdAt'>) => void;
  projectId: string;
  smartGoals?: IProjectSmartGoal[];
  editAction?: IProjectSustainabilityAction;
}

const SustainabilityActionForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  projectId, 
  smartGoals = [],
  editAction 
}: SustainabilityActionFormProps) => {
  const [formData, setFormData] = useState({
    title: editAction?.title || '',
    description: editAction?.description || '',
    responsible: editAction?.responsible || '',
    deadline: editAction?.deadline || '',
    status: editAction?.status || 'pending' as const,
    smartGoalId: editAction?.smartGoalId || 'none'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectId,
      title: formData.title,
      description: formData.description,
      responsible: formData.responsible,
      deadline: formData.deadline || undefined,
      status: formData.status,
      smartGoalId: formData.smartGoalId === 'none' ? undefined : formData.smartGoalId
    });
    onOpenChange(false);
    setFormData({ 
      title: '', 
      description: '', 
      responsible: '', 
      deadline: '', 
      status: 'pending',
      smartGoalId: 'none'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-800">
            {editAction ? 'Editar Ação de Sustentabilidade' : 'Nova Ação de Sustentabilidade'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Cronograma de posts pós-evento"
              required
              className="border-red-200 focus:border-red-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva a ação de sustentabilidade..."
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
              <Label htmlFor="responsible">Responsável</Label>
              <Input
                id="responsible"
                value={formData.responsible}
                onChange={(e) => setFormData({...formData, responsible: e.target.value})}
                placeholder="Nome do responsável"
                className="border-red-200 focus:border-red-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Prazo</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
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
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
              {editAction ? 'Atualizar' : 'Adicionar'} Ação
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

export default SustainabilityActionForm;
