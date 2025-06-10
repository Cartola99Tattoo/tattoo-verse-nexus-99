
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { getProjectService } from "@/services/serviceFactory";
import { IProject, IKanbanStage, IProjectSmartGoal, SmartCriteria, ISmartGoalAssociation } from "@/services/interfaces/IProjectService";
import { mockTeamMembers } from "@/data/mockTeamMembers";
import { useDataQuery } from "@/hooks/useDataQuery";
import { toast } from "@/hooks/use-toast";
import SmartCriteriaSelector from "@/components/admin/SmartCriteriaSelector";

interface CreateTaskFormProps {
  project: IProject;
  stages: IKanbanStage[];
  onTaskCreated: () => void;
  onCancel: () => void;
  initialStage?: string;
}

const CreateTaskForm = ({ project, stages, onTaskCreated, onCancel, initialStage }: CreateTaskFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: initialStage || stages[0]?.id || 'ideas',
    priority: 'medium' as const,
    assignedTo: '',
    dueDate: '',
    estimatedHours: '',
    smartGoalId: 'none',
    smartCriteria: [] as SmartCriteria[]
  });

  const projectService = getProjectService();

  const { data: smartGoals, loading: smartGoalsLoading } = useDataQuery<IProjectSmartGoal[]>(
    () => projectService.fetchProjectSmartGoals(project.id),
    [project.id]
  );

  // Ensure safe access to smartGoals array
  const safeSmartGoals = Array.isArray(smartGoals) ? smartGoals : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const smartGoalAssociation: ISmartGoalAssociation[] = 
        formData.smartGoalId !== 'none' && formData.smartCriteria.length > 0
          ? [{ goalId: formData.smartGoalId, criteria: formData.smartCriteria }]
          : [];

      const taskData = {
        projectId: project.id,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo || undefined,
        dueDate: formData.dueDate || undefined,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
        smartGoalAssociation: smartGoalAssociation.length > 0 ? smartGoalAssociation : undefined,
        order: 0
      };

      await projectService.createTask(taskData);
      
      toast({
        title: "Tarefa criada",
        description: "A tarefa foi criada com sucesso.",
      });
      
      onTaskCreated();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar a tarefa. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleSmartGoalChange = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      smartGoalId: goalId,
      smartCriteria: goalId === 'none' ? [] : prev.smartCriteria
    }));
  };

  const handleSmartCriteriaChange = (criteria: SmartCriteria[]) => {
    setFormData(prev => ({
      ...prev,
      smartCriteria: criteria
    }));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onCancel} className="border-red-300 text-red-600 hover:bg-red-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 font-heading">Nova Tarefa</h1>
        </div>

        <Card className="border-l-4 border-l-red-600 shadow-tattoo bg-gradient-to-br from-white to-red-50">
          <CardHeader className="bg-gradient-to-r from-red-50 to-white border-b border-red-100">
            <CardTitle className="text-red-800">Detalhes da Tarefa</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título da Tarefa */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                  Título da Tarefa *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Criar material promocional para evento"
                  required
                  className="border-red-200 focus:border-red-400"
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva os detalhes da tarefa..."
                  rows={3}
                  className="border-red-200 focus:border-red-400"
                />
              </div>

              {/* Etapa Inicial e Prioridade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Etapa Inicial</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="border-red-200 focus:border-red-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value: any) => setFormData({...formData, priority: value})}>
                    <SelectTrigger className="border-red-200 focus:border-red-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="critical">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Responsável e Data de Vencimento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Responsável</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => setFormData({...formData, assignedTo: value})}>
                    <SelectTrigger className="border-red-200 focus:border-red-400">
                      <SelectValue placeholder="Selecionar responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} - {member.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-sm font-semibold text-gray-700">
                    Data de Vencimento
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="border-red-200 focus:border-red-400"
                  />
                </div>
              </div>

              {/* Tempo Médio */}
              <div className="space-y-2">
                <Label htmlFor="estimatedHours" className="text-sm font-semibold text-gray-700">
                  Tempo Médio para Realizar (horas)
                </Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                  placeholder="Ex: 8"
                  min="0"
                  step="0.5"
                  className="border-red-200 focus:border-red-400"
                />
              </div>

              {/* Associação à Meta SMART */}
              {!smartGoalsLoading && (
                <SmartCriteriaSelector
                  smartGoals={safeSmartGoals}
                  selectedGoalId={formData.smartGoalId}
                  selectedCriteria={formData.smartCriteria}
                  onGoalChange={handleSmartGoalChange}
                  onCriteriaChange={handleSmartCriteriaChange}
                />
              )}

              {/* Botões */}
              <div className="flex gap-3 pt-6 border-t border-red-100">
                <Button 
                  type="submit" 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-red-glow"
                >
                  Criar Tarefa
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTaskForm;
