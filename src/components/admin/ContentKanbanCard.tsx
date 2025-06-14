
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, User, Target, Tag, Calendar, Lightbulb } from 'lucide-react';
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
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    boxShadow: isDragging ? '0 25px 50px -12px rgba(239, 68, 68, 0.8)' : 'none',
    transform: isDragging
      ? `${CSS.Transform.toString(transform)} scale(1.05) rotate(2deg)`
      : CSS.Transform.toString(transform),
  };

  const getFormatColor = (format: string) => {
    const colors: { [key: string]: string } = {
      'Blog Post': 'bg-gradient-to-r from-purple-600 to-purple-800 text-white border-purple-400 shadow-purple-500/40',
      'eBook': 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-white border-indigo-400 shadow-indigo-500/40',
      'Webinar/Live': 'bg-gradient-to-r from-pink-600 to-pink-800 text-white border-pink-400 shadow-pink-500/40',
      'Vídeo Curto': 'bg-gradient-to-r from-teal-600 to-teal-800 text-white border-teal-400 shadow-teal-500/40',
      'Post de Redes Sociais': 'bg-gradient-to-r from-cyan-600 to-cyan-800 text-white border-cyan-400 shadow-cyan-500/40',
      'Infográfico': 'bg-gradient-to-r from-emerald-600 to-emerald-800 text-white border-emerald-400 shadow-emerald-500/40',
      'Estudo de Caso': 'bg-gradient-to-r from-amber-600 to-amber-800 text-white border-amber-400 shadow-amber-500/40',
      'Outro': 'bg-gradient-to-r from-slate-600 to-slate-800 text-white border-slate-400 shadow-slate-500/40',
    };
    return colors[format] || colors['Outro'];
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Aprendizado e Descoberta': return 'from-blue-500 to-blue-700';
      case 'Reconhecimento do Problema': return 'from-yellow-500 to-yellow-700';
      case 'Consideração da Solução': return 'from-green-500 to-green-700';
      case 'Decisão de Compra': return 'from-purple-500 to-purple-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ideia': return '💡';
      case 'Planejado': return '📋';
      case 'Em Produção': return '✍️';
      case 'Em Revisão': return '👀';
      case 'Fazendo Imagens/Gráficos': return '🎨';
      case 'Conteúdo Agendado': return '📅';
      case 'Publicado': return '✅';
      case 'Promover/Distribuir': return '📢';
      default: return '💭';
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="transform transition-all duration-300 hover:z-10">
      <Card
        {...attributes}
        className="mb-4 bg-gradient-to-br from-white via-red-50 to-red-100 border-2 border-red-300 shadow-xl hover:shadow-2xl hover:shadow-red-500/50 hover:border-red-500 transition-all duration-300 group hover:scale-[1.02] hover:-translate-y-2 cursor-pointer backdrop-blur-sm"
      >
        <CardContent className="p-4 relative">
          <button 
            {...listeners} 
            className="absolute top-3 right-3 p-2 text-red-500 hover:text-red-700 cursor-grab active:cursor-grabbing transition-all duration-200 bg-white/90 rounded-full shadow-lg hover:shadow-red-300/50 hover:bg-red-50 group-hover:scale-110 z-10"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          
          <div className="pr-12">
            {/* Status Icon and Title */}
            <div className="flex items-start gap-3 mb-3">
              <div className="text-2xl mt-1 opacity-80">
                {getStatusIcon(idea.status)}
              </div>
              <h3 className="font-bold text-lg line-clamp-2 text-red-800 group-hover:text-red-900 transition-colors flex-1">
                {idea.theme}
              </h3>
            </div>
            
            <div className="space-y-3">
              {/* Format and Status Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline" 
                  className={`${getFormatColor(idea.format)} text-xs font-bold shadow-lg border-2 transition-all duration-300 hover:scale-105`}
                >
                  {idea.format}
                </Badge>
              </div>

              {/* Purchase Stage */}
              <div className="flex items-center gap-2 text-sm">
                <div className={`bg-gradient-to-r ${getStageColor(idea.purchaseStage)} p-1.5 rounded-full shadow-lg`}>
                  <Target className="h-3 w-3 text-white" />
                </div>
                <span className="text-gray-700 font-medium text-xs line-clamp-1">{idea.purchaseStage}</span>
              </div>

              {/* Focus Keyword */}
              {idea.focusKeyword && (
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-3 w-3 text-red-500 flex-shrink-0" />
                  <span className="text-gray-600 text-xs line-clamp-1">
                    <strong className="text-red-600">Keyword:</strong> {idea.focusKeyword}
                  </span>
                </div>
              )}

              {/* Creator */}
              {idea.ideaCreator && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-3 w-3 text-red-500 flex-shrink-0" />
                  <span className="text-gray-600 text-xs line-clamp-1">
                    <strong className="text-red-600">Por:</strong> {idea.ideaCreator}
                  </span>
                </div>
              )}

              {/* Personas */}
              {idea.focusPersonas && idea.focusPersonas.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded-lg border border-blue-200 shadow-sm">
                  <p className="text-xs text-gray-700 line-clamp-1">
                    <strong className="text-blue-600">Personas:</strong> {idea.focusPersonas.join(', ')}
                  </p>
                </div>
              )}

              {/* Relevance - shortened for Kanban */}
              {idea.personaRelevance && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 p-2 rounded-lg border border-red-200 shadow-sm">
                  <p className="text-xs text-gray-700 line-clamp-2">
                    <strong className="text-red-600">Relevância:</strong> {idea.personaRelevance}
                  </p>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-red-100">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(idea.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="bg-gradient-to-r from-red-100 to-red-200 px-2 py-1 rounded-full border border-red-300">
                  <span className="font-medium text-red-700">{idea.status}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentKanbanCard;
