
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit, Trash, Target, Clock, User, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IProjectTask, SmartCriteria } from "@/services/interfaces/IProjectService";

interface ProjectTaskCardProps {
  task: IProjectTask;
  onTaskUpdate: (taskId: string, newStatus: string) => Promise<void>;
  onTaskRefresh: () => void;
}

const priorityColors: { [key: string]: { bg: string; border: string; text: string } } = {
  low: { bg: 'bg-green-50', border: 'border-l-green-500', text: 'text-green-700' },
  medium: { bg: 'bg-yellow-50', border: 'border-l-yellow-500', text: 'text-yellow-700' },
  high: { bg: 'bg-orange-50', border: 'border-l-orange-500', text: 'text-orange-700' },
  critical: { bg: 'bg-red-50', border: 'border-l-red-500', text: 'text-red-700' },
};

const priorityLabels: { [key: string]: string } = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
};

const smartCriteriaLabels: { [key in SmartCriteria]: string } = {
  specific: 'Específica',
  measurable: 'Mensurável',
  achievable: 'Atingível',
  relevant: 'Relevante',
  time_bound: 'Temporal',
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
  const priorityConfig = priorityColors[task.priority] || priorityColors.medium;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sem prazo';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isOverdue = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date() && task.status !== 'completed';
  };

  return (
    <Card 
      className={`mb-3 cursor-move transition-all duration-300 hover:shadow-lg border-l-4 ${priorityConfig.border} ${priorityConfig.bg} ${
        isDragging ? 'opacity-60 rotate-2 scale-105 shadow-xl' : 'hover:scale-102'
      } backdrop-blur-sm`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
        <div className="flex-1">
          <CardTitle className={`text-sm font-semibold ${priorityConfig.text} leading-tight`}>
            {task.title}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`text-xs mt-1 ${priorityConfig.text} border-current`}
          >
            {priorityLabels[task.priority]}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-red-100">
              <span className="sr-only">Abrir menu</span>
              <MoreVertical className="h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log('Edit task')} className="hover:bg-red-50">
              <Edit className="h-4 w-4 mr-2" />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log('Delete task')} className="hover:bg-red-50 text-red-600">
              <Trash className="h-4 w-4 mr-2" />
              <span>Excluir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {task.description && (
          <p className="text-xs text-gray-600 line-clamp-2 bg-white/50 p-2 rounded border">
            {task.description}
          </p>
        )}
        
        {/* Informações da Tarefa */}
        <div className="space-y-2">
          {/* Data de Vencimento */}
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3 w-3 text-gray-500" />
            <span className={`${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              {formatDate(task.dueDate)}
              {isOverdue(task.dueDate) && <span className="ml-1">⚠️</span>}
            </span>
          </div>

          {/* Tempo Estimado */}
          {task.estimatedHours && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock className="h-3 w-3" />
              <span>{task.estimatedHours}h estimadas</span>
            </div>
          )}

          {/* Responsável */}
          {task.assignedTo && (
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-gray-500" />
              <Avatar className="h-5 w-5">
                <AvatarImage src={`https://github.com/${task.assignedTo}.png`} alt={task.assignedTo} />
                <AvatarFallback className="text-xs bg-red-100 text-red-700">
                  {task.assignedTo.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600 font-medium">{task.assignedTo}</span>
            </div>
          )}
        </div>

        {/* Associação com Meta SMART */}
        {smartGoalInfo && smartGoalInfo.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-3 mt-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-3 w-3 text-red-600" />
              <span className="text-xs font-semibold text-red-800">Meta SMART Associada</span>
            </div>
            {smartGoalInfo.map((info, index) => (
              <div key={index} className="text-xs text-red-700">
                <div className="font-medium mb-1">Meta: {info.goalId}</div>
                <div className="flex flex-wrap gap-1">
                  {info.criteria.map((criterion, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs bg-white/80 text-red-700 border-red-300"
                    >
                      {smartCriteriaLabels[criterion]}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTaskCard;
