import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectDashboard from "./ProjectDashboard";
import ProjectRiskManagement from "./ProjectRiskManagement";
import EnhancedSmartGoalsManager from "./EnhancedSmartGoalsManager";
import BudgetItemForm from "./BudgetItemForm";
import ImprovementActionForm from "./ImprovementActionForm";
import ExpansionResourceForm from "./ExpansionResourceForm";
import SustainabilityActionForm from "./SustainabilityActionForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Target, AlertTriangle } from "lucide-react";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getProjectService } from "@/services/serviceFactory";
import { 
  IProject, 
  IProjectTask, 
  IProjectBudgetItem,
  IProjectImprovementAction,
  IProjectExpansionResource,
  IProjectSustainabilityAction,
  IProjectSmartGoal
} from "@/services/interfaces/IProjectService";
import { toast } from "@/hooks/use-toast";

interface ProjectPlanningTabsProps {
  project: IProject;
  tasks: IProjectTask[];
}

const ProjectPlanningTabs = ({ project, tasks }: ProjectPlanningTabsProps) => {
  const [activeTab, setActiveTab] = useState("goals");
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showImprovementForm, setShowImprovementForm] = useState(false);
  const [showExpansionForm, setShowExpansionForm] = useState(false);
  const [showSustainabilityForm, setShowSustainabilityForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const projectService = getProjectService();

  // Queries para as diferentes seções com null safety
  const { data: budgetData = [], refresh: refreshBudget } = useDataQuery<IProjectBudgetItem[]>(
    () => projectService.fetchProjectBudgetItems(project.id),
    [project.id]
  );

  const { data: improvementData = [], refresh: refreshImprovements } = useDataQuery<IProjectImprovementAction[]>(
    () => projectService.fetchProjectImprovementActions(project.id),
    [project.id]
  );

  const { data: expansionData = [], refresh: refreshExpansion } = useDataQuery<IProjectExpansionResource[]>(
    () => projectService.fetchProjectExpansionResources(project.id),
    [project.id]
  );

  const { data: sustainabilityData = [], refresh: refreshSustainability } = useDataQuery<IProjectSustainabilityAction[]>(
    () => projectService.fetchProjectSustainabilityActions(project.id),
    [project.id]
  );

  const { data: smartGoalsData = [], refresh: refreshSmartGoals } = useDataQuery<IProjectSmartGoal[]>(
    () => projectService.fetchProjectSmartGoals(project.id),
    [project.id]
  );

  // Ensure arrays are never null
  const budgetItems = Array.isArray(budgetData) ? budgetData : [];
  const improvementActions = Array.isArray(improvementData) ? improvementData : [];
  const expansionResources = Array.isArray(expansionData) ? expansionData : [];
  const sustainabilityActions = Array.isArray(sustainabilityData) ? sustainabilityData : [];
  const smartGoals = Array.isArray(smartGoalsData) ? smartGoalsData : [];

  // Handlers para Metas SMART
  const handleAddSmartGoal = async (goal: Omit<IProjectSmartGoal, 'id' | 'createdAt'>) => {
    try {
      await projectService.createSmartGoal(goal);
      refreshSmartGoals();
      toast({
        title: "Meta criada",
        description: "Meta SMART criada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar meta SMART.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSmartGoal = async (id: string, goal: Partial<IProjectSmartGoal>) => {
    try {
      await projectService.updateSmartGoal(id, goal);
      refreshSmartGoals();
      toast({
        title: "Meta atualizada",
        description: "Meta SMART atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar meta SMART.",
        variant: "destructive"
      });
    }
  };

  // Handlers para adicionar itens
  const handleAddBudgetItem = async (item: Omit<IProjectBudgetItem, 'id' | 'createdAt'>) => {
    try {
      await projectService.createBudgetItem(item);
      refreshBudget();
      toast({
        title: "Item adicionado",
        description: "Item de orçamento adicionado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar item de orçamento.",
        variant: "destructive"
      });
    }
  };

  const handleAddImprovementAction = async (action: Omit<IProjectImprovementAction, 'id' | 'createdAt'>) => {
    try {
      await projectService.createImprovementAction(action);
      refreshImprovements();
      toast({
        title: "Ação adicionada",
        description: "Ação de melhoria adicionada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar ação de melhoria.",
        variant: "destructive"
      });
    }
  };

  const handleAddExpansionResource = async (resource: Omit<IProjectExpansionResource, 'id' | 'createdAt'>) => {
    try {
      await projectService.createExpansionResource(resource);
      refreshExpansion();
      toast({
        title: "Recurso adicionado",
        description: "Recurso de expansão adicionado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar recurso de expansão.",
        variant: "destructive"
      });
    }
  };

  const handleAddSustainabilityAction = async (action: Omit<IProjectSustainabilityAction, 'id' | 'createdAt'>) => {
    try {
      await projectService.createSustainabilityAction(action);
      refreshSustainability();
      toast({
        title: "Ação adicionada",
        description: "Ação de sustentabilidade adicionada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar ação de sustentabilidade.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
      case 'achieved': return 'bg-green-100 text-green-800';
      case 'in_progress':
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'researching': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'completed': 'Concluída',
      'paid': 'Pago',
      'pending': 'Pendente',
      'in_progress': 'Em Andamento',
      'planning': 'Planejamento',
      'approved': 'Aprovado',
      'researching': 'Pesquisando',
      'acquired': 'Adquirido',
      'estimated': 'Estimado'
    };
    return labels[status] || status;
  };

  // Verificar se há tarefas sem associação SMART
  const tasksWithoutSmartGoal = (tasks || []).filter(task => !task.smartGoalAssociation);

  return (
    <div className="space-y-6">
      {smartGoals.length === 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">
                Defina as Metas SMART primeiro para orientar estrategicamente todas as tarefas do projeto.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="goals" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            Metas SMART
          </TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="budget">Orçamento</TabsTrigger>
          <TabsTrigger value="risks">Riscos</TabsTrigger>
          <TabsTrigger value="improvements">Melhorias</TabsTrigger>
          <TabsTrigger value="expansion">Expansão</TabsTrigger>
          <TabsTrigger value="sustainability">Sustentabilidade</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          <EnhancedSmartGoalsManager
            projectId={project.id}
            goals={smartGoals}
            onAddGoal={handleAddSmartGoal}
            onUpdateGoal={handleUpdateSmartGoal}
          />
          
          {tasksWithoutSmartGoal.length > 0 && smartGoals.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Tarefas sem Associação SMART
                </CardTitle>
                <CardDescription className="text-amber-700">
                  {tasksWithoutSmartGoal.length} tarefa(s) não estão associadas a nenhuma Meta SMART.
                  Considere associá-las para melhor direcionamento estratégico.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <ProjectDashboard project={project} tasks={tasks || []} />
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <ProjectRiskManagement project={project} />
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Orçamento do Projeto</CardTitle>
                <CardDescription>Controle de custos estimados e reais por categoria</CardDescription>
              </div>
              <Button onClick={() => setShowBudgetForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.description}</h4>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>Estimado: R$ {item.estimatedCost}</span>
                        <span>Real: R$ {item.realCost}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusLabel(item.status)}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingItem(item);
                        setShowBudgetForm(true);
                      }}>
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {budgetItems.length > 0 && (
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>Total Estimado:</span>
                      <span>R$ {budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-green-600">
                      <span>Total Real:</span>
                      <span>R$ {budgetItems.reduce((sum, item) => sum + item.realCost, 0)}</span>
                    </div>
                  </div>
                )}
                
                {budgetItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum item de orçamento adicionado ainda.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ações de Otimização</CardTitle>
                <CardDescription>Melhorias nos processos e execução</CardDescription>
              </div>
              <Button onClick={() => setShowImprovementForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Ação
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {improvementActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{action.title}</h4>
                      {action.description && (
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      )}
                      <div className="flex gap-4 text-sm text-gray-600 mt-2">
                        {action.responsible && <span>Responsável: {action.responsible}</span>}
                        <span>Prioridade: {action.priority === 'high' ? 'Alta' : action.priority === 'medium' ? 'Média' : 'Baixa'}</span>
                        {action.dueDate && <span>Prazo: {new Date(action.dueDate).toLocaleDateString('pt-BR')}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(action.status)}>
                        {getStatusLabel(action.status)}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingItem(action);
                        setShowImprovementForm(true);
                      }}>
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {improvementActions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma ação de melhoria adicionada ainda.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expansion" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recursos para Expansão</CardTitle>
                <CardDescription>Planejamento de crescimento</CardDescription>
              </div>
              <Button onClick={() => setShowExpansionForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Recurso
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expansionResources.map((resource) => (
                  <div key={resource.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{resource.resource}</h4>
                        <p className="text-sm text-gray-600 mt-1">{resource.justification}</p>
                        <div className="text-sm text-gray-600 mt-2">
                          <div>Custo Estimado: R$ {resource.estimatedCost}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(resource.status)}>
                          {getStatusLabel(resource.status)}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingItem(resource);
                          setShowExpansionForm(true);
                        }}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {expansionResources.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum recurso de expansão adicionado ainda.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sustentabilidade e Relacionamento</CardTitle>
                <CardDescription>Ações para manutenção a longo prazo</CardDescription>
              </div>
              <Button onClick={() => setShowSustainabilityForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Ação
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sustainabilityActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{action.title}</h4>
                      {action.description && (
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      )}
                      <div className="flex gap-4 text-sm text-gray-600 mt-2">
                        {action.responsible && <span>Responsável: {action.responsible}</span>}
                        {action.deadline && <span>Prazo: {new Date(action.deadline).toLocaleDateString('pt-BR')}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(action.status)}>
                        {getStatusLabel(action.status)}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingItem(action);
                        setShowSustainabilityForm(true);
                      }}>
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {sustainabilityActions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma ação de sustentabilidade adicionada ainda.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Formulários */}
      <BudgetItemForm
        open={showBudgetForm}
        onOpenChange={(open) => {
          setShowBudgetForm(open);
          if (!open) setEditingItem(null);
        }}
        onSubmit={handleAddBudgetItem}
        projectId={project.id}
        editItem={editingItem}
      />

      <ImprovementActionForm
        open={showImprovementForm}
        onOpenChange={(open) => {
          setShowImprovementForm(open);
          if (!open) setEditingItem(null);
        }}
        onSubmit={handleAddImprovementAction}
        projectId={project.id}
        editAction={editingItem}
      />

      <ExpansionResourceForm
        open={showExpansionForm}
        onOpenChange={(open) => {
          setShowExpansionForm(open);
          if (!open) setEditingItem(null);
        }}
        onSubmit={handleAddExpansionResource}
        projectId={project.id}
        editResource={editingItem}
      />

      <SustainabilityActionForm
        open={showSustainabilityForm}
        onOpenChange={(open) => {
          setShowSustainabilityForm(open);
          if (!open) setEditingItem(null);
        }}
        onSubmit={handleAddSustainabilityAction}
        projectId={project.id}
        editAction={editingItem}
      />
    </div>
  );
};

export default ProjectPlanningTabs;
