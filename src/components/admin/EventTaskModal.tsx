import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CheckCircle2, Circle, Target } from 'lucide-react';
import { IEvent } from '@/services/interfaces/IEventService';
import { IProject, IProjectSmartGoal } from '@/services/interfaces/IProjectService';

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
  smartGoalId?: string;
  projectId?: string;
}

interface EventTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<EventTask>) => void;
  editingTask: EventTask | null;
  events: IEvent[];
  projects?: IProject[];
  smartGoals?: IProjectSmartGoal[];
}

const EventTaskModal = ({ isOpen, onClose, onSave, editingTask, events, projects = [], smartGoals = [] }: EventTaskModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsible: '',
    deadline: '',
    eventId: '',
    projectId: '',
    smartGoalId: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    checklist: [] as string[]
  });

  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [showNewSmartGoal, setShowNewSmartGoal] = useState(false);
  const [newSmartGoal, setNewSmartGoal] = useState({
    title: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
    deadline: '',
    responsible: ''
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        responsible: editingTask.responsible,
        deadline: editingTask.deadline,
        eventId: editingTask.eventId,
        projectId: editingTask.projectId || '',
        smartGoalId: editingTask.smartGoalId || '',
        priority: editingTask.priority,
        checklist: editingTask.checklist || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        responsible: '',
        deadline: '',
        eventId: '',
        projectId: '',
        smartGoalId: '',
        priority: 'medium',
        checklist: []
      });
    }
    setShowNewSmartGoal(false);
    setNewSmartGoal({
      title: '',
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: '',
      deadline: '',
      responsible: ''
    });
  }, [editingTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Se estiver criando uma nova meta SMART, incluir na submissão
    if (showNewSmartGoal && newSmartGoal.title) {
      const goalData = {
        ...formData,
        newSmartGoal: newSmartGoal
      };
      onSave(goalData);
    } else {
      onSave(formData);
    }
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData(prev => ({
        ...prev,
        checklist: [...prev.checklist, newChecklistItem.trim()]
      }));
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== index)
    }));
  };

  const toggleChecklistItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map((item, i) => 
        i === index 
          ? item.startsWith('✓') 
            ? item.replace('✓ ', '') 
            : `✓ ${item}`
          : item
      )
    }));
  };

  const responsibleOptions = [
    'Ana Silva - Coordenadora',
    'Carlos Santos - Designer',
    'Maria Oliveira - Marketing',
    'João Costa - Logística',
    'Paula Lima - Financeiro',
    'Pedro Souza - Artista',
    'Equipe Geral'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-red-50 border-2 border-red-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-red-800">
            {editingTask ? 'Editar Tarefa de Evento' : 'Nova Tarefa de Evento'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-red-700 font-medium">Título da Tarefa</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Definir local do evento"
              className="border-red-200 focus:border-red-500"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-red-700 font-medium">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva os detalhes da tarefa..."
              className="border-red-200 focus:border-red-500 min-h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Responsável */}
            <div className="space-y-2">
              <Label className="text-red-700 font-medium">Responsável</Label>
              <Select value={formData.responsible} onValueChange={(value) => setFormData(prev => ({ ...prev, responsible: value }))}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent className="bg-white border-red-200">
                  {responsibleOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prazo */}
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-red-700 font-medium">Prazo</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="border-red-200 focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Evento Relacionado */}
            <div className="space-y-2">
              <Label className="text-red-700 font-medium">Evento Relacionado</Label>
              <Select value={formData.eventId} onValueChange={(value) => setFormData(prev => ({ ...prev, eventId: value }))}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue placeholder="Selecione um evento" />
                </SelectTrigger>
                <SelectContent className="bg-white border-red-200">
                  <SelectItem value="no-event">Nenhum evento específico</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Projeto Relacionado */}
            <div className="space-y-2">
              <Label className="text-red-700 font-medium">Projeto Relacionado</Label>
              <Select value={formData.projectId} onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent className="bg-white border-red-200">
                  <SelectItem value="no-project">Nenhum projeto específico</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prioridade */}
            <div className="space-y-2">
              <Label className="text-red-700 font-medium">Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-red-200">
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">Baixa</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-600 text-white">Média</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-600 text-white">Alta</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Gestão de Metas SMART */}
          <div className="space-y-4 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <Label className="text-blue-700 font-medium flex items-center gap-2">
                <Target className="h-5 w-5" />
                Meta SMART Associada
              </Label>
              <Button
                type="button"
                onClick={() => setShowNewSmartGoal(!showNewSmartGoal)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
              >
                {showNewSmartGoal ? 'Cancelar' : 'Nova Meta'}
              </Button>
            </div>

            {!showNewSmartGoal ? (
              <Select value={formData.smartGoalId} onValueChange={(value) => setFormData(prev => ({ ...prev, smartGoalId: value }))}>
                <SelectTrigger className="border-blue-200 focus:border-blue-500">
                  <SelectValue placeholder="Selecione uma meta SMART existente" />
                </SelectTrigger>
                <SelectContent className="bg-white border-blue-200">
                  <SelectItem value="no-goal">Nenhuma meta específica</SelectItem>
                  {smartGoals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>{goal.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-4 bg-white p-4 rounded-lg border border-blue-300">
                <h4 className="font-bold text-blue-800">Criar Nova Meta SMART</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label className="text-blue-700">Título da Meta</Label>
                    <Input
                      value={newSmartGoal.title}
                      onChange={(e) => setNewSmartGoal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Aumentar participação no evento"
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-blue-700">Específica</Label>
                    <Textarea
                      value={newSmartGoal.specific}
                      onChange={(e) => setNewSmartGoal(prev => ({ ...prev, specific: e.target.value }))}
                      placeholder="O que exatamente queremos alcançar?"
                      className="border-blue-200 focus:border-blue-500 min-h-20"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-blue-700">Mensurável</Label>
                    <Textarea
                      value={newSmartGoal.measurable}
                      onChange={(e) => setNewSmartGoal(prev => ({ ...prev, measurable: e.target.value }))}
                      placeholder="Como mediremos o progresso?"
                      className="border-blue-200 focus:border-blue-500 min-h-20"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-blue-700">Atingível</Label>
                    <Textarea
                      value={newSmartGoal.achievable}
                      onChange={(e) => setNewSmartGoal(prev => ({ ...prev, achievable: e.target.value }))}
                      placeholder="É realista e possível?"
                      className="border-blue-200 focus:border-blue-500 min-h-20"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-blue-700">Relevante</Label>
                    <Textarea
                      value={newSmartGoal.relevant}
                      onChange={(e) => setNewSmartGoal(prev => ({ ...prev, relevant: e.target.value }))}
                      placeholder="Por que é importante?"
                      className="border-blue-200 focus:border-blue-500 min-h-20"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-blue-700">Temporal</Label>
                    <Textarea
                      value={newSmartGoal.timeBound}
                      onChange={(e) => setNewSmartGoal(prev => ({ ...prev, timeBound: e.target.value }))}
                      placeholder="Qual o prazo?"
                      className="border-blue-200 focus:border-blue-500 min-h-20"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-blue-700">Responsável</Label>
                    <Input
                      value={newSmartGoal.responsible}
                      onChange={(e) => setNewSmartGoal(prev => ({ ...prev, responsible: e.target.value }))}
                      placeholder="Quem é responsável?"
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Checklist */}
          <div className="space-y-4">
            <Label className="text-red-700 font-medium">Checklist de Sub-tarefas</Label>
            
            {/* Add new item */}
            <div className="flex gap-2">
              <Input
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Nova sub-tarefa..."
                className="border-red-200 focus:border-red-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
              />
              <Button
                type="button"
                onClick={addChecklistItem}
                className="bg-red-600 hover:bg-red-700 text-white px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Checklist items */}
            {formData.checklist.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg border border-red-200">
                {formData.checklist.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border">
                    <button
                      type="button"
                      onClick={() => toggleChecklistItem(index)}
                      className="text-green-600 hover:text-green-700"
                    >
                      {item.startsWith('✓') ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </button>
                    <span className={`flex-1 text-sm ${item.startsWith('✓') ? 'line-through text-gray-500' : ''}`}>
                      {item.replace('✓ ', '')}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold"
            >
              {editingTask ? 'Atualizar Tarefa' : 'Criar Tarefa'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventTaskModal;
