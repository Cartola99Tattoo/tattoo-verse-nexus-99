
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
      <Card className="h-full bg-gradient-to-b from-red-900 via-red-800 to-black border-t-4 border-red-500 rounded-xl shadow-2xl shadow-red-500/20 backdrop-blur-sm">
        <CardHeader className="p-4 border-b border-red-600/50 bg-gradient-to-r from-red-600 to-red-700">
          <CardTitle className="text-white font-black flex justify-between items-center text-lg tracking-wider">
            <span className="text-white drop-shadow-lg">{title}</span>
            <span className="text-base font-bold text-white bg-red-500/50 px-3 py-1 rounded-full shadow-lg border border-red-400/30">
              {ideas.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent ref={setNodeRef} className="p-2 sm:p-4 h-[calc(100vh-280px)] overflow-y-auto bg-gradient-to-b from-black/90 to-red-900/20">
          <SortableContext id={id} items={ideas} strategy={verticalListSortingStrategy}>
            {ideas.length > 0 ? (
              ideas.map(idea => <ContentKanbanCard key={idea.id} idea={idea} />)
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300">
                <p className="text-sm italic text-center bg-red-900/30 p-4 rounded-lg border border-red-700/50 shadow-lg">
                  Arraste as ideias para esta coluna
                </p>
              </div>
            )}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentKanbanColumn;
