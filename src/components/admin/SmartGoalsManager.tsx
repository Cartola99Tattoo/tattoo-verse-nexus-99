
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Target, Plus, Calendar, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SmartGoal {
  id: string;
  specific: string;
  measurable: {
    metric: string;
    current: number;
    target: number;
    unit: string;
  };
  achievable: string;
  relevant: string;
  timeBound: {
    startDate: string;
    endDate: string;
  };
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
}

interface SmartGoalsManagerProps {
  projectId: string;
  goals: SmartGoal[];
  onAddGoal: (goal: Omit<SmartGoal, 'id'>) => void;
  onUpdateGoal: (goalId: string, updates: Partial<SmartGoal>) => void;
}

const SmartGoalsManager = ({ projectId, goals, onAddGoal, onUpdateGoal }: SmartGoalsManagerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<SmartGoal>>({
    specific: "",
    measurable: { metric: "", current: 0, target: 0, unit: "" },
    achievable: "",
    relevant: "",
    timeBound: { startDate: "", endDate: "" },
    status: 'not_started',
    progress: 0
  });

  const handleAddGoal = () => {
    if (!newGoal.specific || !newGoal.measurable?.metric) return;
    
    onAddGoal({
      specific: newGoal.specific!,
      measurable: newGoal.measurable!,
      achievable: newGoal.achievable!,
      relevant: newGoal.relevant!,
      timeBound: newGoal.timeBound!,
      status: 'not_started',
      progress: 0
    });
    
    setNewGoal({
      specific: "",
      measurable: { metric: "", current: 0, target: 0, unit: "" },
      achievable: "",
      relevant: "",
      timeBound: { startDate: "", endDate: "" },
      status: 'not_started',
      progress: 0
    });
    
    setIsAddDialogOpen(false);
  };

  const getStatusBadge = (status: SmartGoal['status']) => {
    const variants = {
      not_started: { label: "Não Iniciado", color: "bg-gray-100 text-gray-800" },
      in_progress: { label: "Em Progresso", color: "bg-blue-100 text-blue-800" },
      completed: { label: "Concluído", color: "bg-green-100 text-green-800" },
      delayed: { label: "Atrasado", color: "bg-red-100 text-red-800" }
    };
    
    const variant = variants[status];
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const calculateOverallProgress = () => {
    if (goals.length === 0) return 0;
    return goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length;
  };

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-600" />
              Metas SMART do Projeto
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Meta SMART
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Nova Meta SMART</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    <Label>Específico (Specific) *</Label>
                    <Textarea
                      placeholder="Descreva claramente o que será alcançado..."
                      value={newGoal.specific}
                      onChange={(e) => setNewGoal({...newGoal, specific: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Métrica *</Label>
                      <Input
                        placeholder="Ex: Número de participantes"
                        value={newGoal.measurable?.metric || ""}
                        onChange={(e) => setNewGoal({
                          ...newGoal, 
                          measurable: {...newGoal.measurable!, metric: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unidade</Label>
                      <Input
                        placeholder="Ex: pessoas, R$, %"
                        value={newGoal.measurable?.unit || ""}
                        onChange={(e) => setNewGoal({
                          ...newGoal, 
                          measurable: {...newGoal.measurable!, unit: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valor Atual</Label>
                      <Input
                        type="number"
                        value={newGoal.measurable?.current || 0}
                        onChange={(e) => setNewGoal({
                          ...newGoal, 
                          measurable: {...newGoal.measurable!, current: parseInt(e.target.value) || 0}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Meta *</Label>
                      <Input
                        type="number"
                        value={newGoal.measurable?.target || 0}
                        onChange={(e) => setNewGoal({
                          ...newGoal, 
                          measurable: {...newGoal.measurable!, target: parseInt(e.target.value) || 0}
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Atingível (Achievable)</Label>
                    <Textarea
                      placeholder="Explique por que esta meta é atingível..."
                      value={newGoal.achievable}
                      onChange={(e) => setNewGoal({...newGoal, achievable: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Relevante (Relevant)</Label>
                    <Textarea
                      placeholder="Como esta meta se alinha aos objetivos do estúdio..."
                      value={newGoal.relevant}
                      onChange={(e) => setNewGoal({...newGoal, relevant: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data Início</Label>
                      <Input
                        type="date"
                        value={newGoal.timeBound?.startDate || ""}
                        onChange={(e) => setNewGoal({
                          ...newGoal, 
                          timeBound: {...newGoal.timeBound!, startDate: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Data Fim *</Label>
                      <Input
                        type="date"
                        value={newGoal.timeBound?.endDate || ""}
                        onChange={(e) => setNewGoal({
                          ...newGoal, 
                          timeBound: {...newGoal.timeBound!, endDate: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddGoal} className="flex-1">
                    Criar Meta SMART
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progresso Geral das Metas</span>
              <span className="text-sm text-gray-600">
                {calculateOverallProgress().toFixed(0)}%
              </span>
            </div>
            <Progress value={calculateOverallProgress()} className="h-2" />
            
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {goals.filter(g => g.status === 'not_started').length}
                </div>
                <div className="text-xs text-gray-500">Não Iniciadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {goals.filter(g => g.status === 'in_progress').length}
                </div>
                <div className="text-xs text-gray-500">Em Progresso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {goals.filter(g => g.status === 'completed').length}
                </div>
                <div className="text-xs text-gray-500">Concluídas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {goals.filter(g => g.status === 'delayed').length}
                </div>
                <div className="text-xs text-gray-500">Atrasadas</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Metas */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-600" />
                  <span className="font-medium">{goal.measurable.metric}</span>
                </div>
                {getStatusBadge(goal.status)}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="specific">Específico</TabsTrigger>
                  <TabsTrigger value="measurable">Mensurável</TabsTrigger>
                  <TabsTrigger value="achievable">Atingível</TabsTrigger>
                  <TabsTrigger value="relevant">Relevante</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-600">Progresso</div>
                        <div className="font-semibold">{goal.progress}%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="text-sm text-gray-600">Atual / Meta</div>
                        <div className="font-semibold">
                          {goal.measurable.current} / {goal.measurable.target} {goal.measurable.unit}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <div>
                        <div className="text-sm text-gray-600">Prazo</div>
                        <div className="font-semibold">
                          {formatDate(goal.timeBound.endDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Progress value={goal.progress} className="h-3" />
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newProgress = Math.min(100, goal.progress + 10);
                        const newStatus = newProgress >= 100 ? 'completed' : 'in_progress';
                        onUpdateGoal(goal.id, { progress: newProgress, status: newStatus });
                      }}
                    >
                      +10% Progresso
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newCurrent = goal.measurable.current + 1;
                        const newProgress = Math.min(100, (newCurrent / goal.measurable.target) * 100);
                        onUpdateGoal(goal.id, { 
                          measurable: { ...goal.measurable, current: newCurrent },
                          progress: newProgress,
                          status: newProgress >= 100 ? 'completed' : 'in_progress'
                        });
                      }}
                    >
                      +1 {goal.measurable.unit}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="specific">
                  <p className="text-sm">{goal.specific}</p>
                </TabsContent>
                
                <TabsContent value="measurable">
                  <div className="space-y-2">
                    <p><strong>Métrica:</strong> {goal.measurable.metric}</p>
                    <p><strong>Valor Atual:</strong> {goal.measurable.current} {goal.measurable.unit}</p>
                    <p><strong>Meta:</strong> {goal.measurable.target} {goal.measurable.unit}</p>
                    <p><strong>Progresso:</strong> {goal.progress}%</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="achievable">
                  <p className="text-sm">{goal.achievable}</p>
                </TabsContent>
                
                <TabsContent value="relevant">
                  <p className="text-sm">{goal.relevant}</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {goals.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma meta SMART definida
            </h3>
            <p className="text-gray-500 mb-4">
              Crie metas SMART para acompanhar o progresso do projeto.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Meta SMART
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartGoalsManager;
