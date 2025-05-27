import { IProject, IProjectTask, IKanbanStage, IProjectService, IProjectBudgetItem, IProjectImprovementAction, IProjectExpansionResource, IProjectSustainabilityAction, IProjectCategoryGoal, IProjectSmartGoal, ILearningCycle, ISprint, IEnhancedSmartGoal } from '@/services/interfaces/IProjectService';
import { simulateNetworkDelay } from './mockUtils';

class MockProjectService implements IProjectService {
  private projects: IProject[] = [
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

  private tasks: IProjectTask[] = [
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

  private stages: IKanbanStage[] = [
    { id: '1', projectId: '1', name: 'A Fazer', order: 1, color: 'gray', createdAt: '2024-01-01T10:00:00Z' },
    { id: '2', projectId: '1', name: 'Em Andamento', order: 2, color: 'blue', createdAt: '2024-01-01T10:00:00Z' },
    { id: '3', projectId: '1', name: 'Revisão', order: 3, color: 'yellow', createdAt: '2024-01-01T10:00:00Z' },
    { id: '4', projectId: '1', name: 'Concluído', order: 4, color: 'green', createdAt: '2024-01-01T10:00:00Z' },
    { id: '5', projectId: '2', name: 'Planejamento', order: 1, color: 'purple', createdAt: '2024-01-20T14:00:00Z' },
    { id: '6', projectId: '2', name: 'Em Execução', order: 2, color: 'blue', createdAt: '2024-01-20T14:00:00Z' },
    { id: '7', projectId: '2', name: 'Finalizado', order: 3, color: 'green', createdAt: '2024-01-20T14:00:00Z' }
  ];

  private budgetItems: IProjectBudgetItem[] = [
    { id: '1', projectId: '1', description: 'Material de divulgação', estimatedCost: 500, realCost: 450, status: 'paid', createdAt: '2024-01-01T10:00:00Z' },
    { id: '2', projectId: '1', description: 'Equipamentos extras', estimatedCost: 1200, realCost: 0, status: 'pending', createdAt: '2024-01-01T10:00:00Z' }
  ];

  private improvementActions: IProjectImprovementAction[] = [
    { id: '1', projectId: '1', title: 'Otimizar processo de agendamento', responsible: 'João Silva', priority: 'high', status: 'in_progress', createdAt: '2024-01-01T10:00:00Z' }
  ];

  private expansionResources: IProjectExpansionResource[] = [
    { id: '1', projectId: '1', resource: 'Mais 2 tatuadores', justification: 'Aumentar capacidade', estimatedCost: 8000, status: 'planning', createdAt: '2024-01-01T10:00:00Z' }
  ];

  private sustainabilityActions: IProjectSustainabilityAction[] = [
    { id: '1', projectId: '1', title: 'Cronograma de posts pós-evento', responsible: 'Social Media', deadline: '2024-02-20', status: 'pending', createdAt: '2024-01-01T10:00:00Z' }
  ];

  private categoryGoals: IProjectCategoryGoal[] = [
    { id: '1', projectId: '1', category: 'Marketing', title: 'Alcançar 1000 seguidores', responsible: 'Maria', deadline: '2024-03-01', status: 'in_progress', createdAt: '2024-01-01T10:00:00Z' }
  ];

  private smartGoals: IProjectSmartGoal[] = [
    { id: '1', projectId: '1', title: 'Aumentar faturamento em 30%', metric: 'R$ 15.000 vs R$ 12.000', deadline: '2024-02-15', responsible: 'Gerente', progress: 85, createdAt: '2024-01-01T10:00:00Z' }
  ];

  private learningCycles: ILearningCycle[] = [
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

  private sprints: ISprint[] = [
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

  private enhancedSmartGoals: IEnhancedSmartGoal[] = [
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

  async fetchProjects(): Promise<IProject[]> {
    console.log('MockProjectService: fetchProjects called');
    await simulateNetworkDelay();
    return this.projects;
  }

  async createProject(project: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProject> {
    console.log('MockProjectService: createProject called with:', project);
    await simulateNetworkDelay();
    
    const newProject: IProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      taskCount: 0,
      completedTasksCount: 0
    };
    
    this.projects.push(newProject);
    return newProject;
  }

  async updateProject(id: string, project: Partial<IProject>): Promise<IProject> {
    console.log('MockProjectService: updateProject called with id:', id, 'data:', project);
    await simulateNetworkDelay();
    
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    this.projects[index] = {
      ...this.projects[index],
      ...project,
      updatedAt: new Date().toISOString()
    };
    
    return this.projects[index];
  }

  async deleteProject(id: string): Promise<void> {
    console.log('MockProjectService: deleteProject called with id:', id);
    await simulateNetworkDelay();
    
    this.projects = this.projects.filter(p => p.id !== id);
    this.tasks = this.tasks.filter(t => t.projectId !== id);
    this.stages = this.stages.filter(s => s.projectId !== id);
  }

  async fetchProjectTasks(projectId: string): Promise<IProjectTask[]> {
    console.log('MockProjectService: fetchProjectTasks called with projectId:', projectId);
    await simulateNetworkDelay();
    return this.tasks.filter(task => task.projectId === projectId);
  }

  async createTask(task: Omit<IProjectTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProjectTask> {
    console.log('MockProjectService: createTask called with:', task);
    await simulateNetworkDelay();
    
    const newTask: IProjectTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.tasks.push(newTask);
    
    // Update project task count
    const project = this.projects.find(p => p.id === task.projectId);
    if (project) {
      project.taskCount = (project.taskCount || 0) + 1;
    }
    
    return newTask;
  }

  async updateTask(id: string, task: Partial<IProjectTask>): Promise<IProjectTask> {
    console.log('MockProjectService: updateTask called with id:', id, 'data:', task);
    await simulateNetworkDelay();
    
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const oldTask = this.tasks[index];
    this.tasks[index] = {
      ...oldTask,
      ...task,
      updatedAt: new Date().toISOString()
    };
    
    // Update completed tasks count if status changed
    if (task.status !== undefined && task.status !== oldTask.status) {
      const project = this.projects.find(p => p.id === oldTask.projectId);
      if (project) {
        const projectTasks = this.tasks.filter(t => t.projectId === project.id);
        project.completedTasksCount = projectTasks.filter(t => t.status === 'completed').length;
      }
    }
    
    return this.tasks[index];
  }

  async deleteTask(id: string): Promise<void> {
    console.log('MockProjectService: deleteTask called with id:', id);
    await simulateNetworkDelay();
    
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      
      // Update project task count
      const project = this.projects.find(p => p.id === task.projectId);
      if (project) {
        project.taskCount = (project.taskCount || 1) - 1;
        const projectTasks = this.tasks.filter(t => t.projectId === project.id);
        project.completedTasksCount = projectTasks.filter(t => t.status === 'completed').length;
      }
    }
  }

  async fetchKanbanStages(projectId: string): Promise<IKanbanStage[]> {
    console.log('MockProjectService: fetchKanbanStages called with projectId:', projectId);
    await simulateNetworkDelay();
    return this.stages
      .filter(stage => stage.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  }

  async createKanbanStage(stage: Omit<IKanbanStage, 'id' | 'createdAt'>): Promise<IKanbanStage> {
    console.log('MockProjectService: createKanbanStage called with:', stage);
    await simulateNetworkDelay();
    
    const newStage: IKanbanStage = {
      ...stage,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.stages.push(newStage);
    return newStage;
  }

  async updateKanbanStage(id: string, stage: Partial<IKanbanStage>): Promise<IKanbanStage> {
    console.log('MockProjectService: updateKanbanStage called with id:', id, 'data:', stage);
    await simulateNetworkDelay();
    
    const index = this.stages.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Stage not found');
    }
    
    this.stages[index] = {
      ...this.stages[index],
      ...stage
    };
    
    return this.stages[index];
  }

  async deleteKanbanStage(id: string): Promise<void> {
    console.log('MockProjectService: deleteKanbanStage called with id:', id);
    await simulateNetworkDelay();
    
    this.stages = this.stages.filter(s => s.id !== id);
  }

  // Budget Items
  async fetchProjectBudgetItems(projectId: string): Promise<IProjectBudgetItem[]> {
    console.log('MockProjectService: fetchProjectBudgetItems called with projectId:', projectId);
    await simulateNetworkDelay();
    return this.budgetItems.filter(item => item.projectId === projectId);
  }

  async createBudgetItem(item: Omit<IProjectBudgetItem, 'id' | 'createdAt'>): Promise<IProjectBudgetItem> {
    console.log('MockProjectService: createBudgetItem called with:', item);
    await simulateNetworkDelay();
    
    const newItem: IProjectBudgetItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.budgetItems.push(newItem);
    return newItem;
  }

  async updateBudgetItem(id: string, item: Partial<IProjectBudgetItem>): Promise<IProjectBudgetItem> {
    console.log('MockProjectService: updateBudgetItem called with id:', id, 'data:', item);
    await simulateNetworkDelay();
    
    const index = this.budgetItems.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Budget item not found');
    }
    
    this.budgetItems[index] = { ...this.budgetItems[index], ...item };
    return this.budgetItems[index];
  }

  async deleteBudgetItem(id: string): Promise<void> {
    console.log('MockProjectService: deleteBudgetItem called with id:', id);
    await simulateNetworkDelay();
    this.budgetItems = this.budgetItems.filter(i => i.id !== id);
  }

  // Improvement Actions
  async fetchProjectImprovementActions(projectId: string): Promise<IProjectImprovementAction[]> {
    console.log('MockProjectService: fetchProjectImprovementActions called with projectId:', projectId);
    await simulateNetworkDelay();
    return this.improvementActions.filter(action => action.projectId === projectId);
  }

  async createImprovementAction(action: Omit<IProjectImprovementAction, 'id' | 'createdAt'>): Promise<IProjectImprovementAction> {
    console.log('MockProjectService: createImprovementAction called with:', action);
    await simulateNetworkDelay();
    
    const newAction: IProjectImprovementAction = {
      ...action,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.improvementActions.push(newAction);
    return newAction;
  }

  async updateImprovementAction(id: string, action: Partial<IProjectImprovementAction>): Promise<IProjectImprovementAction> {
    console.log('MockProjectService: updateImprovementAction called with id:', id, 'data:', action);
    await simulateNetworkDelay();
    
    const index = this.improvementActions.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Improvement action not found');
    }
    
    this.improvementActions[index] = { ...this.improvementActions[index], ...action };
    return this.improvementActions[index];
  }

  async deleteImprovementAction(id: string): Promise<void> {
    console.log('MockProjectService: deleteImprovementAction called with id:', id);
    await simulateNetworkDelay();
    this.improvementActions = this.improvementActions.filter(a => a.id !== id);
  }

  // Expansion Resources
  async fetchProjectExpansionResources(projectId: string): Promise<IProjectExpansionResource[]> {
    console.log('MockProjectService: fetchProjectExpansionResources called with projectId:', projectId);
    await simulateNetworkDelay();
    return this.expansionResources.filter(resource => resource.projectId === projectId);
  }

  async createExpansionResource(resource: Omit<IProjectExpansionResource, 'id' | 'createdAt'>): Promise<IProjectExpansionResource> {
    console.log('MockProjectService: createExpansionResource called with:', resource);
    await simulateNetworkDelay();
    
    const newResource: IProjectExpansionResource = {
      ...resource,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.expansionResources.push(newResource);
    return newResource;
  }

  async updateExpansionResource(id: string, resource: Partial<IProjectExpansionResource>): Promise<IProjectExpansionResource> {
    console.log('MockProjectService: updateExpansionResource called with id:', id, 'data:', resource);
    await simulateNetworkDelay();
    
    const index = this.expansionResources.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Expansion resource not found');
    }
    
    this.expansionResources[index] = { ...this.expansionResources[index], ...resource };
    return this.expansionResources[index];
  }

  async deleteExpansionResource(id: string): Promise<void> {
    console.log('MockProjectService: deleteExpansionResource called with id:', id);
    await simulateNetworkDelay();
    this.expansionResources = this.expansionResources.filter(r => r.id !== id);
  }

  // Sustainability Actions
  async fetchProjectSustainabilityActions(projectId: string): Promise<IProjectSustainabilityAction[]> {
    console.log('MockProjectService: fetchProjectSustainabilityActions called with projectId:', projectId);
    await simulateNetworkDelay();
    return this.sustainabilityActions.filter(action => action.projectId === projectId);
  }

  async createSustainabilityAction(action: Omit<IProjectSustainabilityAction, 'id' | 'createdAt'>): Promise<IProjectSustainabilityAction> {
    console.log('MockProjectService: createSustainabilityAction called with:', action);
    await simulateNetworkDelay();
    
    const newAction: IProjectSustainabilityAction = {
      ...action,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.sustainabilityActions.push(newAction);
    return newAction;
  }

  async updateSustainabilityAction(id: string, action: Partial<IProjectSustainabilityAction>): Promise<IProjectSustainabilityAction> {
    console.log('MockProjectService: updateSustainabilityAction called with id:', id, 'data:', action);
    await simulateNetworkDelay();
    
    const index = this.sustainabilityActions.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Sustainability action not found');
    }
    
    this.sustainabilityActions[index] = { ...this.sustainabilityActions[index], ...action };
    return this.sustainabilityActions[index];
  }

  async deleteSustainabilityAction(id: string): Promise<void> {
    console.log('MockProjectService: deleteSustainabilityAction called with id:', id);
    await simulateNetworkDelay();
    this.sustainabilityActions = this.sustainabilityActions.filter(a => a.id !== id);
  }

  // Category Goals
  async fetchProjectCategoryGoals(projectId: string): Promise<IProjectCategoryGoal[]> {
    console.log('MockProjectService: fetchProjectCategoryGoals called with projectId:', projectId);
    await simulateNetworkDelay();
    return this.categoryGoals.filter(goal => goal.projectId === projectId);
  }

  async createCategoryGoal(goal: Omit<IProjectCategoryGoal, 'id' | 'createdAt'>): Promise<IProjectCategoryGoal> {
    console.log('MockProjectService: createCategoryGoal called with:', goal);
    await simulateNetworkDelay();
    
    const newGoal: IProjectCategoryGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.categoryGoals.push(newGoal);
    return newGoal;
  }

  async updateCategoryGoal(id: string, goal: Partial<IProjectCategoryGoal>): Promise<IProjectCategoryGoal> {
    console.log('MockProjectService: updateCategoryGoal called with id:', id, 'data:', goal);
    await simulateNetworkDelay();
    
    const index = this.categoryGoals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Category goal not found');
    }
    
    this.categoryGoals[index] = { ...this.categoryGoals[index], ...goal };
    return this.categoryGoals[index];
  }

  async deleteCategoryGoal(id: string): Promise<void> {
    console.log('MockProjectService: deleteCategoryGoal called with id:', id);
    await simulateNetworkDelay();
    this.categoryGoals = this.categoryGoals.filter(g => g.id !== id);
  }

  // Smart Goals
  async fetchProjectSmartGoals(projectId: string): Promise<IProjectSmartGoal[]> {
    console.log('MockProjectService: fetchProjectSmartGoals called with projectId:', projectId);
    await simulateNetworkDelay();
    return this.smartGoals.filter(goal => goal.projectId === projectId);
  }

  async createSmartGoal(goal: Omit<IProjectSmartGoal, 'id' | 'createdAt'>): Promise<IProjectSmartGoal> {
    console.log('MockProjectService: createSmartGoal called with:', goal);
    await simulateNetworkDelay();
    
    const newGoal: IProjectSmartGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.smartGoals.push(newGoal);
    return newGoal;
  }

  async updateSmartGoal(id: string, goal: Partial<IProjectSmartGoal>): Promise<IProjectSmartGoal> {
    console.log('MockProjectService: updateSmartGoal called with id:', id, 'data:', goal);
    await simulateNetworkDelay();
    
    const index = this.smartGoals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Smart goal not found');
    }
    
    this.smartGoals[index] = { ...this.smartGoals[index], ...goal };
    return this.smartGoals[index];
  }

  async deleteSmartGoal(id: string): Promise<void> {
    console.log('MockProjectService: deleteSmartGoal called with id:', id);
    await simulateNetworkDelay();
    this.smartGoals = this.smartGoals.filter(g => g.id !== id);
  }

  // Learning Cycles (Lean Startup)
  async fetchLearningCycles(projectId: string): Promise<ILearningCycle[]> {
    console.log('MockProjectService: fetchLearningCycles called with projectId:', projectId);
    await simulateNetworkDelay();
    return this.learningCycles.filter(cycle => cycle.projectId === projectId);
  }

  async createLearningCycle(cycle: Omit<ILearningCycle, 'id' | 'createdAt'>): Promise<ILearningCycle> {
    console.log('MockProjectService: createLearningCycle called with:', cycle);
    await simulateNetworkDelay();
    
    const newCycle: ILearningCycle = {
      ...cycle,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.learningCycles.push(newCycle);
    return newCycle;
  }

  async updateLearningCycle(id: string, cycle: Partial<ILearningCycle>): Promise<ILearningCycle> {
    console.log('MockProjectService: updateLearningCycle called with id:', id, 'data:', cycle);
    await simulateNetworkDelay();
    
    const index = this.learningCycles.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Learning cycle not found');
    }
    
    this.learningCycles[index] = { ...this.learningCycles[index], ...cycle };
    return this.learningCycles[index];
  }

  async deleteLearningCycle(id: string): Promise<void> {
    console.log('MockProjectService: deleteLearningCycle called with id:', id);
    await simulateNetworkDelay();
    this.learningCycles = this.learningCycles.filter(c => c.id !== id);
  }

  // Sprints (Scrum)
  async fetchSprints(projectId: string): Promise<ISprint[]> {
    console.log('MockProjectService: fetchSprints called with projectId:', projectId);
    await simulateNetworkDelay();
    return this.sprints.filter(sprint => sprint.projectId === projectId);
  }

  async createSprint(sprint: Omit<ISprint, 'id' | 'createdAt'>): Promise<ISprint> {
    console.log('MockProjectService: createSprint called with:', sprint);
    await simulateNetworkDelay();
    
    const newSprint: ISprint = {
      ...sprint,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.sprints.push(newSprint);
    return newSprint;
  }

  async updateSprint(id: string, sprint: Partial<ISprint>): Promise<ISprint> {
    console.log('MockProjectService: updateSprint called with id:', id, 'data:', sprint);
    await simulateNetworkDelay();
    
    const index = this.sprints.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Sprint not found');
    }
    
    this.sprints[index] = { ...this.sprints[index], ...sprint };
    return this.sprints[index];
  }

  async deleteSprint(id: string): Promise<void> {
    console.log('MockProjectService: deleteSprint called with id:', id);
    await simulateNetworkDelay();
    this.sprints = this.sprints.filter(s => s.id !== id);
  }

  // Enhanced SMART Goals
  async fetchEnhancedSmartGoals(projectId: string): Promise<IEnhancedSmartGoal[]> {
    console.log('MockProjectService: fetchEnhancedSmartGoals called with projectId:', projectId);
    await simulateNetworkDelay();
    return this.enhancedSmartGoals.filter(goal => goal.projectId === projectId);
  }

  async createEnhancedSmartGoal(goal: Omit<IEnhancedSmartGoal, 'id' | 'createdAt'>): Promise<IEnhancedSmartGoal> {
    console.log('MockProjectService: createEnhancedSmartGoal called with:', goal);
    await simulateNetworkDelay();
    
    const newGoal: IEnhancedSmartGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.enhancedSmartGoals.push(newGoal);
    return newGoal;
  }

  async updateEnhancedSmartGoal(id: string, goal: Partial<IEnhancedSmartGoal>): Promise<IEnhancedSmartGoal> {
    console.log('MockProjectService: updateEnhancedSmartGoal called with id:', id, 'data:', goal);
    await simulateNetworkDelay();
    
    const index = this.enhancedSmartGoals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Enhanced SMART goal not found');
    }
    
    this.enhancedSmartGoals[index] = { ...this.enhancedSmartGoals[index], ...goal };
    return this.enhancedSmartGoals[index];
  }

  async deleteEnhancedSmartGoal(id: string): Promise<void> {
    console.log('MockProjectService: deleteEnhancedSmartGoal called with id:', id);
    await simulateNetworkDelay();
    this.enhancedSmartGoals = this.enhancedSmartGoals.filter(g => g.id !== id);
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
    await simulateNetworkDelay();
    return this.projects.find(p => p.id === id) || null;
  }

  async update(id: string, item: Partial<IProject>): Promise<IProject> {
    return this.updateProject(id, item);
  }

  async delete(id: string): Promise<void> {
    return this.deleteProject(id);
  }
}

export default new MockProjectService();
