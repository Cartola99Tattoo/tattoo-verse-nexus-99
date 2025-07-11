
// Dados simulados para testes multi-tenant
export interface StudioTenant {
  id: string;
  name: string;
  admin_id: string;
  admin_email: string;
  location: string;
  subscription_tier: 'basic' | 'premium' | 'enterprise';
}

export interface MockAppointment {
  id: string;
  studio_id: string;
  client_name: string;
  artist_name: string;
  service: string;
  date: string;
  time: string;
  price: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export interface MockTransaction {
  id: string;
  studio_id: string;
  type: 'revenue' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at: string;
}

export interface MockClient {
  id: string;
  studio_id: string;
  name: string;
  email: string;
  phone: string;
  total_spent: number;
  visit_count: number;
  created_at: string;
}

// Estúdios simulados
export const mockStudios: StudioTenant[] = [
  {
    id: 'studio_1',
    name: 'Black Ink Studio',
    admin_id: 'admin_studio_1',
    admin_email: 'admin@blackink.com',
    location: 'São Paulo, SP',
    subscription_tier: 'premium'
  },
  {
    id: 'studio_2',
    name: 'Tattoo Arts Gallery',
    admin_id: 'admin_studio_2',
    admin_email: 'admin@tattooarts.com',
    location: 'Rio de Janeiro, RJ',
    subscription_tier: 'enterprise'
  },
  {
    id: 'studio_3',
    name: 'Ink & Soul',
    admin_id: 'admin_studio_3',
    admin_email: 'admin@inksoul.com',
    location: 'Belo Horizonte, MG',
    subscription_tier: 'basic'
  },
  {
    id: 'studio_4',
    name: 'Urban Tattoo Collective',
    admin_id: 'admin_studio_4',
    admin_email: 'admin@urbantattoo.com',
    location: 'Porto Alegre, RS',
    subscription_tier: 'premium'
  },
  {
    id: 'studio_5',
    name: 'Classic Tattoo House',
    admin_id: 'admin_studio_5',
    admin_email: 'admin@classictattoo.com',
    location: 'Brasília, DF',
    subscription_tier: 'basic'
  }
];

// Agendamentos simulados
export const mockAppointments: MockAppointment[] = [
  // Studio 1 - Black Ink Studio
  {
    id: 'apt_1_1',
    studio_id: 'studio_1',
    client_name: 'João Silva',
    artist_name: 'Carlos Mendoza',
    service: 'Tatuagem Realista',
    date: '2024-01-20',
    time: '14:00',
    price: 800,
    status: 'completed',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'apt_1_2',
    studio_id: 'studio_1',
    client_name: 'Maria Santos',
    artist_name: 'Ana Costa',
    service: 'Tatuagem Aquarela',
    date: '2024-01-22',
    time: '10:00',
    price: 600,
    status: 'confirmed',
    created_at: '2024-01-18T14:30:00Z'
  },
  {
    id: 'apt_1_3',
    studio_id: 'studio_1',
    client_name: 'Pedro Oliveira',
    artist_name: 'Carlos Mendoza',
    service: 'Cover Up',
    date: '2024-01-25',
    time: '16:00',
    price: 1200,
    status: 'pending',
    created_at: '2024-01-20T09:15:00Z'
  },

  // Studio 2 - Tattoo Arts Gallery
  {
    id: 'apt_2_1',
    studio_id: 'studio_2',
    client_name: 'Fernanda Lima',
    artist_name: 'Roberto Silva',
    service: 'Tatuagem Tribal',
    date: '2024-01-21',
    time: '15:30',
    price: 450,
    status: 'completed',
    created_at: '2024-01-16T11:20:00Z'
  },
  {
    id: 'apt_2_2',
    studio_id: 'studio_2',
    client_name: 'Lucas Ferreira',
    artist_name: 'Mariana Alves',
    service: 'Tatuagem Geométrica',
    date: '2024-01-23',
    time: '13:00',
    price: 700,
    status: 'confirmed',
    created_at: '2024-01-19T16:45:00Z'
  },

  // Studio 3 - Ink & Soul
  {
    id: 'apt_3_1',
    studio_id: 'studio_3',
    client_name: 'Carla Mendes',
    artist_name: 'Diego Santos',
    service: 'Tatuagem Minimalista',
    date: '2024-01-24',
    time: '11:30',
    price: 350,
    status: 'confirmed',
    created_at: '2024-01-20T08:00:00Z'
  },

  // Studio 4 - Urban Tattoo Collective
  {
    id: 'apt_4_1',
    studio_id: 'studio_4',
    client_name: 'Rafael Costa',
    artist_name: 'Juliano Pereira',
    service: 'Tatuagem Old School',
    date: '2024-01-26',
    time: '14:30',
    price: 520,
    status: 'pending',
    created_at: '2024-01-21T13:10:00Z'
  },
  {
    id: 'apt_4_2',
    studio_id: 'studio_4',
    client_name: 'Amanda Ribeiro',
    artist_name: 'Thiago Moura',
    service: 'Tatuagem Blackwork',
    date: '2024-01-27',
    time: '10:00',
    price: 900,
    status: 'confirmed',
    created_at: '2024-01-22T15:30:00Z'
  },

  // Studio 5 - Classic Tattoo House
  {
    id: 'apt_5_1',
    studio_id: 'studio_5',
    client_name: 'Bruno Martins',
    artist_name: 'Letícia Rocha',
    service: 'Tatuagem Tradicional',
    date: '2024-01-28',
    time: '16:30',
    price: 400,
    status: 'confirmed',
    created_at: '2024-01-23T12:00:00Z'
  }
];

// Transações simuladas
export const mockTransactions: MockTransaction[] = [
  // Studio 1 Revenue
  { id: 'tx_1_1', studio_id: 'studio_1', type: 'revenue', amount: 800, description: 'Tatuagem Realista - João Silva', category: 'Tatuagem', date: '2024-01-20', created_at: '2024-01-20T14:00:00Z' },
  { id: 'tx_1_2', studio_id: 'studio_1', type: 'revenue', amount: 600, description: 'Tatuagem Aquarela - Maria Santos', category: 'Tatuagem', date: '2024-01-22', created_at: '2024-01-22T10:00:00Z' },
  { id: 'tx_1_3', studio_id: 'studio_1', type: 'expense', amount: 200, description: 'Compra de tintas', category: 'Material', date: '2024-01-18', created_at: '2024-01-18T16:00:00Z' },

  // Studio 2 Revenue
  { id: 'tx_2_1', studio_id: 'studio_2', type: 'revenue', amount: 450, description: 'Tatuagem Tribal - Fernanda Lima', category: 'Tatuagem', date: '2024-01-21', created_at: '2024-01-21T15:30:00Z' },
  { id: 'tx_2_2', studio_id: 'studio_2', type: 'revenue', amount: 700, description: 'Tatuagem Geométrica - Lucas Ferreira', category: 'Tatuagem', date: '2024-01-23', created_at: '2024-01-23T13:00:00Z' },
  { id: 'tx_2_3', studio_id: 'studio_2', type: 'expense', amount: 150, description: 'Manutenção equipamentos', category: 'Manutenção', date: '2024-01-19', created_at: '2024-01-19T14:00:00Z' },

  // Studio 3 Revenue
  { id: 'tx_3_1', studio_id: 'studio_3', type: 'revenue', amount: 350, description: 'Tatuagem Minimalista - Carla Mendes', category: 'Tatuagem', date: '2024-01-24', created_at: '2024-01-24T11:30:00Z' },
  { id: 'tx_3_2', studio_id: 'studio_3', type: 'expense', amount: 80, description: 'Material descartável', category: 'Material', date: '2024-01-20', created_at: '2024-01-20T10:00:00Z' },

  // Studio 4 Revenue
  { id: 'tx_4_1', studio_id: 'studio_4', type: 'revenue', amount: 520, description: 'Tatuagem Old School - Rafael Costa', category: 'Tatuagem', date: '2024-01-26', created_at: '2024-01-26T14:30:00Z' },
  { id: 'tx_4_2', studio_id: 'studio_4', type: 'revenue', amount: 900, description: 'Tatuagem Blackwork - Amanda Ribeiro', category: 'Tatuagem', date: '2024-01-27', created_at: '2024-01-27T10:00:00Z' },
  { id: 'tx_4_3', studio_id: 'studio_4', type: 'expense', amount: 300, description: 'Aluguel estúdio', category: 'Fixo', date: '2024-01-25', created_at: '2024-01-25T09:00:00Z' },

  // Studio 5 Revenue
  { id: 'tx_5_1', studio_id: 'studio_5', type: 'revenue', amount: 400, description: 'Tatuagem Tradicional - Bruno Martins', category: 'Tatuagem', date: '2024-01-28', created_at: '2024-01-28T16:30:00Z' },
  { id: 'tx_5_2', studio_id: 'studio_5', type: 'expense', amount: 120, description: 'Limpeza e higienização', category: 'Operacional', date: '2024-01-22', created_at: '2024-01-22T18:00:00Z' }
];

// Clientes simulados
export const mockClients: MockClient[] = [
  // Studio 1 Clients
  { id: 'cli_1_1', studio_id: 'studio_1', name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-0001', total_spent: 2400, visit_count: 3, created_at: '2023-12-01T10:00:00Z' },
  { id: 'cli_1_2', studio_id: 'studio_1', name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 99999-0002', total_spent: 1200, visit_count: 2, created_at: '2023-11-15T14:00:00Z' },
  { id: 'cli_1_3', studio_id: 'studio_1', name: 'Pedro Oliveira', email: 'pedro@email.com', phone: '(11) 99999-0003', total_spent: 800, visit_count: 1, created_at: '2024-01-10T16:00:00Z' },

  // Studio 2 Clients
  { id: 'cli_2_1', studio_id: 'studio_2', name: 'Fernanda Lima', email: 'fernanda@email.com', phone: '(21) 99999-0004', total_spent: 900, visit_count: 2, created_at: '2023-10-20T11:00:00Z' },
  { id: 'cli_2_2', studio_id: 'studio_2', name: 'Lucas Ferreira', email: 'lucas@email.com', phone: '(21) 99999-0005', total_spent: 700, visit_count: 1, created_at: '2024-01-05T13:00:00Z' },

  // Studio 3 Clients
  { id: 'cli_3_1', studio_id: 'studio_3', name: 'Carla Mendes', email: 'carla@email.com', phone: '(31) 99999-0006', total_spent: 700, visit_count: 2, created_at: '2023-12-10T09:00:00Z' },

  // Studio 4 Clients
  { id: 'cli_4_1', studio_id: 'studio_4', name: 'Rafael Costa', email: 'rafael@email.com', phone: '(51) 99999-0007', total_spent: 520, visit_count: 1, created_at: '2024-01-15T15:00:00Z' },
  { id: 'cli_4_2', studio_id: 'studio_4', name: 'Amanda Ribeiro', email: 'amanda@email.com', phone: '(51) 99999-0008', total_spent: 1800, visit_count: 2, created_at: '2023-11-30T12:00:00Z' },

  // Studio 5 Clients
  { id: 'cli_5_1', studio_id: 'studio_5', name: 'Bruno Martins', email: 'bruno@email.com', phone: '(61) 99999-0009', total_spent: 400, visit_count: 1, created_at: '2024-01-18T17:00:00Z' }
];

// Função para calcular métricas consolidadas
export const calculateConsolidatedMetrics = () => {
  const totalRevenue = mockTransactions
    .filter(tx => tx.type === 'revenue')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = mockTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalAppointments = mockAppointments.length;
  const completedAppointments = mockAppointments.filter(apt => apt.status === 'completed').length;
  const totalClients = mockClients.length;
  const totalStudios = mockStudios.length;

  const revenueByStudio = mockStudios.map(studio => {
    const studioRevenue = mockTransactions
      .filter(tx => tx.studio_id === studio.id && tx.type === 'revenue')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const studioExpenses = mockTransactions
      .filter(tx => tx.studio_id === studio.id && tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      ...studio,
      revenue: studioRevenue,
      expenses: studioExpenses,
      profit: studioRevenue - studioExpenses,
      appointments: mockAppointments.filter(apt => apt.studio_id === studio.id).length,
      clients: mockClients.filter(cli => cli.studio_id === studio.id).length
    };
  });

  return {
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    totalAppointments,
    completedAppointments,
    totalClients,
    totalStudios,
    averageRevenuePerStudio: totalRevenue / totalStudios,
    conversionRate: (completedAppointments / totalAppointments) * 100,
    revenueByStudio
  };
};

// Função para filtrar dados por estúdio (simulação de RLS)
export const getStudioData = (studioId: string) => {
  return {
    studio: mockStudios.find(s => s.id === studioId),
    appointments: mockAppointments.filter(apt => apt.studio_id === studioId),
    transactions: mockTransactions.filter(tx => tx.studio_id === studioId),
    clients: mockClients.filter(cli => cli.studio_id === studioId)
  };
};

// Função para simular violação de permissão
export const simulatePermissionViolation = (userRole: string, studioId: string, targetStudioId: string) => {
  if (userRole === 'admin_estudio' && studioId !== targetStudioId) {
    throw new Error(`Acesso negado: admin_estudio do ${studioId} não pode acessar dados do ${targetStudioId}`);
  }
};
