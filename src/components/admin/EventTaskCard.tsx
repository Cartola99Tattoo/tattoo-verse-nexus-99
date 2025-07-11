
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GripVertical, User, Calendar, CheckCircle2, Edit, AlertTriangle, Target, Clock } from 'lucide-react';

interface EventTask {
  id: string;
  title: string;
  description: string;
  responsible: string;
  deadline: string;
  status: string;
  eventId: string;
  checklist: string[];
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

interface EventTaskCardProps {
  task: EventTask;
  onEdit?: (task: EventTask) => void;
}

const EventTaskCard = ({ task, onEdit }: EventTaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transition,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    boxShadow: isDragging ? '0 25px 50px -12px rgba(239, 68, 68, 0.8)' : 'none',
    transform: isDragging
      ? `${CSS.Transform.toString(transform)} scale(1.05) rotate(2deg)`
      : CSS.Transform.toString(transform),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-600 to-red-800 text-white border-red-400 shadow-red-500/40';
      case 'medium': return 'bg-gradient-to-r from-yellow-600 to-yellow-800 text-white border-yellow-400 shadow-yellow-500/40';
      case 'low': return 'bg-gradient-to-r from-green-600 to-green-800 text-white border-green-400 shadow-green-500/40';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-800 text-white border-gray-400 shadow-gray-500/40';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <Target className="h-3 w-3" />;
      case 'low': return <CheckCircle2 className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date();
  const completedTasks = task.checklist?.filter(item => item.includes('✓')).length || 0;
  const totalTasks = task.checklist?.length || 0;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(task);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="transform transition-all duration-300 hover:z-10">
      <Card className="mb-4 bg-gradient-to-br from-white via-gray-50 to-red-50 border-2 border-red-200 shadow-xl hover:shadow-2xl hover:shadow-red-500/30 hover:border-red-400 transition-all duration-300 group hover:scale-[1.02] hover:-translate-y-2 backdrop-blur-sm">
        <CardContent className="p-4 relative">
          <button 
            {...listeners} 
            {...attributes}
            className="absolute top-3 right-3 p-2 text-red-500 hover:text-red-700 cursor-grab active:cursor-grabbing transition-all duration-200 bg-white/90 rounded-full shadow-lg hover:shadow-red-300/50 hover:bg-red-50 group-hover:scale-110 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          
          <div className="pr-12">
            {/* Title and Priority */}
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg line-clamp-2 text-red-800 group-hover:text-red-900 transition-colors">
                  {task.title}
                </h3>
              </div>
            </div>

            {/* Priority Badge */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge 
                variant="outline" 
                className={`${getPriorityColor(task.priority)} text-xs font-bold shadow-lg border-2 transition-all duration-300 hover:scale-105`}
              >
                {getPriorityIcon(task.priority)}
                <span className="ml-1">{getPriorityLabel(task.priority)}</span>
              </Badge>
              {isOverdue && (
                <Badge 
                  variant="outline" 
                  className="bg-gradient-to-r from-red-600 to-red-800 text-white border-red-400 text-xs font-bold shadow-lg"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Atrasado
                </Badge>
              )}
            </div>
            
            <div className="space-y-3">
              {/* Description */}
              {task.description && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-2 rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-700 line-clamp-2">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Responsible */}
              {task.responsible && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-3 w-3 text-red-500 flex-shrink-0" />
                  <span className="text-gray-600 text-xs line-clamp-1">
                    <strong className="text-red-600">Responsável:</strong> {task.responsible}
                  </span>
                </div>
              )}

              {/* Deadline */}
              {task.deadline && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3 text-red-500 flex-shrink-0" />
                  <span className={`text-xs ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                    <strong className="text-red-600">Prazo:</strong> {new Date(task.deadline).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}

              {/* Checklist Progress */}
              {totalTasks > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-bold text-blue-700">Progresso</span>
                    </div>
                    <span className="text-xs font-bold text-blue-700">{completedTasks}/{totalTasks}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-blue-200 rounded-full h-2 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-700 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-blue-600 mt-1">
                    {progressPercentage.toFixed(0)}% concluído
                  </div>
                </div>
              )}

              {/* Date and Edit Button */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-red-100">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(task.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-red-100 to-red-200 px-2 py-1 rounded-full border border-red-300">
                    <span className="font-medium text-red-700 text-xs">{task.status.split(' / ')[0]}</span>
                  </div>
                  {onEdit && (
                    <Button
                      onClick={handleEdit}
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500 p-1 h-6 w-6"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventTaskCard;
