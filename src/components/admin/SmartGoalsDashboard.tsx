import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar, Users, BarChart3, CheckCircle2 } from "lucide-react";
import { IProjectSmartGoal, IProjectTask } from "@/services/interfaces/IProjectService";

interface SmartGoalsDashboardProps {
  project: any;
  goals: IProjectSmartGoal[];
  tasks: IProjectTask[];
  onUpdateGoal: any;
  onRefreshGoals: any;
}

const SmartGoalsDashboard = ({ project, goals, tasks, onUpdateGoal, onRefreshGoals }: SmartGoalsDashboardProps) => {
  const getGoalTypeColor = (goalId: string) => {
    const colors = {
      'specific': 'bg-red-100 text-red-800 border-red-200',
      'measurable': 'bg-blue-100 text-blue-800 border-blue-200',
      'achievable': 'bg-green-100 text-green-800 border-green-200',
      'relevant': 'bg-purple-100 text-purple-800 border-purple-200',
      'timeBound': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors['specific'] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getGoalTypeLabel = (goalId: string) => {
    return 'Meta SMART';
  };

  const getTasksForGoal = (goalId: string) => {
    return tasks.filter(task => 
      task.smartGoalAssociation?.some(assoc => assoc.goalId === goalId)
    );
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
    
    if (diffDays < 0) return `${Math.abs(diffDays)} dias atrasado`;
    if (diffDays === 0) return 'Vence hoje';
    if (diffDays === 1) return 'Vence amanhã';
    return `${diffDays} dias restantes`;
  };

  if (goals.length === 0) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-amber-700">
            <Target className="h-5 w-5" />
            <p className="font-medium">
              Defina as Metas SMART para orientar estrategicamente o desenvolvimento deste projeto.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-6 w-6 text-red-600" />
        <h3 className="text-xl font-bold text-gray-900">Metas SMART - Direcionamento Estratégico</h3>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const goalTasks = getTasksForGoal(goal.id);
          const progress = getGoalProgress(goal.id);
          const completedTasks = goalTasks.filter(task => task.status === 'completed').length;
          
          return (
            <Card key={goal.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-600 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge className={`${getGoalTypeColor(goal.id)} font-medium`}>
                    {getGoalTypeLabel(goal.id)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{progress}%</span>
                  </div>
                </div>
                <CardTitle className="text-base leading-tight">{goal.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {goal.specific && (
                  <p className="text-sm text-gray-600 line-clamp-2">{goal.specific}</p>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium">{completedTasks}/{goalTasks.length} tarefas</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3 text-blue-600" />
                    <span className="text-gray-600">Tarefas: {goalTasks.length}</span>
                  </div>
                  
                  {goal.deadline && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-orange-600" />
                      <span className="text-gray-600">{formatDeadline(goal.deadline)}</span>
                    </div>
                  )}
                </div>

                {goal.measurable && (
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <div className="flex items-center gap-1 text-xs">
                      <Target className="h-3 w-3 text-blue-600" />
                      <span className="font-medium text-blue-800">Meta: {goal.measurable}</span>
                    </div>
                    {goal.achievable && (
                      <div className="text-xs text-blue-700 mt-1">
                        Atingível: {goal.achievable}
                      </div>
                    )}
                  </div>
                )}

                {goalTasks.length === 0 && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                    Nenhuma tarefa associada a esta meta
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SmartGoalsDashboard;
