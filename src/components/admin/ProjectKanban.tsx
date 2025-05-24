
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Settings, Filter } from "lucide-react";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getProjectService } from "@/services/serviceFactory";
import { IProject, IProjectTask, IKanbanStage } from "@/services/interfaces/IProjectService";
import ProjectKanbanColumn from "@/components/admin/ProjectKanbanColumn";
import CreateTaskForm from "@/components/admin/CreateTaskForm";
import ProjectKanbanSettings from "@/components/admin/ProjectKanbanSettings";

interface ProjectKanbanProps {
  project: IProject;
  onBack: () => void;
}

const ProjectKanban = ({ project, onBack }: ProjectKanbanProps) => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const projectService = getProjectService();

  const { data: tasks = [], loading: tasksLoading, refresh: refreshTasks } = useDataQuery<IProjectTask[]>(
    () => projectService.fetchProjectTasks(project.id),
    [project.id]
  );

  const { data: stages = [], loading: stagesLoading, refresh: refreshStages } = useDataQuery<IKanbanStage[]>(
    () => projectService.fetchKanbanStages(project.id),
    [project.id]
  );

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
    ? tasks 
    : tasks.filter(task => task.priority === filter);

  if (showCreateTask) {
    return (
      <CreateTaskForm
        project={project}
        stages={stages}
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
              <span className="text-gray-600">{tasks.length} tarefas</span>
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
          variant={filter === 'urgent' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('urgent')}
        >
          Urgente
        </Button>
      </div>

      {stagesLoading || tasksLoading ? (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((i) => (
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
      ) : stages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Configure as etapas do projeto
            </h3>
            <p className="text-gray-500 text-center mb-6">
              Defina as etapas do seu Kanban para começar a organizar as tarefas.
            </p>
            <Button onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Configurar Etapas
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {stages.map((stage) => (
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
    </div>
  );
};

export default ProjectKanban;
