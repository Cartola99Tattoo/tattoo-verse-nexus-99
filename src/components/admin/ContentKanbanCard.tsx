
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical } from 'lucide-react';
import { ContentIdea } from '@/types/contentIdea';

interface ContentKanbanCardProps {
  idea: ContentIdea;
}

const ContentKanbanCard = ({ idea }: ContentKanbanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: idea.id });

  const style = {
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 100 : 'auto',
    boxShadow: isDragging ? '0 25px 50px -12px rgba(239, 68, 68, 0.5)' : 'none',
    transform: isDragging
      ? `${CSS.Transform.toString(transform)} scale(1.05) rotate(2deg)`
      : CSS.Transform.toString(transform),
  };

  const getFormatColor = (format: string) => {
    const colors: { [key: string]: string } = {
      'Blog Post': 'bg-gradient-to-r from-purple-600 to-purple-800 text-white border-purple-400',
      'eBook': 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-white border-indigo-400',
      'Webinar/Live': 'bg-gradient-to-r from-pink-600 to-pink-800 text-white border-pink-400',
      'Vídeo Curto': 'bg-gradient-to-r from-teal-600 to-teal-800 text-white border-teal-400',
      'Post de Redes Sociais': 'bg-gradient-to-r from-cyan-600 to-cyan-800 text-white border-cyan-400',
      'Infográfico': 'bg-gradient-to-r from-emerald-600 to-emerald-800 text-white border-emerald-400',
      'Estudo de Caso': 'bg-gradient-to-r from-amber-600 to-amber-800 text-white border-amber-400',
      'Outro': 'bg-gradient-to-r from-slate-600 to-slate-800 text-white border-slate-400',
    };
    return colors[format] || colors['Outro'];
  };

  return (
    <div ref={setNodeRef} style={style} className="transform transition-all duration-300">
      <Card
        {...attributes}
        className="mb-4 bg-gradient-to-br from-red-50 via-white to-red-100 border-2 border-red-300 shadow-xl hover:shadow-red-500/30 hover:border-red-500 transition-all duration-300 group hover:scale-[1.03] hover:-translate-y-2 cursor-pointer"
      >
        <CardContent className="p-4 relative">
          <button 
            {...listeners} 
            className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-600 cursor-grab active:cursor-grabbing transition-colors duration-200 bg-white/80 rounded-full shadow-lg hover:shadow-red-300/50"
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <p className="font-bold text-lg mb-3 pr-10 line-clamp-2 text-red-800 group-hover:text-red-900 transition-colors">
            {idea.theme}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="outline" 
              className={`${getFormatColor(idea.format)} text-xs font-bold shadow-lg border-2 transition-all duration-300 hover:scale-105`}
            >
              {idea.format}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentKanbanCard;
