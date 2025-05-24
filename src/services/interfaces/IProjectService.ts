
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
}

export interface IProjectTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface IKanbanStage {
  id: string;
  projectId: string;
  name: string;
  order: number;
  color: string;
  createdAt: string;
}

export interface IProjectService {
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
}
