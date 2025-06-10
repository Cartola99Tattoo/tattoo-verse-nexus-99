import { v4 as uuidv4 } from 'uuid';
import { IProject, IProjectTask, IKanbanStage, IProjectService, IProjectBudgetItem, IProjectImprovementAction, IProjectExpansionResource, IProjectSustainabilityAction, IProjectCategoryGoal, IProjectSmartGoal, ILearningCycle, ISprint, IEnhancedSmartGoal, IProjectRisk } from '../interfaces/IProjectService';

// Helper function to simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class MockProjectService implements IProjectService {
  private mockProjects: IProject[] = [
    {
      id: '1',
      name: 'Flash Day: Tatuagens Tradicionais',
      description: 'Evento de flash day com foco em tatuagens de estilo tradicional americano.',
      startDate: '2023-10-15',
      endDate: '2023-10-15',
      status: 'active',
      createdAt: '2023-09-01T10:00:00Z',
      updatedAt: '2023-09-01T10:00:00Z',
      taskCount: 12,
      completedTasksCount: 5,
      mainHypothesis: 'Um evento de flash day com foco em tatuagens tradicionais americanas atrairá novos clientes interessados neste estilo específico.',
      validationMetrics: 'Número de novos clientes, taxa de conversão de reservas, feedback dos participantes'
    },
    {
      id: '2',
      name: 'Workshop de Aquarela',
      description: 'Workshop para tatuadores focado em técnicas de aquarela.',
      startDate: '2023-11-10',
      endDate: '2023-11-12',
      status: 'planning',
      createdAt: '2023-09-05T14:30:00Z',
      updatedAt: '2023-09-05T14:30:00Z',
      taskCount: 8,
      completedTasksCount: 2
    },
    {
      id: '3',
      name: 'Expansão: Novo Estúdio Zona Sul',
      description: 'Projeto de expansão para abertura de uma nova unidade na Zona Sul.',
      startDate: '2023-12-01',
      endDate: '2024-03-31',
      status: 'planning',
      createdAt: '2023-09-10T09:15:00Z',
      updatedAt: '2023-09-10T09:15:00Z',
      taskCount: 20,
      completedTasksCount: 0
    }
  ];

  private mockTasks: IProjectTask[] = [
    {
      id: '1',
      projectId: '1',
      title: 'Criar material promocional',
      description: 'Desenvolver flyers e posts para redes sociais',
      status: 'completed',
      priority: 'high',
      assignedTo: '1',
      dueDate: '2023-10-01',
      createdAt: '2023-09-01T10:30:00Z',
      updatedAt: '2023-09-15T11:20:00Z',
      order: 1
    },
    {
      id: '2',
      projectId: '1',
      title: 'Contatar tatuadores convidados',
      description: 'Entrar em contato com tatuadores para participar do evento',
      status: 'completed',
      priority: 'critical',
      assignedTo: '2',
      dueDate: '2023-09-20',
      createdAt: '2023-09-02T09:15:00Z',
      updatedAt: '2023-09-18T14:00:00Z',
      order: 2
    },
    {
      id: '3',
      projectId: '1',
      title: 'Preparar catálogo de flashes',
      description: 'Compilar desenhos dos tatuadores em um catálogo',
      status: 'in_progress',
      priority: 'medium',
      assignedTo: '3',
      dueDate: '2023-10-10',
      createdAt: '2023-09-05T11:45:00Z',
      updatedAt: '2023-09-05T11:45:00Z',
      order: 3
    },
    {
      id: '4',
      projectId: '2',
      title: 'Reservar espaço para workshop',
      description: 'Encontrar e reservar local adequado para o workshop',
      status: 'completed',
      priority: 'high',
      assignedTo: '1',
      dueDate: '2023-10-15',
      createdAt: '2023-09-06T13:20:00Z',
      updatedAt: '2023-10-10T09:30:00Z',
      order: 1
    },
    {
      id: '5',
      projectId: '2',
      title: 'Criar conteúdo do workshop',
      description: 'Desenvolver material didático e exercícios práticos',
      status: 'in_progress',
      priority: 'medium',
      assignedTo: '4',
      dueDate: '2023-11-01',
      createdAt: '2023-09-08T10:00:00Z',
      updatedAt: '2023-09-08T10:00:00Z',
      order: 2
    }
  ];

  private mockStages: IKanbanStage[] = [
    {
      id: 'ideas',
      projectId: '1',
      name: 'Quadro de Ideias',
      order: 1,
      color: '#8B5CF6',
      createdAt: '2023-09-01T10:00:00Z'
    },
    {
      id: 'todo',
      projectId: '1',
      name: 'A Fazer',
      order: 2,
      color: '#dc2626',
      createdAt: '2023-09-01T10:00:00Z'
    },
    {
      id: 'in_progress',
      projectId: '1',
      name: 'Em Andamento',
      order: 3,
      color: '#ea384c',
      createdAt: '2023-09-01T10:00:00Z'
    },
    {
      id: 'review',
      projectId: '1',
      name: 'Revisão',
      order: 4,
      color: '#f97316',
      createdAt: '2023-09-01T10:00:00Z'
    },
    {
      id: 'completed',
      projectId: '1',
      name: 'Concluído',
      order: 5,
      color: '#10b981',
      createdAt: '2023-09-01T10:00:00Z'
    },
    {
      id: 'ideas',
      projectId: '2',
      name: 'Quadro de Ideias',
      order: 1,
      color: '#8B5CF6',
      createdAt: '2023-09-05T14:30:00Z'
    },
    {
      id: 'todo',
      projectId: '2',
      name: 'A Fazer',
      order: 2,
      color: '#dc2626',
      createdAt: '2023-09-05T14:30:00Z'
    },
    {
      id: 'in_progress',
      projectId: '2',
      name: 'Em Andamento',
      order: 3,
      color: '#ea384c',
      createdAt: '2023-09-05T14:30:00Z'
    },
    {
      id: 'review',
      projectId: '2',
      name: 'Revisão',
      order: 4,
      color: '#f97316',
      createdAt: '2023-09-05T14:30:00Z'
    },
    {
      id: 'completed',
      projectId: '2',
      name: 'Concluído',
      order: 5,
      color: '#10b981',
      createdAt: '2023-09-05T14:30:00Z'
    }
  ];

  private mockBudgetItems: IProjectBudgetItem[] = [
    {
      id: '1',
      projectId: '1',
      description: 'Material promocional impresso',
      estimatedCost: 500,
      realCost: 450,
      status: 'paid',
      createdAt: '2023-09-02T10:00:00Z'
    },
    {
      id: '2',
      projectId: '1',
      description: 'Alimentação para equipe e convidados',
      estimatedCost: 800,
      realCost: 0,
      status: 'estimated',
      createdAt: '2023-09-02T10:30:00Z'
    },
    {
      id: '3',
      projectId: '2',
      description: 'Aluguel do espaço',
      estimatedCost: 1200,
      realCost: 1200,
      status: 'paid',
      createdAt: '2023-09-06T14:00:00Z'
    }
  ];

  private mockImprovementActions: IProjectImprovementAction[] = [
    {
      id: '1',
      projectId: '1',
      title: 'Melhorar sistema de agendamento',
      description: 'Implementar sistema online para agendamento de horários durante o evento',
      responsible: 'Ana Silva',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2023-10-10',
      createdAt: '2023-09-03T11:00:00Z'
    },
    {
      id: '2',
      projectId: '1',
      title: 'Otimizar layout do estúdio',
      description: 'Reorganizar estações de trabalho para melhor fluxo durante o evento',
      responsible: 'Carlos Mendes',
      priority: 'medium',
      status: 'pending',
      dueDate: '2023-10-12',
      createdAt: '2023-09-03T11:30:00Z'
    }
  ];

  private mockExpansionResources: IProjectExpansionResource[] = [
    {
      id: '1',
      projectId: '3',
      resource: 'Novas máquinas de tatuagem',
      justification: 'Necessário para equipar o novo estúdio com tecnologia de ponta',
      estimatedCost: 5000,
      status: 'planning',
      createdAt: '2023-09-11T09:00:00Z'
    },
    {
      id: '2',
      projectId: '3',
      resource: 'Sistema de esterilização',
      justification: 'Equipamento essencial para garantir segurança e higiene',
      estimatedCost: 3000,
      status: 'researching',
      createdAt: '2023-09-11T09:30:00Z'
    }
  ];

  private mockSustainabilityActions: IProjectSustainabilityAction[] = [
    {
      id: '1',
      projectId: '1',
      title: 'Programa de fidelidade pós-evento',
      description: 'Criar sistema de descontos para clientes que participaram do flash day',
      responsible: 'Mariana Costa',
      deadline: '2023-10-30',
      status: 'pending',
      createdAt: '2023-09-04T10:00:00Z'
    },
    {
      id: '2',
      projectId: '1',
      title: 'Cronograma de posts pós-evento',
      description: 'Manter engajamento nas redes sociais após o evento',
      responsible: 'Juliana Alves',
      deadline: '2023-10-25',
      status: 'pending',
      createdAt: '2023-09-04T10:30:00Z'
    }
  ];

  private mockCategoryGoals: IProjectCategoryGoal[] = [
    {
      id: '1',
      projectId: '1',
      category: 'Financeiro',
      title: 'Atingir faturamento de R$ 10.000',
      description: 'Meta de faturamento para o evento de flash day',
      responsible: 'Roberto Santos',
      deadline: '2023-10-15',
      status: 'in_progress',
      createdAt: '2023-09-05T09:00:00Z'
    },
    {
      id: '2',
      projectId: '1',
      category: 'Marketing',
      title: 'Alcançar 5.000 pessoas nas redes sociais',
      description: 'Meta de alcance para as publicações do evento',
      responsible: 'Juliana Alves',
      deadline: '2023-10-14',
      status: 'in_progress',
      createdAt: '2023-09-05T09:30:00Z'
    }
  ];

  private mockSmartGoals: IProjectSmartGoal[] = [
    {
      id: '1',
      projectId: '1',
      title: 'Aumentar base de clientes',
      specific: 'Atrair 20 novos clientes durante o evento de flash day',
      measurable: 'Número de novos cadastros no sistema',
      achievable: 'Baseado em eventos anteriores, onde conseguimos em média 15 novos clientes',
      relevant: 'Expandir nossa base de clientes é essencial para o crescimento do estúdio',
      timeBound: 'Durante o dia do evento (15/10/2023)',
      deadline: '2023-10-15',
      responsible: 'Equipe de Recepção',
      progress: 0,
      createdAt: '2023-09-06T10:00:00Z'
    },
    {
      id: '2',
      projectId: '1',
      title: 'Aumentar engajamento nas redes sociais',
      specific: 'Conseguir 500 novos seguidores no Instagram',
      measurable: 'Número de novos seguidores na conta do estúdio',
      achievable: 'Com estratégia de conteúdo e divulgação do evento',
      relevant: 'Maior visibilidade online aumenta a captação de clientes',
      timeBound: 'Até uma semana após o evento (22/10/2023)',
      deadline: '2023-10-22',
      responsible: 'Juliana Alves',
      progress: 20,
      createdAt: '2023-09-06T10:30:00Z'
    }
  ];

  private mockLearningCycles: ILearningCycle[] = [
    {
      id: '1',
      projectId: '1',
      hypothesis: 'Oferecer descontos para tatuagens maiores durante o flash day aumentará o ticket médio',
      experiment: 'Criar promoção especial para tatuagens acima de R$ 300',
      results: 'Pendente',
      learnings: 'Pendente',
      nextAction: 'Analisar resultados após o evento',
      date: '2023-10-15',
      createdAt: '2023-09-07T10:00:00Z'
    }
  ];

  private mockSprints: ISprint[] = [
    {
      id: '1',
      projectId: '3',
      name: 'Sprint 1 - Planejamento Inicial',
      goal: 'Definir requisitos e orçamento para o novo estúdio',
      startDate: '2023-12-01',
      endDate: '2023-12-15',
      status: 'planning',
      storyPoints: 20,
      completedPoints: 0,
      createdAt: '2023-09-12T10:00:00Z'
    }
  ];

  private mockEnhancedSmartGoals: IEnhancedSmartGoal[] = [
    {
      id: '1',
      projectId: '3',
      title: 'ROI do Novo Estúdio',
      specific: 'Atingir retorno sobre investimento positivo no novo estúdio',
      measurable: 'ROI de 15% no primeiro ano',
      achievable: 'Baseado em projeções financeiras e histórico da unidade atual',
      relevant: 'Garantir a viabilidade financeira da expansão',
      timeBound: 'Até dezembro de 2024',
      currentMetric: 0,
      targetMetric: 15,
      deadline: '2024-12-31',
      responsible: 'Roberto Santos',
      progress: 0,
      createdAt: '2023-09-13T10:00:00Z'
    }
  ];

  // Risk management methods
  private mockRisks: IProjectRisk[] = [
    {
      id: '1',
      projectId: '1',
      description: 'Atraso na entrega de materiais de divulgação',
      probability: 'medium',
      impact: 'high',
      mitigation: 'Ter fornecedores alternativos e fazer pedidos com antecedência',
      status: 'open',
      smartGoalId: '1',
      smartCriteria: 'time_bound',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      projectId: '1',
      description: 'Indisponibilidade de tatuadores no dia do evento',
      probability: 'low',
      impact: 'high',
      mitigation: 'Manter lista de tatuadores reserva e confirmar presença 48h antes',
      status: 'mitigated',
      smartGoalId: '2',
      smartCriteria: 'specific',
      createdAt: '2024-01-02T10:00:00Z'
    }
  ];

  async fetchProjectRisks(projectId: string): Promise<IProjectRisk[]> {
    await delay();
    return this.mockRisks.filter(risk => risk.projectId === projectId);
  }

  async createRisk(risk: Omit<IProjectRisk, 'id' | 'createdAt'>): Promise<IProjectRisk> {
    await delay();
    const newRisk: IProjectRisk = {
      id: uuidv4(),
      ...risk,
      createdAt: new Date().toISOString()
    };
    this.mockRisks.push(newRisk);
    return newRisk;
  }

  async updateRisk(id: string, risk: Partial<IProjectRisk>): Promise<IProjectRisk> {
    await delay();
    const index = this.mockRisks.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Risk not found');
    }
    this.mockRisks[index] = { ...this.mockRisks[index], ...risk };
    return this.mockRisks[index];
  }

  async deleteRisk(id: string): Promise<void> {
    await delay();
    const index = this.mockRisks.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Risk not found');
    }
    this.mockRisks.splice(index, 1);
  }

  // Base CRUD operations
  async getAll(): Promise<IProject[]> {
    return this.fetchProjects();
  }

  async getById(id: string): Promise<IProject> {
    await delay();
    const project = this.mockProjects.find(p => p.id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  async create(data: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProject> {
    await delay();
    const newProject: IProject = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      taskCount: 0,
      completedTasksCount: 0
    };
    this.mockProjects.push(newProject);
    return newProject;
  }

  async update(id: string, data: Partial<IProject>): Promise<IProject> {
    await delay();
    const index = this.mockProjects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    this.mockProjects[index] = {
      ...this.mockProjects[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return this.mockProjects[index];
  }

  async delete(id: string): Promise<void> {
    await delay();
    const index = this.mockProjects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    this.mockProjects.splice(index, 1);
  }

  // Project specific methods
  async fetchProjects(): Promise<IProject[]> {
    await delay();
    return this.mockProjects;
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
    await delay();
    return this.mockTasks.filter(task => task.projectId === projectId);
  }

  async createTask(task: Omit<IProjectTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProjectTask> {
    await delay();
    const newTask: IProjectTask = {
      id: uuidv4(),
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mockTasks.push(newTask);

    // Update project task count
    const projectIndex = this.mockProjects.findIndex(p => p.id === task.projectId);
    if (projectIndex !== -1) {
      this.mockProjects[projectIndex].taskCount = (this.mockProjects[projectIndex].taskCount || 0) + 1;
    }

    return newTask;
  }

  async updateTask(id: string, task: Partial<IProjectTask>): Promise<IProjectTask> {
    await delay();
    const index = this.mockTasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }

    const oldStatus = this.mockTasks[index].status;
    const newStatus = task.status || oldStatus;

    this.mockTasks[index] = {
      ...this.mockTasks[index],
      ...task,
      updatedAt: new Date().toISOString()
    };

    // Update project completed tasks count if status changed to/from completed
    if (oldStatus !== newStatus) {
      const projectId = this.mockTasks[index].projectId;
      const projectIndex = this.mockProjects.findIndex(p => p.id === projectId);
      
      if (projectIndex !== -1) {
        if (newStatus === 'completed' && oldStatus !== 'completed') {
          this.mockProjects[projectIndex].completedTasksCount = (this.mockProjects[projectIndex].completedTasksCount || 0) + 1;
        } else if (newStatus !== 'completed' && oldStatus === 'completed') {
          this.mockProjects[projectIndex].completedTasksCount = Math.max(0, (this.mockProjects[projectIndex].completedTasksCount || 0) - 1);
        }
      }
    }

    return this.mockTasks[index];
  }

  async deleteTask(id: string): Promise<void> {
    await delay();
    const index = this.mockTasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }

    const task = this.mockTasks[index];
    const projectIndex = this.mockProjects.findIndex(p => p.id === task.projectId);
    
    if (projectIndex !== -1) {
      // Update project task count
      this.mockProjects[projectIndex].taskCount = Math.max(0, (this.mockProjects[projectIndex].taskCount || 0) - 1);
      
      // Update completed tasks count if needed
      if (task.status === 'completed') {
        this.mockProjects[projectIndex].completedTasksCount = Math.max(0, (this.mockProjects[projectIndex].completedTasksCount || 0) - 1);
      }
    }

    this.mockTasks.splice(index, 1);
  }

  // Kanban stage methods
  async fetchKanbanStages(projectId: string): Promise<IKanbanStage[]> {
    await delay();
    const stages = this.mockStages.filter(stage => stage.projectId === projectId);
    
    // If no stages found, create default ones
    if (stages.length === 0) {
      const defaultStages: IKanbanStage[] = [
        { 
          id: 'ideas', 
          projectId, 
          name: 'Quadro de Ideias', 
          order: 1, 
          color: '#8B5CF6',
          createdAt: new Date().toISOString() 
        },
        { 
          id: 'todo', 
          projectId, 
          name: 'A Fazer', 
          order: 2, 
          color: '#dc2626',
          createdAt: new Date().toISOString() 
        },
        { 
          id: 'in_progress', 
          projectId, 
          name: 'Em Andamento', 
          order: 3, 
          color: '#ea384c',
          createdAt: new Date().toISOString() 
        },
        { 
          id: 'review', 
          projectId, 
          name: 'Revisão', 
          order: 4, 
          color: '#f97316',
          createdAt: new Date().toISOString() 
        },
        { 
          id: 'completed', 
          projectId, 
          name: 'Concluído', 
          order: 5, 
          color: '#10b981',
          createdAt: new Date().toISOString() 
        }
      ];
      
      this.mockStages.push(...defaultStages);
      return defaultStages;
    }
    
    return stages;
  }

  async createKanbanStage(stage: Omit<IKanbanStage, 'id' | 'createdAt'>): Promise<IKanbanStage> {
    await delay();
    const newStage: IKanbanStage = {
      id: uuidv4(),
      ...stage,
      createdAt: new Date().toISOString()
    };
    this.mockStages.push(newStage);
    return newStage;
  }

  async updateKanbanStage(id: string, stage: Partial<IKanbanStage>): Promise<IKanbanStage> {
    await delay();
    const index = this.mockStages.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Stage not found');
    }
    this.mockStages[index] = { ...this.mockStages[index], ...stage };
    return this.mockStages[index];
  }

  async deleteKanbanStage(id: string): Promise<void> {
    await delay();
    const index = this.mockStages.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Stage not found');
    }
    this.mockStages.splice(index, 1);
  }

  // Budget items methods
  async fetchProjectBudgetItems(projectId: string): Promise<IProjectBudgetItem[]> {
    await delay();
    return this.mockBudgetItems.filter(item => item.projectId === projectId);
  }

  async createBudgetItem(item: Omit<IProjectBudgetItem, 'id' | 'createdAt'>): Promise<IProjectBudgetItem> {
    await delay();
    const newItem: IProjectBudgetItem = {
      id: uuidv4(),
      ...item,
      createdAt: new Date().toISOString()
    };
    this.mockBudgetItems.push(newItem);
    return newItem;
  }

  async updateBudgetItem(id: string, item: Partial<IProjectBudgetItem>): Promise<IProjectBudgetItem> {
    await delay();
    const index = this.mockBudgetItems.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Budget item not found');
    }
    this.mockBudgetItems[index] = { ...this.mockBudgetItems[index], ...item };
    return this.mockBudgetItems[index];
  }

  async deleteBudgetItem(id: string): Promise<void> {
    await delay();
    const index = this.mockBudgetItems.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Budget item not found');
    }
    this.mockBudgetItems.splice(index, 1);
  }

  // Improvement actions methods
  async fetchProjectImprovementActions(projectId: string): Promise<IProjectImprovementAction[]> {
    await delay();
    return this.mockImprovementActions.filter(action => action.projectId === projectId);
  }

  async createImprovementAction(action: Omit<IProjectImprovementAction, 'id' | 'createdAt'>): Promise<IProjectImprovementAction> {
    await delay();
    const newAction: IProjectImprovementAction = {
      id: uuidv4(),
      ...action,
      createdAt: new Date().toISOString()
    };
    this.mockImprovementActions.push(newAction);
    return newAction;
  }

  async updateImprovementAction(id: string, action: Partial<IProjectImprovementAction>): Promise<IProjectImprovementAction> {
    await delay();
    const index = this.mockImprovementActions.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Improvement action not found');
    }
    this.mockImprovementActions[index] = { ...this.mockImprovementActions[index], ...action };
    return this.mockImprovementActions[index];
  }

  async deleteImprovementAction(id: string): Promise<void> {
    await delay();
    const index = this.mockImprovementActions.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Improvement action not found');
    }
    this.mockImprovementActions.splice(index, 1);
  }

  // Expansion resources methods
  async fetchProjectExpansionResources(projectId: string): Promise<IProjectExpansionResource[]> {
    await delay();
    return this.mockExpansionResources.filter(resource => resource.projectId === projectId);
  }

  async createExpansionResource(resource: Omit<IProjectExpansionResource, 'id' | 'createdAt'>): Promise<IProjectExpansionResource> {
    await delay();
    const newResource: IProjectExpansionResource = {
      id: uuidv4(),
      ...resource,
      createdAt: new Date().toISOString()
    };
    this.mockExpansionResources.push(newResource);
    return newResource;
  }

  async updateExpansionResource(id: string, resource: Partial<IProjectExpansionResource>): Promise<IProjectExpansionResource> {
    await delay();
    const index = this.mockExpansionResources.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Expansion resource not found');
    }
    this.mockExpansionResources[index] = { ...this.mockExpansionResources[index], ...resource };
    return this.mockExpansionResources[index];
  }

  async deleteExpansionResource(id: string): Promise<void> {
    await delay();
    const index = this.mockExpansionResources.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Expansion resource not found');
    }
    this.mockExpansionResources.splice(index, 1);
  }

  // Sustainability actions methods
  async fetchProjectSustainabilityActions(projectId: string): Promise<IProjectSustainabilityAction[]> {
    await delay();
    return this.mockSustainabilityActions.filter(action => action.projectId === projectId);
  }

  async createSustainabilityAction(action: Omit<IProjectSustainabilityAction, 'id' | 'createdAt'>): Promise<IProjectSustainabilityAction> {
    await delay();
    const newAction: IProjectSustainabilityAction = {
      id: uuidv4(),
      ...action,
      createdAt: new Date().toISOString()
    };
    this.mockSustainabilityActions.push(newAction);
    return newAction;
  }

  async updateSustainabilityAction(id: string, action: Partial<IProjectSustainabilityAction>): Promise<IProjectSustainabilityAction> {
    await delay();
    const index = this.mockSustainabilityActions.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Sustainability action not found');
    }
    this.mockSustainabilityActions[index] = { ...this.mockSustainabilityActions[index], ...action };
    return this.mockSustainabilityActions[index];
  }

  async deleteSustainabilityAction(id: string): Promise<void> {
    await delay();
    const index = this.mockSustainabilityActions.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Sustainability action not found');
    }
    this.mockSustainabilityActions.splice(index, 1);
  }

  // Category goals methods
  async fetchProjectCategoryGoals(projectId: string): Promise<IProjectCategoryGoal[]> {
    await delay();
    return this.mockCategoryGoals.filter(goal => goal.projectId === projectId);
  }

  async createCategoryGoal(goal: Omit<IProjectCategoryGoal, 'id' | 'createdAt'>): Promise<IProjectCategoryGoal> {
    await delay();
    const newGoal: IProjectCategoryGoal = {
      id: uuidv4(),
      ...goal,
      createdAt: new Date().toISOString()
    };
    this.mockCategoryGoals.push(newGoal);
    return newGoal;
  }

  async updateCategoryGoal(id: string, goal: Partial<IProjectCategoryGoal>): Promise<IProjectCategoryGoal> {
    await delay();
    const index = this.mockCategoryGoals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Category goal not found');
    }
    this.mockCategoryGoals[index] = { ...this.mockCategoryGoals[index], ...goal };
    return this.mockCategoryGoals[index];
  }

  async deleteCategoryGoal(id: string): Promise<void> {
    await delay();
    const index = this.mockCategoryGoals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Category goal not found');
    }
    this.mockCategoryGoals.splice(index, 1);
  }

  // SMART goals methods
  async fetchProjectSmartGoals(projectId: string): Promise<IProjectSmartGoal[]> {
    await delay();
    return this.mockSmartGoals.filter(goal => goal.projectId === projectId);
  }

  async createSmartGoal(goal: Omit<IProjectSmartGoal, 'id' | 'createdAt'>): Promise<IProjectSmartGoal> {
    await delay();
    const newGoal: IProjectSmartGoal = {
      id: uuidv4(),
      ...goal,
      createdAt: new Date().toISOString()
    };
    this.mockSmartGoals.push(newGoal);
    return newGoal;
  }

  async updateSmartGoal(id: string, goal: Partial<IProjectSmartGoal>): Promise<IProjectSmartGoal> {
    await delay();
    const index = this.mockSmartGoals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('SMART goal not found');
    }
    this.mockSmartGoals[index] = { ...this.mockSmartGoals[index], ...goal };
    return this.mockSmartGoals[index];
  }

  async deleteSmartGoal(id: string): Promise<void> {
    await delay();
    const index = this.mockSmartGoals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('SMART goal not found');
    }
    this.mockSmartGoals.splice(index, 1);
  }

  // Learning cycles methods
  async fetchLearningCycles(projectId: string): Promise<ILearningCycle[]> {
    await delay();
    return this.mockLearningCycles.filter(cycle => cycle.projectId === projectId);
  }

  async createLearningCycle(cycle: Omit<ILearningCycle, 'id' | 'createdAt'>): Promise<ILearningCycle> {
    await delay();
    const newCycle: ILearningCycle = {
      id: uuidv4(),
      ...cycle,
      createdAt: new Date().toISOString()
    };
    this.mockLearningCycles.push(newCycle);
    return newCycle;
  }

  async updateLearningCycle(id: string, cycle: Partial<ILearningCycle>): Promise<ILearningCycle> {
    await delay();
    const index = this.mockLearningCycles.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Learning cycle not found');
    }
    this.mockLearningCycles[index] = { ...this.mockLearningCycles[index], ...cycle };
    return this.mockLearningCycles[index];
  }

  async deleteLearningCycle(id: string): Promise<void> {
    await delay();
    const index = this.mockLearningCycles.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Learning cycle not found');
    }
    this.mockLearningCycles.splice(index, 1);
  }

  // Sprints methods
  async fetchSprints(projectId: string): Promise<ISprint[]> {
    await delay();
    return this.mockSprints.filter(sprint => sprint.projectId === projectId);
  }

  async createSprint(sprint: Omit<ISprint, 'id' | 'createdAt'>): Promise<ISprint> {
    await delay();
    const newSprint: ISprint = {
      id: uuidv4(),
      ...sprint,
      createdAt: new Date().toISOString()
    };
    this.mockSprints.push(newSprint);
    return newSprint;
  }

  async updateSprint(id: string, sprint: Partial<ISprint>): Promise<ISprint> {
    await delay();
    const index = this.mockSprints.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Sprint not found');
    }
    this.mockSprints[index] = { ...this.mockSprints[index], ...sprint };
    return this.mockSprints[index];
  }

  async deleteSprint(id: string): Promise<void> {
    await delay();
    const index = this.mockSprints.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Sprint not found');
    }
    this.mockSprints.splice(index, 1);
  }

  // Enhanced SMART goals methods
  async fetchEnhancedSmartGoals(projectId: string): Promise<IEnhancedSmartGoal[]> {
    await delay();
    return this.mockEnhancedSmartGoals.filter(goal => goal.projectId === projectId);
  }

  async createEnhancedSmartGoal(goal: Omit<IEnhancedSmartGoal, 'id' | 'createdAt'>): Promise<IEnhancedSmartGoal> {
    await delay();
    const newGoal: IEnhancedSmartGoal = {
      id: uuidv4(),
      ...goal,
      createdAt: new Date().toISOString()
    };
    this.mockEnhancedSmartGoals.push(newGoal);
    return newGoal;
  }

  async updateEnhancedSmartGoal(id: string, goal: Partial<IEnhancedSmartGoal>): Promise<IEnhancedSmartGoal> {
    await delay();
    const index = this.mockEnhancedSmartGoals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Enhanced SMART goal not found');
    }
    this.mockEnhancedSmartGoals[index] = { ...this.mockEnhancedSmartGoals[index], ...goal };
    return this.mockEnhancedSmartGoals[index];
  }

  async deleteEnhancedSmartGoal(id: string): Promise<void> {
    await delay();
    const index = this.mockEnhancedSmartGoals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Enhanced SMART goal not found');
    }
    this.mockEnhancedSmartGoals.splice(index, 1);
  }
}

export const mockProjectService = new MockProjectService();
export default MockProjectService;
