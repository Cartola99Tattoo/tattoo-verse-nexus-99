
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Plus, Lightbulb, ArrowRight } from 'lucide-react';
import { IEvent } from '@/services/interfaces/IEventService';
import { IProject, IProjectSmartGoal } from '@/services/interfaces/IProjectService';
import { useDataQuery } from "@/hooks/useDataQuery";
import { getProjectService } from "@/services/serviceFactory";
import EventKanbanColumn from './EventKanbanColumn';
import EventTaskCard from './EventTaskCard';
import EventTaskModal from './EventTaskModal';
import EventSmartGoalModal from './EventSmartGoalModal';
import EventSmartGoalCard from './EventSmartGoalCard';

interface EventTask {
  id: string;
  title: string;
  description: string;
  responsible: string;
  deadline: string;
  status: 'Metas' | 'Planejamento Inicial / Ideação' | 'Pré-Produção / Logística' | 'Marketing / Promoção' | 'Execução / Durante o Evento' | 'Pós-Evento / Análise';
  eventId: string;
  checklist: string[];
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  smartGoalId?: string;
  projectId?: string;
}

interface EventSmartGoal {
  id: string;
  title: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  deadline?: string;
  responsible?: string;
  progress: number;
  eventId?: string;
  projectId?: string;
  created_at: string;
  updated_at: string;
}

interface EventKanbanProps {
  events: IEvent[];
}

const KANBAN_COLUMNS = [
  "Metas",
  "Planejamento Inicial / Ideação",
  "Pré-Produção / Logística", 
  "Marketing / Promoção",
  "Execução / Durante o Evento",
  "Pós-Evento / Análise",
];

type TaskColumns = {
  [key: string]: EventTask[];
};

type SmartGoalColumns = {
  [key: string]: EventSmartGoal[];
};

const EventKanban = ({ events }: EventKanbanProps) => {
  const [columns, setColumns] = useState<TaskColumns>({});
  const [smartGoalColumns, setSmartGoalColumns] = useState<SmartGoalColumns>({ "Metas": [] });
  const [activeTask, setActiveTask] = useState<EventTask | null>(null);
  const [activeSmartGoal, setActiveSmartGoal] = useState<EventSmartGoal | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSmartGoalModal, setShowSmartGoalModal] = useState(false);
  const [editingTask, setEditingTask] = useState<EventTask | null>(null);
  const [editingSmartGoal, setEditingSmartGoal] = useState<EventSmartGoal | null>(null);
  const [tasks, setTasks] = useState<EventTask[]>([]);
  const [smartGoals, setSmartGoals] = useState<EventSmartGoal[]>([]);

  const projectService = getProjectService();

  const { data: projects } = useDataQuery<IProject[]>(
    () => projectService.fetchProjects(),
    []
  );

  const { data: projectSmartGoals } = useDataQuery<IProjectSmartGoal[]>(
    () => projectService.fetchProjectSmartGoals('all'),
    []
  );

  const safeProjects = projects || [];
  const safeProjectSmartGoals = projectSmartGoals || [];

  useEffect(() => {
    // Initialize empty columns
    const initialColumns: TaskColumns = KANBAN_COLUMNS.reduce((acc, col) => ({ ...acc, [col]: [] }), {});

    // Distribute tasks across columns (excluding Metas column)
    tasks.forEach(task => {
      const columnName = task.status || 'Planejamento Inicial / Ideação';
      if (initialColumns[columnName] && columnName !== 'Metas') {
        initialColumns[columnName].push(task);
      } else if (columnName !== 'Metas') {
        initialColumns['Planejamento Inicial / Ideação'].push(task);
      }
    });

    // Sort tasks within columns by update time
    for (const col in initialColumns) {
      if (col !== 'Metas') {
        initialColumns[col].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      }
    }

    setColumns(initialColumns);

    // Handle smart goals in Metas column
    const metasColumn: SmartGoalColumns = { "Metas": smartGoals };
    setSmartGoalColumns(metasColumn);
  }, [tasks, smartGoals]);

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

  const findColumn = (taskId: string) => {
    if (!taskId) return null;
    const columnName = Object.keys(columns).find(key => columns[key].some(t => t.id === taskId));
    return columnName || null;
  };

  const findSmartGoalColumn = (goalId: string) => {
    if (!goalId) return null;
    return Object.keys(smartGoalColumns).find(key => smartGoalColumns[key].some(g => g.id === goalId)) || null;
  };
  
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    const smartGoal = smartGoals.find(g => g.id === active.id);
    
    if (task) {
      setActiveTask(task);
    } else if (smartGoal) {
      setActiveSmartGoal(smartGoal);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setActiveSmartGoal(null);

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Handle smart goal dragging
    const activeSmartGoalColumn = findSmartGoalColumn(activeId);
    if (activeSmartGoalColumn) {
      // Smart goals can only be reordered within Metas column
      if (overId === 'Metas' || smartGoals.find(g => g.id === overId)) {
        const oldIndex = smartGoals.findIndex(g => g.id === activeId);
        const newIndex = smartGoals.findIndex(g => g.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          setSmartGoals(prev => arrayMove(prev, oldIndex, newIndex));
        }
      }
      return;
    }

    // Handle task dragging (existing logic)
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId) || (KANBAN_COLUMNS.includes(overId) && overId !== 'Metas' ? overId : null);

    if (!activeColumn || !overColumn || overColumn === 'Metas') {
      return;
    }

    // Handle reordering within the same column
    if (activeColumn === overColumn) {
      if (activeId !== overId) {
        setColumns(prev => {
          const newColumns = { ...prev };
          const tasksInColumn = newColumns[activeColumn];
          const oldIndex = tasksInColumn.findIndex(t => t.id === activeId);
          const newIndex = tasksInColumn.findIndex(t => t.id === overId);
          if (oldIndex !== -1 && newIndex !== -1) {
            newColumns[activeColumn] = arrayMove(tasksInColumn, oldIndex, newIndex);
          }
          return newColumns;
        });
      }
      return;
    }

    // Handle moving to a different column
    setTasks(prev => prev.map(task => 
      task.id === activeId ? { ...task, status: overColumn as EventTask['status'], updated_at: new Date().toISOString() } : task
    ));
  };

  const handleQuickAdd = (columnName: string) => {
    if (columnName === 'Metas') {
      setEditingSmartGoal(null);
      setShowSmartGoalModal(true);
    } else {
      setEditingTask(null);
      setShowTaskModal(true);
    }
  };

  const handleEditTask = (task: EventTask) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleEditSmartGoal = (goal: EventSmartGoal) => {
    setEditingSmartGoal(goal);
    setShowSmartGoalModal(true);
  };

  const handleTaskSave = (taskData: Partial<EventTask>) => {
    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData, updated_at: new Date().toISOString() }
          : task
      ));
    } else {
      const newTask: EventTask = {
        id: Date.now().toString(),
        title: taskData.title || '',
        description: taskData.description || '',
        responsible: taskData.responsible || '',
        deadline: taskData.deadline || '',
        status: 'Planejamento Inicial / Ideação',
        eventId: taskData.eventId || '',
        projectId: taskData.projectId || '',
        smartGoalId: taskData.smartGoalId || '',
        checklist: taskData.checklist || [],
        priority: taskData.priority || 'medium',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setTasks(prev => [...prev, newTask]);
    }
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleSmartGoalSave = (goalData: Partial<EventSmartGoal>) => {
    if (editingSmartGoal) {
      setSmartGoals(prev => prev.map(goal => 
        goal.id === editingSmartGoal.id 
          ? { ...goal, ...goalData, updated_at: new Date().toISOString() }
          : goal
      ));
    } else {
      const newSmartGoal: EventSmartGoal = {
        id: Date.now().toString(),
        title: goalData.title || '',
        specific: goalData.specific || '',
        measurable: goalData.measurable || '',
        achievable: goalData.achievable || '',
        relevant: goalData.relevant || '',
        timeBound: goalData.timeBound || '',
        deadline: goalData.deadline || '',
        responsible: goalData.responsible || '',
        progress: goalData.progress || 0,
        eventId: goalData.eventId || '',
        projectId: goalData.projectId || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setSmartGoals(prev => [...prev, newSmartGoal]);
    }
    setShowSmartGoalModal(false);
    setEditingSmartGoal(null);
  };

  return (
    <div className="bg-gradient-to-br from-white to-red-50 min-h-screen p-1 relative overflow-hidden">
      {/* Background pattern for 99Tattoo identity */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 via-transparent to-red-900/5 opacity-90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent"></div>
      
      {/* Header */}
      <div className="relative mb-6 px-4">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          {/* Título */}
          <h2 className="text-3xl font-black text-red-800 drop-shadow-lg">
            Kanban de Gestão Estratégica de Eventos
          </h2>
          
          {/* Guia de Uso */}
          <div className="bg-gradient-to-r from-red-100 to-red-200 px-4 py-2 rounded-lg border border-red-300 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">
              Gerencie eventos com metas SMART e projetos integrados
            </span>
            <ArrowRight className="h-4 w-4 text-red-600 animate-pulse" />
          </div>
        </div>
        
        {/* Botões de Ação Principais */}
        <div className="flex flex-wrap gap-4 mt-6">
          <Button
            onClick={() => handleQuickAdd('Metas')}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold shadow-2xl shadow-purple-500/30 border border-purple-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Nova Meta SMART
          </Button>
          <Button
            onClick={() => handleQuickAdd('Planejamento Inicial / Ideação')}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold shadow-2xl shadow-red-500/30 border border-red-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Nova Tarefa
          </Button>
        </div>
      </div>
      
      <div className="relative flex gap-6 overflow-x-auto pb-4 min-h-screen">
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
                <EventKanbanColumn
                  key={columnName}
                  id={columnName}
                  title={columnName}
                  tasks={columnName === 'Metas' ? [] : (columns[columnName] || [])}
                  smartGoals={columnName === 'Metas' ? (smartGoalColumns[columnName] || []) : []}
                  onQuickAdd={() => handleQuickAdd(columnName)}
                  onEditTask={handleEditTask}
                  onEditSmartGoal={handleEditSmartGoal}
                  isMetas={columnName === 'Metas'}
                />
              ))}
            </div>
            <DragOverlay>
              {activeTask ? (
                <div className="rotate-3 scale-110 opacity-95 transform transition-all duration-300 shadow-2xl shadow-red-500/50">
                  <EventTaskCard 
                    task={activeTask} 
                    onEdit={handleEditTask}
                  />
                </div>
              ) : activeSmartGoal ? (
                <div className="rotate-3 scale-110 opacity-95 transform transition-all duration-300 shadow-2xl shadow-purple-500/50">
                  <EventSmartGoalCard 
                    smartGoal={activeSmartGoal} 
                    onEdit={handleEditSmartGoal}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Task Modal */}
      <EventTaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        onSave={handleTaskSave}
        editingTask={editingTask}
        events={events}
        projects={safeProjects}
        smartGoals={safeProjectSmartGoals}
      />

      {/* Smart Goal Modal */}
      <EventSmartGoalModal
        isOpen={showSmartGoalModal}
        onClose={() => {
          setShowSmartGoalModal(false);
          setEditingSmartGoal(null);
        }}
        onSave={handleSmartGoalSave}
        editingSmartGoal={editingSmartGoal}
        events={events}
        projects={safeProjects}
      />
    </div>
  );
};

export default EventKanban;
