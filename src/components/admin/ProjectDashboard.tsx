
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Users,
  Target
} from "lucide-react";
import { IProject, IProjectTask } from "@/services/interfaces/IProjectService";

interface ProjectDashboardProps {
  project: IProject;
  tasks: IProjectTask[];
}

const ProjectDashboard = ({ project, tasks }: ProjectDashboardProps) => {
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  
  // Calcular dias restantes
  const endDate = project.endDate ? new Date(project.endDate) : null;
  const today = new Date();
  const daysRemaining = endDate ? Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
  
  // Mock de dados de orçamento
  const totalBudget = 5000;
  const usedBudget = 1800;
  const budgetPercentage = (usedBudget / totalBudget) * 100;
  
  // Status do projeto baseado em progresso e prazo
  const getProjectStatus = () => {
    if (daysRemaining !== null && daysRemaining < 0) return { status: 'Atrasado', color: 'bg-red-100 text-red-800' };
    if (progressPercentage >= 90) return { status: 'Quase Concluído', color: 'bg-green-100 text-green-800' };
    if (progressPercentage >= 50) return { status: 'No Prazo', color: 'bg-blue-100 text-blue-800' };
    return { status: 'Em Andamento', color: 'bg-yellow-100 text-yellow-800' };
  };

  const projectStatus = getProjectStatus();

  const urgentTasks = tasks.filter(task => task.priority === 'urgent' && task.status !== 'completed').length;
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < today;
  }).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
            <Progress value={progressPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedTasks} de {tasks.length} tarefas concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prazo</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daysRemaining !== null ? 
                (daysRemaining >= 0 ? `${daysRemaining}d` : `${Math.abs(daysRemaining)}d atraso`) 
                : 'N/A'
              }
            </div>
            <Badge className={projectStatus.color}>
              {projectStatus.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(budgetPercentage)}%</div>
            <Progress value={budgetPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              R$ {usedBudget} de R$ {totalBudget}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentTasks + overdueTasks}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <div>{urgentTasks} urgentes</div>
              <div>{overdueTasks} atrasadas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Gráfico de Progresso
            </CardTitle>
            <CardDescription>Evolução das tarefas ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center text-gray-500">
              Gráfico de burn-down será implementado aqui
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Riscos Identificados
            </CardTitle>
            <CardDescription>Riscos que requerem atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Atraso na entrega de materiais</span>
                <Badge variant="destructive">Alto</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Disponibilidade de tatuadores</span>
                <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo do Projeto</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Informações Gerais</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Data de Início:</span>
                  <span>{project.startDate ? new Date(project.startDate).toLocaleDateString('pt-BR') : 'Não definida'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data de Fim:</span>
                  <span>{project.endDate ? new Date(project.endDate).toLocaleDateString('pt-BR') : 'Não definida'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge className={projectStatus.color}>
                    {projectStatus.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Estatísticas de Tarefas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>{tasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Concluídas:</span>
                  <span>{completedTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pendentes:</span>
                  <span>{tasks.length - completedTasks}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Recursos</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Orçamento Total:</span>
                  <span>R$ {totalBudget}</span>
                </div>
                <div className="flex justify-between">
                  <span>Utilizado:</span>
                  <span>R$ {usedBudget}</span>
                </div>
                <div className="flex justify-between">
                  <span>Disponível:</span>
                  <span>R$ {totalBudget - usedBudget}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDashboard;
