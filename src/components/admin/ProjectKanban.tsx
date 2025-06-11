import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Settings, Filter, LayoutDashboard, Kanban, Target, RefreshCw } from "lucide-react";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getProjectService } from "@/services/serviceFactory";
import { IProject, IProjectTask, IKanbanStage, IProjectSmartGoal } from "@/services/interfaces/IProjectService";
import ProjectKanbanColumn from "@/components/admin/ProjectKanbanColumn";
import CreateTaskForm from "@/components/admin/CreateTaskForm";
import EditTaskForm from "@/components/admin/EditTaskForm";
import ProjectKanbanSettings from "@/components/admin/ProjectKanbanSettings";
import EnhancedSmartGoalsDashboard from "@/components/admin/EnhancedSmartGoalsDashboard";
import IntegratedProjectOverview from "@/components/admin/IntegratedProjectOverview";

interface ProjectKanbanProps {
  project: IProject;
  onBack: () => void;
}

const ProjectKanban = ({ project, onBack }: ProjectKanbanProps) => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<IProjectTask | null>(null);
  const [initialStage, setInitialStage] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('kanban');
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  // Etapas padrão do sistema - ordem exata solicitada com cores aprimoradas
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

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshTasks(), refreshStages(), refreshSmartGoals()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTaskCreated = () => {
    setShowCreateTask(false);
    setInitialStage('');
    refreshTasks();
  };

  const handleTaskUpdated = () => {
    setShowEditTask(false);
    setSelectedTask(null);
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

  const handleAddTask = (stageId: string) => {
    setInitialStage(stageId);
    setShowCreateTask(true);
  };

  const handleEditTask = (task: IProjectTask) => {
    setSelectedTask(task);
    setShowEditTask(true);
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
      case 'planning': return 'bg-purple-100 text-purple-800 border-purple-300 shadow-purple-500/20';
      case 'active': return 'bg-red-100 text-red-800 border-red-300 shadow-red-500/20';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300 shadow-green-500/20';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-yellow-500/20';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 shadow-gray-500/20';
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

  const getTaskStatistics = () => {
    const total = safeTasks.length;
    const completed = safeTasks.filter(task => task.status === 'completed').length;
    const inProgress = safeTasks.filter(task => task.status === 'in_progress').length;
    const overdue = safeTasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== 'completed';
    }).length;

    return { total, completed, inProgress, overdue };
  };

  const taskStats = getTaskStatistics();

  if (showCreateTask) {
    return (
      <CreateTaskForm
        project={project}
        stages={currentStages || []}
        onTaskCreated={handleTaskCreated}
        onCancel={() => {
          setShowCreateTask(false);
          setInitialStage('');
        }}
        initialStage={initialStage}
      />
    );
  }

  if (showEditTask && selectedTask) {
    return (
      <EditTaskForm
        task={selectedTask}
        project={project}
        stages={currentStages || []}
        onTaskUpdated={handleTaskUpdated}
        onCancel={() => {
          setShowEditTask(false);
          setSelectedTask(null);
        }}
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
    <div className="p-6 bg-gradient-to-br from-gray-50 via-red-50/30 to-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300 shadow-sm hover:shadow-md">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              {project.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge className={`${getStatusColor(project.status)} font-medium px-3 py-1`}>
                {getStatusLabel(project.status)}
              </Badge>
              <span className="text-gray-600 font-medium">{taskStats.total} tarefas</span>
              <span className="text-green-600 font-medium">{taskStats.completed} concluídas</span>
              {taskStats.overdue > 0 && (
                <span className="text-red-600 font-medium">{taskStats.overdue} atrasadas</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(true)} className="border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {project.description && (
        <Card className="mb-6 border-l-4 border-l-red-600 shadow-lg bg-gradient-to-r from-red-50 to-white backdrop-blur-sm">
          <CardContent className="pt-6">
            <p className="text-gray-700 font-medium">{project.description}</p>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 shadow-lg rounded-xl">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-300 rounded-lg">
            <Target className="h-4 w-4" />
            Visão Geral Unificada
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-300 rounded-lg">
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
          {/* Filtros Aprimorados */}
          <div className="flex gap-4 mb-8 justify-center">
            <div className="flex bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {[
                { key: 'all', label: 'Todas', count: taskStats.total },
                { key: 'high', label: 'Alta Prioridade', count: safeTasks.filter(t => t.priority === 'high').length },
                { key: 'critical', label: 'Crítica', count: safeTasks.filter(t => t.priority === 'critical').length }
              ].map((filterOption) => (
                <Button
                  key={filterOption.key}
                  variant={filter === filterOption.key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(filterOption.key)}
                  className={`rounded-none border-r border-gray-200 last:border-r-0 px-6 py-3 transition-all duration-300 ${
                    filter === filterOption.key 
                      ? 'bg-red-600 hover:bg-red-700 shadow-lg text-white' 
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <span className="font-semibold">{filterOption.label}</span>
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 ${
                      filter === filterOption.key 
                        ? 'bg-white/20 text-white' 
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {filterOption.count}
                  </Badge>
                </Button>
              ))}
            </div>
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
            <div className="bg-gradient-to-br from-red-50/30 via-white to-red-50/30 p-8 rounded-3xl shadow-2xl border border-red-100/50 overflow-hidden backdrop-blur-sm relative">
              {/* Elementos decorativos de fundo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-100/20 rounded-full transform translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-100/30 rounded-full transform -translate-x-24 translate-y-24"></div>
              
              <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px] relative z-10">
                {currentStages.map((stage, index) => (
                  <div 
                    key={stage.id} 
                    className="flex-shrink-0 transition-all duration-500 hover:scale-[1.01] hover:z-10"
                    style={{ 
                      animationDelay: `${index * 150}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <ProjectKanbanColumn
                      title={stage.name}
                      status={stage.id}
                      tasks={filteredTasks.filter(task => task.status === stage.id)}
                      onTaskUpdate={handleTaskUpdate}
                      onTaskRefresh={refreshTasks}
                      onAddTask={handleAddTask}
                      onEditTask={handleEditTask}
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
