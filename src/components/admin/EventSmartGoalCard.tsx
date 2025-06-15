
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, User, Target, GripVertical } from 'lucide-react';

interface EventSmartGoal {
  id: string;
  title: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  deadline?: string;
  responsible?: string;
  progress: number;
  eventId?: string;
  projectId?: string;
  created_at: string;
  updated_at: string;
}

interface EventSmartGoalCardProps {
  smartGoal: EventSmartGoal;
  onEdit?: (goal: EventSmartGoal) => void;
}

const EventSmartGoalCard = ({ smartGoal, onEdit }: EventSmartGoalCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: smartGoal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onEdit) {
      onEdit(smartGoal);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 
        shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
        hover:scale-105 hover:border-purple-400 group
        ${isDragging ? 'opacity-50 rotate-3 scale-110' : ''}
      `}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-600" />
              <h4 className="font-bold text-purple-800 text-sm line-clamp-2 group-hover:text-purple-900">
                {smartGoal.title}
              </h4>
            </div>
            
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-purple-700">Progresso</span>
                <span className="text-xs font-bold text-purple-600">{smartGoal.progress}%</span>
              </div>
              <Progress 
                value={smartGoal.progress} 
                className="h-2 bg-purple-100" 
              />
            </div>
          </div>
          
          <div
            {...attributes}
            {...listeners}
            className="text-purple-400 hover:text-purple-600 cursor-grab active:cursor-grabbing p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Specific Goal Preview */}
        {smartGoal.specific && (
          <p className="text-xs text-purple-600 mb-3 line-clamp-2 bg-purple-50 p-2 rounded border border-purple-200">
            <strong>Específica:</strong> {smartGoal.specific}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-purple-600">
          <div className="flex items-center gap-1">
            {smartGoal.responsible && (
              <>
                <User className="h-3 w-3" />
                <span className="truncate max-w-[80px]">{smartGoal.responsible}</span>
              </>
            )}
          </div>
          
          {smartGoal.deadline && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(smartGoal.deadline).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>

        {/* SMART Badge */}
        <div className="mt-3 flex justify-center">
          <Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs font-bold">
            META SMART
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventSmartGoalCard;
