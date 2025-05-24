
import { IProject, IProjectTask, IKanbanStage, IProjectService } from '@/services/interfaces/IProjectService';
import { mockUtils } from './mockUtils';

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
      completedTasksCount: 3
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
      order: 1
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
      order: 2
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

  async fetchProjects(): Promise<IProject[]> {
    console.log('MockProjectService: fetchProjects called');
    await mockUtils.simulateDelay();
    return this.projects;
  }

  async createProject(project: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProject> {
    console.log('MockProjectService: createProject called with:', project);
    await mockUtils.simulateDelay();
    
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
    await mockUtils.simulateDelay();
    
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
    await mockUtils.simulateDelay();
    
    this.projects = this.projects.filter(p => p.id !== id);
    this.tasks = this.tasks.filter(t => t.projectId !== id);
    this.stages = this.stages.filter(s => s.projectId !== id);
  }

  async fetchProjectTasks(projectId: string): Promise<IProjectTask[]> {
    console.log('MockProjectService: fetchProjectTasks called with projectId:', projectId);
    await mockUtils.simulateDelay();
    return this.tasks.filter(task => task.projectId === projectId);
  }

  async createTask(task: Omit<IProjectTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProjectTask> {
    console.log('MockProjectService: createTask called with:', task);
    await mockUtils.simulateDelay();
    
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
    await mockUtils.simulateDelay();
    
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
    await mockUtils.simulateDelay();
    
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
    await mockUtils.simulateDelay();
    return this.stages
      .filter(stage => stage.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  }

  async createKanbanStage(stage: Omit<IKanbanStage, 'id' | 'createdAt'>): Promise<IKanbanStage> {
    console.log('MockProjectService: createKanbanStage called with:', stage);
    await mockUtils.simulateDelay();
    
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
    await mockUtils.simulateDelay();
    
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
    await mockUtils.simulateDelay();
    
    this.stages = this.stages.filter(s => s.id !== id);
    // Note: In a real implementation, you might want to move tasks to another stage
  }
}

export default new MockProjectService();
