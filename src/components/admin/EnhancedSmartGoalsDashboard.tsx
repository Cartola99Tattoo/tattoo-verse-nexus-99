import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProject, IProjectTask, IEnhancedSmartGoal } from "@/services/interfaces/IProjectService";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle, ListChecks, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnhancedSmartGoalsDashboardProps {
  project: IProject;
  goals: IEnhancedSmartGoal[];
  tasks: IProjectTask[];
  onUpdateGoal: (goalId: string, updates: Partial<IEnhancedSmartGoal>) => void;
  onRefreshGoals: () => void;
}

const EnhancedSmartGoalsDashboard = ({ project, goals, tasks, onUpdateGoal, onRefreshGoals }: EnhancedSmartGoalsDashboardProps) => {
  const getTasksForGoal = (goalId: string) => {
    return tasks.filter(task => 
      task.smartGoalAssociation?.some(assoc => assoc.goalId === goalId)
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <Card key={goal.id} className="bg-white shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{goal.title}</CardTitle>
            <Edit className="h-4 w-4 text-gray-500 cursor-pointer" onClick={() => console.log('Editar meta', goal.id)} />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500 mb-2">
              <span className="font-semibold">Prazo:</span> {new Date(goal.deadline).toLocaleDateString()}
            </div>
            <Progress value={goal.progress} max={100} className="h-2 mb-3" />
            <div className="flex items-center justify-between text-xs text-gray-700 mb-4">
              <span>Progresso: {goal.progress}%</span>
              <span>{goal.currentMetric}/{goal.targetMetric}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs">Específico:</span>
                <Badge variant="secondary" className="text-xs">{goal.specific}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-blue-500" />
                <span className="text-xs">Mensurável:</span>
                <Badge variant="secondary" className="text-xs">{goal.measurable}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-yellow-500" />
                <span className="text-xs">Alcançável:</span>
                <Badge variant="secondary" className="text-xs">{goal.achievable}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-xs">Relevante:</span>
                <Badge variant="secondary" className="text-xs">{goal.relevant}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span className="text-xs">Temporal:</span>
                <Badge variant="secondary" className="text-xs">{goal.timeBound}</Badge>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Tarefas relacionadas ({getTasksForGoal(goal.id).length}):
              </h4>
              {getTasksForGoal(goal.id).length > 0 ? (
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {getTasksForGoal(goal.id).map((task) => (
                    <li key={task.id}>{task.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">Nenhuma tarefa associada a esta meta.</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedSmartGoalsDashboard;
