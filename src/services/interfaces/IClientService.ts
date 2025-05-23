
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
  average_order_value: number;
  client_retention_rate: number;
  conversion_rate: number;
  average_conversion_time: number;
}

export interface IClientService {
  // Clientes
  fetchClients(options?: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Client[]>;
  
  fetchClientById(id: string): Promise<Client | null>;
  
  createClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'total_spent' | 'total_orders'>): Promise<Client>;
  
  updateClient(id: string, clientData: Partial<Client>): Promise<Client>;
  
  deleteClient(id: string): Promise<void>;
  
  // Estatísticas
  fetchClientStats(): Promise<ClientStats>;
  
  // Interações
  fetchClientInteractions(clientId: string): Promise<ClientInteraction[]>;
  
  createClientInteraction(interactionData: Omit<ClientInteraction, 'id' | 'created_at'>): Promise<ClientInteraction>;
  
  // Histórico de compras
  fetchClientPurchaseHistory(clientId: string): Promise<any[]>;
  
  // Histórico de agendamentos
  fetchClientAppointments(clientId: string): Promise<any[]>;
}
