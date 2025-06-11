
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { IProjectTask, IKanbanStage } from "@/services/interfaces/IProjectService";
import ProjectTaskCard from "./ProjectTaskCard";

interface ProjectKanbanColumnProps {
  title: string;
  status: string;
  tasks: IProjectTask[];
  onTaskUpdate: (taskId: string, newStatus: string) => Promise<void>;
  onTaskRefresh: () => void;
  onAddTask: (stageId: string) => void;
  onEditTask: (task: IProjectTask) => void;
  count: number;
}

const ProjectKanbanColumn = ({ 
  title, 
  status, 
  tasks, 
  onTaskUpdate,
  onTaskRefresh, 
  onAddTask,
  onEditTask,
  count 
}: ProjectKanbanColumnProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-red-400', 'bg-red-50', 'scale-102', 'shadow-2xl');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-red-400', 'bg-red-50', 'scale-102', 'shadow-2xl');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-red-400', 'bg-red-50', 'scale-102', 'shadow-2xl');
    e.currentTarget.classList.add('animate-pulse');
    setTimeout(() => {
      e.currentTarget.classList.remove('animate-pulse');
    }, 300);
    
    const taskId = e.dataTransfer.getData('taskId');
    onTaskUpdate(taskId, status);
  };

  const getColumnColor = (status: string) => {
    switch (status) {
      case 'ideas': return 'from-purple-600 via-purple-700 to-purple-800';
      case 'todo': return 'from-red-600 via-red-700 to-red-800';
      case 'in_progress': return 'from-orange-600 via-orange-700 to-red-600';
      case 'review': return 'from-yellow-600 via-yellow-700 to-orange-600';
      case 'completed': return 'from-green-600 via-green-700 to-green-800';
      default: return 'from-gray-600 via-gray-700 to-gray-800';
    }
  };

  const getColumnBorderColor = (status: string) => {
    switch (status) {
      case 'ideas': return 'border-purple-300 hover:border-purple-400';
      case 'todo': return 'border-red-300 hover:border-red-400';
      case 'in_progress': return 'border-orange-300 hover:border-orange-400';
      case 'review': return 'border-yellow-300 hover:border-yellow-400';
      case 'completed': return 'border-green-300 hover:border-green-400';
      default: return 'border-gray-300 hover:border-gray-400';
    }
  };

  const getAddButtonColor = (status: string) => {
    switch (status) {
      case 'ideas': return 'bg-purple-600 hover:bg-purple-700 border-purple-300 shadow-purple-500/25';
      case 'todo': return 'bg-red-600 hover:bg-red-700 border-red-300 shadow-red-500/25';
      case 'in_progress': return 'bg-orange-600 hover:bg-orange-700 border-orange-300 shadow-orange-500/25';
      case 'review': return 'bg-yellow-600 hover:bg-yellow-700 border-yellow-300 shadow-yellow-500/25';
      case 'completed': return 'bg-green-600 hover:bg-green-700 border-green-300 shadow-green-500/25';
      default: return 'bg-gray-600 hover:bg-gray-700 border-gray-300 shadow-gray-500/25';
    }
  };

  const getEmptyStateIcon = (status: string) => {
    switch (status) {
      case 'ideas': return '💡';
      case 'todo': return '📋';
      case 'in_progress': return '🔄';
      case 'review': return '👀';
      case 'completed': return '✅';
      default: return '📌';
    }
  };

  return (
    <div 
      className="flex-shrink-0 w-80 min-w-[320px] transition-all duration-500 ease-in-out transform hover:scale-[1.02]"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Card className={`h-full border-2 ${getColumnBorderColor(status)} shadow-2xl bg-gradient-to-b from-white via-gray-50 to-white hover:shadow-3xl transition-all duration-500 backdrop-blur-sm border-opacity-60`}>
        <CardHeader className={`pb-4 sticky top-0 bg-gradient-to-r ${getColumnColor(status)} text-white z-20 border-b rounded-t-lg shadow-lg backdrop-blur-md`}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold tracking-wide uppercase flex items-center gap-2">
              <span className="text-lg">{getEmptyStateIcon(status)}</span>
              {title}
            </CardTitle>
            <Badge variant="secondary" className="text-xs bg-white/95 text-gray-800 font-bold shadow-md px-3 py-1 animate-pulse">
              {count}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto p-6 custom-scrollbar">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-16 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 via-white to-gray-50 hover:border-red-400 hover:bg-red-50 transition-all duration-500 group cursor-pointer" onClick={() => onAddTask(status)}>
              <div className="text-4xl mb-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                {getEmptyStateIcon(status)}
              </div>
              <div className="text-gray-400 text-xs mb-2 font-medium group-hover:text-red-500 transition-colors duration-300">
                ✨ Arraste tarefas aqui ou clique para adicionar ✨
              </div>
              <div className="text-gray-600 font-medium group-hover:text-red-600 transition-colors duration-300">
                Nenhuma tarefa neste estágio
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('taskId', task.id);
                    e.currentTarget.classList.add('opacity-60', 'rotate-2', 'scale-105', 'z-50');
                  }}
                  onDragEnd={(e) => {
                    e.currentTarget.classList.remove('opacity-60', 'rotate-2', 'scale-105', 'z-50');
                  }}
                  className="cursor-move transition-all duration-300 hover:scale-[1.02] hover:z-10 animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <ProjectTaskCard 
                    task={task} 
                    onTaskUpdate={onTaskUpdate}
                    onTaskRefresh={onTaskRefresh}
                    onEditTask={onEditTask}
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Botão de Adição Rápida Aprimorado */}
          <div className="pt-6 border-t border-gray-200">
            <Button
              onClick={() => onAddTask(status)}
              variant="outline"
              className={`w-full ${getAddButtonColor(status)} text-white border-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden`}
              size="sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold">Adicionar Tarefa</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
            border-radius: 12px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #dc2626, #ef4444);
            border-radius: 12px;
            border: 2px solid #f1f5f9;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #b91c1c, #dc2626);
          }
          
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
          
          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
          }
        `}
      </style>
    </div>
  );
};

export default ProjectKanbanColumn;
