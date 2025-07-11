
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Lightbulb, User, Target, Tag, Calendar } from 'lucide-react';
import { ContentIdea } from '@/types/contentIdea';
import { Persona } from '@/types/persona';

interface ContentIdeaCardProps {
  idea: ContentIdea;
  personas: Persona[];
  onEdit: (idea: ContentIdea) => void;
}

const ContentIdeaCard = ({ idea, personas, onEdit }: ContentIdeaCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ideia': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Planejado': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Em Produção': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Em Revisão': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Publicado': return 'bg-green-100 text-green-700 border-green-300';
      case 'Arquivado': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'Blog Post': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'eBook': return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'Webinar/Live': return 'bg-pink-100 text-pink-700 border-pink-300';
      case 'Vídeo Curto': return 'bg-teal-100 text-teal-700 border-teal-300';
      case 'Post de Redes Sociais': return 'bg-cyan-100 text-cyan-700 border-cyan-300';
      case 'Infográfico': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Estudo de Caso': return 'bg-amber-100 text-amber-700 border-amber-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
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

  const getFocusPersonas = () => {
    return idea.focusPersonas
      .map(personaId => personas.find(p => p.id === personaId)?.name)
      .filter(Boolean)
      .join(', ') || 'Nenhuma persona definida';
  };

  return (
    <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl hover:shadow-red-glow transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
      <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg border-b border-red-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-2 rounded-full">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-red-600 font-bold text-lg line-clamp-2">
                {idea.theme}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge className={`${getStatusColor(idea.status)} border`}>
                  {idea.status}
                </Badge>
                <Badge className={`${getFormatColor(idea.format)} border`}>
                  {idea.format}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(idea)}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className={`bg-gradient-to-r ${getStageColor(idea.purchaseStage)} p-1.5 rounded-full`}>
              <Target className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-gray-800">{idea.purchaseStage}</span>
          </div>

          {idea.focusKeyword && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-red-500" />
              <span className="text-sm text-gray-700">
                <strong>Keyword:</strong> {idea.focusKeyword}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-700">
              <strong>Personas:</strong> {getFocusPersonas()}
            </span>
          </div>

          {idea.personaRelevance && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-lg border border-red-200">
              <p className="text-sm text-gray-700">
                <strong className="text-red-600">Relevância:</strong> {idea.personaRelevance}
              </p>
            </div>
          )}

          {idea.notes && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 line-clamp-3">
                <strong>Observações:</strong> {idea.notes}
              </p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-red-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Criado em: {new Date(idea.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
          {idea.ideaCreator && (
            <span>Por: {idea.ideaCreator}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentIdeaCard;
