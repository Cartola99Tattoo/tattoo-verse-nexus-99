
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit, Trash, Target, Clock, User, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IProjectTask, SmartCriteria } from "@/services/interfaces/IProjectService";

interface ProjectTaskCardProps {
  task: IProjectTask;
  onTaskUpdate: (taskId: string, newStatus: string) => Promise<void>;
  onTaskRefresh: () => void;
  onEditTask: (task: IProjectTask) => void;
}

const priorityColors: { [key: string]: { bg: string; border: string; text: string; icon: string; glow: string } } = {
  low: { 
    bg: 'bg-green-50', 
    border: 'border-l-green-500', 
    text: 'text-green-700', 
    icon: '🟢',
    glow: 'shadow-green-500/20'
  },
  medium: { 
    bg: 'bg-yellow-50', 
    border: 'border-l-yellow-500', 
    text: 'text-yellow-700', 
    icon: '🟡',
    glow: 'shadow-yellow-500/20'
  },
  high: { 
    bg: 'bg-orange-50', 
    border: 'border-l-orange-500', 
    text: 'text-orange-700', 
    icon: '🟠',
    glow: 'shadow-orange-500/20'
  },
  critical: { 
    bg: 'bg-red-50', 
    border: 'border-l-red-500', 
    text: 'text-red-700', 
    icon: '🔴',
    glow: 'shadow-red-500/20'
  },
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

const ProjectTaskCard = ({ task, onTaskUpdate, onTaskRefresh, onEditTask }: ProjectTaskCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleEdit = () => {
    onEditTask(task);
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

  const getDaysUntilDue = (dateString?: string) => {
    if (!dateString) return null;
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(task.dueDate);

  return (
    <Card 
      className={`mb-3 cursor-move transition-all duration-300 hover:shadow-xl border-l-4 ${priorityConfig.border} ${priorityConfig.bg} ${priorityConfig.glow} ${
        isDragging ? 'opacity-70 rotate-3 scale-110 shadow-2xl z-50' : 'hover:scale-[1.02] hover:-translate-y-1'
      } backdrop-blur-sm group relative overflow-hidden`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Efeito de brilho no hover */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none`}></div>
      
      <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">{priorityConfig.icon}</span>
            <CardTitle className={`text-sm font-semibold ${priorityConfig.text} leading-tight flex-1`}>
              {task.title}
            </CardTitle>
            {task.status === 'completed' && (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${priorityConfig.text} border-current bg-white/80 font-medium px-2 py-1 shadow-sm`}
            >
              {priorityLabels[task.priority]}
            </Badge>
            {daysUntilDue !== null && (
              <Badge 
                variant="outline" 
                className={`text-xs px-2 py-1 font-medium ${
                  daysUntilDue < 0 
                    ? 'text-red-700 border-red-300 bg-red-50' 
                    : daysUntilDue <= 3 
                    ? 'text-orange-700 border-orange-300 bg-orange-50'
                    : 'text-blue-700 border-blue-300 bg-blue-50'
                }`}
              >
                {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}d atraso` : `${daysUntilDue}d restantes`}
              </Badge>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-red-100 transition-all duration-200 opacity-60 hover:opacity-100">
              <span className="sr-only">Abrir menu</span>
              <MoreVertical className="h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl">
            <DropdownMenuLabel className="font-semibold text-gray-700">Ações da Tarefa</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleEdit} className="hover:bg-red-50 cursor-pointer transition-colors duration-200">
              <Edit className="h-4 w-4 mr-2 text-blue-600" />
              <span>Editar Tarefa</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log('Delete task')} className="hover:bg-red-50 text-red-600 cursor-pointer transition-colors duration-200">
              <Trash className="h-4 w-4 mr-2" />
              <span>Excluir Tarefa</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4 relative z-10">
        {task.description && (
          <div className="relative">
            <p className="text-xs text-gray-700 line-clamp-2 bg-white/70 p-3 rounded-lg border border-gray-200 shadow-sm font-medium leading-relaxed">
              {task.description}
            </p>
          </div>
        )}
        
        {/* Informações da Tarefa com melhor layout */}
        <div className="grid grid-cols-1 gap-3">
          {/* Data de Vencimento */}
          <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg border border-gray-200/50">
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-3 w-3 text-gray-500" />
              <span className={`font-medium ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-600'}`}>
                {formatDate(task.dueDate)}
              </span>
            </div>
            {isOverdue(task.dueDate) && (
              <AlertCircle className="h-3 w-3 text-red-500" />
            )}
          </div>

          {/* Tempo Estimado e Responsável */}
          <div className="flex items-center justify-between">
            {task.estimatedHours && (
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/60 px-2 py-1 rounded-lg border border-gray-200/50">
                <Clock className="h-3 w-3" />
                <span className="font-medium">{task.estimatedHours}h</span>
              </div>
            )}

            {task.assignedTo && (
              <div className="flex items-center gap-2 bg-white/60 px-2 py-1 rounded-lg border border-gray-200/50">
                <User className="h-3 w-3 text-gray-500" />
                <Avatar className="h-4 w-4">
                  <AvatarImage src={`https://github.com/${task.assignedTo}.png`} alt={task.assignedTo} />
                  <AvatarFallback className="text-xs bg-red-100 text-red-700 font-bold">
                    {task.assignedTo.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-600 font-medium max-w-[60px] truncate">{task.assignedTo}</span>
              </div>
            )}
          </div>
        </div>

        {/* Associação com Meta SMART - Design aprimorado */}
        {smartGoalInfo && smartGoalInfo.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 via-red-100 to-red-50 border-2 border-red-200 rounded-xl p-4 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-red-200/30 rounded-full transform translate-x-6 -translate-y-6"></div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-red-600" />
              <span className="text-xs font-bold text-red-800 uppercase tracking-wide">Meta SMART</span>
            </div>
            {smartGoalInfo.map((info, index) => (
              <div key={index} className="text-xs text-red-700 space-y-2">
                <div className="font-semibold text-red-800 bg-white/50 px-2 py-1 rounded">
                  📎 {info.goalId}
                </div>
                <div className="flex flex-wrap gap-1">
                  {info.criteria.map((criterion, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs bg-white/90 text-red-700 border-red-300 font-medium px-2 py-1 shadow-sm hover:shadow-md transition-shadow duration-200"
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
