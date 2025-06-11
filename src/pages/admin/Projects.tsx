
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, Calendar, Users, LayoutGrid, CalendarDays, Target, Sparkles, TrendingUp, Clock } from "lucide-react";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getProjectService } from "@/services/serviceFactory";
import ProjectKanban from "@/components/admin/ProjectKanban";
import CreateProjectForm from "@/components/admin/CreateProjectForm";
import ProjectCalendar from "@/components/admin/ProjectCalendar";
import { IProject } from "@/services/interfaces/IProjectService";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [view, setView] = useState<'grid' | 'calendar'>('grid');
  const [createDate, setCreateDate] = useState<string>('');
  const projectService = getProjectService();

  const { data: projects = [], loading, refresh } = useDataQuery<IProject[]>(
    () => projectService.fetchProjects(),
    []
  );

  const handleProjectCreated = () => {
    setShowCreateForm(false);
    setCreateDate('');
    refresh();
  };

  const handleProjectSelect = (project: IProject) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const handleCreateFromCalendar = (date: string) => {
    setCreateDate(date);
    setShowCreateForm(true);
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      planning: { 
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100', 
        border: 'border-l-purple-500', 
        text: 'text-purple-700',
        badge: 'bg-purple-600 text-white shadow-purple-500/25',
        icon: '📋',
        label: 'Planejamento'
      },
      active: { 
        bg: 'bg-gradient-to-br from-red-50 to-red-100', 
        border: 'border-l-red-500', 
        text: 'text-red-700',
        badge: 'bg-red-600 text-white shadow-red-500/25',
        icon: '🚀',
        label: 'Ativo'
      },
      completed: { 
        bg: 'bg-gradient-to-br from-green-50 to-green-100', 
        border: 'border-l-green-500', 
        text: 'text-green-700',
        badge: 'bg-green-600 text-white shadow-green-500/25',
        icon: '✨',
        label: 'Concluído'
      },
      on_hold: { 
        bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100', 
        border: 'border-l-yellow-500', 
        text: 'text-yellow-700',
        badge: 'bg-yellow-600 text-white shadow-yellow-500/25',
        icon: '⏸️',
        label: 'Em Espera'
      }
    };
    return configs[status as keyof typeof configs] || configs.planning;
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
        onCancel={() => {
          setShowCreateForm(false);
          setCreateDate('');
        }}
        initialDate={createDate}
      />
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-red-50/30 to-white min-h-screen">
      {/* Header Aprimorado */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <div className="absolute -top-2 -left-2 w-12 h-12 bg-red-200/30 rounded-full"></div>
          <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text relative z-10">
            Projetos e Iniciativas
          </h1>
          <p className="text-gray-600 font-medium mt-2 relative z-10">
            Gerencie projetos, eventos e iniciativas do estúdio com criatividade
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex border-2 border-red-200 rounded-xl shadow-lg bg-white overflow-hidden">
            <Button
              variant={view === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('grid')}
              className={`rounded-r-none transition-all duration-300 ${
                view === 'grid' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Grade
            </Button>
            <Button
              variant={view === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('calendar')}
              className={`rounded-l-none transition-all duration-300 ${
                view === 'calendar' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              Calendário
            </Button>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-red-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
      </div>

      {view === 'calendar' ? (
        <ProjectCalendar
          projects={projects}
          onCreateProject={handleCreateFromCalendar}
          onProjectClick={handleProjectSelect}
        />
      ) : (
        <>
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse shadow-xl">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <Card className="shadow-2xl bg-gradient-to-br from-white via-gray-50 to-white border-2 border-red-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/20 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-100/30 rounded-full transform -translate-x-12 translate-y-12"></div>
              <CardContent className="flex flex-col items-center justify-center py-16 relative z-10">
                <div className="text-6xl mb-6 opacity-60">
                  🎨
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  Nenhum projeto encontrado
                </h3>
                <p className="text-gray-600 text-center mb-8 max-w-md font-medium">
                  Comece criando seu primeiro projeto para organizar tarefas, eventos e iniciativas criativas do estúdio.
                </p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => {
                const statusConfig = getStatusConfig(project.status);
                const progress = project.taskCount ? (project.completedTasksCount || 0) / project.taskCount * 100 : 0;
                
                return (
                  <Card 
                    key={project.id} 
                    className={`cursor-pointer border-l-4 ${statusConfig.border} ${statusConfig.bg} shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group relative overflow-hidden`}
                    onClick={() => handleProjectSelect(project)}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    {/* Efeito de brilho animado */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                    
                    <CardHeader className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{statusConfig.icon}</span>
                          <CardTitle className={`flex items-center gap-2 ${statusConfig.text} font-bold text-lg`}>
                            <FolderOpen className="h-5 w-5" />
                            {project.name}
                          </CardTitle>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`${statusConfig.badge} animate-pulse font-bold`}>
                          {statusConfig.label}
                        </Badge>
                        {project.mainHypothesis && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                            <Target className="h-3 w-3 mr-1" />
                            Com Hipótese
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2 font-medium text-gray-700">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="relative z-10">
                      <div className="space-y-4">
                        {/* Datas */}
                        <div className="grid grid-cols-1 gap-2">
                          {project.startDate && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/70 p-2 rounded-lg border border-gray-200">
                              <Calendar className="h-4 w-4 text-red-600" />
                              <span className="font-medium">
                                Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          )}
                          {project.endDate && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/70 p-2 rounded-lg border border-gray-200">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">
                                Fim: {new Date(project.endDate).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/70 p-2 rounded-lg border border-gray-200">
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{project.taskCount || 0} tarefas</span>
                          </div>
                        </div>

                        {/* Hipótese Principal */}
                        {project.mainHypothesis && (
                          <div className="text-xs text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border-2 border-blue-200 shadow-inner">
                            <div className="flex items-center gap-1 mb-1">
                              <Target className="h-3 w-3" />
                              <strong>Hipótese Principal:</strong>
                            </div>
                            <span className="font-medium">{project.mainHypothesis.substring(0, 80)}...</span>
                          </div>
                        )}

                        {/* Barra de Progresso Aprimorada */}
                        <div className="bg-white/70 p-3 rounded-lg border border-gray-200 shadow-inner">
                          <div className="flex justify-between text-xs text-gray-600 mb-2">
                            <span className="font-bold flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Progresso
                            </span>
                            <span className="font-bold">
                              {project.completedTasksCount || 0}/{project.taskCount || 0}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                            <div 
                              className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500 shadow-lg relative overflow-hidden"
                              style={{ width: `${progress}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] animate-shimmer"></div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 mt-1 text-center font-medium">
                            {Math.round(progress)}% concluído
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      <style>
        {`
          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-12deg); }
            100% { transform: translateX(200%) skewX(-12deg); }
          }
          
          .animate-shimmer {
            animation: shimmer 2s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Projects;
