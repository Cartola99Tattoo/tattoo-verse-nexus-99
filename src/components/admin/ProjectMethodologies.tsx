
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Lightbulb, Target, TrendingUp, CheckCircle } from "lucide-react";
import { IProject, ILearningCycle, ISprint, IEnhancedSmartGoal } from "@/services/interfaces/IProjectService";

interface ProjectMethodologiesProps {
  project: IProject;
  learningCycles: ILearningCycle[];
  sprints: ISprint[];
  enhancedSmartGoals: IEnhancedSmartGoal[];
  onUpdateProject: (updates: Partial<IProject>) => void;
  onCreateLearningCycle: (cycle: Omit<ILearningCycle, 'id' | 'createdAt'>) => void;
  onCreateSprint: (sprint: Omit<ISprint, 'id' | 'createdAt'>) => void;
  onCreateEnhancedSmartGoal: (goal: Omit<IEnhancedSmartGoal, 'id' | 'createdAt'>) => void;
}

const ProjectMethodologies = ({
  project,
  learningCycles,
  sprints,
  enhancedSmartGoals,
  onUpdateProject,
  onCreateLearningCycle,
  onCreateSprint,
  onCreateEnhancedSmartGoal
}: ProjectMethodologiesProps) => {
  const [newCycle, setNewCycle] = useState({
    hypothesis: '',
    experiment: '',
    results: '',
    learnings: '',
    nextAction: ''
  });

  const [newSprint, setNewSprint] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
    storyPoints: 0
  });

  const [newSmartGoal, setNewSmartGoal] = useState({
    title: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
    currentMetric: 0,
    targetMetric: 0,
    deadline: ''
  });

  const handleCreateCycle = () => {
    if (newCycle.hypothesis && newCycle.experiment) {
      onCreateLearningCycle({
        projectId: project.id,
        ...newCycle,
        date: new Date().toISOString()
      });
      setNewCycle({
        hypothesis: '',
        experiment: '',
        results: '',
        learnings: '',
        nextAction: ''
      });
    }
  };

  const handleCreateSprint = () => {
    if (newSprint.name && newSprint.startDate && newSprint.endDate) {
      onCreateSprint({
        projectId: project.id,
        ...newSprint,
        status: 'planning',
        completedPoints: 0
      });
      setNewSprint({
        name: '',
        goal: '',
        startDate: '',
        endDate: '',
        storyPoints: 0
      });
    }
  };

  const handleCreateSmartGoal = () => {
    if (newSmartGoal.title && newSmartGoal.specific) {
      onCreateEnhancedSmartGoal({
        projectId: project.id,
        ...newSmartGoal,
        progress: 0
      });
      setNewSmartGoal({
        title: '',
        specific: '',
        measurable: '',
        achievable: '',
        relevant: '',
        timeBound: '',
        currentMetric: 0,
        targetMetric: 0,
        deadline: ''
      });
    }
  };

  const activeSprint = sprints.find(s => s.status === 'active');
  const sprintProgress = activeSprint ? (activeSprint.completedPoints / activeSprint.storyPoints) * 100 : 0;

  return (
    <Tabs defaultValue="lean" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="lean">Lean Startup</TabsTrigger>
        <TabsTrigger value="scrum">Scrum</TabsTrigger>
        <TabsTrigger value="ocean">Oceano Azul</TabsTrigger>
        <TabsTrigger value="smart">SMART</TabsTrigger>
      </TabsList>

      <TabsContent value="lean" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Metodologia Lean Startup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hypothesis">Hipótese Principal</Label>
              <Textarea
                id="hypothesis"
                value={project.mainHypothesis || ''}
                onChange={(e) => onUpdateProject({ mainHypothesis: e.target.value })}
                placeholder="Qual é a principal hipótese que queremos validar com este projeto?"
              />
            </div>
            
            <div>
              <Label htmlFor="metrics">Métricas de Validação</Label>
              <Input
                id="metrics"
                value={project.validationMetrics || ''}
                onChange={(e) => onUpdateProject({ validationMetrics: e.target.value })}
                placeholder="Como mediremos o sucesso?"
              />
            </div>

            <div>
              <h4 className="font-medium mb-2">Ciclos Construir-Medir-Aprender</h4>
              <div className="space-y-2 mb-4">
                {learningCycles.map(cycle => (
                  <Card key={cycle.id} className="p-3">
                    <div className="space-y-2">
                      <div><strong>Hipótese:</strong> {cycle.hypothesis}</div>
                      <div><strong>Experimento:</strong> {cycle.experiment}</div>
                      {cycle.results && <div><strong>Resultados:</strong> {cycle.results}</div>}
                      {cycle.learnings && <div><strong>Aprendizados:</strong> {cycle.learnings}</div>}
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-3 border-dashed">
                <div className="space-y-2">
                  <Input
                    placeholder="Hipótese do experimento"
                    value={newCycle.hypothesis}
                    onChange={(e) => setNewCycle({...newCycle, hypothesis: e.target.value})}
                  />
                  <Input
                    placeholder="Experimento a ser realizado"
                    value={newCycle.experiment}
                    onChange={(e) => setNewCycle({...newCycle, experiment: e.target.value})}
                  />
                  <Input
                    placeholder="Resultados obtidos"
                    value={newCycle.results}
                    onChange={(e) => setNewCycle({...newCycle, results: e.target.value})}
                  />
                  <Input
                    placeholder="Aprendizados"
                    value={newCycle.learnings}
                    onChange={(e) => setNewCycle({...newCycle, learnings: e.target.value})}
                  />
                  <Button onClick={handleCreateCycle} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Ciclo
                  </Button>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="scrum" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Metodologia Scrum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSprint && (
              <Card className="p-4 bg-green-50">
                <h4 className="font-medium mb-2">Sprint Atual: {activeSprint.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{activeSprint.goal}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{activeSprint.completedPoints}/{activeSprint.storyPoints} pontos</span>
                  </div>
                  <Progress value={sprintProgress} className="h-2" />
                </div>
              </Card>
            )}

            <div>
              <h4 className="font-medium mb-2">Sprints</h4>
              <div className="space-y-2 mb-4">
                {sprints.map(sprint => (
                  <Card key={sprint.id} className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{sprint.name}</div>
                        <div className="text-sm text-gray-600">{sprint.goal}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant={sprint.status === 'active' ? 'default' : 'secondary'}>
                        {sprint.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-3 border-dashed">
                <div className="space-y-2">
                  <Input
                    placeholder="Nome da Sprint"
                    value={newSprint.name}
                    onChange={(e) => setNewSprint({...newSprint, name: e.target.value})}
                  />
                  <Input
                    placeholder="Objetivo da Sprint"
                    value={newSprint.goal}
                    onChange={(e) => setNewSprint({...newSprint, goal: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={newSprint.startDate}
                      onChange={(e) => setNewSprint({...newSprint, startDate: e.target.value})}
                    />
                    <Input
                      type="date"
                      value={newSprint.endDate}
                      onChange={(e) => setNewSprint({...newSprint, endDate: e.target.value})}
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder="Story Points"
                    value={newSprint.storyPoints}
                    onChange={(e) => setNewSprint({...newSprint, storyPoints: parseInt(e.target.value) || 0})}
                  />
                  <Button onClick={handleCreateSprint} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Sprint
                  </Button>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ocean" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Estratégia Oceano Azul
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="valueCurve">Curva de Valor</Label>
              <Textarea
                id="valueCurve"
                value={project.valueCurve || ''}
                onChange={(e) => onUpdateProject({ valueCurve: e.target.value })}
                placeholder="Descreva os fatores de concorrência e como este projeto se diferencia..."
              />
            </div>
            
            <div>
              <Label htmlFor="innovations">Inovações de Valor</Label>
              <Textarea
                value={project.valueInnovations?.join('\n') || ''}
                onChange={(e) => onUpdateProject({ valueInnovations: e.target.value.split('\n').filter(Boolean) })}
                placeholder="Liste as inovações que tornam este projeto único (uma por linha)"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="smart" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Metas SMART Aprimoradas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {enhancedSmartGoals.map(goal => (
                <Card key={goal.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{goal.title}</h4>
                      <Badge variant="outline">{goal.progress}%</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><strong>Específico:</strong> {goal.specific}</div>
                      <div><strong>Mensurável:</strong> {goal.measurable}</div>
                      <div><strong>Atingível:</strong> {goal.achievable}</div>
                      <div><strong>Relevante:</strong> {goal.relevant}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso: {goal.currentMetric}/{goal.targetMetric}</span>
                        <span>Prazo: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-3 border-dashed">
              <div className="space-y-2">
                <Input
                  placeholder="Título da Meta"
                  value={newSmartGoal.title}
                  onChange={(e) => setNewSmartGoal({...newSmartGoal, title: e.target.value})}
                />
                <Textarea
                  placeholder="Específico: O que exatamente queremos alcançar?"
                  value={newSmartGoal.specific}
                  onChange={(e) => setNewSmartGoal({...newSmartGoal, specific: e.target.value})}
                />
                <Input
                  placeholder="Mensurável: Como mediremos o sucesso?"
                  value={newSmartGoal.measurable}
                  onChange={(e) => setNewSmartGoal({...newSmartGoal, measurable: e.target.value})}
                />
                <Input
                  placeholder="Atingível: É realista?"
                  value={newSmartGoal.achievable}
                  onChange={(e) => setNewSmartGoal({...newSmartGoal, achievable: e.target.value})}
                />
                <Input
                  placeholder="Relevante: Por que é importante?"
                  value={newSmartGoal.relevant}
                  onChange={(e) => setNewSmartGoal({...newSmartGoal, relevant: e.target.value})}
                />
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    placeholder="Métrica Atual"
                    value={newSmartGoal.currentMetric}
                    onChange={(e) => setNewSmartGoal({...newSmartGoal, currentMetric: parseInt(e.target.value) || 0})}
                  />
                  <Input
                    type="number"
                    placeholder="Meta"
                    value={newSmartGoal.targetMetric}
                    onChange={(e) => setNewSmartGoal({...newSmartGoal, targetMetric: parseInt(e.target.value) || 0})}
                  />
                  <Input
                    type="date"
                    value={newSmartGoal.deadline}
                    onChange={(e) => setNewSmartGoal({...newSmartGoal, deadline: e.target.value})}
                  />
                </div>
                <Button onClick={handleCreateSmartGoal} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Meta SMART
                </Button>
              </div>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProjectMethodologies;
