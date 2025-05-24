
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IKanbanStage, IProjectTask } from "@/services/interfaces/IProjectService";
import ProjectTaskCard from "@/components/admin/ProjectTaskCard";

interface ProjectKanbanColumnProps {
  stage: IKanbanStage;
  tasks: IProjectTask[];
  onTaskUpdate: (taskId: string, newStatus: string) => void;
  onTaskRefresh: () => void;
}

const ProjectKanbanColumn = ({ 
  stage, 
  tasks, 
  onTaskUpdate, 
  onTaskRefresh 
}: ProjectKanbanColumnProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onTaskUpdate(taskId, stage.id);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-200 bg-blue-50';
      case 'green': return 'border-green-200 bg-green-50';
      case 'yellow': return 'border-yellow-200 bg-yellow-50';
      case 'red': return 'border-red-200 bg-red-50';
      case 'purple': return 'border-purple-200 bg-purple-50';
      case 'orange': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getHeaderColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-800';
      case 'green': return 'text-green-800';
      case 'yellow': return 'text-yellow-800';
      case 'red': return 'text-red-800';
      case 'purple': return 'text-purple-800';
      case 'orange': return 'text-orange-800';
      default: return 'text-gray-800';
    }
  };

  return (
    <div 
      className="flex-shrink-0 w-80"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Card className={`h-full ${getColorClass(stage.color)}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className={`text-sm font-medium ${getHeaderColor(stage.color)}`}>
              {stage.name}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              Nenhuma tarefa nesta etapa
            </div>
          ) : (
            tasks
              .sort((a, b) => a.order - b.order)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', task.id);
                  }}
                  className="cursor-move"
                >
                  <ProjectTaskCard 
                    task={task} 
                    onTaskRefresh={onTaskRefresh}
                  />
                </div>
              ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectKanbanColumn;
