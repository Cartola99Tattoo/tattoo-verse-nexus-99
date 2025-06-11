import { CRUDOperations } from '../base/BaseService';

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
  
  // Novos campos para qualificação de leads
  lead_score?: number; // Pontuação de 0 a 100
  last_activity?: string; // Data da última atividade
  qualified_interests?: string[]; // Interesses identificados
  origin?: string; // Origem do lead
}

export interface PageVisit {
  id: string;
  client_id?: string;
  session_id: string;
  url: string;
  page_title?: string;
  timestamp: string;
  duration_seconds?: number;
  user_agent?: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  artist_id: string;
  date: string;
  time: string;
  duration_minutes: number;
  service_type: 'tattoo' | 'piercing' | 'consultation';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  bed_id?: string;
  price?: number; // Added financial integration
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

export interface IClientService extends CRUDOperations<Client> {
  // Existing methods
  fetchClients(options?: { search?: string; status?: string; temperature?: string; limit?: number; offset?: number }): Promise<Client[]>;
  fetchClientById(id: string): Promise<Client | null>;
  createClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'total_spent' | 'total_orders'>): Promise<Client>;
  updateClient(id: string, clientData: Partial<Client>): Promise<Client>;
  deleteClient(id: string): Promise<void>;
  
  // Extended methods
  fetchClientStats(): Promise<ClientStats>;
  updateClientTemperature(id: string, temperature: 'hot' | 'warm' | 'cold', score?: number): Promise<Client>;
  fetchClientInteractions(clientId: string): Promise<ClientInteraction[]>;
  createClientInteraction(interactionData: Omit<ClientInteraction, 'id' | 'created_at'>): Promise<ClientInteraction>;
  fetchClientPurchaseHistory(clientId: string): Promise<any[]>;
  fetchClientAppointments(clientId: string): Promise<Appointment[]>;
  fetchUpcomingAppointments(limit?: number): Promise<Appointment[]>;
  createAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment>;
  updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void>;
  fetchKanbanStages(): Promise<KanbanStage[]>;
  createKanbanStage(stageData: Omit<KanbanStage, 'id' | 'created_at' | 'updated_at'>): Promise<KanbanStage>;
  updateKanbanStage(id: string, stageData: Partial<KanbanStage>): Promise<KanbanStage>;
  deleteKanbanStage(id: string): Promise<void>;
  fetchAppointmentsByClient(clientId: string): Promise<Appointment[]>;
  updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment>;
  deleteAppointment(id: string): Promise<void>;
  
  // Novos métodos para qualificação de leads
  fetchClientPageVisits(clientId: string): Promise<PageVisit[]>;
  updateLeadScore(clientId: string, score: number): Promise<void>;
  updateQualifiedInterests(clientId: string, interests: string[]): Promise<void>;
}
