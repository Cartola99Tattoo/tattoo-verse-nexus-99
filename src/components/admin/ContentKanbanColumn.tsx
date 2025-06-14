
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
    <div className="w-[300px] flex-shrink-0">
      <Card className="h-full bg-black/80 border-t-4 border-red-600 rounded-lg shadow-2xl backdrop-blur-sm">
        <CardHeader className="p-4 border-b border-white/10">
          <CardTitle className="text-white font-bold flex justify-between items-center text-base">
            <span>{title}</span>
            <span className="text-sm font-normal text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">{ideas.length}</span>
          </CardTitle>
        </CardHeader>
        <CardContent ref={setNodeRef} className="p-4 h-[calc(100vh-280px)] overflow-y-auto">
          <SortableContext id={id} items={ideas} strategy={verticalListSortingStrategy}>
            {ideas.length > 0 ? (
              ideas.map(idea => <ContentKanbanCard key={idea.id} idea={idea} />)
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p className="text-sm">Arraste as ideias aqui</p>
              </div>
            )}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentKanbanColumn;
