
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IProjectExpansionResource } from "@/services/interfaces/IProjectService";

interface ExpansionResourceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (resource: Omit<IProjectExpansionResource, 'id' | 'createdAt'>) => void;
  projectId: string;
  editResource?: IProjectExpansionResource;
}

const ExpansionResourceForm = ({ open, onOpenChange, onSubmit, projectId, editResource }: ExpansionResourceFormProps) => {
  const [formData, setFormData] = useState({
    resource: editResource?.resource || '',
    justification: editResource?.justification || '',
    estimatedCost: editResource?.estimatedCost || 0,
    status: editResource?.status || 'planning' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectId,
      resource: formData.resource,
      justification: formData.justification,
      estimatedCost: formData.estimatedCost,
      status: formData.status
    });
    onOpenChange(false);
    setFormData({ resource: '', justification: '', estimatedCost: 0, status: 'planning' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editResource ? 'Editar Recurso de Expansão' : 'Novo Recurso de Expansão'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resource">Recurso *</Label>
            <Input
              id="resource"
              value={formData.resource}
              onChange={(e) => setFormData({...formData, resource: e.target.value})}
              placeholder="Ex: Mais 2 tatuadores"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="justification">Justificativa *</Label>
            <Textarea
              id="justification"
              value={formData.justification}
              onChange={(e) => setFormData({...formData, justification: e.target.value})}
              placeholder="Explique por que este recurso é necessário..."
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
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                <SelectTrigger>
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
            <Button type="submit" className="flex-1">
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
