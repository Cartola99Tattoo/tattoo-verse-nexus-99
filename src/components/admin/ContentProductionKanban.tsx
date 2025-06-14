
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { ContentIdea } from '@/types/contentIdea';
import KanbanGuideColumn from './KanbanGuideColumn';
import ContentKanbanColumn from './ContentKanbanColumn';
import ContentKanbanCard from './ContentKanbanCard';

interface ContentProductionKanbanProps {
  ideas: ContentIdea[];
}

const KANBAN_COLUMNS = [
  "Ideias de Artigos",
  "Pesquisando",
  "Escrevendo",
  "Editando",
  "Fazendo Imagens/Gráficos",
  "Conteúdo Agendado",
  "Conteúdo Publicado",
  "Promover/Distribuir",
];

type IdeaColumns = {
  [key: string]: ContentIdea[];
};

const ContentProductionKanban = ({ ideas: initialIdeas }: ContentProductionKanbanProps) => {
  const [columns, setColumns] = useState<IdeaColumns>({});
  const [activeIdea, setActiveIdea] = useState<ContentIdea | null>(null);

  useEffect(() => {
    const statusToColumnMap: { [key: string]: string } = {
      'Ideia': 'Ideias de Artigos',
      'Planejado': 'Pesquisando',
      'Em Produção': 'Escrevendo',
      'Em Revisão': 'Editando',
      'Publicado': 'Conteúdo Publicado',
    };

    const initialColumns: IdeaColumns = KANBAN_COLUMNS.reduce((acc, col) => ({ ...acc, [col]: [] }), {});

    initialIdeas.forEach(idea => {
      const columnName = statusToColumnMap[idea.status] || 'Ideias de Artigos';
      if (initialColumns[columnName]) {
        initialColumns[columnName].push(idea);
      } else {
        initialColumns['Ideias de Artigos'].push(idea);
      }
    });

    setColumns(initialColumns);
  }, [initialIdeas]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumn = (ideaId: string) => {
    if (!ideaId) return null;
    const columnName = Object.keys(columns).find(key => columns[key].some(i => i.id === ideaId));
    return columnName || null;
  };
  
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const idea = initialIdeas.find(i => i.id === active.id);
    setActiveIdea(idea || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveIdea(null);

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId) || (KANBAN_COLUMNS.includes(overId) ? overId : null);

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      // Handle reordering within the same column
      if (activeColumn && activeId !== overId) {
        setColumns(prev => {
          const newColumns = { ...prev };
          const ideasInColumn = newColumns[activeColumn];
          const oldIndex = ideasInColumn.findIndex(i => i.id === activeId);
          const newIndex = ideasInColumn.findIndex(i => i.id === overId);
          newColumns[activeColumn] = arrayMove(ideasInColumn, oldIndex, newIndex);
          return newColumns;
        });
      }
      return;
    }

    // Handle moving to a different column
    setColumns(prev => {
      const activeItems = [...prev[activeColumn]];
      const overItems = [...prev[overColumn]];

      const activeIndex = activeItems.findIndex(i => i.id === activeId);
      const [movedItem] = activeItems.splice(activeIndex, 1);
      
      const overIndex = overItems.findIndex(i => i.id === overId);
      
      // If dropping on an item, insert before it. Otherwise, at the end.
      const newIndex = overIndex >= 0 ? overIndex : overItems.length;
      overItems.splice(newIndex, 0, movedItem);

      return {
        ...prev,
        [activeColumn]: activeItems,
        [overColumn]: overItems,
      };
    });
  };

  return (
    <div className="flex gap-6 p-1">
      <KanbanGuideColumn />
      <div className="flex-1 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6">
            {KANBAN_COLUMNS.map(columnName => (
              <ContentKanbanColumn
                key={columnName}
                id={columnName}
                title={columnName}
                ideas={columns[columnName] || []}
              />
            ))}
          </div>
          <DragOverlay>
            {activeIdea ? <ContentKanbanCard idea={activeIdea} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default ContentProductionKanban;
