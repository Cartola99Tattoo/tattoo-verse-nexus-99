
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Settings, Filter, LayoutDashboard, Kanban, Target } from "lucide-react";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getProjectService } from "@/services/serviceFactory";
import { IProject, IProjectTask, IKanbanStage, IProjectSmartGoal } from "@/services/interfaces/IProjectService";
import ProjectKanbanColumn from "@/components/admin/ProjectKanbanColumn";
import CreateTaskForm from "@/components/admin/CreateTaskForm";
import ProjectKanbanSettings from "@/components/admin/ProjectKanbanSettings";
import EnhancedSmartGoalsDashboard from "@/components/admin/EnhancedSmartGoalsDashboard";
import IntegratedProjectOverview from "@/components/admin/IntegratedProjectOverview";

interface ProjectKanbanProps {
  project: IProject;
  onBack: () => void;
}

const ProjectKanban = ({ project, onBack }: ProjectKanbanProps) => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('kanban');
  const projectService = getProjectService();

  const { data: tasks, loading: tasksLoading, refresh: refreshTasks } = useDataQuery<IProjectTask[]>(
    () => projectService.fetchProjectTasks(project.id),
    [project.id]
  );

  const { data: stages, loading: stagesLoading, refresh: refreshStages } = useDataQuery<IKanbanStage[]>(
    () => projectService.fetchKanbanStages(project.id),
    [project.id]
  );

  const { data: smartGoals, refresh: refreshSmartGoals } = useDataQuery<IProjectSmartGoal[]>(
    () => projectService.fetchProjectSmartGoals(project.id),
    [project.id]
  );

  // Ensure safe access to tasks and smartGoals arrays
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeSmartGoals = Array.isArray(smartGoals) ? smartGoals : [];
  const safeStages = Array.isArray(stages) ? stages : [];

  // Etapas padrão do sistema - ordem exata solicitada
  const getDefaultStages = (): IKanbanStage[] => [
    { 
      id: 'ideas', 
      projectId: project.id,
      name: 'Quadro de Ideias', 
      order: 1,
      color: '#8B5CF6',
      createdAt: new Date().toISOString()
    },
    { 
      id: 'todo', 
      projectId: project.id,
      name: 'A Fazer', 
      order: 2,
      color: '#dc2626',
      createdAt: new Date().toISOString()
    },
    { 
      id: 'in_progress', 
      projectId: project.id,
      name: 'Em Andamento', 
      order: 3,
      color: '#ea384c',
      createdAt: new Date().toISOString()
    },
    { 
      id: 'review', 
      projectId: project.id,
      name: 'Revisão', 
      order: 4,
      color: '#f97316',
      createdAt: new Date().toISOString()
    },
    { 
      id: 'completed', 
      projectId: project.id,
      name: 'Concluído', 
      order: 5,
      color: '#10b981',
      createdAt: new Date().toISOString()
    }
  ];

  const currentStages = safeStages.length > 0 ? safeStages.sort((a, b) => a.order - b.order) : getDefaultStages();

  const handleTaskCreated = () => {
    setShowCreateTask(false);
    refreshTasks();
  };

  const handleTaskUpdate = async (taskId: string, newStatus: string) => {
    try {
      await projectService.updateTask(taskId, { status: newStatus });
      refreshTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
    refreshStages();
  };

  const handleSmartGoalUpdate = async (goalId: string, updates: Partial<IProjectSmartGoal>) => {
    try {
      await projectService.updateSmartGoal(goalId, updates);
      refreshSmartGoals();
    } catch (error) {
      console.error('Error updating smart goal:', error);
    }
  };

  const handleAddSmartGoal = () => {
    setActiveTab('overview');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'active': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'Planejamento';
      case 'active': return 'Ativo';
      case 'completed': return 'Concluído';
      case 'on_hold': return 'Em Espera';
      default: return status;
    }
  };

  const filteredTasks = filter === 'all' 
    ? safeTasks 
    : safeTasks.filter(task => task.priority === filter);

  if (showCreateTask) {
    return (
      <CreateTaskForm
        project={project}
        stages={currentStages || []}
        onTaskCreated={handleTaskCreated}
        onCancel={() => setShowCreateTask(false)}
      />
    );
  }

  if (showSettings) {
    return (
      <ProjectKanbanSettings
        project={project}
        onClose={handleSettingsClose}
      />
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-red-50 to-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              {project.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(project.status)}>
                {getStatusLabel(project.status)}
              </Badge>
              <span className="text-gray-600">{safeTasks.length} tarefas</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSettings(true)} className="border-gray-300 hover:bg-gray-50 transition-all duration-300">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {project.description && (
        <Card className="mb-6 border-l-4 border-l-red-600 shadow-lg bg-gradient-to-r from-red-50 to-white">
          <CardContent className="pt-6">
            <p className="text-gray-700">{project.description}</p>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 shadow-sm">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-300">
            <Target className="h-4 w-4" />
            Visão Geral Unificada
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-300">
            <Kanban className="h-4 w-4" />
            Quadro de Tarefas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <IntegratedProjectOverview
            project={project}
            goals={safeSmartGoals}
            tasks={safeTasks}
            onUpdateGoal={handleSmartGoalUpdate}
            onAddGoal={handleAddSmartGoal}
            onRefreshGoals={refreshSmartGoals}
          />
        </TabsContent>

        <TabsContent value="kanban" className="mt-6">
          {/* Botão para Adicionar Nova Tarefa - Posicionado estrategicamente */}
          <div className="mb-6 flex justify-center">
            <Button 
              onClick={() => setShowCreateTask(true)} 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg font-semibold"
            >
              <Plus className="h-5 w-5 mr-3" />
              Adicionar Nova Tarefa
            </Button>
          </div>

          {/* Filtros */}
          <div className="flex gap-4 mb-6 justify-center">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-red-600 hover:bg-red-700 shadow-lg' : 'border-red-300 text-red-600 hover:bg-red-50'}
            >
              Todas
            </Button>
            <Button
              variant={filter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('high')}
              className={filter === 'high' ? 'bg-red-600 hover:bg-red-700 shadow-lg' : 'border-red-300 text-red-600 hover:bg-red-50'}
            >
              Alta Prioridade
            </Button>
            <Button
              variant={filter === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('critical')}
              className={filter === 'critical' ? 'bg-red-600 hover:bg-red-700 shadow-lg' : 'border-red-300 text-red-600 hover:bg-red-50'}
            >
              Crítica
            </Button>
          </div>

          {stagesLoading || tasksLoading ? (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="flex-shrink-0 w-80 animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2].map((j) => (
                        <div key={j} className="h-20 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-red-50 via-white to-red-50 p-8 rounded-2xl shadow-2xl border border-red-100 overflow-hidden">
              <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px]">
                {currentStages.map((stage) => (
                  <div key={stage.id} className="flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <ProjectKanbanColumn
                      title={stage.name}
                      status={stage.id}
                      tasks={filteredTasks.filter(task => task.status === stage.id)}
                      onTaskUpdate={handleTaskUpdate}
                      onTaskRefresh={refreshTasks}
                      count={filteredTasks.filter(task => task.status === stage.id).length}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectKanban;
