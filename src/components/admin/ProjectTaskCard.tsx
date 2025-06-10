
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash, Target } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IProjectTask, SmartCriteria } from "@/services/interfaces/IProjectService";

interface ProjectTaskCardProps {
  task: IProjectTask;
  onTaskUpdate: (taskId: string, newStatus: string) => Promise<void>;
  onTaskRefresh: () => void;
}

const priorityColors: { [key: string]: string } = {
  low: 'border-l-green-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-orange-500',
  critical: 'border-l-red-500',
};

const ProjectTaskCard = ({ task, onTaskUpdate, onTaskRefresh }: ProjectTaskCardProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    await onTaskUpdate(task.id, newStatus);
    onTaskRefresh();
  };

  const getSmartGoalInfo = () => {
    if (!task.smartGoalAssociation || task.smartGoalAssociation.length === 0) {
      return null;
    }

    return task.smartGoalAssociation.map(assoc => ({
      goalId: assoc.goalId,
      criteria: assoc.criteria
    }));
  };

  const smartGoalInfo = getSmartGoalInfo();

  return (
    <Card 
      className={`mb-3 cursor-move transition-all duration-200 hover:shadow-lg border-l-4 ${priorityColors[task.priority]} ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log('Edit task')}>
              <Edit className="h-4 w-4 mr-2" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Delete task')}>
              <Trash className="h-4 w-4 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pt-2">
        {task.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
            {task.description}
          </p>
        )}
        
        {smartGoalInfo && smartGoalInfo.length > 0 && (
          <div className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded mt-2">
            <Target className="h-3 w-3 inline mr-1" />
            Meta SMART: {smartGoalInfo.map(info => `${info.goalId} (${info.criteria.join(', ')})`).join('; ')}
          </div>
        )}

        <div className="flex items-center space-x-2">
          {task.assignedTo && (
            <Avatar className="h-5 w-5">
              <AvatarImage src={`https://github.com/${task.assignedTo}.png`} alt={task.assignedTo} />
              <AvatarFallback>{task.assignedTo.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
          <span className="text-xs text-gray-500">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sem data'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTaskCard;
