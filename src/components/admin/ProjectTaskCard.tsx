
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, AlertCircle, Edit, Trash2 } from "lucide-react";
import { IProjectTask } from "@/services/interfaces/IProjectService";
import EditTaskForm from "@/components/admin/EditTaskForm";
import { getProjectService } from "@/services/serviceFactory";
import { toast } from "@/hooks/use-toast";

interface ProjectTaskCardProps {
  task: IProjectTask;
  onTaskRefresh: () => void;
}

const ProjectTaskCard = ({ task, onTaskRefresh }: ProjectTaskCardProps) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const projectService = getProjectService();

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    
    setLoading(true);
    try {
      await projectService.deleteTask(task.id);
      toast({
        title: "Sucesso",
        description: "Tarefa excluída com sucesso!",
      });
      onTaskRefresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir tarefa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditComplete = () => {
    setShowEditForm(false);
    onTaskRefresh();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  if (showEditForm) {
    return (
      <EditTaskForm
        task={task}
        onTaskUpdated={handleEditComplete}
        onCancel={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm line-clamp-2 flex-1">
              {task.title}
            </h4>
            <div className="flex gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditForm(true)}
                className="h-6 w-6 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(task.priority)} size="sm">
              {getPriorityLabel(task.priority)}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" size="sm">
                <AlertCircle className="h-3 w-3 mr-1" />
                Atrasada
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            {task.assignedTo && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <User className="h-3 w-3" />
                <span>{task.assignedTo}</span>
              </div>
            )}
            
            {task.dueDate && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="h-3 w-3" />
                <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                  {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTaskCard;
