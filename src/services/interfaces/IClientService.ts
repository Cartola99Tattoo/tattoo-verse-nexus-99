
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  status: 'new' | 'active' | 'inactive' | 'interested' | 'pending' | 'completed' | 'returning' | 'vip';
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  total_spent: number;
  total_orders: number;
  preferred_artist_id?: string;
  preferred_style?: string;
  temperature?: 'hot' | 'warm' | 'cold';
  temperature_score?: number;
  next_appointment_date?: string;
  next_appointment_artist?: string;
  appointment_status?: 'scheduled' | 'confirmed' | 'cancelled';
}

export interface Appointment {
  id: string;
  client_id: string;
  artist_id: string;
  bed_id?: string;
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

export interface ClientInteraction {
  id: string;
  client_id: string;
  type: 'call' | 'email' | 'visit' | 'note' | 'appointment' | 'purchase';
  title: string;
  description?: string;
  date: string;
  user_id: string;
  created_at: string;
}

export interface ClientStats {
  total_clients: number;
  new_clients_this_month: number;
  active_clients: number;
  vip_clients: number;
  hot_clients: number;
  warm_clients: number;
  cold_clients: number;
  average_order_value: number;
  client_retention_rate: number;
  conversion_rate: number;
  average_conversion_time: number;
  scheduled_appointments: number;
  confirmed_appointments: number;
}

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

export interface IClientService {
  fetchClients(options?: { 
    limit?: number; 
    offset?: number; 
    search?: string; 
    status?: string; 
    temperature?: string;
  }): Promise<Client[]>;
  fetchClientById(id: string): Promise<Client>;
  createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'total_spent' | 'total_orders'>): Promise<Client>;
  updateClient(id: string, updates: Partial<Client>): Promise<Client>;
  updateClientTemperature(id: string, temperature: 'hot' | 'warm' | 'cold', score?: number): Promise<Client>;
  deleteClient(id: string): Promise<void>;
  
  // Stats methods
  fetchClientStats(): Promise<ClientStats>;
  
  // Interaction methods
  fetchClientInteractions(clientId: string): Promise<ClientInteraction[]>;
  createClientInteraction(interaction: Omit<ClientInteraction, 'id' | 'created_at'>): Promise<ClientInteraction>;
  
  // Purchase history
  fetchClientPurchaseHistory(clientId: string): Promise<any[]>;
  
  // Appointment methods
  fetchUpcomingAppointments(limit?: number): Promise<Appointment[]>;
  fetchAppointmentsByClient(clientId: string): Promise<Appointment[]>;
  fetchClientAppointments(clientId: string): Promise<Appointment[]>;
  createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment>;
  updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment>;
  updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void>;
  deleteAppointment(id: string): Promise<void>;
  
  // Kanban methods
  fetchKanbanStages(): Promise<KanbanStage[]>;
  createKanbanStage(stage: Omit<KanbanStage, 'id' | 'created_at' | 'updated_at'>): Promise<KanbanStage>;
  updateKanbanStage(id: string, updates: Partial<KanbanStage>): Promise<KanbanStage>;
  deleteKanbanStage(id: string): Promise<void>;
}
