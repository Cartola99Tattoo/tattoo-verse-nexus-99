import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectDashboard from "./ProjectDashboard";
import ProjectRiskManagement from "./ProjectRiskManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Users, 
  Calendar,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { IProject, IProjectTask } from "@/services/interfaces/IProjectService";

interface ProjectPlanningTabsProps {
  project: IProject;
  tasks: IProjectTask[];
}

const ProjectPlanningTabs = ({ project, tasks }: ProjectPlanningTabsProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const mockBudgetItems = [
    { id: '1', description: 'Material de divulgação', estimated: 500, real: 450, status: 'paid' },
    { id: '2', description: 'Equipamentos extras', estimated: 1200, real: 0, status: 'pending' },
    { id: '3', description: 'Coffee break para equipe', estimated: 300, real: 280, status: 'paid' }
  ];

  const mockImprovementActions = [
    { id: '1', title: 'Otimizar processo de agendamento', responsible: 'João Silva', priority: 'high', status: 'in_progress' },
    { id: '2', title: 'Criar checklist de materiais', responsible: 'Maria Santos', priority: 'medium', status: 'completed' },
    { id: '3', title: 'Implementar sistema de feedback', responsible: 'Pedro Costa', priority: 'low', status: 'pending' }
  ];

  const mockExpansionResources = [
    { id: '1', resource: 'Mais 2 tatuadores', justification: 'Aumentar capacidade de atendimento', cost: 8000, status: 'planning' },
    { id: '2', resource: 'Sistema de som profissional', justification: 'Melhorar ambiente', cost: 1500, status: 'approved' },
    { id: '3', resource: 'Espaço adicional', justification: 'Comportar mais clientes', cost: 5000, status: 'researching' }
  ];

  const mockSustainabilityActions = [
    { id: '1', title: 'Cronograma de posts pós-evento', responsible: 'Social Media', deadline: '2024-02-20', status: 'pending' },
    { id: '2', title: 'E-mail de agradecimento', responsible: 'Marketing', deadline: '2024-02-16', status: 'completed' },
    { id: '3', title: 'Coleta de feedback dos clientes', responsible: 'Atendimento', deadline: '2024-02-18', status: 'in_progress' }
  ];

  const mockCategoryGoals = [
    { id: '1', category: 'Marketing', title: 'Alcançar 1000 seguidores', responsible: 'Maria', deadline: '2024-03-01', status: 'in_progress' },
    { id: '2', category: 'Vendas', title: 'Realizar 50 tatuagens flash', responsible: 'Equipe', deadline: '2024-02-15', status: 'achieved' },
    { id: '3', category: 'Operacional', title: 'Zero reclamações de qualidade', responsible: 'Todos', deadline: '2024-02-15', status: 'achieved' }
  ];

  const mockSmartGoals = [
    { 
      id: '1', 
      title: 'Aumentar faturamento do Flash Day em 30%', 
      metric: 'R$ 15.000 vs R$ 12.000 anterior', 
      deadline: '2024-02-15', 
      responsible: 'Gerente', 
      progress: 85 
    },
    { 
      id: '2', 
      title: 'Reduzir tempo de espera para 15min máximo', 
      metric: 'Tempo médio de espera', 
      deadline: '2024-02-15', 
      responsible: 'Atendimento', 
      progress: 60 
    }
  ];

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

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="budget">Orçamento</TabsTrigger>
          <TabsTrigger value="risks">Riscos</TabsTrigger>
          <TabsTrigger value="improvements">Melhorias</TabsTrigger>
          <TabsTrigger value="expansion">Expansão</TabsTrigger>
          <TabsTrigger value="sustainability">Sustentabilidade</TabsTrigger>
          <TabsTrigger value="goals">Metas SMART</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <ProjectDashboard project={project} tasks={tasks} />
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
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBudgetItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.description}</h4>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>Categoria: Marketing</span>
                        <span>Estimado: R$ {item.estimated}</span>
                        <span>Real: R$ {item.real}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status === 'paid' ? 'Pago' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Total Estimado:</span>
                    <span>R$ {mockBudgetItems.reduce((sum, item) => sum + item.estimated, 0)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-green-600">
                    <span>Total Real:</span>
                    <span>R$ {mockBudgetItems.reduce((sum, item) => sum + item.real, 0)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-blue-600">
                    <span>Disponível:</span>
                    <span>R$ {mockBudgetItems.reduce((sum, item) => sum + item.estimated, 0) - mockBudgetItems.reduce((sum, item) => sum + item.real, 0)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ações de Otimização</CardTitle>
                <CardDescription>Melhorias nos processos e execução com alocação de recursos</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Ação
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockImprovementActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{action.title}</h4>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>Responsável: {action.responsible}</span>
                        <span>Prioridade: {action.priority === 'high' ? 'Alta' : action.priority === 'medium' ? 'Média' : 'Baixa'}</span>
                        <span>Recursos: Equipamento XYZ</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Critério de Qualidade: Reduzir tempo de espera em 50%
                      </div>
                    </div>
                    <Badge className={getStatusColor(action.status)}>
                      {action.status === 'completed' ? 'Concluída' : 
                       action.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expansion" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recursos para Expansão</CardTitle>
                <CardDescription>Planejamento de crescimento com verificação de disponibilidade</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Recurso
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockExpansionResources.map((resource) => (
                  <div key={resource.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{resource.resource}</h4>
                        <p className="text-sm text-gray-600 mt-1">{resource.justification}</p>
                        <div className="text-sm text-gray-600 mt-2 space-y-1">
                          <div>Custo Estimado: R$ {resource.cost}</div>
                          <div>Disponibilidade: {resource.resource.includes('tatuador') ? 'Verificar agenda' : 'Em estoque'}</div>
                          <div>Impacto: Aumento de 30% na capacidade</div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(resource.status)}>
                        {resource.status === 'approved' ? 'Aprovado' : 
                         resource.status === 'planning' ? 'Planejamento' : 'Pesquisando'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sustentabilidade e Relacionamento</CardTitle>
                <CardDescription>Ações para manutenção a longo prazo e integração com CRM</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Ação
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSustainabilityActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{action.title}</h4>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>Responsável: {action.responsible}</span>
                        <span>Prazo: {new Date(action.deadline).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Integração: {action.title.includes('post') ? 'Redes Sociais' : 
                                    action.title.includes('email') ? 'CRM/Email Marketing' : 'Sistema de Feedback'}
                      </div>
                    </div>
                    <Badge className={getStatusColor(action.status)}>
                      {action.status === 'completed' ? 'Concluída' : 
                       action.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Metas por Categoria</CardTitle>
                <CardDescription>Objetivos específicos por área com marcos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCategoryGoals.map((goal) => (
                    <div key={goal.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {goal.category}
                            </Badge>
                            <Badge className={getStatusColor(goal.status)}>
                              {goal.status === 'achieved' ? 'Alcançada' : 'Em Andamento'}
                            </Badge>
                          </div>
                          <h5 className="font-medium text-sm">{goal.title}</h5>
                          <div className="text-xs text-gray-600 mt-1">
                            <span>Responsável: {goal.responsible}</span>
                            <span className="ml-3">Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Marco: {goal.category === 'Marketing' ? '500 seguidores alcançados' : 
                                    goal.category === 'Vendas' ? '25 tatuagens concluídas' : 'Zero incidentes registrados'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metas SMART Interativas</CardTitle>
                <CardDescription>Objetivos específicos e mensuráveis com KPIs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSmartGoals.map((goal) => (
                    <div key={goal.id} className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm mb-2">{goal.title}</h5>
                      <div className="text-xs text-gray-600 mb-2">
                        <div>Métrica: {goal.metric}</div>
                        <div>Responsável: {goal.responsible}</div>
                        <div>Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</div>
                        <div>Status: {goal.progress >= 100 ? 'Concluída' : goal.progress >= 80 ? 'Quase lá' : 'Em andamento'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progresso</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                        <div className="text-xs text-gray-500">
                          KPI Atual: {goal.progress >= 85 ? 'R$ 12.750' : 'R$ 10.200'} de faturamento
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectPlanningTabs;
