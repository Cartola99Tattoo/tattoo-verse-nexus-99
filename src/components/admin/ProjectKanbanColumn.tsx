
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import { IKanbanStage, IProjectTask } from "@/services/interfaces/IProjectService";
import ProjectTaskCard from "./ProjectTaskCard";

interface ProjectKanbanColumnProps {
  stage: IKanbanStage;
  tasks: IProjectTask[];
  onTaskUpdate: (taskId: string, newStatus: string) => void;
  onTaskRefresh: () => void;
}

const ProjectKanbanColumn = ({ stage, tasks, onTaskUpdate, onTaskRefresh }: ProjectKanbanColumnProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onTaskUpdate(taskId, stage.id);
    }
  };

  const getStageColor = (stageId: string) => {
    const colors = {
      'ideas': 'bg-purple-500',
      'todo': 'bg-blue-500',
      'in_progress': 'bg-yellow-500',
      'review': 'bg-orange-500',
      'completed': 'bg-green-500'
    };
    return colors[stageId as keyof typeof colors] || 'bg-gray-500';
  };

  const getStageGradient = (stageId: string) => {
    const gradients = {
      'ideas': 'from-purple-500 to-purple-600',
      'todo': 'from-blue-500 to-blue-600',
      'in_progress': 'from-yellow-500 to-yellow-600',
      'review': 'from-orange-500 to-orange-600',
      'completed': 'from-green-500 to-green-600'
    };
    return gradients[stageId as keyof typeof gradients] || 'from-gray-500 to-gray-600';
  };

  return (
    <div 
      className="flex-shrink-0 w-80 min-w-[300px]"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Card className={`h-full shadow-lg border-0 transition-all duration-300 ${
        isDragOver ? 'ring-2 ring-red-400 ring-opacity-50 shadow-xl transform scale-105' : ''
      }`}>
        <CardHeader className={`pb-3 bg-gradient-to-r ${getStageGradient(stage.id)} text-white rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-white opacity-80`}></div>
              {stage.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs font-medium">
                {tasks.length}
              </Badge>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-white/20">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={`space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto p-4 ${
          isDragOver ? 'bg-red-50' : 'bg-white'
        }`}>
          {tasks.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="space-y-2">
                <div className="text-gray-400">
                  {stage.id === 'ideas' && '💡'}
                  {stage.id === 'todo' && '📋'}
                  {stage.id === 'in_progress' && '⚡'}
                  {stage.id === 'review' && '👀'}
                  {stage.id === 'completed' && '✅'}
                </div>
                <p>Arraste tarefas aqui</p>
                <p className="text-xs text-gray-400">ou adicione uma nova</p>
              </div>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', task.id);
                }}
                className="cursor-move transition-transform duration-200 hover:scale-105"
              >
                <ProjectTaskCard 
                  task={task} 
                  onTaskRefresh={onTaskRefresh}
                />
              </div>
            ))
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full border-2 border-dashed border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Tarefa
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectKanbanColumn;
