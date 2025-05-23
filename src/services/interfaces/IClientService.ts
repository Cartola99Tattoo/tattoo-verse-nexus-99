
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  status: 'new' | 'active' | 'inactive' | 'vip' | 'interested' | 'pending' | 'completed' | 'returning';
  tags?: string[];
  total_spent: number;
  total_orders: number;
  preferred_artist_id?: string;
  preferred_style?: string;
  notes?: string;
  temperature?: 'hot' | 'warm' | 'cold'; // Nova propriedade para temperatura de interesse
  temperature_score?: number; // Pontuação calculada automaticamente
  next_appointment_date?: string; // Próximo agendamento
  next_appointment_artist?: string; // Artista do próximo agendamento
  appointment_status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'; // Status do agendamento
  created_at: string;
  updated_at: string;
}

export interface ClientInteraction {
  id: string;
  client_id: string;
  type: 'call' | 'email' | 'visit' | 'note' | 'appointment' | 'purchase';
  title: string;
  description: string;
  date: string;
  user_id?: string;
  created_at: string;
}

export interface ClientStats {
  total_clients: number;
  new_clients_this_month: number;
  active_clients: number;
  vip_clients: number;
  hot_clients: number; // Clientes com temperatura "hot"
  warm_clients: number; // Clientes com temperatura "warm"
  cold_clients: number; // Clientes com temperatura "cold"
  average_order_value: number;
  client_retention_rate: number;
  conversion_rate: number;
  average_conversion_time: number;
  scheduled_appointments: number; // Agendamentos marcados
  confirmed_appointments: number; // Agendamentos confirmados
}

// Nova interface para estágios do Kanban
export interface KanbanStage {
  id: string;
  name: string;
  status_key: string;
  order: number;
  color: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Nova interface para agendamentos (preparação para módulo futuro)
export interface Appointment {
  id: string;
  client_id: string;
  artist_id: string;
  date: string;
  time: string;
  duration_minutes: number;
  service_type: 'tattoo' | 'piercing' | 'consultation';
  service_description?: string;
  estimated_price?: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface IClientService {
  // Clientes
  fetchClients(options?: {
    search?: string;
    status?: string;
    temperature?: string;
    limit?: number;
    offset?: number;
  }): Promise<Client[]>;
  
  fetchClientById(id: string): Promise<Client | null>;
  
  createClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'total_spent' | 'total_orders'>): Promise<Client>;
  
  updateClient(id: string, clientData: Partial<Client>): Promise<Client>;
  
  updateClientTemperature(id: string, temperature: 'hot' | 'warm' | 'cold', score?: number): Promise<Client>;
  
  deleteClient(id: string): Promise<void>;
  
  // Estatísticas
  fetchClientStats(): Promise<ClientStats>;
  
  // Interações
  fetchClientInteractions(clientId: string): Promise<ClientInteraction[]>;
  
  createClientInteraction(interactionData: Omit<ClientInteraction, 'id' | 'created_at'>): Promise<ClientInteraction>;
  
  // Histórico de compras
  fetchClientPurchaseHistory(clientId: string): Promise<any[]>;
  
  // Agendamentos (preparação para módulo futuro)
  fetchClientAppointments(clientId: string): Promise<Appointment[]>;
  
  fetchUpcomingAppointments(limit?: number): Promise<Appointment[]>;
  
  createAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment>;
  
  updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment>;
  
  // Estágios do Kanban
  fetchKanbanStages(): Promise<KanbanStage[]>;
  
  createKanbanStage(stageData: Omit<KanbanStage, 'id' | 'created_at' | 'updated_at'>): Promise<KanbanStage>;
  
  updateKanbanStage(id: string, stageData: Partial<KanbanStage>): Promise<KanbanStage>;
  
  deleteKanbanStage(id: string): Promise<void>;
}
