import { IProjectService, IProject, IProjectTask, IKanbanStage, IProjectBudgetItem, IProjectImprovementAction, IProjectExpansionResource, IProjectSustainabilityAction, IProjectCategoryGoal, IProjectSmartGoal, ILearningCycle, ISprint, IEnhancedSmartGoal, IProjectRisk } from '@/services/interfaces/IProjectService';
import { mockUtils } from './mockUtils';

// Mock data for projects
const mockProjects: IProject[] = [
  {
    id: '1',
    name: 'Redesign do Site',
    description: 'Redesenho completo do site da empresa com foco em UX',
    startDate: '2023-01-15',
    endDate: '2023-04-30',
    status: 'active',
    createdAt: '2023-01-10T10:00:00Z',
    updatedAt: '2023-01-10T10:00:00Z',
    taskCount: 24,
    completedTasksCount: 8,
    mainHypothesis: 'Um design mais moderno aumentará as conversões em 25%',
    validationMetrics: 'Taxa de conversão, tempo no site, bounce rate',
    currentSprint: 'Sprint 3 - Implementação de UI',
  },
  {
    id: '2',
    name: 'Lançamento App Mobile',
    description: 'Desenvolvimento e lançamento do aplicativo mobile para clientes',
    startDate: '2023-02-01',
    endDate: '2023-07-15',
    status: 'active',
    createdAt: '2023-01-20T14:30:00Z',
    updatedAt: '2023-01-20T14:30:00Z',
    taskCount: 36,
    completedTasksCount: 12,
    mainHypothesis: 'Um app mobile aumentará o engajamento dos clientes em 40%',
    validationMetrics: 'Downloads, usuários ativos, tempo de uso',
  },
  {
    id: '3',
    name: 'Campanha de Marketing Q2',
    description: 'Planejamento e execução da campanha de marketing para Q2',
    startDate: '2023-04-01',
    endDate: '2023-06-30',
    status: 'planning',
    createdAt: '2023-03-15T09:45:00Z',
    updatedAt: '2023-03-15T09:45:00Z',
    taskCount: 18,
    completedTasksCount: 0,
    mainHypothesis: 'Focar em marketing de conteúdo aumentará leads em 30%',
    validationMetrics: 'Novos leads, taxa de conversão, ROI',
  },
  {
    id: '4',
    name: 'Expansão Internacional',
    description: 'Planejamento para expansão do negócio para mercados internacionais',
    startDate: '2023-06-01',
    endDate: '2024-01-31',
    status: 'planning',
    createdAt: '2023-02-28T16:20:00Z',
    updatedAt: '2023-02-28T16:20:00Z',
    taskCount: 42,
    completedTasksCount: 0,
    mainHypothesis: 'A expansão para o mercado europeu aumentará o faturamento em 50%',
    validationMetrics: 'Vendas internacionais, custo de aquisição, retenção',
  },
  {
    id: '5',
    name: 'Otimização de Processos Internos',
    description: 'Revisão e otimização dos processos internos da empresa',
    startDate: '2023-03-01',
    endDate: '2023-05-31',
    status: 'completed',
    createdAt: '2023-02-15T11:10:00Z',
    updatedAt: '2023-06-01T15:30:00Z',
    taskCount: 16,
    completedTasksCount: 16,
    mainHypothesis: 'A otimização de processos reduzirá custos operacionais em 20%',
    validationMetrics: 'Tempo de execução, custos operacionais, satisfação dos funcionários',
  }
];

// Mock data for tasks
const mockTasks: IProjectTask[] = [
  {
    id: '101',
    projectId: '1',
    title: 'Análise do site atual',
    description: 'Realizar análise completa do site atual, identificando pontos de melhoria',
    status: 'completed',
    priority: 'high',
    assignedTo: 'ana.silva',
    dueDate: '2023-01-25',
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2023-01-22T14:30:00Z',
    order: 1,
    storyPoints: 5,
    estimatedHours: 8,
    smartGoalAssociation: [
      {
        goalId: '201',
        criteria: ['specific', 'measurable']
      }
    ]
  },
  {
    id: '102',
    projectId: '1',
    title: 'Wireframes das páginas principais',
    description: 'Criar wireframes para homepage, produtos e contato',
    status: 'completed',
    priority: 'high',
    assignedTo: 'carlos.design',
    dueDate: '2023-02-10',
    createdAt: '2023-01-20T10:15:00Z',
    updatedAt: '2023-02-08T16:45:00Z',
    order: 2,
    storyPoints: 8,
    estimatedHours: 16,
    smartGoalAssociation: [
      {
        goalId: '201',
        criteria: ['specific', 'achievable']
      }
    ]
  },
  {
    id: '103',
    projectId: '1',
    title: 'Design visual da homepage',
    description: 'Criar design visual final da homepage baseado nos wireframes aprovados',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'carlos.design',
    dueDate: '2023-02-28',
    createdAt: '2023-02-11T08:30:00Z',
    updatedAt: '2023-02-11T08:30:00Z',
    order: 3,
    storyPoints: 13,
    estimatedHours: 24,
    smartGoalAssociation: [
      {
        goalId: '201',
        criteria: ['achievable', 'time_bound']
      }
    ]
  },
  {
    id: '104',
    projectId: '1',
    title: 'Implementação HTML/CSS da homepage',
    description: 'Implementar o código HTML/CSS da homepage baseado no design aprovado',
    status: 'to_do',
    priority: 'medium',
    assignedTo: 'pedro.dev',
    dueDate: '2023-03-15',
    createdAt: '2023-02-15T13:45:00Z',
    updatedAt: '2023-02-15T13:45:00Z',
    order: 4,
    storyPoints: 8,
    estimatedHours: 16,
    smartGoalAssociation: [
      {
        goalId: '202',
        criteria: ['specific', 'measurable']
      }
    ]
  },
  {
    id: '105',
    projectId: '1',
    title: 'Testes de usabilidade',
    description: 'Realizar testes de usabilidade com usuários reais',
    status: 'to_do',
    priority: 'high',
    assignedTo: 'ana.silva',
    dueDate: '2023-03-30',
    createdAt: '2023-02-20T09:20:00Z',
    updatedAt: '2023-02-20T09:20:00Z',
    order: 5,
    storyPoints: 5,
    estimatedHours: 8,
    smartGoalAssociation: [
      {
        goalId: '203',
        criteria: ['measurable', 'relevant']
      }
    ]
  },
  {
    id: '201',
    projectId: '2',
    title: 'Definição de requisitos do app',
    description: 'Documentar todos os requisitos funcionais e não-funcionais do aplicativo',
    status: 'completed',
    priority: 'critical',
    assignedTo: 'mariana.pm',
    dueDate: '2023-02-15',
    createdAt: '2023-02-01T10:00:00Z',
    updatedAt: '2023-02-14T16:30:00Z',
    order: 1,
    storyPoints: 8,
    estimatedHours: 16
  },
  {
    id: '202',
    projectId: '2',
    title: 'Design de UI do app',
    description: 'Criar design visual para todas as telas do aplicativo',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'carlos.design',
    dueDate: '2023-03-15',
    createdAt: '2023-02-16T09:15:00Z',
    updatedAt: '2023-02-16T09:15:00Z',
    order: 2,
    storyPoints: 13,
    estimatedHours: 40
  }
];

// Mock data for kanban stages
const mockKanbanStages: IKanbanStage[] = [
  {
    id: '1',
    projectId: '1',
    name: 'To Do',
    order: 1,
    color: 'gray',
    createdAt: '2023-01-10T10:00:00Z'
  },
  {
    id: '2',
    projectId: '1',
    name: 'In Progress',
    order: 2,
    color: 'blue',
    createdAt: '2023-01-10T10:00:00Z'
  },
  {
    id: '3',
    projectId: '1',
    name: 'Review',
    order: 3,
    color: 'yellow',
    createdAt: '2023-01-10T10:00:00Z'
  },
  {
    id: '4',
    projectId: '1',
    name: 'Completed',
    order: 4,
    color: 'green',
    createdAt: '2023-01-10T10:00:00Z'
  }
];

// Mock data for SMART goals
const mockSmartGoals: IProjectSmartGoal[] = [
  {
    id: '201',
    projectId: '1',
    title: 'Melhorar a experiência do usuário',
    specific: 'Redesenhar a interface do usuário para aumentar a usabilidade',
    measurable: 'Aumentar a taxa de conversão em 25%',
    achievable: 'Utilizar as melhores práticas de UX/UI',
    relevant: 'Alinhado com o objetivo de aumentar vendas online',
    timeBound: 'Concluir até o final do Q1 2023',
    deadline: '2023-03-31',
    responsible: 'carlos.design',
    progress: 40,
    createdAt: '2023-01-10T10:00:00Z'
  },
  {
    id: '202',
    projectId: '1',
    title: 'Otimizar performance do site',
    specific: 'Melhorar o tempo de carregamento das páginas',
    measurable: 'Reduzir o tempo de carregamento para menos de 2 segundos',
    achievable: 'Implementar técnicas de otimização de código e imagens',
    relevant: 'Melhora a experiência do usuário e SEO',
    timeBound: 'Implementar até o final de fevereiro',
    deadline: '2023-02-28',
    responsible: 'pedro.dev',
    progress: 20,
    createdAt: '2023-01-10T10:00:00Z'
  },
  {
    id: '203',
    projectId: '1',
    title: 'Aumentar engajamento dos usuários',
    specific: 'Implementar recursos interativos no site',
    measurable: 'Aumentar o tempo médio de sessão em 30%',
    achievable: 'Adicionar elementos interativos e conteúdo relevante',
    relevant: 'Aumenta a probabilidade de conversão',
    timeBound: 'Implementar até o final de março',
    deadline: '2023-03-31',
    responsible: 'ana.silva',
    progress: 10,
    createdAt: '2023-01-10T10:00:00Z'
  }
];

// Mock data for enhanced SMART goals
const mockEnhancedSmartGoals: IEnhancedSmartGoal[] = [
  {
    id: '301',
    projectId: '1',
    title: 'Melhorar a experiência do usuário',
    specific: 'Redesenhar a interface do usuário para aumentar a usabilidade',
    measurable: 'Aumentar a taxa de conversão em 25%',
    achievable: 'Utilizar as melhores práticas de UX/UI',
    relevant: 'Alinhado com o objetivo de aumentar vendas online',
    timeBound: 'Concluir até o final do Q1 2023',
    currentMetric: 10,
    targetMetric: 25,
    deadline: '2023-03-31',
    responsible: 'carlos.design',
    progress: 40,
    createdAt: '2023-01-10T10:00:00Z'
  },
  {
    id: '302',
    projectId: '1',
    title: 'Otimizar performance do site',
    specific: 'Melhorar o tempo de carregamento das páginas',
    measurable: 'Reduzir o tempo de carregamento para menos de 2 segundos',
    achievable: 'Implementar técnicas de otimização de código e imagens',
    relevant: 'Melhora a experiência do usuário e SEO',
    timeBound: 'Implementar até o final de fevereiro',
    currentMetric: 3.5,
    targetMetric: 2,
    deadline: '2023-02-28',
    responsible: 'pedro.dev',
    progress: 20,
    createdAt: '2023-01-10T10:00:00Z'
  },
  {
    id: '303',
    projectId: '1',
    title: 'Aumentar engajamento dos usuários',
    specific: 'Implementar recursos interativos no site',
    measurable: 'Aumentar o tempo médio de sessão em 30%',
    achievable: 'Adicionar elementos interativos e conteúdo relevante',
    relevant: 'Aumenta a probabilidade de conversão',
    timeBound: 'Implementar até o final de março',
    currentMetric: 2.1,
    targetMetric: 3,
    deadline: '2023-03-31',
    responsible: 'ana.silva',
    progress: 10,
    createdAt: '2023-01-10T10:00:00Z'
  }
];

// Mock data for budget items
const mockBudgetItems: IProjectBudgetItem[] = [
  {
    id: '401',
    projectId: '1',
    description: 'Licença de software de design',
    estimatedCost: 1200,
    realCost: 1200,
    status: 'paid',
    smartGoalId: '201',
    smartCriteria: 'specific',
    createdAt: '2023-01-15T10:00:00Z'
  },
  {
    id: '402',
    projectId: '1',
    description: 'Contratação de especialista em UX',
    estimatedCost: 5000,
    realCost: 0,
    status: 'estimated',
    smartGoalId: '201',
    smartCriteria: 'achievable',
    createdAt: '2023-01-15T10:00:00Z'
  }
];

// Mock data for improvement actions
const mockImprovementActions: IProjectImprovementAction[] = [
  {
    id: '501',
    projectId: '1',
    title: 'Implementar sistema de cache',
    description: 'Adicionar sistema de cache para melhorar performance',
    responsible: 'pedro.dev',
    priority: 'high',
    status: 'pending',
    dueDate: '2023-02-20',
    smartGoalId: '202',
    smartCriteria: 'specific',
    createdAt: '2023-01-20T10:00:00Z'
  },
  {
    id: '502',
    projectId: '1',
    title: 'Otimizar imagens do site',
    description: 'Comprimir e otimizar todas as imagens do site',
    responsible: 'carlos.design',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2023-02-15',
    smartGoalId: '202',
    smartCriteria: 'achievable',
    createdAt: '2023-01-20T10:00:00Z'
  }
];

// Mock data for expansion resources
const mockExpansionResources: IProjectExpansionResource[] = [
  {
    id: '601',
    projectId: '1',
    resource: 'Servidor dedicado',
    justification: 'Necessário para suportar o aumento de tráfego esperado',
    estimatedCost: 3000,
    status: 'planning',
    smartGoalId: '202',
    smartCriteria: 'achievable',
    createdAt: '2023-01-25T10:00:00Z'
  },
  {
    id: '602',
    projectId: '1',
    resource: 'Ferramenta de análise avançada',
    justification: 'Para medir com precisão as métricas de engajamento',
    estimatedCost: 1500,
    status: 'researching',
    smartGoalId: '203',
    smartCriteria: 'measurable',
    createdAt: '2023-01-25T10:00:00Z'
  }
];

// Mock data for sustainability actions
const mockSustainabilityActions: IProjectSustainabilityAction[] = [
  {
    id: '701',
    projectId: '1',
    title: 'Implementar modo escuro',
    description: 'Adicionar modo escuro para reduzir consumo de energia',
    responsible: 'pedro.dev',
    deadline: '2023-03-15',
    status: 'pending',
    smartGoalId: '203',
    smartCriteria: 'relevant',
    createdAt: '2023-01-30T10:00:00Z'
  },
  {
    id: '702',
    projectId: '1',
    title: 'Otimizar requisições ao servidor',
    description: 'Reduzir número de requisições para economizar recursos',
    responsible: 'pedro.dev',
    deadline: '2023-03-01',
    status: 'in_progress',
    smartGoalId: '202',
    smartCriteria: 'specific',
    createdAt: '2023-01-30T10:00:00Z'
  }
];

// Mock data for risks
const mockRisks: IProjectRisk[] = [
  {
    id: '801',
    projectId: '1',
    description: 'Atraso na entrega do design',
    probability: 'medium',
    impact: 'high',
    mitigation: 'Iniciar desenvolvimento com wireframes enquanto aguarda design final',
    status: 'open',
    smartGoalId: '201',
    smartCriteria: 'time_bound',
    createdAt: '2023-01-15T10:00:00Z'
  },
  {
    id: '802',
    projectId: '1',
    description: 'Problemas de compatibilidade com navegadores antigos',
    probability: 'high',
    impact: 'medium',
    mitigation: 'Implementar fallbacks e testar em múltiplos navegadores',
    status: 'mitigated',
    smartGoalId: '202',
    smartCriteria: 'achievable',
    createdAt: '2023-01-15T10:00:00Z'
  }
];

// Mock data for learning cycles
const mockLearningCycles: ILearningCycle[] = [
  {
    id: '901',
    projectId: '1',
    hypothesis: 'Usuários preferem um processo de checkout simplificado',
    experiment: 'A/B test com duas versões do checkout',
    results: '67% dos usuários completaram o checkout simplificado vs 42% no original',
    learnings: 'Simplificar o processo de checkout aumenta significativamente a conversão',
    nextAction: 'Implementar checkout simplificado em todas as páginas',
    date: '2023-02-10',
    createdAt: '2023-02-10T15:30:00Z'
  },
  {
    id: '902',
    projectId: '1',
    hypothesis: 'Imagens maiores de produtos aumentam o engajamento',
    experiment: 'A/B test com diferentes tamanhos de imagens',
    results: 'Não houve diferença significativa no engajamento',
    learnings: 'O tamanho da imagem não é um fator decisivo para engajamento',
    nextAction: 'Focar em qualidade e relevância das imagens em vez de tamanho',
    date: '2023-02-20',
    createdAt: '2023-02-20T14:15:00Z'
  }
];

// Mock data for sprints
const mockSprints: ISprint[] = [
  {
    id: '1001',
    projectId: '1',
    name: 'Sprint 1 - Planejamento',
    goal: 'Definir requisitos e planejar o projeto',
    startDate: '2023-01-15',
    endDate: '2023-01-28',
    status: 'completed',
    storyPoints: 21,
    completedPoints: 21,
    createdAt: '2023-01-14T09:00:00Z'
  },
  {
    id: '1002',
    projectId: '1',
    name: 'Sprint 2 - Design',
    goal: 'Criar wireframes e designs visuais',
    startDate: '2023-01-29',
    endDate: '2023-02-11',
    status: 'completed',
    storyPoints: 34,
    completedPoints: 29,
    createdAt: '2023-01-28T16:30:00Z'
  },
  {
    id: '1003',
    projectId: '1',
    name: 'Sprint 3 - Implementação de UI',
    goal: 'Implementar HTML/CSS das páginas principais',
    startDate: '2023-02-12',
    endDate: '2023-02-25',
    status: 'active',
    storyPoints: 29,
    completedPoints: 13,
    createdAt: '2023-02-11T17:00:00Z'
  }
];

class MockProjectService implements IProjectService {
  // Base CRUD operations required by interface
  async fetchAll(): Promise<IProject[]> {
    await mockUtils.simulateDelay();
    return mockProjects;
  }

  async fetchById(id: string): Promise<IProject | null> {
    await mockUtils.simulateDelay();
    return mockProjects.find(p => p.id === id) || null;
  }

  async create(project: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProject> {
    await mockUtils.simulateDelay();
    const newProject: IProject = {
      ...project,
      id: mockUtils.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockProjects.push(newProject);
    return newProject;
  }

  async update(id: string, project: Partial<IProject>): Promise<IProject> {
    await mockUtils.simulateDelay();
    const index = mockProjects.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProjects[index] = { ...mockProjects[index], ...project, updatedAt: new Date().toISOString() };
      return mockProjects[index];
    }
    throw new Error('Project not found');
  }

  async delete(id: string): Promise<void> {
    await mockUtils.simulateDelay();
    const index = mockProjects.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProjects.splice(index, 1);
    }
  }

  // Project-specific methods
  async fetchProjects(): Promise<IProject[]> {
    return this.fetchAll();
  }

  async createProject(project: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProject> {
    return this.create(project);
  }

  async updateProject(id: string, project: Partial<IProject>): Promise<IProject> {
    return this.update(id, project);
  }

  async deleteProject(id: string): Promise<void> {
    return this.delete(id);
  }

  // Task methods
  async fetchProjectTasks(projectId: string): Promise<IProjectTask[]> {
    await mockUtils.simulateDelay();
    return mockTasks.filter(task => task.projectId === projectId);
  }

  async createTask(task: Omit<IProjectTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProjectTask> {
    await mockUtils.simulateDelay();
    const newTask: IProjectTask = {
      ...task,
      id: mockUtils.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockTasks.push(newTask);
    return newTask;
  }

  async updateTask(id: string, task: Partial<IProjectTask>): Promise<IProjectTask> {
    await mockUtils.simulateDelay();
    const index = mockTasks.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTasks[index] = { ...mockTasks[index], ...task, updatedAt: new Date().toISOString() };
      return mockTasks[index];
    }
    throw new Error('Task not found');
  }

  async deleteTask(id: string): Promise<void> {
    await mockUtils.simulateDelay();
    const index = mockTasks.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTasks.splice(index, 1);
    }
  }

  // Kanban stage methods
  async fetchKanbanStages(projectId: string): Promise<IKanbanStage[]> {
    await mockUtils.simulateDelay();
    return mockKanbanStages.filter(stage => stage.projectId === projectId);
  }

  async createKanbanStage(stage: Omit<IKanbanStage, 'id' | 'createdAt'>): Promise<IKanbanStage> {
    await mockUtils.simulateDelay();
    const newStage: IKanbanStage = {
      ...stage,
      id: mockUtils.generateId(),
      createdAt: new Date().toISOString()
    };
    mockKanbanStages.push(newStage);
    return newStage;
  }

  async updateKanbanStage(id: string, stage: Partial<IKanbanStage>): Promise<IKanbanStage> {
    await mockUtils.simulateDelay();
    const index = mockKanbanStages.findIndex(s => s.id === id);
    if (index !== -1) {
      mockKanbanStages[index] = { ...mockKanbanStages[index], ...stage };
      return mockKanbanStages[index];
    }
    throw new Error('Kanban stage not found');
  }

  async deleteKanbanStage(id: string): Promise<void> {
    await mockUtils.simulateDelay();
    const index = mockKanbanStages.findIndex(s => s.id === id);
    if (index !== -1) {
      mockKanbanStages.splice(index, 1);
    }
  }

  // Budget item methods
  async fetchProjectBudgetItems(projectId: string): Promise<IProjectBudgetItem[]> {
    await mockUtils.simulateDelay();
    return mockBudgetItems.filter(item => item.projectId === projectId);
  }

  async createBudgetItem(item: Omit<IProjectBudgetItem, 'id' | 'createdAt'>): Promise<IProjectBudgetItem> {
    await mockUtils.simulateDelay();
    const newItem: IProjectBudgetItem = {
      ...item,
      id: mockUtils.generateId(),
      createdAt: new Date().toISOString()
    };
    mockBudgetItems.push(newItem);
    return newItem;
  }

  async updateBudgetItem(id: string, item: Partial<IProjectBudgetItem>): Promise<IProjectBudgetItem> {
    await mockUtils.simulateDelay();
    const index = mockBudgetItems.findIndex(i => i.id === id);
    if (index !== -1) {
      mockBudgetItems[index] = { ...mockBudgetItems[index], ...item };
      return mockBudgetItems[index];
    }
    throw new Error('Budget item not found');
  }

  async deleteBudgetItem(id: string): Promise<void> {
    await mockUtils.simulateDelay();
    const index = mockBudgetItems.findIndex(i => i.id === id);
    if (index !== -1) {
      mockBudgetItems.splice(index, 1);
    }
  }

  // Improvement action methods
  async fetchProjectImprovementActions(projectId: string): Promise<IProjectImprovementAction[]> {
    await mockUtils.simulateDelay();
    return mockImprovementActions.filter(action => action.projectId === projectId);
  }

  async createImprovementAction(action: Omit<IProjectImprovementAction, 'id' | 'createdAt'>): Promise<IProjectImprovementAction> {
    await mockUtils.simulateDelay();
    const newAction: IProjectImprovementAction = {
      ...action,
      id: mockUtils.generateId(),
      createdAt: new Date().toISOString()
    };
    mockImprovementActions.push(newAction);
    return newAction;
  }

  async updateImprovementAction(id: string, action: Partial<IProjectImprovementAction>): Promise<IProjectImprovementAction> {
    await mockUtils.simulateDelay();
    const index = mockImprovementActions.findIndex(a => a.id === id);
    if (index !== -1) {
      mockImprovementActions[index] = { ...mockImprovementActions[index], ...action };
      return mockImprovementActions[index];
    }
    throw new Error('Improvement action not found');
  }

  async deleteImprovementAction(id: string): Promise<void> {
    await mockUtils.simulateDelay();
    const index = mockImprovementActions.findIndex(a => a.id === id);
    if (index !== -1) {
      mockImprovementActions.splice(index, 1);
    }
  }

  // Expansion resource methods
  async fetchProjectExpansionResources(projectId: string): Promise<IProjectExpansionResource[]> {
    await mockUtils.simulateDelay();
    return mockExpansionResources.filter(resource => resource.projectId === projectId);
  }

  async createExpansionResource(resource: Omit<IProjectExpansionResource, 'id' | 'createdAt'>): Promise<IProjectExpansionResource> {
    await mockUtils.simulateDelay();
    const newResource: IProjectExpansionResource = {
      ...resource,
      id: mockUtils.generateId(),
      createdAt: new Date().toISOString()
    };
    mockExpansionResources.push(newResource);
    return newResource;
  }

  async updateExpansionResource(id: string, resource: Partial<IProjectExpansionResource>): Promise<IProjectExpansionResource> {
    await mockUtils.simulateDelay();
    const index = mockExpansionResources.findIndex(r => r.id === id);
    if (index !== -1) {
      mockExpansionResources[index] = { ...mockExpansionResources[index], ...resource };
      return mockExpansionResources[index];
    }
    throw new Error('Expansion resource not found');
  }

  async deleteExpansionResource(id: string): Promise<void> {
    await mockUtils.simulateDelay();
    const index = mockExpansionResources.findIndex(r => r.id === id);
    if (index !== -1) {
      mockExpansionResources.splice(index, 1);
    }
  }

  // Sustainability action methods
  async fetchProjectSustainabilityActions(projectId: string): Promise<IProjectSustainabilityAction[]> {
    await mockUtils.simulateDelay();
    return mockSustainabilityActions.filter(action => action.projectId === projectId);
  }

  async createSustainabilityAction(action: Omit<IProjectSustainabilityAction, 'id' | 'createdAt'>): Promise<IProjectSustainabilityAction> {
    await mockUtils.simulateDelay();
    const newAction: IProjectSustainabilityAction = {
      ...action,
      id: mockUtils.generateId(),
      createdAt: new Date().toISOString()
    };
    mockSustainabilityActions.push(newAction);
    return newAction;
  }

  async updateSustainabilityAction(id: string, action: Partial<IProjectSustainabilityAction>): Promise<IProjectSustainabilityAction> {
    await mockUtils.simulateDelay();
    const index = mockSustainabilityActions.findIndex(a => a.id === id);
    if (index !== -1) {
      mockSustainabilityActions[index] = { ...mockSustainabilityActions[index], ...action };
      return mockSustainabilityActions[index];
    }
    throw new Error('Sustainability action not found');
  }

  async deleteSustainabilityAction(id: string): Promise<void> {
    await mockUtils.simulateDelay();
    const index = mockSustainabilityActions.findIndex(a => a.id === id);
    if (index !== -1) {
      mockSustainabilityActions.splice(index, 1);
    }
  }

  // Category goal methods
  async fetchProjectCategoryGoals(projectId: string): Promise<IProjectCategoryGoal[]> {
    await mockUtils.simulateDelay();
    // This is a placeholder since we don't have mock data for category goals yet
    return [];
  }

  async createCategoryGoal(goal: Omit<IProjectCategoryGoal, 'id' | 'createdAt'>): Promise<IProjectCategoryGoal> {
    await mockUtils.simulateDelay();
    const newGoal: IProjectCategoryGoal = {
      ...goal,
      id: mockUtils.generateId(),
      createdAt: new Date().toISOString()
    };
    // Would push to mockCategoryGoals if it existed
    return newGoal;
  }

  async updateCategoryGoal(id: string, goal: Partial<IProjectCategoryGoal>): Promise<IProjectCategoryGoal> {
    await mockUtils.simulateDelay();
    // Placeholder implementation
    return {
      id,
      projectId: '',
      category: '',
      title: '',
      status: 'not_started',
      createdAt: new Date().toISOString(),
      ...goal
    };
  }

  async deleteCategoryGoal(id: string): Promise<void> {
    await mockUtils.simulateDelay();
    // Placeholder implementation
  }

  // SMART goal methods
  async fetchProjectSmartGoals(projectId: string): Promise<IProjectSmartGoal[]> {
    await mockUtils.simulateDelay();
    return mockSmartGoals.filter(goal => goal.projectId === projectId);
  }

  async createSmartGoal(goal: Omit<IProjectSmartGoal, 'id' | 'createdAt'>): Promise<IProjectSmartGoal> {
    await mockUtils.simulateDelay();
    const newGoal: IProjectSmartGoal = {
      ...goal,
      id: mockUtils.generateId(),
      createdAt: new Date().toISOString()
    };
    mockSmartGoals.push(newGoal);
    return newGoal;
  }

  async updateSmartGoal(id: string, goal: Partial<IProjectSmartGoal>): Promise<IProjectSmartGoal> {
    await mockUtils.simulateDelay();
    const index = mockSmartGoals.findIndex(g => g.id === id);
    if (index !== -1) {
      mockSmartGoals[index] = { ...mockSmartGoals[index], ...goal };
      return mockSmartGoals[index];
    }
    throw new Error('SMART goal not found');
  }

  async deleteSmartGoal(id: string): Promise<void> {
    await mockUtils.simulateDelay();
    const index = mockSmartGoals.findIndex(g => g.id === id);
    if (index !== -1) {
      mockSmartGoals.splice(index, 1);
    }
  }

  // Learning cycle methods
  async fetchLearningCycles(projectId: string): Promise<ILearningCycle[]> {
    await mockUtils.simulateDelay();
    return mockLearningCycles.filter(cycle => cycle.projectId === projectId);
  }

  async createLearningCycle(cycle: Omit<ILearningCycle, 'id' | 'createdAt'>): Promise<ILearningCycle> {
    await mockUtils.simulateDelay();
    const newCycle: ILearningCycle = {
      ...cycle,
      id: mockUtils.generateId(),
      createdAt: new Date().toISOString()
    };
    mockLearningCycles.push(newCycle);
    return newCycle;
  }

  async updateLearningCycle(id: string, cycle: Partial<ILearningCycle>): Promise<ILearningCycle> {
    await mockUtils.simulateDelay();
    const index = mockLearningCycles.findIndex(c => c.id === id);
    if (index !== -1) {
      mockLearningCycles[index] = { ...mockLearningCycles[index], ...cycle };
      return mockLearningCycles[index];
    }
    throw new Error('Learning cycle not found');
  }

  async deleteLearningCycle(id: string): Promise<void> {
    await mockUtils.simulateDelay();
    const index = mockLearningCycles.findIndex(c => c.id === id);
    if (index !== -1) {
      mockLearningCycles.splice(index, 1);
    }
  }

  // Sprint methods
  async fetchSprints(projectId: string): Promise<ISprint[]> {
    await mockUtils.simulateDelay();
    return mockSprints.filter(sprint => sprint.projectId === projectId);
  }

  async createSprint(sprint: Omit<ISprint, 'id' | 'createdAt'>): Promise<ISprint> {
    await mockUtils.simulateDelay();
    const newSprint: ISprint = {
      ...sprint,
      id: mockUtils.generateId(),
      createdAt: new Date().toISOString()
    };
    mockSprints.push(newSprint);
    return newSprint;
  }

  async updateSprint(id: string, sprint: Partial<ISprint>): Promise<ISprint> {
    await mockUtils.simulateDelay();
    const index = mockSprints.findIndex(s => s.id === id);
    if (index !== -1) {
      mockSprints[index] = { ...mockSprints[index], ...sprint };
      return mockSprints[index];
    }
    throw new Error('Sprint not found');
  }

  async deleteSprint(id: string): Promise<void> {
    await mockUtils.simulateDelay();
    const index = mockSprints.findIndex(s => s.id === id);
    if (index !== -1) {
      mockSprints.splice(index, 1);
    }
  }

  // Enhanced SMART goal methods
  async fetchEnhancedSmartGoals(projectId: string): Promise<IEnhancedSmartGoal[]> {
    await mockUtils.simulateDelay();
    return mockEnhancedSmartGoals.filter(goal => goal.projectId === projectId);
  }

  async createEnhancedSmartGoal(goal: Omit<IEnhancedSmartGoal, 'id' | 'createdAt'>): Promise<IEnhancedSmartGoal> {
    await mockUtils.simulateDelay();
    const newGoal: IEnhancedSmartGoal = {
      ...goal,
      id: mockUtils.generateId(),
      createdAt: new Date().toISOString()
    };
    mockEnhancedSmartGoals.push(newGoal);
    return newGoal;
  }

  async updateEnhancedSmartGoal(id: string, goal: Partial<IEnhancedSmartGoal>): Promise<IEnhancedSmartGoal> {
    await mockUtils.simulateDelay();
    const index = mockEnhancedSmartGoals.findIndex(g => g.id === id);
    if (index !== -1) {
      mockEnhancedSmartGoals[index] = { ...mockEnhancedSmartGoals[index], ...goal };
      return mockEnhancedSmartGoals[index];
    }
    throw new Error('Enhanced SMART goal not found');
  }

  async deleteEnhancedSmartGoal(id: string): Promise<void> {
    await mockUtils.simulateDelay();
    const index = mockEnhancedSmartGoals.findIndex(g => g.id === id);
    if (index !== -1) {
      mockEnhancedSmartGoals.splice(index, 1);
    }
  }

  // Risk management methods
  async fetchProjectRisks(projectId: string): Promise<IProjectRisk[]> {
    await mockUtils.simulateDelay();
    return mockRisks.filter(risk => risk.projectId === projectId);
  }

  async createRisk(risk: Omit<IProjectRisk, 'id' | 'createdAt'>): Promise<IProjectRisk> {
    await mockUtils.simulateDelay();
    const newRisk: IProjectRisk = {
      ...risk,
      id: mockUtils.generateId(),
      createdAt: new Date().toISOString()
    };
    mockRisks.push(newRisk);
    return newRisk;
  }

  async updateRisk(id: string, risk: Partial<IProjectRisk>): Promise<IProjectRisk> {
    await mockUtils.simulateDelay();
    const index = mockRisks.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRisks[index] = { ...mockRisks[index], ...risk };
      return mockRisks[index];
    }
    throw new Error('Risk not found');
  }

  async deleteRisk(id: string): Promise<void> {
    await mockUtils.simulateDelay();
    const index = mockRisks.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRisks.splice(index, 1);
    }
  }
}

export const mockProjectService = new MockProjectService();
export default mockProjectService;
