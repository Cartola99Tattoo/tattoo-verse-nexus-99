
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
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  const getFormatColor = (format: string) => {
    const colors: { [key: string]: string } = {
      'Blog Post': 'bg-purple-600/20 text-purple-300 border-purple-500/30',
      'eBook': 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30',
      'Webinar/Live': 'bg-pink-600/20 text-pink-300 border-pink-500/30',
      'Vídeo Curto': 'bg-teal-600/20 text-teal-300 border-teal-500/30',
      'Post de Redes Sociais': 'bg-cyan-600/20 text-cyan-300 border-cyan-500/30',
      'Infográfico': 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30',
      'Estudo de Caso': 'bg-amber-600/20 text-amber-300 border-amber-500/30',
      'Outro': 'bg-slate-600/20 text-slate-300 border-slate-500/30',
    };
    return colors[format] || colors['Outro'];
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        {...attributes}
        className="mb-4 bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-red-800/50 shadow-lg hover:shadow-red-500/20 hover:border-red-700 transition-all duration-300 group"
      >
        <CardContent className="p-3 text-white relative">
          <button {...listeners} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white cursor-grab active:cursor-grabbing">
            <GripVertical className="h-5 w-5" />
          </button>
          <p className="font-bold text-base mb-2 pr-8 line-clamp-2">{idea.theme}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={`${getFormatColor(idea.format)} text-xs`}>
              {idea.format}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentKanbanCard;
