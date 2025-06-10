
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IProjectSustainabilityAction } from "@/services/interfaces/IProjectService";

interface SustainabilityActionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (action: Omit<IProjectSustainabilityAction, 'id' | 'createdAt'>) => void;
  projectId: string;
  editAction?: IProjectSustainabilityAction;
}

const SustainabilityActionForm = ({ open, onOpenChange, onSubmit, projectId, editAction }: SustainabilityActionFormProps) => {
  const [formData, setFormData] = useState({
    title: editAction?.title || '',
    description: editAction?.description || '',
    responsible: editAction?.responsible || '',
    deadline: editAction?.deadline || '',
    status: editAction?.status || 'pending' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectId,
      title: formData.title,
      description: formData.description,
      responsible: formData.responsible,
      deadline: formData.deadline || undefined,
      status: formData.status
    });
    onOpenChange(false);
    setFormData({ title: '', description: '', responsible: '', deadline: '', status: 'pending' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editAction ? 'Editar Ação de Sustentabilidade' : 'Nova Ação de Sustentabilidade'}</DialogTitle>
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
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva a ação de sustentabilidade..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável</Label>
              <Input
                id="responsible"
                value={formData.responsible}
                onChange={(e) => setFormData({...formData, responsible: e.target.value})}
                placeholder="Nome do responsável"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Prazo</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
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
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
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
