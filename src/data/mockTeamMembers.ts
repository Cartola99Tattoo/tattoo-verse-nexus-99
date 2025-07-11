
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  specialties?: string[];
}

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    role: 'Tatuador Senior',
    specialties: ['Realismo', 'Black & Grey']
  },
  {
    id: '2',
    name: 'Ana Costa',
    role: 'Tatuadora',
    specialties: ['Fine Line', 'Minimalista']
  },
  {
    id: '3',
    name: 'Rafael Santos',
    role: 'Tatuador',
    specialties: ['Old School', 'Neo Traditional']
  },
  {
    id: '4',
    name: 'Marina Oliveira',
    role: 'Tatuadora',
    specialties: ['Aquarela', 'Floral']
  },
  {
    id: '5',
    name: 'João Pedro',
    role: 'Piercer',
    specialties: ['Piercings', 'Jewelry']
  },
  {
    id: '6',
    name: 'Beatriz Lima',
    role: 'Gerente de Projetos',
    specialties: ['Gestão', 'Eventos']
  },
  {
    id: '7',
    name: 'Diego Ferreira',
    role: 'Marketing',
    specialties: ['Social Media', 'Campanhas']
  }
];

export const getTeamMemberById = (id: string): TeamMember | undefined => {
  return mockTeamMembers.find(member => member.id === id);
};

export const getTeamMembersByRole = (role: string): TeamMember[] => {
  return mockTeamMembers.filter(member => member.role.toLowerCase().includes(role.toLowerCase()));
};
