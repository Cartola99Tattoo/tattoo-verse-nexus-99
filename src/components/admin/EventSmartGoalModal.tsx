
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Target, Lightbulb } from 'lucide-react';
import { IEvent } from '@/services/interfaces/IEventService';
import { IProject } from '@/services/interfaces/IProjectService';

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

interface EventSmartGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: Partial<EventSmartGoal>) => void;
  editingSmartGoal: EventSmartGoal | null;
  events: IEvent[];
  projects?: IProject[];
}

const EventSmartGoalModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingSmartGoal, 
  events, 
  projects = [] 
}: EventSmartGoalModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
    deadline: '',
    responsible: '',
    progress: 0,
    eventId: '',
    projectId: ''
  });

  const exampleSmartGoal = {
    title: 'Aumentar Engajamento do Evento "Flash Tattoo Party Verão"',
    specific: 'Aumentar em 25% o número de interações (curtidas, comentários, compartilhamentos) nas publicações do evento no Instagram.',
    measurable: 'Será medido pelo Analytics do Instagram, comparando a média de interações dos posts de eventos anteriores.',
    achievable: 'É atingível com um investimento de R$500 em impulsionamento de posts e 3 posts diários na semana do evento.',
    relevant: 'Maior engajamento nas redes sociais atrai mais público e potenciais clientes para o estúdio.',
    timeBound: 'Meta a ser atingida até o dia do evento, 15 de julho de 2025.',
    deadline: '2025-07-15',
    responsible: 'Maria Oliveira - Marketing',
    progress: 0
  };

  useEffect(() => {
    if (editingSmartGoal) {
      setFormData({
        title: editingSmartGoal.title,
        specific: editingSmartGoal.specific,
        measurable: editingSmartGoal.measurable,
        achievable: editingSmartGoal.achievable,
        relevant: editingSmartGoal.relevant,
        timeBound: editingSmartGoal.timeBound,
        deadline: editingSmartGoal.deadline || '',
        responsible: editingSmartGoal.responsible || '',
        progress: editingSmartGoal.progress,
        eventId: editingSmartGoal.eventId || '',
        projectId: editingSmartGoal.projectId || ''
      });
    } else {
      // Pré-preencher com exemplo quando criando nova meta
      setFormData({
        ...exampleSmartGoal,
        eventId: '',
        projectId: ''
      });
    }
  }, [editingSmartGoal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-purple-800 flex items-center gap-2">
            <Target className="h-6 w-6" />
            {editingSmartGoal ? 'Editar Meta SMART' : 'Nova Meta SMART'}
          </DialogTitle>
          
          {!editingSmartGoal && (
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-3 rounded-lg border border-purple-300 flex items-start gap-2 mt-4">
              <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-purple-800 mb-1">💡 Exemplo Pré-preenchido</p>
                <p className="text-xs text-purple-700">
                  Este formulário vem com um exemplo para guiá-lo na criação de uma Meta SMART eficaz. 
                  Modifique os campos conforme necessário para sua meta específica.
                </p>
              </div>
            </div>
          )}
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-purple-700 font-medium">Título da Meta</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Aumentar participação no evento"
              className="border-purple-200 focus:border-purple-500"
              required
            />
          </div>

          {/* Critérios SMART */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Específica */}
            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">S - Específica</Label>
              <Textarea
                value={formData.specific}
                onChange={(e) => setFormData(prev => ({ ...prev, specific: e.target.value }))}
                placeholder="O que exatamente queremos alcançar?"
                className="border-purple-200 focus:border-purple-500 min-h-24"
                required
              />
            </div>

            {/* Mensurável */}
            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">M - Mensurável</Label>
              <Textarea
                value={formData.measurable}
                onChange={(e) => setFormData(prev => ({ ...prev, measurable: e.target.value }))}
                placeholder="Como mediremos o progresso?"
                className="border-purple-200 focus:border-purple-500 min-h-24"
                required
              />
            </div>

            {/* Atingível */}
            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">A - Atingível</Label>
              <Textarea
                value={formData.achievable}
                onChange={(e) => setFormData(prev => ({ ...prev, achievable: e.target.value }))}
                placeholder="É realista e possível?"
                className="border-purple-200 focus:border-purple-500 min-h-24"
                required
              />
            </div>

            {/* Relevante */}
            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">R - Relevante</Label>
              <Textarea
                value={formData.relevant}
                onChange={(e) => setFormData(prev => ({ ...prev, relevant: e.target.value }))}
                placeholder="Por que é importante?"
                className="border-purple-200 focus:border-purple-500 min-h-24"
                required
              />
            </div>
          </div>

          {/* Temporal */}
          <div className="space-y-2">
            <Label className="text-purple-700 font-medium">T - Temporal</Label>
            <Textarea
              value={formData.timeBound}
              onChange={(e) => setFormData(prev => ({ ...prev, timeBound: e.target.value }))}
              placeholder="Qual o prazo e cronograma?"
              className="border-purple-200 focus:border-purple-500 min-h-20"
              required
            />
          </div>

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Responsável */}
            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Responsável</Label>
              <Select value={formData.responsible} onValueChange={(value) => setFormData(prev => ({ ...prev, responsible: value }))}>
                <SelectTrigger className="border-purple-200 focus:border-purple-500">
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent className="bg-white border-purple-200">
                  {responsibleOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prazo */}
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-purple-700 font-medium">Prazo Final</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>

            {/* Progresso */}
            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Progresso (%)</Label>
              <div className="space-y-2">
                <Slider
                  value={[formData.progress]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, progress: value[0] }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="text-center">
                  <span className="text-lg font-bold text-purple-600">{formData.progress}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Associações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Evento Relacionado */}
            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Evento Relacionado</Label>
              <Select value={formData.eventId} onValueChange={(value) => setFormData(prev => ({ ...prev, eventId: value }))}>
                <SelectTrigger className="border-purple-200 focus:border-purple-500">
                  <SelectValue placeholder="Selecione um evento" />
                </SelectTrigger>
                <SelectContent className="bg-white border-purple-200">
                  <SelectItem value="no-event">Nenhum evento específico</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Projeto Relacionado */}
            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Projeto Relacionado</Label>
              <Select value={formData.projectId} onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}>
                <SelectTrigger className="border-purple-200 focus:border-purple-500">
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent className="bg-white border-purple-200">
                  <SelectItem value="no-project">Nenhum projeto específico</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold"
            >
              {editingSmartGoal ? 'Atualizar Meta SMART' : 'Criar Meta SMART'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventSmartGoalModal;
