
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { ContentIdea } from '@/types/contentIdea';
import ContentKanbanCard from './ContentKanbanCard';
import { Persona } from '@/types/persona';

interface ContentKanbanColumnProps {
  id: string;
  title: string;
  ideas: ContentIdea[];
  onQuickAdd: () => void;
}

const ContentKanbanColumn = ({ id, title, ideas, onQuickAdd }: ContentKanbanColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  const getColumnColor = (columnTitle: string) => {
    switch (columnTitle) {
      case 'Ideias de Artigos': return 'from-gray-600 to-gray-800';
      case 'Pesquisando': return 'from-blue-600 to-blue-800';
      case 'Escrevendo': return 'from-yellow-600 to-yellow-800';
      case 'Editando': return 'from-orange-600 to-orange-800';
      case 'Fazendo Imagens/Gráficos': return 'from-purple-600 to-purple-800';
      case 'Conteúdo Agendado': return 'from-indigo-600 to-indigo-800';
      case 'Conteúdo Publicado': return 'from-green-600 to-green-800';
      case 'Promover/Distribuir': return 'from-red-600 to-red-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="min-w-[350px] max-w-[350px]">
      <Card 
        ref={setNodeRef}
        className="h-full bg-white border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        <CardHeader className={`bg-gradient-to-r ${getColumnColor(title)} text-white p-4 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-black text-white">
              {title}
            </CardTitle>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 font-bold">
              {ideas.length}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 bg-white min-h-[600px] flex flex-col gap-4">
          {/* Botão de Adicionar */}
          <Button
            onClick={onQuickAdd}
            variant="outline"
            className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500 font-bold transition-all duration-300 bg-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Card
          </Button>

          {/* Lista de Cards */}
          <div className="flex-1">
            <SortableContext items={ideas.map(idea => idea.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {ideas.map(idea => (
                  <ContentKanbanCard
                    key={idea.id}
                    idea={idea}
                    personas={[]} // Will be passed from parent when needed
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentKanbanColumn;
