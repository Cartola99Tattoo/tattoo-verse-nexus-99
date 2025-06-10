
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
import ProjectPlanningTabs from "@/components/admin/ProjectPlanningTabs";
import SmartGoalsDashboard from "@/components/admin/SmartGoalsDashboard";
import EnhancedSmartGoalsManager from "@/components/admin/EnhancedSmartGoalsManager";

interface ProjectKanbanProps {
  project: IProject;
  onBack: () => void;
}

const ProjectKanban = ({ project, onBack }: ProjectKanbanProps) => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('overview');
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

  // Ensure default stages exist
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
      color: '#3B82F6',
      createdAt: new Date().toISOString()
    },
    { 
      id: 'in_progress', 
      projectId: project.id,
      name: 'Em Andamento', 
      order: 3,
      color: '#F59E0B',
      createdAt: new Date().toISOString()
    },
    { 
      id: 'review', 
      projectId: project.id,
      name: 'Revisão', 
      order: 4,
      color: '#F97316',
      createdAt: new Date().toISOString()
    },
    { 
      id: 'completed', 
      projectId: project.id,
      name: 'Concluído', 
      order: 5,
      color: '#10B981',
      createdAt: new Date().toISOString()
    }
  ];

  const currentStages = safeStages.length > 0 ? safeStages : getDefaultStages();

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-purple-100 text-purple-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(project.status)}>
                {getStatusLabel(project.status)}
              </Badge>
              <span className="text-gray-600">{safeTasks.length} tarefas</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
          <Button onClick={() => setShowCreateTask(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {project.description && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-gray-700">{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Painel de Metas SMART Integrado */}
      <div className="mb-6">
        <SmartGoalsDashboard goals={safeSmartGoals} tasks={safeTasks} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="planning" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Planejamento Estratégico
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <Kanban className="h-4 w-4" />
            Quadro de Tarefas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-600" />
                  Gerenciar Metas SMART
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedSmartGoalsManager
                  projectId={project.id}
                  goals={safeSmartGoals}
                  onAddGoal={async (goal) => {
                    await projectService.createSmartGoal(goal);
                    refreshSmartGoals();
                  }}
                  onUpdateGoal={async (id, goal) => {
                    await projectService.updateSmartGoal(id, goal);
                    refreshSmartGoals();
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="planning" className="mt-6">
          <ProjectPlanningTabs project={project} tasks={safeTasks} />
        </TabsContent>

        <TabsContent value="kanban" className="mt-6">
          <div className="flex gap-4 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas
            </Button>
            <Button
              variant={filter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('high')}
            >
              Alta Prioridade
            </Button>
            <Button
              variant={filter === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('critical')}
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
            <div className="flex gap-6 overflow-x-auto pb-4 bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg">
              {currentStages.map((stage) => (
                <ProjectKanbanColumn
                  key={stage.id}
                  stage={stage}
                  tasks={filteredTasks.filter(task => task.status === stage.id)}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskRefresh={refreshTasks}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectKanban;
