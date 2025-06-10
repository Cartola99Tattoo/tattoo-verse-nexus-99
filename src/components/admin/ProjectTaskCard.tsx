
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, User, Target, Edit, Trash2 } from "lucide-react";
import { IProjectTask } from "@/services/interfaces/IProjectService";
import EditTaskForm from "./EditTaskForm";

interface ProjectTaskCardProps {
  task: IProjectTask;
  onTaskRefresh: () => void;
}

const ProjectTaskCard = ({ task, onTaskRefresh }: ProjectTaskCardProps) => {
  const [showEditForm, setShowEditForm] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      'critical': 'Crítica',
      'high': 'Alta',
      'medium': 'Média',
      'low': 'Baixa'
    };
    return labels[priority] || priority;
  };

  const getSmartGoalColor = (association: string) => {
    switch (association) {
      case 'specific': return 'bg-red-100 text-red-800';
      case 'measurable': return 'bg-blue-100 text-blue-800';
      case 'achievable': return 'bg-green-100 text-green-800';
      case 'relevant': return 'bg-purple-100 text-purple-800';
      case 'timeBound': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSmartGoalLabel = (association: string) => {
    const labels: Record<string, string> = {
      'specific': 'Específica',
      'measurable': 'Mensurável',
      'achievable': 'Atingível',
      'relevant': 'Relevante',
      'timeBound': 'Temporal'
    };
    return labels[association] || association;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (showEditForm) {
    return (
      <EditTaskForm
        task={task}
        onCancel={() => setShowEditForm(false)}
        onTaskUpdated={onTaskRefresh}
      />
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-sm leading-tight line-clamp-2">{task.title}</h4>
          <div className="flex gap-1 ml-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => setShowEditForm(true)}
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.description && (
          <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex gap-1 flex-wrap">
          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
            {getPriorityLabel(task.priority)}
          </Badge>
          
          {task.smartGoalAssociation && (
            <Badge className={`text-xs ${getSmartGoalColor(task.smartGoalAssociation)}`}>
              <Target className="h-3 w-3 mr-1" />
              {getSmartGoalLabel(task.smartGoalAssociation)}
            </Badge>
          )}
        </div>

        {task.assignedTo && (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {getInitials(task.assignedTo)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600 truncate">{task.assignedTo}</span>
          </div>
        )}

        <div className="space-y-1">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              <span className={isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-600'}>
                {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                {isOverdue(task.dueDate) && ' (Atrasada)'}
              </span>
            </div>
          )}
          
          {task.estimatedHours && task.estimatedHours > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Clock className="h-3 w-3" />
              <span>
                {task.estimatedHours}h estimada{task.estimatedHours !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {!task.smartGoalAssociation && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
            <Target className="h-3 w-3 inline mr-1" />
            Tarefa não associada a nenhuma Meta SMART
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTaskCard;
