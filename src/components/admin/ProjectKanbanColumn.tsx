
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IProjectTask } from "@/services/interfaces/IProjectService";
import ProjectTaskCard from "./ProjectTaskCard";

interface ProjectKanbanColumnProps {
  title: string;
  status: string;
  tasks: IProjectTask[];
  onTaskUpdate: (taskId: string, newStatus: string) => Promise<void>;
  onTaskRefresh: () => void;
  count: number;
}

const ProjectKanbanColumn = ({ 
  title, 
  status, 
  tasks, 
  onTaskUpdate,
  onTaskRefresh, 
  count 
}: ProjectKanbanColumnProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onTaskUpdate(taskId, status);
  };

  return (
    <div 
      className="flex-shrink-0 w-72 min-w-[280px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Card className="h-full border-2 border-red-100 shadow-lg bg-gradient-to-b from-white to-red-50">
        <CardHeader className="pb-3 sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white z-10 border-b rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold">{title}</CardTitle>
            <Badge variant="secondary" className="text-xs bg-white text-red-700 font-semibold">
              {count}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto p-4">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="text-gray-400 text-xs mb-2">Arraste tarefas aqui</div>
              Nenhuma tarefa neste estágio
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('taskId', task.id);
                }}
                className="cursor-move"
              >
                <ProjectTaskCard 
                  task={task} 
                  onTaskUpdate={onTaskUpdate}
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
