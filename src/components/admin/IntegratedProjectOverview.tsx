import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  Leaf, 
  Users, 
  Plus,
  Calendar,
  BarChart3
} from "lucide-react";
import { IProject, IProjectTask, IProjectSmartGoal, IEnhancedSmartGoal } from "@/services/interfaces/IProjectService";
import EnhancedSmartGoalsDashboard from "@/components/admin/EnhancedSmartGoalsDashboard";
import EnhancedSmartGoalsManager from "@/components/admin/EnhancedSmartGoalsManager";
import BudgetItemForm from "@/components/admin/BudgetItemForm";
import ImprovementActionForm from "@/components/admin/ImprovementActionForm";
import ExpansionResourceForm from "@/components/admin/ExpansionResourceForm";
import SustainabilityActionForm from "@/components/admin/SustainabilityActionForm";
import { getProjectService } from "@/services/serviceFactory";
import { toast } from "@/hooks/use-toast";

interface IntegratedProjectOverviewProps {
  project: IProject;
  goals: IProjectSmartGoal[];
  tasks: IProjectTask[];
  onUpdateGoal: (id: string, goal: Partial<IProjectSmartGoal>) => void;
  onAddGoal: () => void;
  onRefreshGoals: () => void;
}

const IntegratedProjectOverview = ({ 
  project, 
  goals, 
  tasks, 
  onUpdateGoal, 
  onAddGoal,
  onRefreshGoals 
}: IntegratedProjectOverviewProps) => {
  const [activeSection, setActiveSection] = useState<string>('smart-goals');
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showImprovementForm, setShowImprovementForm] = useState(false);
  const [showExpansionForm, setShowExpansionForm] = useState(false);
  const [showSustainabilityForm, setShowSustainabilityForm] = useState(false);
  
  const projectService = getProjectService();

  const overallProgress = goals.length > 0 
    ? goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length 
    : 0;

  const completedGoals = goals.filter(g => g.progress >= 100).length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const urgentGoals = goals.filter(goal => 
    goal.deadline && new Date(goal.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;

  // Convert IProjectSmartGoal to IEnhancedSmartGoal for compatibility
  const enhancedGoals: IEnhancedSmartGoal[] = goals.map(goal => ({
    ...goal,
    currentMetric: 0, // Default value - can be enhanced later
    targetMetric: 100, // Default value - can be enhanced later
    projectId: project.id,
    createdAt: new Date().toISOString(),
    deadline: goal.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Default deadline if not set
  }));

  const getProjectMetrics = () => {
    const totalTasks = tasks.length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const overdueTasks = tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  const metrics = getProjectMetrics();

  const sections = [
    { id: 'smart-goals', name: 'Metas SMART', icon: Target, color: 'red' },
    { id: 'budget', name: 'Orçamento', icon: DollarSign, color: 'green' },
    { id: 'risks', name: 'Gestão de Riscos', icon: AlertTriangle, color: 'orange' },
    { id: 'improvements', name: 'Ações de Otimização', icon: TrendingUp, color: 'blue' },
    { id: 'expansion', name: 'Recursos para Expansão', icon: Users, color: 'purple' },
    { id: 'sustainability', name: 'Sustentabilidade', icon: Leaf, color: 'green' }
  ];

  // Handlers para adicionar itens com associação SMART
  const handleAddBudgetItem = async (item: any) => {
    try {
      await projectService.createBudgetItem(item);
      toast({
        title: "Item de orçamento adicionado",
        description: "Item adicionado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar item de orçamento.",
        variant: "destructive"
      });
    }
  };

  const handleAddImprovementAction = async (action: any) => {
    try {
      await projectService.createImprovementAction(action);
      toast({
        title: "Ação de melhoria adicionada",
        description: "Ação adicionada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar ação de melhoria.",
        variant: "destructive"
      });
    }
  };

  const handleAddExpansionResource = async (resource: any) => {
    try {
      await projectService.createExpansionResource(resource);
      toast({
        title: "Recurso de expansão adicionado",
        description: "Recurso adicionado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar recurso de expansão.",
        variant: "destructive"
      });
    }
  };

  const handleAddSustainabilityAction = async (action: any) => {
    try {
      await projectService.createSustainabilityAction(action);
      toast({
        title: "Ação de sustentabilidade adicionada",
        description: "Ação adicionada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar ação de sustentabilidade.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumo Executivo do Projeto */}
      <Card className="border-l-4 border-l-red-600 bg-gradient-to-r from-red-50 via-white to-red-50 shadow-tattoo">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <BarChart3 className="h-6 w-6" />
            Resumo Executivo - {project.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Progresso das Metas */}
            <div className="text-center p-4 bg-white rounded-lg shadow-card border border-red-100">
              <div className="text-3xl font-bold text-red-600">{overallProgress.toFixed(0)}%</div>
              <div className="text-sm text-gray-600 mb-2">Progresso das Metas</div>
              <Progress value={overallProgress} className="h-3" />
              <div className="text-xs text-gray-500 mt-1">
                {completedGoals}/{goals.length} metas concluídas
              </div>
            </div>

            {/* Progresso das Tarefas */}
            <div className="text-center p-4 bg-white rounded-lg shadow-card border border-red-100">
              <div className="text-3xl font-bold text-blue-600">{metrics.completionRate}%</div>
              <div className="text-sm text-gray-600 mb-2">Conclusão de Tarefas</div>
              <Progress value={metrics.completionRate} className="h-3" />
              <div className="text-xs text-gray-500 mt-1">
                {completedTasks}/{metrics.totalTasks} tarefas concluídas
              </div>
            </div>

            {/* Alertas de Prazo */}
            <div className="text-center p-4 bg-white rounded-lg shadow-card border border-orange-100">
              <div className="text-3xl font-bold text-orange-600">{urgentGoals}</div>
              <div className="text-sm text-gray-600">Prazos Urgentes</div>
              <div className="text-xs text-gray-500 mt-2">
                Metas com vencimento em 7 dias
              </div>
            </div>

            {/* Tarefas em Andamento */}
            <div className="text-center p-4 bg-white rounded-lg shadow-card border border-green-100">
              <div className="text-3xl font-bold text-green-600">{metrics.inProgressTasks}</div>
              <div className="text-sm text-gray-600">Em Andamento</div>
              <div className="text-xs text-gray-500 mt-2">
                Tarefas ativas no momento
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navegação por Seções */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <Button
              key={section.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              className={isActive 
                ? `bg-red-600 hover:bg-red-700 text-white shadow-red-glow` 
                : `border-red-300 text-red-600 hover:bg-red-50`
              }
            >
              <Icon className="h-4 w-4 mr-2" />
              {section.name}
            </Button>
          );
        })}
      </div>

      {/* Conteúdo das Seções */}
      <div className="min-h-[400px]">
        {activeSection === 'smart-goals' && (
          <div className="space-y-6">
            <EnhancedSmartGoalsDashboard
              project={project}
              goals={enhancedGoals}
              tasks={tasks}
              onUpdateGoal={(goalId, updates) => {
                // Convert back to IProjectSmartGoal format
                const { currentMetric, targetMetric, projectId, createdAt, ...smartGoalUpdates } = updates;
                onUpdateGoal(goalId, smartGoalUpdates);
              }}
              onRefreshGoals={onRefreshGoals}
            />
            
            <Card className="border-dashed border-2 border-red-300 bg-gradient-to-r from-red-50 to-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <Target className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-red-800 mb-2">
                    Gerenciar Metas SMART
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Adicione, edite e acompanhe as metas estratégicas do projeto
                  </p>
                  <EnhancedSmartGoalsManager
                    projectId={project.id}
                    goals={goals}
                    onAddGoal={async (goal) => {
                      await projectService.createSmartGoal(goal);
                      onRefreshGoals();
                    }}
                    onUpdateGoal={async (id, goal) => {
                      await projectService.updateSmartGoal(id, goal);
                      onRefreshGoals();
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'budget' && (
          <Card className="border-l-4 border-l-green-600 shadow-green-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <DollarSign className="h-6 w-6" />
                Orçamento do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Gestão de Orçamento
                </h3>
                <p className="text-gray-600 mb-6">
                  Configure e acompanhe o orçamento, custos e investimentos do projeto
                </p>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setShowBudgetForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item de Orçamento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === 'risks' && (
          <Card className="border-l-4 border-l-orange-600 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-6 w-6" />
                Gestão de Riscos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Identificação e Mitigação de Riscos
                </h3>
                <p className="text-gray-600 mb-6">
                  Identifique, analise e crie planos de mitigação para os riscos do projeto
                </p>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Risco
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === 'improvements' && (
          <Card className="border-l-4 border-l-blue-600 shadow-blue-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <TrendingUp className="h-6 w-6" />
                Ações de Otimização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Melhorias e Otimizações
                </h3>
                <p className="text-gray-600 mb-6">
                  Planeje e implemente melhorias contínuas no projeto e processos
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowImprovementForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Ação de Melhoria
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === 'expansion' && (
          <Card className="border-l-4 border-l-purple-600 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Users className="h-6 w-6" />
                Recursos para Expansão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Planejamento de Expansão
                </h3>
                <p className="text-gray-600 mb-6">
                  Recursos, investimentos e estratégias para crescimento e expansão
                </p>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setShowExpansionForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Recurso de Expansão
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === 'sustainability' && (
          <Card className="border-l-4 border-l-green-600 shadow-green-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Leaf className="h-6 w-6" />
                Sustentabilidade e Relacionamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Leaf className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Sustentabilidade e Impacto Social
                </h3>
                <p className="text-gray-600 mb-6">
                  Iniciativas sustentáveis, responsabilidade social e relacionamento com stakeholders
                </p>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setShowSustainabilityForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Ação Sustentável
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Formulários */}
      <BudgetItemForm
        open={showBudgetForm}
        onOpenChange={setShowBudgetForm}
        onSubmit={handleAddBudgetItem}
        projectId={project.id}
        smartGoals={goals}
      />

      <ImprovementActionForm
        open={showImprovementForm}
        onOpenChange={setShowImprovementForm}
        onSubmit={handleAddImprovementAction}
        projectId={project.id}
        smartGoals={goals}
      />

      <ExpansionResourceForm
        open={showExpansionForm}
        onOpenChange={setShowExpansionForm}
        onSubmit={handleAddExpansionResource}
        projectId={project.id}
        smartGoals={goals}
      />

      <SustainabilityActionForm
        open={showSustainabilityForm}
        onOpenChange={setShowSustainabilityForm}
        onSubmit={handleAddSustainabilityAction}
        projectId={project.id}
        smartGoals={goals}
      />
    </div>
  );
};

export default IntegratedProjectOverview;
