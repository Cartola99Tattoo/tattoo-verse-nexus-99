
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'active' | 'inactive';
  notes?: string;
  created_at: string;
  updated_at: string;
  total_spent: number;
  total_orders: number;
}

export interface Appointment {
  id: string;
  client_id: string;
  artist_id: string;
  bed_id?: string; // Nova propriedade para gestão de macas
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
  fetchClients(options?: { limit?: number; offset?: number }): Promise<Client[]>;
  fetchClientById(id: string): Promise<Client>;
  createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'total_spent' | 'total_orders'>): Promise<Client>;
  updateClient(id: string, updates: Partial<Client>): Promise<Client>;
  deleteClient(id: string): Promise<void>;
  
  // Appointment methods
  fetchUpcomingAppointments(limit?: number): Promise<Appointment[]>;
  fetchAppointmentsByClient(clientId: string): Promise<Appointment[]>;
  createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment>;
  updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment>;
  updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void>;
  deleteAppointment(id: string): Promise<void>;
}
