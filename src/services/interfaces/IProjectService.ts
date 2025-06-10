
import { CRUDOperations } from '../base/BaseService';

export interface IProject {
  id: string;
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  createdAt: string;
  updatedAt: string;
  taskCount?: number;
  completedTasksCount?: number;
  
  // Lean Startup fields
  mainHypothesis?: string;
  validationMetrics?: string;
  learningCycles?: ILearningCycle[];
  
  // Scrum fields
  currentSprint?: string;
  sprints?: ISprint[];
  
  // Blue Ocean Strategy fields
  valueCurve?: string;
  valueInnovations?: string[];
  
  // SMART Goals enhanced
  smartGoals?: IEnhancedSmartGoal[];
}

export interface ILearningCycle {
  id: string;
  projectId: string;
  hypothesis: string;
  experiment: string;
  results: string;
  learnings: string;
  nextAction: string;
  date: string;
  createdAt: string;
}

export interface ISprint {
  id: string;
  projectId: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  storyPoints: number;
  completedPoints: number;
  createdAt: string;
}

export interface IEnhancedSmartGoal {
  id: string;
  projectId: string;
  title: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  currentMetric: number;
  targetMetric: number;
  deadline: string;
  responsible?: string;
  progress: number;
  createdAt: string;
}

export type SmartCriteria = 'specific' | 'measurable' | 'achievable' | 'relevant' | 'time_bound';

export interface ISmartGoalAssociation {
  goalId: string;
  criteria: SmartCriteria[];
}

export interface IProjectTask {
  id: string;
  projectId: string;
  sprintId?: string;
  title: string;
  description?: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
  storyPoints?: number;
  estimatedHours?: number;
  smartGoalAssociation?: ISmartGoalAssociation[];
}

export interface IKanbanStage {
  id: string;
  projectId: string;
  name: string;
  order: number;
  color: string;
  createdAt: string;
}

export interface IProjectBudgetItem {
  id: string;
  projectId: string;
  description: string;
  estimatedCost: number;
  realCost: number;
  status: 'estimated' | 'paid' | 'pending';
  smartGoalId?: string;
  smartCriteria?: SmartCriteria;
  createdAt: string;
}

export interface IProjectImprovementAction {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  responsible?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
  smartGoalId?: string;
  smartCriteria?: SmartCriteria;
  createdAt: string;
}

export interface IProjectExpansionResource {
  id: string;
  projectId: string;
  resource: string;
  justification: string;
  estimatedCost: number;
  status: 'planning' | 'researching' | 'approved' | 'acquired';
  smartGoalId?: string;
  smartCriteria?: SmartCriteria;
  createdAt: string;
}

export interface IProjectSustainabilityAction {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  responsible?: string;
  deadline?: string;
  status: 'pending' | 'in_progress' | 'completed';
  smartGoalId?: string;
  smartCriteria?: SmartCriteria;
  createdAt: string;
}

export interface IProjectRisk {
  id: string;
  projectId: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  status: 'open' | 'mitigated' | 'occurred';
  smartGoalId?: string;
  smartCriteria?: SmartCriteria;
  createdAt: string;
}

export interface IProjectCategoryGoal {
  id: string;
  projectId: string;
  category: string;
  title: string;
  description?: string;
  responsible?: string;
  deadline?: string;
  status: 'not_started' | 'in_progress' | 'achieved' | 'partially_achieved';
  createdAt: string;
}

export interface IProjectSmartGoal {
  id: string;
  projectId: string;
  title: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  deadline?: string;
  responsible?: string;
  progress: number;
  createdAt: string;
}

export interface IProjectService extends CRUDOperations<IProject> {
  fetchProjects(): Promise<IProject[]>;
  createProject(project: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProject>;
  updateProject(id: string, project: Partial<IProject>): Promise<IProject>;
  deleteProject(id: string): Promise<void>;
  
  fetchProjectTasks(projectId: string): Promise<IProjectTask[]>;
  createTask(task: Omit<IProjectTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProjectTask>;
  updateTask(id: string, task: Partial<IProjectTask>): Promise<IProjectTask>;
  deleteTask(id: string): Promise<void>;
  
  fetchKanbanStages(projectId: string): Promise<IKanbanStage[]>;
  createKanbanStage(stage: Omit<IKanbanStage, 'id' | 'createdAt'>): Promise<IKanbanStage>;
  updateKanbanStage(id: string, stage: Partial<IKanbanStage>): Promise<IKanbanStage>;
  deleteKanbanStage(id: string): Promise<void>;

  // New planning methods
  fetchProjectBudgetItems(projectId: string): Promise<IProjectBudgetItem[]>;
  createBudgetItem(item: Omit<IProjectBudgetItem, 'id' | 'createdAt'>): Promise<IProjectBudgetItem>;
  updateBudgetItem(id: string, item: Partial<IProjectBudgetItem>): Promise<IProjectBudgetItem>;
  deleteBudgetItem(id: string): Promise<void>;
  
  fetchProjectImprovementActions(projectId: string): Promise<IProjectImprovementAction[]>;
  createImprovementAction(action: Omit<IProjectImprovementAction, 'id' | 'createdAt'>): Promise<IProjectImprovementAction>;
  updateImprovementAction(id: string, action: Partial<IProjectImprovementAction>): Promise<IProjectImprovementAction>;
  deleteImprovementAction(id: string): Promise<void>;
  
  fetchProjectExpansionResources(projectId: string): Promise<IProjectExpansionResource[]>;
  createExpansionResource(resource: Omit<IProjectExpansionResource, 'id' | 'createdAt'>): Promise<IProjectExpansionResource>;
  updateExpansionResource(id: string, resource: Partial<IProjectExpansionResource>): Promise<IProjectExpansionResource>;
  deleteExpansionResource(id: string): Promise<void>;
  
  fetchProjectSustainabilityActions(projectId: string): Promise<IProjectSustainabilityAction[]>;
  createSustainabilityAction(action: Omit<IProjectSustainabilityAction, 'id' | 'createdAt'>): Promise<IProjectSustainabilityAction>;
  updateSustainabilityAction(id: string, action: Partial<IProjectSustainabilityAction>): Promise<IProjectSustainabilityAction>;
  deleteSustainabilityAction(id: string): Promise<void>;
  
  fetchProjectCategoryGoals(projectId: string): Promise<IProjectCategoryGoal[]>;
  createCategoryGoal(goal: Omit<IProjectCategoryGoal, 'id' | 'createdAt'>): Promise<IProjectCategoryGoal>;
  updateCategoryGoal(id: string, goal: Partial<IProjectCategoryGoal>): Promise<IProjectCategoryGoal>;
  deleteCategoryGoal(id: string): Promise<void>;
  
  fetchProjectSmartGoals(projectId: string): Promise<IProjectSmartGoal[]>;
  createSmartGoal(goal: Omit<IProjectSmartGoal, 'id' | 'createdAt'>): Promise<IProjectSmartGoal>;
  updateSmartGoal(id: string, goal: Partial<IProjectSmartGoal>): Promise<IProjectSmartGoal>;
  deleteSmartGoal(id: string): Promise<void>;

  // New methods for enhanced functionality
  fetchLearningCycles(projectId: string): Promise<ILearningCycle[]>;
  createLearningCycle(cycle: Omit<ILearningCycle, 'id' | 'createdAt'>): Promise<ILearningCycle>;
  updateLearningCycle(id: string, cycle: Partial<ILearningCycle>): Promise<ILearningCycle>;
  deleteLearningCycle(id: string): Promise<void>;

  fetchSprints(projectId: string): Promise<ISprint[]>;
  createSprint(sprint: Omit<ISprint, 'id' | 'createdAt'>): Promise<ISprint>;
  updateSprint(id: string, sprint: Partial<ISprint>): Promise<ISprint>;
  deleteSprint(id: string): Promise<void>;

  fetchEnhancedSmartGoals(projectId: string): Promise<IEnhancedSmartGoal[]>;
  createEnhancedSmartGoal(goal: Omit<IEnhancedSmartGoal, 'id' | 'createdAt'>): Promise<IEnhancedSmartGoal>;
  updateEnhancedSmartGoal(id: string, goal: Partial<IEnhancedSmartGoal>): Promise<IEnhancedSmartGoal>;
  deleteEnhancedSmartGoal(id: string): Promise<void>;

  // Risk management methods
  fetchProjectRisks(projectId: string): Promise<IProjectRisk[]>;
  createRisk(risk: Omit<IProjectRisk, 'id' | 'createdAt'>): Promise<IProjectRisk>;
  updateRisk(id: string, risk: Partial<IProjectRisk>): Promise<IProjectRisk>;
  deleteRisk(id: string): Promise<void>;
}
