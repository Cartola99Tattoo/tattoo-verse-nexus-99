import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Target, Clock, User, Save } from "lucide-react";
import { getProjectService } from "@/services/serviceFactory";
import { IProject, IKanbanStage, IProjectTask, IProjectSmartGoal, SmartCriteria, ISmartGoalAssociation } from "@/services/interfaces/IProjectService";
import { useDataQuery } from "@/hooks/useDataQuery";
import { toast } from "@/hooks/use-toast";
import SmartCriteriaSelector from "@/components/admin/SmartCriteriaSelector";

interface EditTaskFormProps {
  task: IProjectTask;
  project: IProject;
  stages: IKanbanStage[];
  onTaskUpdated: () => void;
  onCancel: () => void;
}

// Mock data para responsáveis - em produção viria do banco de dados
const mockTeamMembers = [
  { id: 'tatuador1', name: 'João Silva', role: 'Tatuador Senior' },
  { id: 'tatuador2', name: 'Maria Santos', role: 'Tatuadora' },
  { id: 'tatuador3', name: 'Pedro Costa', role: 'Tatuador' },
  { id: 'designer1', name: 'Ana Oliveira', role: 'Designer' },
  { id: 'gerente1', name: 'Carlos Mendes', role: 'Gerente de Projeto' },
  { id: 'social1', name: 'Lucia Ferreira', role: 'Social Media' },
];

const EditTaskForm = ({ task, project, stages, onTaskUpdated, onCancel }: EditTaskFormProps) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    assignedTo: task.assignedTo || '',
    dueDate: task.dueDate || '',
    estimatedHours: task.estimatedHours?.toString() || '',
    smartGoalId: task.smartGoalAssociation?.[0]?.goalId || 'none',
    smartCriteria: task.smartGoalAssociation?.[0]?.criteria || [] as SmartCriteria[]
  });

  const projectService = getProjectService();

  const { data: smartGoals, loading: smartGoalsLoading } = useDataQuery<IProjectSmartGoal[]>(
    () => projectService.fetchProjectSmartGoals(project.id),
    [project.id]
  );

  const safeSmartGoals = Array.isArray(smartGoals) ? smartGoals : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const smartGoalAssociation: ISmartGoalAssociation[] = 
        formData.smartGoalId !== 'none' && formData.smartCriteria.length > 0
          ? [{ goalId: formData.smartGoalId, criteria: formData.smartCriteria }]
          : [];

      const updateData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo || undefined,
        dueDate: formData.dueDate || undefined,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
        smartGoalAssociation: smartGoalAssociation.length > 0 ? smartGoalAssociation : undefined,
      };

      await projectService.updateTask(task.id, updateData);
      
      toast({
        title: "Tarefa atualizada com sucesso! ✨",
        description: "As alterações foram salvas no quadro de tarefas.",
      });
      
      onTaskUpdated();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Erro ao atualizar tarefa",
        description: "Ocorreu um erro. Tente novamente.",
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
    <div className="p-6 bg-gradient-to-br from-red-50 via-white to-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            className="border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Quadro
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent font-heading">
              Editar Tarefa
            </h1>
            <p className="text-gray-600 mt-1">Projeto: {project.name}</p>
          </div>
        </div>

        <Card className="border-l-4 border-l-red-600 shadow-2xl bg-gradient-to-br from-white to-red-50/30">
          <CardHeader className="bg-gradient-to-r from-red-50 to-white border-b border-red-100">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Editar Detalhes da Tarefa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Título da Tarefa */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  Título da Tarefa *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Criar material promocional para evento de tatuagem"
                  required
                  className="border-red-200 focus:border-red-400 text-lg p-4 bg-white shadow-sm"
                />
              </div>

              {/* Descrição */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                  Descrição Detalhada
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva os detalhes da tarefa, objetivos e requisitos específicos..."
                  rows={4}
                  className="border-red-200 focus:border-red-400 bg-white shadow-sm"
                />
              </div>

              {/* Etapa e Prioridade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Etapa</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="border-red-200 focus:border-red-400 bg-white shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id} className="hover:bg-red-50">
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value: "low" | "medium" | "high" | "critical") => setFormData({...formData, priority: value})}>
                    <SelectTrigger className="border-red-200 focus:border-red-400 bg-white shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low" className="hover:bg-green-50">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Baixa
                        </span>
                      </SelectItem>
                      <SelectItem value="medium" className="hover:bg-yellow-50">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          Média
                        </span>
                      </SelectItem>
                      <SelectItem value="high" className="hover:bg-orange-50">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Alta
                        </span>
                      </SelectItem>
                      <SelectItem value="critical" className="hover:bg-red-50">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Crítica
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Responsável e Data de Vencimento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Responsável
                  </Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => setFormData({...formData, assignedTo: value})}>
                    <SelectTrigger className="border-red-200 focus:border-red-400 bg-white shadow-sm">
                      <SelectValue placeholder="Selecionar responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id} className="hover:bg-red-50">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{member.name}</span>
                            <span className="text-xs text-gray-500">{member.role}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="dueDate" className="text-sm font-semibold text-gray-700">
                    Data de Vencimento
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="border-red-200 focus:border-red-400 bg-white shadow-sm"
                  />
                </div>
              </div>

              {/* Tempo Estimado */}
              <div className="space-y-3">
                <Label htmlFor="estimatedHours" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Tempo Estimado para Conclusão (horas)
                </Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                  placeholder="Ex: 8"
                  min="0"
                  step="0.5"
                  className="border-red-200 focus:border-red-400 bg-white shadow-sm w-full md:w-48"
                />
                <p className="text-xs text-gray-500">
                  Estimativa de tempo necessário para completar esta tarefa
                </p>
              </div>

              {/* Associação à Meta SMART */}
              {!smartGoalsLoading && (
                <div className="space-y-4 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-red-800">Associação à Meta SMART</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Conecte esta tarefa a uma meta estratégica do projeto para melhor acompanhamento.
                  </p>
                  <SmartCriteriaSelector
                    smartGoals={safeSmartGoals}
                    selectedGoalId={formData.smartGoalId}
                    selectedCriteria={formData.smartCriteria}
                    onGoalChange={handleSmartGoalChange}
                    onCriteriaChange={handleSmartCriteriaChange}
                  />
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-4 pt-8 border-t border-red-100">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 py-3 text-lg font-semibold"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Salvar Alterações
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className="border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300 px-8"
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

export default EditTaskForm;

</edits_to_apply>
