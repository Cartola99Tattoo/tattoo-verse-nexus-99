
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Target } from "lucide-react";
import { getProjectService } from "@/services/serviceFactory";
import { IProject, IKanbanStage, IProjectSmartGoal } from "@/services/interfaces/IProjectService";
import { toast } from "@/hooks/use-toast";
import { useDataQuery } from "@/hooks/useDataQuery";

interface CreateTaskFormProps {
  project: IProject;
  stages: IKanbanStage[];
  onTaskCreated: () => void;
  onCancel: () => void;
}

const CreateTaskForm = ({ project, stages, onTaskCreated, onCancel }: CreateTaskFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: stages[0]?.id || '',
    priority: 'medium' as const,
    assignedTo: '',
    dueDate: '',
    order: 0,
    estimatedHours: 0,
    smartGoalAssociation: 'none' as any
  });
  const [loading, setLoading] = useState(false);
  const projectService = getProjectService();

  // Buscar metas SMART do projeto
  const { data: smartGoals = [] } = useDataQuery<IProjectSmartGoal[]>(
    () => projectService.fetchProjectSmartGoals(project.id),
    [project.id]
  );

  // Mock data para responsáveis (tatuadores)
  const mockResponsaveis = [
    'Marcus Silva - Tatuador Sênior',
    'Ana Costa - Tatuadora Especialista',
    'João Santos - Tatuador Júnior',
    'Maria Oliveira - Tatuadora Realismo',
    'Pedro Lima - Tatuador Tradicional',
    'Carla Souza - Tatuadora Fine Line'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "Título da tarefa é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (smartGoals && smartGoals.length > 0 && formData.smartGoalAssociation === 'none') {
      toast({
        title: "Atenção",
        description: "Recomendamos associar esta tarefa a uma Meta SMART para melhor direcionamento estratégico.",
      });
    }

    setLoading(true);
    try {
      await projectService.createTask({
        ...formData,
        projectId: project.id,
        smartGoalAssociation: formData.smartGoalAssociation === 'none' ? undefined : formData.smartGoalAssociation
      });
      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso!",
      });
      onTaskCreated();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar tarefa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getSmartGoalTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'specific': 'Específica (Specific)',
      'measurable': 'Mensurável (Measurable)', 
      'achievable': 'Atingível (Achievable)',
      'relevant': 'Relevante (Relevant)',
      'timeBound': 'Temporal (Time-bound)'
    };
    return labels[type] || type;
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Tarefa</h1>
          <p className="text-gray-600">Adicionar tarefa ao projeto "{project.name}"</p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Detalhes da Tarefa</CardTitle>
          <CardDescription>
            Preencha as informações detalhadas da nova tarefa. Associe-a a uma Meta SMART para direcionamento estratégico.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Tarefa *</Label>
              <Input
                id="title"
                placeholder="Ex: Criar 10 designs flash para evento"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição Detalhada</Label>
              <Textarea
                id="description"
                placeholder="Descreva os detalhes da tarefa, objetivos específicos, materiais necessários, etc..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            {smartGoals && smartGoals.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-600" />
                  Associação à Meta SMART *
                </Label>
                <Select
                  value={formData.smartGoalAssociation}
                  onValueChange={(value) => handleInputChange('smartGoalAssociation', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione qual meta esta tarefa ajuda a atingir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma associação</SelectItem>
                    <SelectItem value="specific">Específica (Specific)</SelectItem>
                    <SelectItem value="measurable">Mensurável (Measurable)</SelectItem>
                    <SelectItem value="achievable">Atingível (Achievable)</SelectItem>
                    <SelectItem value="relevant">Relevante (Relevant)</SelectItem>
                    <SelectItem value="timeBound">Temporal (Time-bound)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Escolha qual critério SMART esta tarefa contribui mais diretamente para alcançar.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Etapa Inicial</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
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
                <Label>Prioridade *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <span className={getPriorityColor('low')}>Baixa</span>
                    </SelectItem>
                    <SelectItem value="medium">
                      <span className={getPriorityColor('medium')}>Média</span>
                    </SelectItem>
                    <SelectItem value="high">
                      <span className={getPriorityColor('high')}>Alta</span>
                    </SelectItem>
                    <SelectItem value="critical">
                      <span className={getPriorityColor('critical')}>Crítica</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Responsável *</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(value) => handleInputChange('assignedTo', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockResponsaveis.map((responsavel) => (
                      <SelectItem key={responsavel} value={responsavel}>
                        {responsavel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Data de Vencimento *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Tempo Estimado (horas) *</Label>
              <Input
                id="estimatedHours"
                type="number"
                min="0.5"
                step="0.5"
                placeholder="Ex: 8"
                value={formData.estimatedHours}
                onChange={(e) => handleInputChange('estimatedHours', parseFloat(e.target.value) || 0)}
                required
              />
              <p className="text-xs text-gray-500">
                Tempo médio estimado para completar esta tarefa (em horas).
              </p>
            </div>

            <div className="flex gap-3 pt-6">
              <Button type="submit" disabled={loading} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Criando...' : 'Criar Tarefa'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTaskForm;
