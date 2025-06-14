
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentIdea } from '@/types/contentIdea';
import ContentKanbanCard from './ContentKanbanCard';

interface ContentKanbanColumnProps {
  id: string;
  title: string;
  ideas: ContentIdea[];
}

const ContentKanbanColumn = ({ id, title, ideas }: ContentKanbanColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="w-[320px] flex-shrink-0">
      <Card className="h-full bg-gradient-to-b from-red-950 via-red-900 to-black border-t-4 border-red-500 rounded-xl shadow-2xl shadow-red-500/30 backdrop-blur-sm hover:shadow-red-500/40 transition-all duration-300">
        <CardHeader className="p-4 border-b border-red-600/50 bg-gradient-to-r from-red-700 via-red-600 to-red-800 rounded-t-lg">
          <CardTitle className="text-white font-black flex justify-between items-center text-lg tracking-wider">
            <span className="text-white drop-shadow-lg filter brightness-110">{title}</span>
            <span className="text-base font-bold text-white bg-gradient-to-r from-red-500 to-red-600 px-3 py-1 rounded-full shadow-lg border border-red-400/30 backdrop-blur-sm">
              {ideas.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent ref={setNodeRef} className="p-2 sm:p-4 h-[calc(100vh-280px)] overflow-y-auto bg-gradient-to-b from-black/95 via-red-950/30 to-black/95 scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-black/50">
          <SortableContext id={id} items={ideas} strategy={verticalListSortingStrategy}>
            {ideas.length > 0 ? (
              ideas.map(idea => <ContentKanbanCard key={idea.id} idea={idea} />)
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300 min-h-[200px]">
                <div className="text-center">
                  <div className="mb-4 p-6 rounded-xl bg-gradient-to-br from-red-900/40 via-red-800/30 to-black/60 border border-red-700/50 shadow-xl backdrop-blur-sm">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">💡</span>
                    </div>
                    <p className="text-sm italic text-center text-red-200 font-medium">
                      Arraste as ideias para esta coluna
                    </p>
                    <p className="text-xs text-red-300/70 mt-2">
                      ou crie novos cards na aba "Ideias"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentKanbanColumn;
