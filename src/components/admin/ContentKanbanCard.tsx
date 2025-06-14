
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, User, Target, Tag, Calendar, PenTool, CheckCircle2, Sparkles } from 'lucide-react';
import { ContentIdea } from '@/types/contentIdea';
import { Persona } from '@/types/persona';
import ContentIdeaDetailModal from './ContentIdeaDetailModal';

interface ContentKanbanCardProps {
  idea: ContentIdea;
  personas?: Persona[];
  onUpdate?: (idea: ContentIdea, data: any) => void;
  onTransformToArticle?: (idea: ContentIdea) => void;
}

const ContentKanbanCard = ({ idea, personas = [], onUpdate, onTransformToArticle }: ContentKanbanCardProps) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  
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

  const hasDraftContent = idea.draftTitle || idea.draftSummary || idea.draftContent;
  const draftCompleteness = [idea.draftTitle, idea.draftSummary, idea.draftContent].filter(Boolean).length;
  const isDraftWellDeveloped = draftCompleteness >= 2;

  return (
    <>
      <div ref={setNodeRef} style={style} className="transform transition-all duration-300 hover:z-10">
        <Card
          {...attributes}
          className="mb-4 bg-gradient-to-br from-white via-gray-50 to-red-50 border-2 border-red-200 shadow-xl hover:shadow-2xl hover:shadow-red-500/30 hover:border-red-400 transition-all duration-300 group hover:scale-[1.02] hover:-translate-y-2 cursor-pointer backdrop-blur-sm"
          onClick={() => setShowDetailModal(true)}
        >
          <CardContent className="p-4 relative">
            <button 
              {...listeners} 
              className="absolute top-3 right-3 p-2 text-red-500 hover:text-red-700 cursor-grab active:cursor-grabbing transition-all duration-200 bg-white/90 rounded-full shadow-lg hover:shadow-red-300/50 hover:bg-red-50 group-hover:scale-110 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            
            <div className="pr-12">
              {/* Status Icon and Title */}
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl mt-1 opacity-80">
                  {getStatusIcon(idea.status)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg line-clamp-2 text-red-800 group-hover:text-red-900 transition-colors">
                    {idea.theme}
                  </h3>
                  
                  {/* INDICADOR DE RASCUNHO MELHORADO E MAIS VISUAL */}
                  {hasDraftContent && (
                    <div className="mt-3 space-y-2">
                      {/* Barra de Progresso Visual */}
                      <div className="bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-lg border-2 border-green-300 shadow-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <PenTool className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-bold text-green-700">Rascunho Desenvolvido</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-green-700">{draftCompleteness}/3</span>
                            {isDraftWellDeveloped && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                          </div>
                        </div>
                        
                        {/* Barra de progresso visual */}
                        <div className="w-full bg-green-200 rounded-full h-2 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-700 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(draftCompleteness / 3) * 100}%` }}
                          />
                        </div>
                        
                        {/* Indicadores específicos */}
                        <div className="flex gap-1 mt-2">
                          {[
                            { field: idea.draftTitle, label: 'T', tooltip: 'Título' },
                            { field: idea.draftSummary, label: 'R', tooltip: 'Resumo' },
                            { field: idea.draftContent, label: 'C', tooltip: 'Conteúdo' }
                          ].map((item, i) => (
                            <div
                              key={i}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                                item.field 
                                  ? 'bg-green-600 text-white shadow-lg' 
                                  : 'bg-green-300 text-green-600'
                              }`}
                              title={item.tooltip}
                            >
                              {item.label}
                            </div>
                          ))}
                        </div>
                        
                        {/* Indicador de "Pronto para Transformar" */}
                        {isDraftWellDeveloped && (
                          <div className="flex items-center gap-2 mt-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                            <Sparkles className="h-3 w-3" />
                            <span>Pronto para Artigo!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
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

      {/* Modal de Detalhes */}
      {showDetailModal && onUpdate && onTransformToArticle && (
        <ContentIdeaDetailModal
          idea={idea}
          personas={personas}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onUpdate={onUpdate}
          onTransformToArticle={onTransformToArticle}
        />
      )}
    </>
  );
};

export default ContentKanbanCard;
