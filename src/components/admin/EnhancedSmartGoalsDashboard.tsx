
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Target, Edit, Calendar, User, TrendingUp, Clock, CheckCircle2, Plus } from "lucide-react";
import { IProjectSmartGoal, IProjectTask } from "@/services/interfaces/IProjectService";
import { mockTeamMembers, getTeamMemberById } from "@/data/mockTeamMembers";
import { toast } from "@/hooks/use-toast";

interface EnhancedSmartGoalsDashboardProps {
  goals: IProjectSmartGoal[];
  tasks: IProjectTask[];
  onUpdateGoal: (id: string, goal: Partial<IProjectSmartGoal>) => void;
  onAddGoal: () => void;
}

const EnhancedSmartGoalsDashboard = ({ goals, tasks, onUpdateGoal, onAddGoal }: EnhancedSmartGoalsDashboardProps) => {
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<IProjectSmartGoal>>({});

  const getTasksForGoal = (goalId: string) => {
    return tasks.filter(task => task.smartGoalAssociation && task.smartGoalAssociation.includes(goalId));
  };

  const getGoalProgress = (goalId: string) => {
    const goalTasks = getTasksForGoal(goalId);
    if (goalTasks.length === 0) return 0;
    const completedTasks = goalTasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / goalTasks.length) * 100);
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)} dias atrasado`, color: 'text-red-600', urgent: true };
    if (diffDays === 0) return { text: 'Vence hoje', color: 'text-orange-600', urgent: true };
    if (diffDays <= 7) return { text: `${diffDays} dias restantes`, color: 'text-yellow-600', urgent: true };
    return { text: `${diffDays} dias restantes`, color: 'text-green-600', urgent: false };
  };

  const getResponsibleMember = (responsibleId: string) => {
    return getTeamMemberById(responsibleId);
  };

  const handleEdit = (goal: IProjectSmartGoal) => {
    setEditingGoal(goal.id);
    setEditValues(goal);
  };

  const handleSave = (goalId: string) => {
    onUpdateGoal(goalId, editValues);
    setEditingGoal(null);
    setEditValues({});
    toast({
      title: "Meta atualizada",
      description: "As informações da meta foram salvas com sucesso.",
    });
  };

  const handleCancel = () => {
    setEditingGoal(null);
    setEditValues({});
  };

  const handleProgressUpdate = (goalId: string, newProgress: number) => {
    onUpdateGoal(goalId, { progress: newProgress });
    toast({
      title: "Progresso atualizado",
      description: `Progresso definido para ${newProgress}%`,
    });
  };

  if (goals.length === 0) {
    return (
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white shadow-tattoo">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Target className="h-16 w-16 text-red-600 mx-auto animate-pulse" />
            <h3 className="text-xl font-bold text-gray-900 font-heading">
              Configure as Metas SMART do Projeto
            </h3>
            <p className="text-gray-600 max-w-md">
              As Metas SMART são fundamentais para o sucesso do projeto. Elas orientam estrategicamente 
              todas as ações e garantem resultados mensuráveis.
            </p>
            <Button onClick={onAddGoal} className="bg-red-600 hover:bg-red-700 text-white shadow-red-glow transform hover:scale-105 transition-all">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Meta SMART
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallProgress = goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length;
  const urgentGoals = goals.filter(goal => 
    goal.deadline && formatDeadline(goal.deadline).urgent
  ).length;

  return (
    <div className="space-y-6">
      {/* Resumo Executivo */}
      <Card className="border-l-4 border-l-red-600 bg-gradient-to-r from-red-50 via-white to-red-50 shadow-tattoo">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800 font-heading">
            <Target className="h-6 w-6" />
            Dashboard de Metas SMART - Direcionamento Estratégico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-card border border-red-100 hover:shadow-red-glow transition-all">
              <div className="text-3xl font-bold text-red-600 font-heading">{goals.length}</div>
              <div className="text-sm text-gray-600">Metas Definidas</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-card border border-blue-100 hover:shadow-blue-glow transition-all">
              <div className="text-3xl font-bold text-blue-600 font-heading">{overallProgress.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Progresso Geral</div>
              <Progress value={overallProgress} className="h-2 mt-2" />
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-card border border-green-100 hover:shadow-green-glow transition-all">
              <div className="text-3xl font-bold text-green-600 font-heading">
                {goals.filter(g => g.progress >= 100).length}
              </div>
              <div className="text-sm text-gray-600">Metas Concluídas</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-card border border-orange-100 hover:shadow-card-hover transition-all">
              <div className="text-3xl font-bold text-orange-600 font-heading">{urgentGoals}</div>
              <div className="text-sm text-gray-600">Prazos Urgentes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metas Individuais */}
      <div className="grid gap-6 lg:grid-cols-2">
        {goals.map((goal) => {
          const isEditing = editingGoal === goal.id;
          const goalTasks = getTasksForGoal(goal.id);
          const calculatedProgress = getGoalProgress(goal.id);
          const responsible = goal.responsible ? getResponsibleMember(goal.responsible) : null;
          const deadline = goal.deadline ? formatDeadline(goal.deadline) : null;
          
          return (
            <Card key={goal.id} className="hover:shadow-tattoo-lg transition-all duration-300 border-l-4 border-l-red-600 bg-gradient-to-br from-white to-red-50 transform hover:scale-102">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-red-50 border-b border-red-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={editValues.title || ''}
                        onChange={(e) => setEditValues({...editValues, title: e.target.value})}
                        className="font-bold text-lg border-red-200 focus:border-red-400"
                        placeholder="Título da Meta"
                      />
                    ) : (
                      <CardTitle className="text-lg font-heading">{goal.title}</CardTitle>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={goal.progress} className="flex-1 h-3" />
                      <span className="text-sm font-bold text-gray-700">{goal.progress}%</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {deadline && (
                      <Badge variant={deadline.urgent ? "destructive" : "outline"} className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {deadline.text}
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => isEditing ? handleSave(goal.id) : handleEdit(goal)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      {isEditing ? <CheckCircle2 className="h-3 w-3" /> : <Edit className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Campos SMART */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-red-600">ESPECÍFICA (Specific)</Label>
                    {isEditing ? (
                      <Input
                        value={editValues.specific || ''}
                        onChange={(e) => setEditValues({...editValues, specific: e.target.value})}
                        placeholder="Descreva especificamente o que será alcançado..."
                        className="border-red-200 focus:border-red-400"
                      />
                    ) : (
                      <p className="text-sm text-gray-700 bg-red-50 p-3 rounded border border-red-200">
                        {goal.specific}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-blue-600">MENSURÁVEL (Measurable)</Label>
                    {isEditing ? (
                      <Input
                        value={editValues.measurable || ''}
                        onChange={(e) => setEditValues({...editValues, measurable: e.target.value})}
                        placeholder="Como será medido o sucesso..."
                        className="border-blue-200 focus:border-blue-400"
                      />
                    ) : (
                      <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded border border-blue-200">
                        {goal.measurable}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-green-600">ATINGÍVEL</Label>
                      {isEditing ? (
                        <Input
                          value={editValues.achievable || ''}
                          onChange={(e) => setEditValues({...editValues, achievable: e.target.value})}
                          placeholder="Como é atingível..."
                          className="border-green-200 focus:border-green-400"
                        />
                      ) : (
                        <p className="text-sm text-gray-700 bg-green-50 p-3 rounded border border-green-200">
                          {goal.achievable}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-purple-600">RELEVANTE</Label>
                      {isEditing ? (
                        <Input
                          value={editValues.relevant || ''}
                          onChange={(e) => setEditValues({...editValues, relevant: e.target.value})}
                          placeholder="Por que é relevante..."
                          className="border-purple-200 focus:border-purple-400"
                        />
                      ) : (
                        <p className="text-sm text-gray-700 bg-purple-50 p-3 rounded border border-purple-200">
                          {goal.relevant}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-orange-600">TEMPORAL (Time-bound)</Label>
                    {isEditing ? (
                      <Input
                        value={editValues.timeBound || ''}
                        onChange={(e) => setEditValues({...editValues, timeBound: e.target.value})}
                        placeholder="Qual o prazo e cronograma..."
                        className="border-orange-200 focus:border-orange-400"
                      />
                    ) : (
                      <p className="text-sm text-gray-700 bg-orange-50 p-3 rounded border border-orange-200">
                        {goal.timeBound}
                      </p>
                    )}
                  </div>
                </div>

                {/* Informações de Gestão */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-600">Data Limite</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editValues.deadline || ''}
                        onChange={(e) => setEditValues({...editValues, deadline: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {goal.deadline ? new Date(goal.deadline).toLocaleDateString('pt-BR') : 'Não definida'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-600">Responsável</Label>
                    {isEditing ? (
                      <Select
                        value={editValues.responsible || ''}
                        onValueChange={(value) => setEditValues({...editValues, responsible: value})}
                      >
                        <SelectTrigger>
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
                    ) : (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-red-100 text-red-600">
                            {responsible ? responsible.name.split(' ').map(n => n[0]).join('') : '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            {responsible ? responsible.name : 'Não atribuído'}
                          </div>
                          {responsible && (
                            <div className="text-xs text-gray-500">{responsible.role}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controle de Progresso */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-gray-600">Progresso Manual (%)</Label>
                    <span className="text-sm font-bold">{goal.progress}%</span>
                  </div>
                  <Slider
                    value={[goal.progress]}
                    onValueChange={(value) => handleProgressUpdate(goal.id, value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>Calculado: {calculatedProgress}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{goalTasks.length} tarefas</span>
                    </div>
                  </div>
                </div>

                {/* Ações de Edição */}
                {isEditing && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button onClick={() => handleSave(goal.id)} className="flex-1 bg-red-600 hover:bg-red-700">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Botão para Adicionar Nova Meta */}
      <Card className="border-2 border-dashed border-red-300 hover:border-red-400 transition-colors bg-gradient-to-r from-red-50 to-white">
        <CardContent className="flex items-center justify-center py-8">
          <Button onClick={onAddGoal} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 shadow-red-glow">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Nova Meta SMART
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSmartGoalsDashboard;
