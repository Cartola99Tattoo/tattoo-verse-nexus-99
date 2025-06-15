
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Plus, Lightbulb, ArrowRight } from 'lucide-react';
import { ContentIdea, CreateContentIdeaData } from '@/types/contentIdea';
import { Persona } from '@/types/persona';
import KanbanGuideColumn from './KanbanGuideColumn';
import ContentKanbanColumn from './ContentKanbanColumn';
import ContentKanbanCard from './ContentKanbanCard';
import ContentIdeaForm from './ContentIdeaForm';
import BlogPostForm from './BlogPostForm';
import { BlogCategory } from '@/services/interfaces/IBlogService';

interface ContentProductionKanbanProps {
  ideas: ContentIdea[];
  personas: Persona[];
  categories?: BlogCategory[];
  onIdeaStatusUpdate: (ideaId: string, newStatus: ContentIdea['status']) => void;
  onIdeaCreate: (data: CreateContentIdeaData) => void;
  onIdeaUpdate: (idea: ContentIdea, data: CreateContentIdeaData) => void;
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

const ContentProductionKanban = ({ 
  ideas: initialIdeas, 
  personas,
  categories = [],
  onIdeaStatusUpdate, 
  onIdeaCreate,
  onIdeaUpdate 
}: ContentProductionKanbanProps) => {
  const [columns, setColumns] = useState<IdeaColumns>({});
  const [activeIdea, setActiveIdea] = useState<ContentIdea | null>(null);
  const [showQuickAddForm, setShowQuickAddForm] = useState(false);
  const [targetColumn, setTargetColumn] = useState<string>('Ideias de Artigos');
  const [transformingIdea, setTransformingIdea] = useState<ContentIdea | null>(null);

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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
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

  const handleQuickAdd = (columnName: string) => {
    setTargetColumn(columnName);
    setShowQuickAddForm(true);
  };

  const handleQuickSave = (data: CreateContentIdeaData) => {
    const columnToStatusMap: { [key: string]: ContentIdea['status'] } = {
      'Ideias de Artigos': 'Ideia',
      'Pesquisando': 'Planejado',
      'Escrevendo': 'Em Produção',
      'Editando': 'Em Revisão',
      'Fazendo Imagens/Gráficos': 'Fazendo Imagens/Gráficos',
      'Conteúdo Agendado': 'Conteúdo Agendado',
      'Conteúdo Publicado': 'Publicado',
      'Promover/Distribuir': 'Promover/Distribuir',
    };

    const ideaData = {
      ...data,
      status: columnToStatusMap[targetColumn] || 'Ideia'
    };

    onIdeaCreate(ideaData);
    setShowQuickAddForm(false);
  };

  const handleTransformToArticle = (idea: ContentIdea) => {
    console.log('Transformando em artigo:', idea);
    setTransformingIdea(idea);
  };

  const handleArticleSaved = () => {
    console.log('Artigo salvo, voltando ao Kanban');
    setTransformingIdea(null);
    // Optionally update the idea status to 'Publicado'
    if (transformingIdea) {
      onIdeaStatusUpdate(transformingIdea.id, 'Publicado');
    }
  };

  // Se estiver transformando uma ideia em artigo, mostrar o formulário de artigo
  if (transformingIdea) {
    return (
      <div className="bg-gradient-to-br from-white to-red-50 min-h-screen">
        <BlogPostForm
          categories={categories}
          personas={personas}
          initialData={{
            title: transformingIdea.draftTitles?.[0] || transformingIdea.theme,
            titles: transformingIdea.draftTitles,
            excerpt: transformingIdea.draftSummary,
            content: transformingIdea.draftContent,
            focusPersonas: transformingIdea.focusPersonas,
            purchaseStage: transformingIdea.purchaseStage,
            seoKeywords: transformingIdea.seoKeywords,
            provisionalSlug: transformingIdea.provisionalSlug,
            suggestedAuthor: transformingIdea.suggestedAuthor,
            featuredImageUrl: transformingIdea.featuredImageUrl,
            internalLinks: transformingIdea.internalLinks,
            suggestedCTA: transformingIdea.suggestedCTA
          }}
          onSave={handleArticleSaved}
          onCancel={() => setTransformingIdea(null)}
        />
      </div>
    );
  }

  if (showQuickAddForm) {
    return (
      <div className="bg-gradient-to-br from-white to-red-50 min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowQuickAddForm(false)}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500"
            >
              ← Voltar ao Kanban
            </Button>
          </div>
          <ContentIdeaForm
            personas={personas}
            onSave={handleQuickSave}
            onCancel={() => setShowQuickAddForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-red-50 min-h-screen p-1 relative overflow-hidden">
      {/* Background pattern for 99Tattoo identity */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 via-transparent to-red-900/5 opacity-90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent"></div>
      
      {/* Header com Botões Posicionados à Esquerda */}
      <div className="relative mb-6 px-4">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          {/* Título */}
          <h2 className="text-3xl font-black text-red-800 drop-shadow-lg">
            Kanban de Produção de Conteúdo
          </h2>
          
          {/* Guia de Uso */}
          <div className="bg-gradient-to-r from-red-100 to-red-200 px-4 py-2 rounded-lg border border-red-300 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">
              Crie rascunhos completos e transforme em artigos
            </span>
            <ArrowRight className="h-4 w-4 text-red-600 animate-pulse" />
          </div>
        </div>
        
        {/* Botões de Ação Principais - POSICIONADOS À ESQUERDA */}
        <div className="flex flex-wrap gap-4 mt-6">
          <Button
            onClick={() => handleQuickAdd('Ideias de Artigos')}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold shadow-2xl shadow-red-500/30 border border-red-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Card de Conteúdo
          </Button>
        </div>
      </div>
      
      <div className="relative flex gap-6 overflow-x-auto pb-4 min-h-screen">
        {/* Guide Column - Always first */}
        <KanbanGuideColumn />
        
        {/* Main Kanban Area */}
        <div className="flex-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 pb-4">
              {KANBAN_COLUMNS.map(columnName => (
                <ContentKanbanColumn
                  key={columnName}
                  id={columnName}
                  title={columnName}
                  ideas={columns[columnName] || []}
                  onQuickAdd={() => handleQuickAdd(columnName)}
                />
              ))}
            </div>
            <DragOverlay>
              {activeIdea ? (
                <div className="rotate-3 scale-110 opacity-95 transform transition-all duration-300 shadow-2xl shadow-red-500/50">
                  <ContentKanbanCard 
                    idea={activeIdea} 
                    personas={personas}
                    onUpdate={onIdeaUpdate}
                    onTransformToArticle={handleTransformToArticle}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default ContentProductionKanban;
