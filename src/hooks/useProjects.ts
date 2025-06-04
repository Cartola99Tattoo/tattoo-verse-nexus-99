
import { useDataQuery } from './useDataQuery';
import { getProjectService } from '@/services/serviceFactory';
import { IProject } from '@/services/interfaces/IProjectService';

export const useProjects = () => {
  const projectService = getProjectService();
  
  return useDataQuery<IProject[]>(
    () => projectService.fetchProjects(),
    []
  );
};
