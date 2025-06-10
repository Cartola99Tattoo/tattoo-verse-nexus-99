
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IProjectImprovementAction, IProjectSmartGoal } from "@/services/interfaces/IProjectService";

interface ImprovementActionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (action: Omit<IProjectImprovementAction, 'id' | 'createdAt'>) => void;
  projectId: string;
  smartGoals?: IProjectSmartGoal[];
  editAction?: IProjectImprovementAction;
}

const ImprovementActionForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  projectId, 
  smartGoals = [],
  editAction 
}: ImprovementActionFormProps) => {
  const [formData, setFormData] = useState({
    title: editAction?.title || '',
    description: editAction?.description || '',
    responsible: editAction?.responsible || '',
    priority: editAction?.priority || 'medium' as const,
    status: editAction?.status || 'pending' as const,
    dueDate: editAction?.dueDate || '',
    smartGoalId: editAction?.smartGoalId || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectId,
      title: formData.title,
      description: formData.description,
      responsible: formData.responsible,
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate || undefined,
      smartGoalId: formData.smartGoalId || undefined
    });
    onOpenChange(false);
    setFormData({ 
      title: '', 
      description: '', 
      responsible: '', 
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      smartGoalId: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-800">
            {editAction ? 'Editar Ação de Melhoria' : 'Nova Ação de Melhoria'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Melhorar processo de atendimento"
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
              placeholder="Descreva a ação de melhoria..."
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
              <Label htmlFor="dueDate">Data Limite</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="border-red-200 focus:border-red-400"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData({...formData, priority: value})}>
                <SelectTrigger className="border-red-200 focus:border-red-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
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

export default ImprovementActionForm;
