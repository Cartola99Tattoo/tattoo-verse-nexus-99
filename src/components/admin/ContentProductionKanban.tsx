import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { ContentIdea } from '@/types/contentIdea';
import KanbanGuideColumn from './KanbanGuideColumn';
import ContentKanbanColumn from './ContentKanbanColumn';
import ContentKanbanCard from './ContentKanbanCard';

interface ContentProductionKanbanProps {
  ideas: ContentIdea[];
  onIdeaStatusUpdate: (ideaId: string, newStatus: ContentIdea['status']) => void;
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

const ContentProductionKanban = ({ ideas: initialIdeas, onIdeaStatusUpdate }: ContentProductionKanbanProps) => {
  const [columns, setColumns] = useState<IdeaColumns>({});
  const [activeIdea, setActiveIdea] = useState<ContentIdea | null>(null);

  useEffect(() => {
    const statusToColumnMap: { [key: string]: string } = {
      'Ideia': 'Ideias de Artigos',
      'Planejado': 'Pesquisando',
      'Em Produção': 'Escrevendo',
      'Em Revisão': 'Editando',
      'Fazendo Imagens/Gráficos': 'Fazendo Imagens/Gráficos',
      'Conteúdo Agendado': 'Conteúdo Agendado',
      'Publicado': 'Conteúdo Publicado',
      'Promover/Distribuir': 'Promover/Distribuir',
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

    // Sort ideas within columns by update time to keep order consistent
    for (const col in initialColumns) {
      initialColumns[col].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }

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

    if (!activeColumn || !overColumn) {
      return;
    }

    // Handle reordering within the same column
    if (activeColumn === overColumn) {
      if (activeId !== overId) {
        setColumns(prev => {
          const newColumns = { ...prev };
          const ideasInColumn = newColumns[activeColumn];
          const oldIndex = ideasInColumn.findIndex(i => i.id === activeId);
          const newIndex = ideasInColumn.findIndex(i => i.id === overId);
          if (oldIndex !== -1 && newIndex !== -1) {
            newColumns[activeColumn] = arrayMove(ideasInColumn, oldIndex, newIndex);
          }
          return newColumns;
        });
      }
      return;
    }

    // Handle moving to a different column
    const columnToStatusMap: { [key: string]: ContentIdea['status'] | undefined } = {
        'Ideias de Artigos': 'Ideia',
        'Pesquisando': 'Planejado',
        'Escrevendo': 'Em Produção',
        'Editando': 'Em Revisão',
        'Fazendo Imagens/Gráficos': 'Fazendo Imagens/Gráficos',
        'Conteúdo Agendado': 'Conteúdo Agendado',
        'Conteúdo Publicado': 'Publicado',
        'Promover/Distribuir': 'Promover/Distribuir',
    };
    
    const newStatus = columnToStatusMap[overColumn];
    if (newStatus) {
      onIdeaStatusUpdate(activeId, newStatus);
    }
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
