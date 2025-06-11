
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
    e.currentTarget.classList.add('border-red-400', 'bg-red-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-red-400', 'bg-red-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-red-400', 'bg-red-50');
    const taskId = e.dataTransfer.getData('taskId');
    onTaskUpdate(taskId, status);
  };

  const getColumnColor = (status: string) => {
    switch (status) {
      case 'ideas': return 'from-purple-600 to-purple-700';
      case 'todo': return 'from-red-600 to-red-700';
      case 'in_progress': return 'from-orange-600 to-red-600';
      case 'review': return 'from-yellow-600 to-orange-600';
      case 'completed': return 'from-green-600 to-green-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getColumnBorderColor = (status: string) => {
    switch (status) {
      case 'ideas': return 'border-purple-200';
      case 'todo': return 'border-red-200';
      case 'in_progress': return 'border-orange-200';
      case 'review': return 'border-yellow-200';
      case 'completed': return 'border-green-200';
      default: return 'border-gray-200';
    }
  };

  const getAddButtonColor = (status: string) => {
    switch (status) {
      case 'ideas': return 'bg-purple-600 hover:bg-purple-700 border-purple-300';
      case 'todo': return 'bg-red-600 hover:bg-red-700 border-red-300';
      case 'in_progress': return 'bg-orange-600 hover:bg-orange-700 border-orange-300';
      case 'review': return 'bg-yellow-600 hover:bg-yellow-700 border-yellow-300';
      case 'completed': return 'bg-green-600 hover:bg-green-700 border-green-300';
      default: return 'bg-gray-600 hover:bg-gray-700 border-gray-300';
    }
  };

  return (
    <div 
      className="flex-shrink-0 w-80 min-w-[320px] transition-all duration-300"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Card className={`h-full border-2 ${getColumnBorderColor(status)} shadow-xl bg-gradient-to-b from-white to-gray-50 hover:shadow-2xl transition-all duration-300`}>
        <CardHeader className={`pb-3 sticky top-0 bg-gradient-to-r ${getColumnColor(status)} text-white z-10 border-b rounded-t-lg shadow-lg`}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold tracking-wide">{title}</CardTitle>
            <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800 font-semibold shadow-sm">
              {count}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto p-6 custom-scrollbar">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:border-red-300 hover:bg-red-50 transition-all duration-300">
              <div className="text-gray-400 text-xs mb-3 font-medium">✨ Arraste tarefas aqui ✨</div>
              <div className="text-gray-600 font-medium">Nenhuma tarefa neste estágio</div>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('taskId', task.id);
                }}
                className="cursor-move transition-all duration-200 hover:scale-105 hover:z-10"
              >
                <ProjectTaskCard 
                  task={task} 
                  onTaskUpdate={onTaskUpdate}
                  onTaskRefresh={onTaskRefresh}
                  onEditTask={onEditTask}
                />
              </div>
            ))
          )}
          
          {/* Botão de Adição Rápida */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={() => onAddTask(status)}
              variant="outline"
              className={`w-full ${getAddButtonColor(status)} text-white border-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Tarefa
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #dc2626, #ea384c);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #b91c1c, #dc2626);
          }
        `}
      </style>
    </div>
  );
};

export default ProjectKanbanColumn;
