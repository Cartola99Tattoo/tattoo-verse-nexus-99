
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import EventTaskCard from './EventTaskCard';

interface EventTask {
  id: string;
  title: string;
  description: string;
  responsible: string;
  deadline: string;
  status: string;
  eventId: string;
  checklist: string[];
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

interface EventKanbanColumnProps {
  id: string;
  title: string;
  tasks: EventTask[];
  onQuickAdd: () => void;
  onEditTask?: (task: EventTask) => void;
}

const EventKanbanColumn = ({ id, title, tasks, onQuickAdd, onEditTask }: EventKanbanColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  const getColumnColor = (columnTitle: string) => {
    switch (columnTitle) {
      case 'Planejamento Inicial / Ideação': return 'from-purple-600 to-purple-800';
      case 'Pré-Produção / Logística': return 'from-blue-600 to-blue-800';
      case 'Marketing / Promoção': return 'from-green-600 to-green-800';
      case 'Execução / Durante o Evento': return 'from-orange-600 to-orange-800';
      case 'Pós-Evento / Análise': return 'from-red-600 to-red-800';
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
              {tasks.length}
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
            Adicionar Tarefa
          </Button>

          {/* Lista de Cards */}
          <div className="flex-1">
            <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {tasks.map(task => (
                  <EventTaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
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

export default EventKanbanColumn;
