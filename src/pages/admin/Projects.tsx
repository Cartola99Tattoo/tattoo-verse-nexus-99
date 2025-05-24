
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, Calendar, Users } from "lucide-react";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getProjectService } from "@/services/serviceFactory";
import ProjectKanban from "@/components/admin/ProjectKanban";
import CreateProjectForm from "@/components/admin/CreateProjectForm";
import { IProject } from "@/services/interfaces/IProjectService";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const projectService = getProjectService();

  const { data: projects = [], loading, refresh } = useDataQuery<IProject[]>(
    () => projectService.fetchProjects(),
    []
  );

  const handleProjectCreated = () => {
    setShowCreateForm(false);
    refresh();
  };

  const handleProjectSelect = (project: IProject) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  if (selectedProject) {
    return (
      <ProjectKanban 
        project={selectedProject} 
        onBack={handleBackToProjects}
      />
    );
  }

  if (showCreateForm) {
    return (
      <CreateProjectForm 
        onProjectCreated={handleProjectCreated}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600">Gerencie projetos e tarefas do estúdio</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-gray-500 text-center mb-6">
              Comece criando seu primeiro projeto para organizar tarefas e eventos.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Projeto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProjectSelect(project)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-red-600" />
                  {project.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.startDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  {project.endDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      Fim: {new Date(project.endDate).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {project.taskCount || 0} tarefas
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progresso</span>
                    <span>{project.completedTasksCount || 0}/{project.taskCount || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${project.taskCount ? (project.completedTasksCount || 0) / project.taskCount * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
