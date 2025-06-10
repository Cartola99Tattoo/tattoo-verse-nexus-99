
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, User } from "lucide-react";
import { IProject, IProjectTask } from "@/services/interfaces/IProjectService";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getProjectService } from "@/services/serviceFactory";

interface ProjectCalendarProps {
  projects: IProject[];
  onCreateProject: (date: string) => void;
  onProjectClick: (project: IProject) => void;
}

const ProjectCalendar = ({ projects, onCreateProject, onProjectClick }: ProjectCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const projectService = getProjectService();

  // Buscar todas as tarefas de todos os projetos
  const { data: allTasks = [] } = useDataQuery<IProjectTask[]>(
    async () => {
      const taskPromises = projects.map(project => 
        projectService.fetchProjectTasks(project.id)
      );
      const tasksArrays = await Promise.all(taskPromises);
      return tasksArrays.flat();
    },
    [projects]
  );

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      on_hold: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getProjectsForDate = (date: Date) => {
    return projects.filter(project => {
      if (!project.startDate) return false;
      const projectStart = new Date(project.startDate);
      const projectEnd = project.endDate ? new Date(project.endDate) : projectStart;
      return date >= projectStart && date <= projectEnd;
    });
  };

  const getTasksForDate = (date: Date) => {
    return allTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      const dayProjects = getProjectsForDate(current);
      const dayTasks = getTasksForDate(current);
      const isCurrentMonth = current.getMonth() === month;
      const isToday = current.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={current.toISOString()}
          className={`min-h-[140px] border p-2 ${
            isCurrentMonth ? 'bg-white' : 'bg-gray-50'
          } ${isToday ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : ''}`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${
              isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
            } ${isToday ? 'text-blue-600 font-bold' : ''}`}>
              {current.getDate()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-red-100"
              onClick={() => onCreateProject(current.toISOString().split('T')[0])}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-1 overflow-y-auto max-h-[100px]">
            {/* Projetos */}
            {dayProjects.slice(0, 2).map(project => (
              <div
                key={`project-${project.id}`}
                className="text-xs p-1 rounded cursor-pointer hover:opacity-80 border"
                onClick={() => onProjectClick(project)}
              >
                <Badge variant="outline" className={`${getStatusColor(project.status)} w-full text-center`}>
                  📁 {project.name}
                </Badge>
              </div>
            ))}
            
            {/* Tarefas */}
            {dayTasks.slice(0, 3).map(task => {
              const project = projects.find(p => p.id === task.projectId);
              const isOverdue = new Date(task.dueDate!) < new Date() && task.status !== 'completed';
              
              return (
                <div
                  key={`task-${task.id}`}
                  className={`text-xs p-1 rounded border ${getPriorityColor(task.priority)} ${
                    isOverdue ? 'ring-1 ring-red-400' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Clock className="h-2 w-2" />
                    <span className="font-medium truncate">{task.title}</span>
                  </div>
                  {task.assignedTo && (
                    <div className="flex items-center gap-1 mt-1">
                      <User className="h-2 w-2" />
                      <span className="truncate">{task.assignedTo.split(' ')[0]}</span>
                    </div>
                  )}
                  {project && (
                    <div className="text-xs text-gray-500 truncate">
                      {project.name}
                    </div>
                  )}
                  {isOverdue && (
                    <div className="text-xs text-red-600 font-bold">
                      ATRASADA
                    </div>
                  )}
                </div>
              );
            })}
            
            {(dayProjects.length > 2 || dayTasks.length > 3) && (
              <div className="text-xs text-gray-500 text-center">
                +{Math.max(0, dayProjects.length - 2) + Math.max(0, dayTasks.length - 3)} mais
              </div>
            )}
          </div>
        </div>
      );
      current.setDate(current.getDate() + 1);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-3 text-center font-bold text-gray-700 bg-gradient-to-r from-red-50 to-red-100 border">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const todayTasks = getTasksForDate(new Date());
  const overdueTasks = allTasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  });

  return (
    <div className="space-y-4">
      {/* Resumo de alertas */}
      {(todayTasks.length > 0 || overdueTasks.length > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4 text-sm">
              {todayTasks.length > 0 && (
                <div className="flex items-center gap-1 text-orange-700">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{todayTasks.length} tarefa(s) vencem hoje</span>
                </div>
              )}
              {overdueTasks.length > 0 && (
                <div className="flex items-center gap-1 text-red-700">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{overdueTasks.length} tarefa(s) atrasada(s)</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendário de Projetos e Tarefas
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-bold px-4 text-lg">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="text-white hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {renderMonthView()}
        </CardContent>
      </Card>

      {/* Legenda */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Projetos em Planejamento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span>Projetos Ativos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
              <span>Tarefas Críticas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
              <span>Tarefas Alta Prioridade</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCalendar;
