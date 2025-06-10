import { IProject, IProjectTask, IKanbanStage, IProjectService, IProjectBudgetItem, IProjectImprovementAction, IProjectExpansionResource, IProjectSustainabilityAction, IProjectCategoryGoal, IProjectSmartGoal, ILearningCycle, ISprint, IEnhancedSmartGoal } from '../interfaces/IProjectService';
import { generateMockId, delay } from './mockUtils';

class MockProjectService implements IProjectService {
  private mockProjects: IProject[] = [];
  private mockTasks: IProjectTask[] = [];
  private mockStages: IKanbanStage[] = [];
  private mockBudgetItems: IProjectBudgetItem[] = [];
  private mockImprovementActions: IProjectImprovementAction[] = [];
  private mockExpansionResources: IProjectExpansionResource[] = [];
  private mockSustainabilityActions: IProjectSustainabilityAction[] = [];
  private mockCategoryGoals: IProjectCategoryGoal[] = [];
  private mockSmartGoals: IProjectSmartGoal[] = [];
  private mockLearningCycles: ILearningCycle[] = [];
  private mockSprints: ISprint[] = [];
  private mockEnhancedSmartGoals: IEnhancedSmartGoal[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    this.mockProjects = [
      {
        id: '1',
        name: 'Flash Day Verão 2024',
        description: 'Evento especial de tatuagens flash com designs exclusivos de verão',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        status: 'active',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        taskCount: 8,
        completedTasksCount: 3,
        mainHypothesis: 'Clientes preferem tatuagens temáticas de verão durante a temporada',
        validationMetrics: 'Aumentar vendas em 30% comparado ao mês anterior',
        valueCurve: 'Diferenciação por designs exclusivos e ambiente climatizado',
        valueInnovations: ['Designs exclusivos', 'Ambiente temático', 'Preços promocionais']
      },
      {
        id: '2',
        name: 'Reforma do Estúdio',
        description: 'Modernização completa do ambiente do estúdio para melhor experiência dos clientes',
        startDate: '2024-02-01',
        endDate: '2024-03-30',
        status: 'planning',
        createdAt: '2024-01-20T14:00:00Z',
        updatedAt: '2024-01-20T14:00:00Z',
        taskCount: 12,
        completedTasksCount: 1
      }
    ];

    this.mockTasks = [
      {
        id: '1',
        projectId: '1',
        title: 'Criar designs flash',
        description: 'Desenvolver 20 designs exclusivos para o evento',
        status: 'completed',
        priority: 'high',
        assignedTo: 'João Silva',
        dueDate: '2024-01-10',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        order: 1,
        storyPoints: 8
      },
      {
        id: '2',
        projectId: '1',
        title: 'Divulgação nas redes sociais',
        description: 'Criar posts e stories para Instagram e Facebook',
        status: 'in_progress',
        priority: 'medium',
        assignedTo: 'Maria Santos',
        dueDate: '2024-01-20',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        order: 2,
        storyPoints: 5
      }
    ];

    this.mockStages = [
      { id: '1', projectId: '1', name: 'A Fazer', order: 1, color: 'gray', createdAt: '2024-01-01T10:00:00Z' },
      { id: '2', projectId: '1', name: 'Em Andamento', order: 2, color: 'blue', createdAt: '2024-01-01T10:00:00Z' },
      { id: '3', projectId: '1', name: 'Revisão', order: 3, color: 'yellow', createdAt: '2024-01-01T10:00:00Z' },
      { id: '4', projectId: '1', name: 'Concluído', order: 4, color: 'green', createdAt: '2024-01-01T10:00:00Z' },
      { id: '5', projectId: '2', name: 'Planejamento', order: 1, color: 'purple', createdAt: '2024-01-20T14:00:00Z' },
      { id: '6', projectId: '2', name: 'Em Execução', order: 2, color: 'blue', createdAt: '2024-01-20T14:00:00Z' },
      { id: '7', projectId: '2', name: 'Finalizado', order: 3, color: 'green', createdAt: '2024-01-20T14:00:00Z' }
    ];

    this.mockBudgetItems = [
      { id: '1', projectId: '1', description: 'Material de divulgação', estimatedCost: 500, realCost: 450, status: 'paid', createdAt: '2024-01-01T10:00:00Z' },
      { id: '2', projectId: '1', description: 'Equipamentos extras', estimatedCost: 1200, realCost: 0, status: 'pending', createdAt: '2024-01-01T10:00:00Z' }
    ];

    this.mockImprovementActions = [
      { id: '1', projectId: '1', title: 'Otimizar processo de agendamento', responsible: 'João Silva', priority: 'high', status: 'in_progress', createdAt: '2024-01-01T10:00:00Z' }
    ];

    this.mockExpansionResources = [
      { id: '1', projectId: '1', resource: 'Mais 2 tatuadores', justification: 'Aumentar capacidade', estimatedCost: 8000, status: 'planning', createdAt: '2024-01-01T10:00:00Z' }
    ];

    this.mockSustainabilityActions = [
      { id: '1', projectId: '1', title: 'Cronograma de posts pós-evento', responsible: 'Social Media', deadline: '2024-02-20', status: 'pending', createdAt: '2024-01-01T10:00:00Z' }
    ];

    this.mockCategoryGoals = [
      { id: '1', projectId: '1', category: 'Marketing', title: 'Alcançar 1000 seguidores', responsible: 'Maria', deadline: '2024-03-01', status: 'in_progress', createdAt: '2024-01-01T10:00:00Z' }
    ];

    this.mockSmartGoals = [
      { id: '1', projectId: '1', title: 'Aumentar faturamento em 30%', specific: 'Aumentar vendas mensais', measurable: 'Meta de R$ 15.000 vs atual R$ 12.000', achievable: 'Com base na capacidade atual', relevant: 'Crescimento sustentável', timeBound: 'Até 15 de fevereiro', deadline: '2024-02-15', responsible: 'Gerente', progress: 85, createdAt: '2024-01-01T10:00:00Z' }
    ];

    this.mockLearningCycles = [
      {
        id: '1',
        projectId: '1',
        hypothesis: 'Clientes preferem designs menores no verão',
        experiment: 'Oferecemos 50% designs pequenos no evento',
        results: '70% das vendas foram designs pequenos',
        learnings: 'Hipótese confirmada - focar em designs menores',
        nextAction: 'Criar mais designs pequenos para próximo evento',
        date: '2024-01-10',
        createdAt: '2024-01-10T10:00:00Z'
      }
    ];

    this.mockSprints = [
      {
        id: '1',
        projectId: '1',
        name: 'Sprint 1 - Preparação',
        goal: 'Finalizar designs e materiais de divulgação',
        startDate: '2024-01-01',
        endDate: '2024-01-14',
        status: 'completed',
        storyPoints: 20,
        completedPoints: 18,
        createdAt: '2024-01-01T10:00:00Z'
      },
      {
        id: '2',
        projectId: '1',
        name: 'Sprint 2 - Execução',
        goal: 'Realizar evento e coletar feedback',
        startDate: '2024-01-15',
        endDate: '2024-01-28',
        status: 'active',
        storyPoints: 15,
        completedPoints: 8,
        createdAt: '2024-01-15T10:00:00Z'
      }
    ];

    this.mockEnhancedSmartGoals = [
      {
        id: '1',
        projectId: '1',
        title: 'Aumentar participação no evento',
        specific: 'Atrair 100 clientes para o Flash Day',
        measurable: 'Número de clientes atendidos',
        achievable: 'Com base na capacidade do estúdio',
        relevant: 'Importante para aumentar receita mensal',
        timeBound: 'Durante o evento de 15-28 de Janeiro',
        currentMetric: 65,
        targetMetric: 100,
        deadline: '2024-01-28',
        responsible: 'Equipe completa',
        progress: 65,
        createdAt: '2024-01-01T10:00:00Z'
      }
    ];
  }

  async fetchProjects(): Promise<IProject[]> {
    console.log('MockProjectService: fetchProjects called');
    await delay(500);
    return this.mockProjects;
  }

  async createProject(project: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProject> {
    console.log('MockProjectService: createProject called with:', project);
    await delay(500);
    
    const newProject: IProject = {
      ...project,
      id: generateMockId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      taskCount: 0,
      completedTasksCount: 0
    };
    
    this.mockProjects.push(newProject);
    return newProject;
  }

  async updateProject(id: string, project: Partial<IProject>): Promise<IProject> {
    console.log('MockProjectService: updateProject called with id:', id, 'data:', project);
    await delay(500);
    
    const index = this.mockProjects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    this.mockProjects[index] = {
      ...this.mockProjects[index],
      ...project,
      updatedAt: new Date().toISOString()
    };
    
    return this.mockProjects[index];
  }

  async deleteProject(id: string): Promise<void> {
    console.log('MockProjectService: deleteProject called with id:', id);
    await delay(500);
    
    this.mockProjects = this.mockProjects.filter(p => p.id !== id);
    this.mockTasks = this.mockTasks.filter(t => t.projectId !== id);
    this.mockStages = this.mockStages.filter(s => s.projectId !== id);
  }

  async fetchProjectTasks(projectId: string): Promise<IProjectTask[]> {
    console.log('MockProjectService: fetchProjectTasks called with projectId:', projectId);
    await delay(500);
    return this.mockTasks.filter(task => task.projectId === projectId);
  }

  async createTask(task: Omit<IProjectTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProjectTask> {
    console.log('MockProjectService: createTask called with:', task);
    await delay(500);
    
    const newTask: IProjectTask = {
      ...task,
      id: generateMockId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.mockTasks.push(newTask);
    
    // Update project task count
    const project = this.mockProjects.find(p => p.id === task.projectId);
    if (project) {
      project.taskCount = (project.taskCount || 0) + 1;
    }
    
    return newTask;
  }

  async updateTask(id: string, task: Partial<IProjectTask>): Promise<IProjectTask> {
    console.log('MockProjectService: updateTask called with id:', id, 'data:', task);
    await delay(500);
    
    const index = this.mockTasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const oldTask = this.mockTasks[index];
    this.mockTasks[index] = {
      ...oldTask,
      ...task,
      updatedAt: new Date().toISOString()
    };
    
    // Update completed tasks count if status changed
    if (task.status !== undefined && task.status !== oldTask.status) {
      const project = this.mockProjects.find(p => p.id === oldTask.projectId);
      if (project) {
        const projectTasks = this.mockTasks.filter(t => t.projectId === project.id);
        project.completedTasksCount = projectTasks.filter(t => t.status === 'completed').length;
      }
    }
    
    return this.mockTasks[index];
  }

  async deleteTask(id: string): Promise<void> {
    console.log('MockProjectService: deleteTask called with id:', id);
    await delay(500);
    
    const task = this.mockTasks.find(t => t.id === id);
    if (task) {
      this.mockTasks = this.mockTasks.filter(t => t.id !== id);
      
      // Update project task count
      const project = this.mockProjects.find(p => p.id === task.projectId);
      if (project) {
        project.taskCount = (project.taskCount || 1) - 1;
        const projectTasks = this.mockTasks.filter(t => t.projectId === project.id);
        project.completedTasksCount = projectTasks.filter(t => t.status === 'completed').length;
      }
    }
  }

  async fetchKanbanStages(projectId: string): Promise<IKanbanStage[]> {
    console.log('MockProjectService: fetchKanbanStages called with projectId:', projectId);
    await delay(500);
    return this.mockStages
      .filter(stage => stage.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  }

  async createKanbanStage(stage: Omit<IKanbanStage, 'id' | 'createdAt'>): Promise<IKanbanStage> {
    console.log('MockProjectService: createKanbanStage called with:', stage);
    await delay(500);
    
    const newStage: IKanbanStage = {
      ...stage,
      id: generateMockId(),
      createdAt: new Date().toISOString()
    };
    
    this.mockStages.push(newStage);
    return newStage;
  }

  async updateKanbanStage(id: string, stage: Partial<IKanbanStage>): Promise<IKanbanStage> {
    console.log('MockProjectService: updateKanbanStage called with id:', id, 'data:', stage);
    await delay(500);
    
    const index = this.mockStages.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Stage not found');
    }
    
    this.mockStages[index] = {
      ...this.mockStages[index],
      ...stage
    };
    
    return this.mockStages[index];
  }

  async deleteKanbanStage(id: string): Promise<void> {
    console.log('MockProjectService: deleteKanbanStage called with id:', id);
    await delay(500);
    
    this.mockStages = this.mockStages.filter(s => s.id !== id);
  }

  // Budget Items
  async fetchProjectBudgetItems(projectId: string): Promise<IProjectBudgetItem[]> {
    console.log('MockProjectService: fetchProjectBudgetItems called with projectId:', projectId);
    await delay(500);
    return this.mockBudgetItems.filter(item => item.projectId === projectId);
  }

  async createBudgetItem(item: Omit<IProjectBudgetItem, 'id' | 'createdAt'>): Promise<IProjectBudgetItem> {
    console.log('MockProjectService: createBudgetItem called with:', item);
    await delay(500);
    
    const newItem: IProjectBudgetItem = {
      ...item,
      id: generateMockId(),
      createdAt: new Date().toISOString()
    };
    
    this.mockBudgetItems.push(newItem);
    return newItem;
  }

  async updateBudgetItem(id: string, item: Partial<IProjectBudgetItem>): Promise<IProjectBudgetItem> {
    console.log('MockProjectService: updateBudgetItem called with id:', id, 'data:', item);
    await delay(500);
    
    const index = this.mockBudgetItems.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Budget item not found');
    }
    
    this.mockBudgetItems[index] = { ...this.mockBudgetItems[index], ...item };
    return this.mockBudgetItems[index];
  }

  async deleteBudgetItem(id: string): Promise<void> {
    console.log('MockProjectService: deleteBudgetItem called with id:', id);
    await delay(500);
    this.mockBudgetItems = this.mockBudgetItems.filter(i => i.id !== id);
  }

  // Improvement Actions
  async fetchProjectImprovementActions(projectId: string): Promise<IProjectImprovementAction[]> {
    console.log('MockProjectService: fetchProjectImprovementActions called with projectId:', projectId);
    await delay(500);
    return this.mockImprovementActions.filter(action => action.projectId === projectId);
  }

  async createImprovementAction(action: Omit<IProjectImprovementAction, 'id' | 'createdAt'>): Promise<IProjectImprovementAction> {
    console.log('MockProjectService: createImprovementAction called with:', action);
    await delay(500);
    
    const newAction: IProjectImprovementAction = {
      ...action,
      id: generateMockId(),
      createdAt: new Date().toISOString()
    };
    
    this.mockImprovementActions.push(newAction);
    return newAction;
  }

  async updateImprovementAction(id: string, action: Partial<IProjectImprovementAction>): Promise<IProjectImprovementAction> {
    console.log('MockProjectService: updateImprovementAction called with id:', id, 'data:', action);
    await delay(500);
    
    const index = this.mockImprovementActions.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Improvement action not found');
    }
    
    this.mockImprovementActions[index] = { ...this.mockImprovementActions[index], ...action };
    return this.mockImprovementActions[index];
  }

  async deleteImprovementAction(id: string): Promise<void> {
    console.log('MockProjectService: deleteImprovementAction called with id:', id);
    await delay(500);
    this.mockImprovementActions = this.mockImprovementActions.filter(a => a.id !== id);
  }

  // Expansion Resources
  async fetchProjectExpansionResources(projectId: string): Promise<IProjectExpansionResource[]> {
    console.log('MockProjectService: fetchProjectExpansionResources called with projectId:', projectId);
    await delay(500);
    return this.mockExpansionResources.filter(resource => resource.projectId === projectId);
  }

  async createExpansionResource(resource: Omit<IProjectExpansionResource, 'id' | 'createdAt'>): Promise<IProjectExpansionResource> {
    console.log('MockProjectService: createExpansionResource called with:', resource);
    await delay(500);
    
    const newResource: IProjectExpansionResource = {
      ...resource,
      id: generateMockId(),
      createdAt: new Date().toISOString()
    };
    
    this.mockExpansionResources.push(newResource);
    return newResource;
  }

  async updateExpansionResource(id: string, resource: Partial<IProjectExpansionResource>): Promise<IProjectExpansionResource> {
    console.log('MockProjectService: updateExpansionResource called with id:', id, 'data:', resource);
    await delay(500);
    
    const index = this.mockExpansionResources.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Expansion resource not found');
    }
    
    this.mockExpansionResources[index] = { ...this.mockExpansionResources[index], ...resource };
    return this.mockExpansionResources[index];
  }

  async deleteExpansionResource(id: string): Promise<void> {
    console.log('MockProjectService: deleteExpansionResource called with id:', id);
    await delay(500);
    this.mockExpansionResources = this.mockExpansionResources.filter(r => r.id !== id);
  }

  // Sustainability Actions
  async fetchProjectSustainabilityActions(projectId: string): Promise<IProjectSustainabilityAction[]> {
    console.log('MockProjectService: fetchProjectSustainabilityActions called with projectId:', projectId);
    await delay(500);
    return this.mockSustainabilityActions.filter(action => action.projectId === projectId);
  }

  async createSustainabilityAction(action: Omit<IProjectSustainabilityAction, 'id' | 'createdAt'>): Promise<IProjectSustainabilityAction> {
    console.log('MockProjectService: createSustainabilityAction called with:', action);
    await delay(500);
    
    const newAction: IProjectSustainabilityAction = {
      ...action,
      id: generateMockId(),
      createdAt: new Date().toISOString()
    };
    
    this.mockSustainabilityActions.push(newAction);
    return newAction;
  }

  async updateSustainabilityAction(id: string, action: Partial<IProjectSustainabilityAction>): Promise<IProjectSustainabilityAction> {
    console.log('MockProjectService: updateSustainabilityAction called with id:', id, 'data:', action);
    await delay(500);
    
    const index = this.mockSustainabilityActions.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Sustainability action not found');
    }
    
    this.mockSustainabilityActions[index] = { ...this.mockSustainabilityActions[index], ...action };
    return this.mockSustainabilityActions[index];
  }

  async deleteSustainabilityAction(id: string): Promise<void> {
    console.log('MockProjectService: deleteSustainabilityAction called with id:', id);
    await delay(500);
    this.mockSustainabilityActions = this.mockSustainabilityActions.filter(a => a.id !== id);
  }

  // Category Goals
  async fetchProjectCategoryGoals(projectId: string): Promise<IProjectCategoryGoal[]> {
    console.log('MockProjectService: fetchProjectCategoryGoals called with projectId:', projectId);
    await delay(500);
    return this.mockCategoryGoals.filter(goal => goal.projectId === projectId);
  }

  async createCategoryGoal(goal: Omit<IProjectCategoryGoal, 'id' | 'createdAt'>): Promise<IProjectCategoryGoal> {
    console.log('MockProjectService: createCategoryGoal called with:', goal);
    await delay(500);
    
    const newGoal: IProjectCategoryGoal = {
      ...goal,
      id: generateMockId(),
      createdAt: new Date().toISOString()
    };
    
    this.mockCategoryGoals.push(newGoal);
    return newGoal;
  }

  async updateCategoryGoal(id: string, goal: Partial<IProjectCategoryGoal>): Promise<IProjectCategoryGoal> {
    console.log('MockProjectService: updateCategoryGoal called with id:', id, 'data:', goal);
    await delay(500);
    
    const index = this.mockCategoryGoals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Category goal not found');
    }
    
    this.mockCategoryGoals[index] = { ...this.mockCategoryGoals[index], ...goal };
    return this.mockCategoryGoals[index];
  }

  async deleteCategoryGoal(id: string): Promise<void> {
    console.log('MockProjectService: deleteCategoryGoal called with id:', id);
    await delay(500);
    this.mockCategoryGoals = this.mockCategoryGoals.filter(g => g.id !== id);
  }

  // Smart Goals
  async fetchProjectSmartGoals(projectId: string): Promise<IProjectSmartGoal[]> {
    console.log('MockProjectService: fetchProjectSmartGoals called with projectId:', projectId);
    await delay(500);
    return this.mockSmartGoals.filter(goal => goal.projectId === projectId);
  }

  async createSmartGoal(goal: Omit<IProjectSmartGoal, 'id' | 'createdAt'>): Promise<IProjectSmartGoal> {
    console.log('MockProjectService: createSmartGoal called with:', goal);
    await delay(500);
    
    const newGoal: IProjectSmartGoal = {
      ...goal,
      id: generateMockId(),
      createdAt: new Date().toISOString()
    };
    
    this.mockSmartGoals.push(newGoal);
    return newGoal;
  }

  async updateSmartGoal(id: string, goal: Partial<IProjectSmartGoal>): Promise<IProjectSmartGoal> {
    console.log('MockProjectService: updateSmartGoal called with id:', id, 'data:', goal);
    await delay(500);
    
    const index = this.mockSmartGoals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Smart goal not found');
    }
    
    this.mockSmartGoals[index] = { ...this.mockSmartGoals[index], ...goal };
    return this.mockSmartGoals[index];
  }

  async deleteSmartGoal(id: string): Promise<void> {
    console.log('MockProjectService: deleteSmartGoal called with id:', id);
    await delay(500);
    this.mockSmartGoals = this.mockSmartGoals.filter(g => g.id !== id);
  }

  // Learning Cycles (Lean Startup)
  async fetchLearningCycles(projectId: string): Promise<ILearningCycle[]> {
    console.log('MockProjectService: fetchLearningCycles called with projectId:', projectId);
    await delay(500);
    return this.mockLearningCycles.filter(cycle => cycle.projectId === projectId);
  }

  async createLearningCycle(cycle: Omit<ILearningCycle, 'id' | 'createdAt'>): Promise<ILearningCycle> {
    console.log('MockProjectService: createLearningCycle called with:', cycle);
    await delay(500);
    
    const newCycle: ILearningCycle = {
      ...cycle,
      id: generateMockId(),
      createdAt: new Date().toISOString()
    };
    
    this.mockLearningCycles.push(newCycle);
    return newCycle;
  }

  async updateLearningCycle(id: string, cycle: Partial<ILearningCycle>): Promise<ILearningCycle> {
    console.log('MockProjectService: updateLearningCycle called with id:', id, 'data:', cycle);
    await delay(500);
    
    const index = this.mockLearningCycles.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Learning cycle not found');
    }
    
    this.mockLearningCycles[index] = { ...this.mockLearningCycles[index], ...cycle };
    return this.mockLearningCycles[index];
  }

  async deleteLearningCycle(id: string): Promise<void> {
    console.log('MockProjectService: deleteLearningCycle called with id:', id);
    await delay(500);
    this.mockLearningCycles = this.mockLearningCycles.filter(c => c.id !== id);
  }

  // Sprints (Scrum)
  async fetchSprints(projectId: string): Promise<ISprint[]> {
    console.log('MockProjectService: fetchSprints called with projectId:', projectId);
    await delay(500);
    return this.mockSprints.filter(sprint => sprint.projectId === projectId);
  }

  async createSprint(sprint: Omit<ISprint, 'id' | 'createdAt'>): Promise<ISprint> {
    console.log('MockProjectService: createSprint called with:', sprint);
    await delay(500);
    
    const newSprint: ISprint = {
      ...sprint,
      id: generateMockId(),
      createdAt: new Date().toISOString()
    };
    
    this.mockSprints.push(newSprint);
    return newSprint;
  }

  async updateSprint(id: string, sprint: Partial<ISprint>): Promise<ISprint> {
    console.log('MockProjectService: updateSprint called with id:', id, 'data:', sprint);
    await delay(500);
    
    const index = this.mockSprints.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Sprint not found');
    }
    
    this.mockSprints[index] = { ...this.mockSprints[index], ...sprint };
    return this.mockSprints[index];
  }

  async deleteSprint(id: string): Promise<void> {
    console.log('MockProjectService: deleteSprint called with id:', id);
    await delay(500);
    this.mockSprints = this.mockSprints.filter(s => s.id !== id);
  }

  // Enhanced SMART Goals
  async fetchEnhancedSmartGoals(projectId: string): Promise<IEnhancedSmartGoal[]> {
    console.log('MockProjectService: fetchEnhancedSmartGoals called with projectId:', projectId);
    await delay(500);
    return this.mockEnhancedSmartGoals.filter(goal => goal.projectId === projectId);
  }

  async createEnhancedSmartGoal(goal: Omit<IEnhancedSmartGoal, 'id' | 'createdAt'>): Promise<IEnhancedSmartGoal> {
    console.log('MockProjectService: createEnhancedSmartGoal called with:', goal);
    await delay(500);
    
    const newGoal: IEnhancedSmartGoal = {
      ...goal,
      id: generateMockId(),
      createdAt: new Date().toISOString()
    };
    
    this.mockEnhancedSmartGoals.push(newGoal);
    return newGoal;
  }

  async updateEnhancedSmartGoal(id: string, goal: Partial<IEnhancedSmartGoal>): Promise<IEnhancedSmartGoal> {
    console.log('MockProjectService: updateEnhancedSmartGoal called with id:', id, 'data:', goal);
    await delay(500);
    
    const index = this.mockEnhancedSmartGoals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Enhanced SMART goal not found');
    }
    
    this.mockEnhancedSmartGoals[index] = { ...this.mockEnhancedSmartGoals[index], ...goal };
    return this.mockEnhancedSmartGoals[index];
  }

  async deleteEnhancedSmartGoal(id: string): Promise<void> {
    console.log('MockProjectService: deleteEnhancedSmartGoal called with id:', id);
    await delay(500);
    this.mockEnhancedSmartGoals = this.mockEnhancedSmartGoals.filter(g => g.id !== id);
  }

  // Base CRUD operations (from CRUDOperations interface)
  async create(item: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProject> {
    return this.createProject(item);
  }

  async fetchAll(): Promise<IProject[]> {
    return this.fetchProjects();
  }

  async fetchById(id: string): Promise<IProject | null> {
    console.log('MockProjectService: fetchById called with id:', id);
    await delay(500);
    return this.mockProjects.find(p => p.id === id) || null;
  }

  async update(id: string, item: Partial<IProject>): Promise<IProject> {
    return this.updateProject(id, item);
  }

  async delete(id: string): Promise<void> {
    return this.deleteProject(id);
  }
}

export const mockProjectService = new MockProjectService();
