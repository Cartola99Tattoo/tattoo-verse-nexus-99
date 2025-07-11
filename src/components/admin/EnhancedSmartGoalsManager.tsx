
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Target, CheckCircle } from "lucide-react";
import { IProjectSmartGoal } from "@/services/interfaces/IProjectService";
import { toast } from "@/hooks/use-toast";

interface EnhancedSmartGoalsManagerProps {
  projectId: string;
  goals: IProjectSmartGoal[];
  onAddGoal: (goal: Omit<IProjectSmartGoal, 'id' | 'createdAt'>) => void;
  onUpdateGoal: (id: string, goal: Partial<IProjectSmartGoal>) => void;
}

const EnhancedSmartGoalsManager = ({ 
  projectId, 
  goals = [], 
  onAddGoal, 
  onUpdateGoal 
}: EnhancedSmartGoalsManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<IProjectSmartGoal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
    deadline: '',
    responsible: '',
    progress: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "Título da meta é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const goalData = {
      ...formData,
      projectId
    };

    if (editingGoal) {
      onUpdateGoal(editingGoal.id, goalData);
      toast({
        title: "Sucesso",
        description: "Meta SMART atualizada com sucesso!",
      });
    } else {
      onAddGoal(goalData);
      toast({
        title: "Sucesso", 
        description: "Meta SMART criada com sucesso!",
      });
    }

    handleCloseForm();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGoal(null);
    setFormData({
      title: '',
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: '',
      deadline: '',
      responsible: '',
      progress: 0
    });
  };

  const handleEditGoal = (goal: IProjectSmartGoal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      specific: goal.specific,
      measurable: goal.measurable,
      achievable: goal.achievable,
      relevant: goal.relevant,
      timeBound: goal.timeBound,
      deadline: goal.deadline || '',
      responsible: goal.responsible || '',
      progress: goal.progress
    });
    setShowForm(true);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-red-200 bg-red-50/50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="h-6 w-6 text-red-600" />
            <CardTitle className="text-2xl text-red-800">Metas SMART - Centro Estratégico</CardTitle>
          </div>
          <CardDescription className="text-red-700">
            Defina e acompanhe as metas estratégicas que orientarão todas as tarefas deste projeto.
            Cada tarefa deve estar associada a uma dessas metas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Meta SMART
            </Button>
          </div>
        </CardContent>
      </Card>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma Meta SMART definida
            </h3>
            <p className="text-gray-500 text-center mb-6">
              Comece definindo as metas estratégicas que orientarão este projeto.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Meta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress 
                        value={goal.progress} 
                        className="flex-1 h-2"
                      />
                      <span className="text-sm font-medium">{goal.progress}%</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditGoal(goal)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-xs font-semibold text-red-600">ESPECÍFICA</Label>
                    <p className="text-sm text-gray-700">{goal.specific}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-blue-600">MENSURÁVEL</Label>
                    <p className="text-sm text-gray-700">{goal.measurable}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-green-600">ATINGÍVEL</Label>
                    <p className="text-sm text-gray-700">{goal.achievable}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-purple-600">RELEVANTE</Label>
                    <p className="text-sm text-gray-700">{goal.relevant}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-orange-600">TEMPORAL</Label>
                    <p className="text-sm text-gray-700">{goal.timeBound}</p>
                  </div>
                </div>
                
                {(goal.deadline || goal.responsible) && (
                  <div className="flex gap-2 flex-wrap">
                    {goal.deadline && (
                      <Badge variant="outline">
                        Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                      </Badge>
                    )}
                    {goal.responsible && (
                      <Badge variant="outline">
                        Responsável: {goal.responsible}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? 'Editar Meta SMART' : 'Nova Meta SMART'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Meta *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Aumentar participação no Flash Day em 50%"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="specific" className="text-red-600 font-semibold">
                  ESPECÍFICA (Specific) *
                </Label>
                <Textarea
                  id="specific"
                  value={formData.specific}
                  onChange={(e) => setFormData({...formData, specific: e.target.value})}
                  placeholder="O que exatamente será alcançado? Seja claro e preciso."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="measurable" className="text-blue-600 font-semibold">
                  MENSURÁVEL (Measurable) *
                </Label>
                <Textarea
                  id="measurable"
                  value={formData.measurable}
                  onChange={(e) => setFormData({...formData, measurable: e.target.value})}
                  placeholder="Como será medido o progresso? Quais métricas serão usadas?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievable" className="text-green-600 font-semibold">
                  ATINGÍVEL (Achievable) *
                </Label>
                <Textarea
                  id="achievable"
                  value={formData.achievable}
                  onChange={(e) => setFormData({...formData, achievable: e.target.value})}
                  placeholder="É realista? Que recursos e estratégias serão necessários?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relevant" className="text-purple-600 font-semibold">
                  RELEVANTE (Relevant) *
                </Label>
                <Textarea
                  id="relevant"
                  value={formData.relevant}
                  onChange={(e) => setFormData({...formData, relevant: e.target.value})}
                  placeholder="Por que esta meta é importante para o negócio?"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeBound" className="text-orange-600 font-semibold">
                TEMPORAL (Time-bound) *
              </Label>
              <Textarea
                id="timeBound"
                value={formData.timeBound}
                onChange={(e) => setFormData({...formData, timeBound: e.target.value})}
                placeholder="Qual é o prazo? Quando será concluída?"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Data Limite</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
              </div>

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
                <Label htmlFor="progress">Progresso (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button type="submit" className="flex-1">
                {editingGoal ? 'Atualizar Meta' : 'Criar Meta'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedSmartGoalsManager;
