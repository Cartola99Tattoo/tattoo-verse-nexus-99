import { faker } from '@faker-js/faker';
import { IClientService, Client, ClientInteraction, ClientStats, KanbanStage, Appointment, PageVisit } from '../interfaces/IClientService';
import { generateMockId, delay } from './mockUtils';

class MockClientService implements IClientService {
  private mockClients: Client[] = [];
  private mockInteractions: ClientInteraction[] = [];
  private mockKanbanStages: KanbanStage[] = [];
  private mockAppointments: Appointment[] = [];

  constructor() {
    this.generateMockData();
  }

  private generateMockData() {
    // Gerar estágios padrão do Kanban
    this.mockKanbanStages = [
      { id: "1", name: "Novos Leads", status_key: "new", order: 1, color: "blue", active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "2", name: "Interessados", status_key: "interested", order: 2, color: "yellow", active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "3", name: "Agendamento Pendente", status_key: "pending", order: 3, color: "orange", active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "4", name: "Tatuagem Concluída", status_key: "completed", order: 4, color: "green", active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "5", name: "Retorno Esperado", status_key: "returning", order: 5, color: "purple", active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "6", name: "VIP/Fidelidade", status_key: "vip", order: 6, color: "pink", active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ];

    // Gerar clientes mock
    for (let i = 0; i < 50; i++) {
      const totalSpent = faker.number.int({ min: 200, max: 5000 });
      const totalOrders = faker.number.int({ min: 1, max: 10 });
      
      // Calcular temperatura baseada em critérios
      let temperatureScore = 0;
      if (totalSpent > 2000) temperatureScore += 3;
      else if (totalSpent > 1000) temperatureScore += 2;
      else if (totalSpent > 500) temperatureScore += 1;
      
      if (totalOrders > 5) temperatureScore += 2;
      else if (totalOrders > 2) temperatureScore += 1;

      const temperature = temperatureScore >= 4 ? 'hot' : temperatureScore >= 2 ? 'warm' : 'cold';
      
      const client: Client = {
        id: generateMockId(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        birth_date: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
        status: faker.helpers.arrayElement(['new', 'interested', 'pending', 'completed', 'returning', 'vip']),
        tags: faker.helpers.arrayElements(['Old School', 'Realismo', 'Minimalista', 'Blackwork', 'Colorido'], { min: 0, max: 3 }),
        total_spent: totalSpent,
        total_orders: totalOrders,
        preferred_artist_id: generateMockId(),
        preferred_style: faker.helpers.arrayElement(['Realismo', 'Old School', 'Minimalista', 'Blackwork']),
        notes: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
        temperature,
        temperature_score: temperatureScore,
        next_appointment_date: faker.datatype.boolean() ? faker.date.future().toISOString() : undefined,
        next_appointment_artist: faker.datatype.boolean() ? faker.person.fullName() : undefined,
        appointment_status: faker.helpers.arrayElement(['scheduled', 'confirmed', 'cancelled']),
        created_at: faker.date.recent({ days: 365 }).toISOString(),
        updated_at: faker.date.recent({ days: 30 }).toISOString(),
        // Novos campos para qualificação de leads
        lead_score: faker.number.int({ min: 0, max: 100 }),
        last_activity: faker.date.recent({ days: 7 }).toISOString(),
        qualified_interests: faker.helpers.arrayElements(['Tatuagem Floral', 'Eventos Corporativos', 'Realismo', 'Minimalista'], { min: 0, max: 3 }),
        origin: faker.helpers.arrayElement(['landing_events', 'contact_form', 'consultation', 'shop', 'referral', 'social_media', 'manual']),
      };
      this.mockClients.push(client);
    }

    // Gerar interações mock
    this.mockClients.forEach(client => {
      const interactionCount = faker.number.int({ min: 1, max: 8 });
      for (let i = 0; i < interactionCount; i++) {
        const interaction: ClientInteraction = {
          id: generateMockId(),
          client_id: client.id,
          type: faker.helpers.arrayElement(['call', 'email', 'visit', 'note', 'appointment', 'purchase']),
          title: faker.lorem.words(3),
          description: faker.lorem.sentence(),
          date: faker.date.recent({ days: 90 }).toISOString(),
          user_id: generateMockId(),
          created_at: faker.date.recent({ days: 90 }).toISOString(),
        };
        this.mockInteractions.push(interaction);
      }
    });

    // Gerar agendamentos mock
    for (let i = 0; i < 20; i++) {
      const appointment: Appointment = {
        id: generateMockId(),
        client_id: faker.helpers.arrayElement(this.mockClients).id,
        artist_id: generateMockId(),
        date: faker.date.future().toISOString(),
        time: faker.helpers.arrayElement(['09:00', '10:30', '14:00', '15:30', '17:00']),
        duration_minutes: faker.helpers.arrayElement([60, 90, 120, 180, 240]),
        service_type: faker.helpers.arrayElement(['tattoo', 'piercing', 'consultation']),
        service_description: faker.lorem.sentence(),
        estimated_price: faker.number.int({ min: 300, max: 2000 }),
        status: faker.helpers.arrayElement(['scheduled', 'confirmed', 'completed', 'cancelled']),
        notes: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
        created_at: faker.date.recent({ days: 30 }).toISOString(),
        updated_at: faker.date.recent({ days: 7 }).toISOString(),
      };
      this.mockAppointments.push(appointment);
    }
  }

  // Base CRUD operations implementation
  async create(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'total_spent' | 'total_orders'>): Promise<Client> {
    return this.createClient(clientData);
  }

  async fetchAll(options: { search?: string; status?: string; temperature?: string; limit?: number; offset?: number } = {}): Promise<Client[]> {
    return this.fetchClients(options);
  }

  async fetchById(id: string): Promise<Client | null> {
    return this.fetchClientById(id);
  }

  async update(id: string, clientData: Partial<Client>): Promise<Client> {
    return this.updateClient(id, clientData);
  }

  async delete(id: string): Promise<void> {
    return this.deleteClient(id);
  }

  async fetchClients(options: { search?: string; status?: string; temperature?: string; limit?: number; offset?: number } = {}): Promise<Client[]> {
    await delay(600);
    let filtered = [...this.mockClients];

    if (options.search) {
      const search = options.search.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        client.phone?.includes(search)
      );
    }

    if (options.status) {
      filtered = filtered.filter(client => client.status === options.status);
    }

    if (options.temperature) {
      filtered = filtered.filter(client => client.temperature === options.temperature);
    }

    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async fetchClientById(id: string): Promise<Client | null> {
    await delay(500);
    return this.mockClients.find(client => client.id === id) || null;
  }

  async createClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'total_spent' | 'total_orders'>): Promise<Client> {
    await delay(800);
    const newClient: Client = {
      ...clientData,
      id: generateMockId(),
      total_spent: 0,
      total_orders: 0,
      temperature: 'cold',
      temperature_score: 0,
      lead_score: clientData.lead_score || 0,
      last_activity: new Date().toISOString(),
      qualified_interests: clientData.qualified_interests || [],
      origin: clientData.origin || 'manual',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.mockClients.unshift(newClient);
    return newClient;
  }

  async updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
    await delay(700);
    const index = this.mockClients.findIndex(client => client.id === id);
    if (index === -1) {
      throw new Error('Cliente não encontrado');
    }
    
    this.mockClients[index] = {
      ...this.mockClients[index],
      ...clientData,
      updated_at: new Date().toISOString(),
    };
    
    return this.mockClients[index];
  }

  async updateClientTemperature(id: string, temperature: 'hot' | 'warm' | 'cold', score?: number): Promise<Client> {
    await delay(500);
    const index = this.mockClients.findIndex(client => client.id === id);
    if (index === -1) {
      throw new Error('Cliente não encontrado');
    }
    
    this.mockClients[index] = {
      ...this.mockClients[index],
      temperature,
      temperature_score: score || this.mockClients[index].temperature_score,
      updated_at: new Date().toISOString(),
    };
    
    return this.mockClients[index];
  }

  async deleteClient(id: string): Promise<void> {
    await delay(500);
    const index = this.mockClients.findIndex(client => client.id === id);
    if (index === -1) {
      throw new Error('Cliente não encontrado');
    }
    
    this.mockClients.splice(index, 1);
    this.mockInteractions = this.mockInteractions.filter(interaction => interaction.client_id !== id);
  }

  async fetchClientStats(): Promise<ClientStats> {
    await delay(800);
    const totalClients = this.mockClients.length;
    const newClientsThisMonth = this.mockClients.filter(client => {
      const createdDate = new Date(client.created_at);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
    }).length;

    return {
      total_clients: totalClients,
      new_clients_this_month: newClientsThisMonth,
      active_clients: this.mockClients.filter(c => c.status === 'active').length,
      vip_clients: this.mockClients.filter(c => c.status === 'vip').length,
      hot_clients: this.mockClients.filter(c => c.temperature === 'hot').length,
      warm_clients: this.mockClients.filter(c => c.temperature === 'warm').length,
      cold_clients: this.mockClients.filter(c => c.temperature === 'cold').length,
      average_order_value: this.mockClients.reduce((sum, c) => sum + c.total_spent, 0) / Math.max(this.mockClients.reduce((sum, c) => sum + c.total_orders, 0), 1),
      client_retention_rate: 85.5,
      conversion_rate: 24.5,
      average_conversion_time: 12,
      scheduled_appointments: this.mockAppointments.filter(a => a.status === 'scheduled').length,
      confirmed_appointments: this.mockAppointments.filter(a => a.status === 'confirmed').length,
    };
  }

  async fetchClientInteractions(clientId: string): Promise<ClientInteraction[]> {
    await delay(500);
    return this.mockInteractions
      .filter(interaction => interaction.client_id === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createClientInteraction(interactionData: Omit<ClientInteraction, 'id' | 'created_at'>): Promise<ClientInteraction> {
    await delay(600);
    const newInteraction: ClientInteraction = {
      ...interactionData,
      id: generateMockId(),
      created_at: new Date().toISOString(),
    };
    this.mockInteractions.unshift(newInteraction);
    return newInteraction;
  }

  async fetchClientPurchaseHistory(clientId: string): Promise<any[]> {
    await delay(600);
    return [
      {
        id: generateMockId(),
        date: faker.date.recent({ days: 30 }).toISOString(),
        type: 'tattoo',
        description: 'Tatuagem Old School - Âncora',
        amount: 850,
        artist: 'Carlos Silva',
        status: 'completed'
      },
      {
        id: generateMockId(),
        date: faker.date.recent({ days: 60 }).toISOString(),
        type: 'product',
        description: 'Camiseta Estúdio',
        amount: 45,
        status: 'completed'
      }
    ];
  }

  async fetchClientAppointments(clientId: string): Promise<Appointment[]> {
    await delay(600);
    return this.mockAppointments
      .filter(appointment => appointment.client_id === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async fetchUpcomingAppointments(limit?: number): Promise<Appointment[]> {
    await delay(600);
    const upcoming = this.mockAppointments
      .filter(appointment => new Date(appointment.date) > new Date() && appointment.status !== 'cancelled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return limit ? upcoming.slice(0, limit) : upcoming;
  }

  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
    await delay(700);
    const newAppointment: Appointment = {
      ...appointmentData,
      id: generateMockId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.mockAppointments.unshift(newAppointment);
    return newAppointment;
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
    await delay(500);
    const index = this.mockAppointments.findIndex(appointment => appointment.id === id);
    if (index === -1) {
      throw new Error('Agendamento não encontrado');
    }
    
    this.mockAppointments[index] = {
      ...this.mockAppointments[index],
      status,
      updated_at: new Date().toISOString(),
    };
  }

  async fetchKanbanStages(): Promise<KanbanStage[]> {
    await delay(400);
    return this.mockKanbanStages.sort((a, b) => a.order - b.order);
  }

  async createKanbanStage(stageData: Omit<KanbanStage, 'id' | 'created_at' | 'updated_at'>): Promise<KanbanStage> {
    await delay(600);
    const newStage: KanbanStage = {
      ...stageData,
      id: generateMockId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.mockKanbanStages.push(newStage);
    return newStage;
  }

  async updateKanbanStage(id: string, stageData: Partial<KanbanStage>): Promise<KanbanStage> {
    await delay(500);
    const index = this.mockKanbanStages.findIndex(stage => stage.id === id);
    if (index === -1) {
      throw new Error('Estágio não encontrado');
    }
    
    this.mockKanbanStages[index] = {
      ...this.mockKanbanStages[index],
      ...stageData,
      updated_at: new Date().toISOString(),
    };
    
    return this.mockKanbanStages[index];
  }

  async deleteKanbanStage(id: string): Promise<void> {
    await delay(400);
    const index = this.mockKanbanStages.findIndex(stage => stage.id === id);
    if (index === -1) {
      throw new Error('Estágio não encontrado');
    }
    
    this.mockKanbanStages.splice(index, 1);
  }

  async fetchAppointmentsByClient(clientId: string): Promise<Appointment[]> {
    return this.fetchClientAppointments(clientId);
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    await delay(500);
    const index = this.mockAppointments.findIndex(appointment => appointment.id === id);
    if (index === -1) {
      throw new Error('Agendamento não encontrado');
    }
    
    this.mockAppointments[index] = {
      ...this.mockAppointments[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    return this.mockAppointments[index];
  }

  async deleteAppointment(id: string): Promise<void> {
    await delay(500);
    const index = this.mockAppointments.findIndex(appointment => appointment.id === id);
    if (index === -1) {
      throw new Error('Agendamento não encontrado');
    }
    
    this.mockAppointments.splice(index, 1);
  }

  // Novos métodos para qualificação de leads
  async fetchClientPageVisits(clientId: string): Promise<PageVisit[]> {
    await delay(600);
    console.log('MockClientService: Fetching client page visits', clientId);
    
    // Mock data para demonstração
    return [
      {
        id: generateMockId(),
        client_id: clientId,
        session_id: 'session-123',
        url: '/artists',
        page_title: 'Tatuadores',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
        duration_seconds: 180,
      },
      {
        id: generateMockId(),
        client_id: clientId,
        session_id: 'session-123',
        url: '/events',
        page_title: 'Eventos de Tatuagem',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hora atrás
        duration_seconds: 240,
      },
      {
        id: generateMockId(),
        client_id: clientId,
        session_id: 'session-123',
        url: '/artists/1',
        page_title: 'Portfólio do Tatuador',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min atrás
        duration_seconds: 320,
      }
    ];
  }

  async updateLeadScore(clientId: string, score: number): Promise<void> {
    await delay(500);
    console.log('MockClientService: Updating lead score', clientId, score);
    
    const index = this.mockClients.findIndex(client => client.id === clientId);
    if (index !== -1) {
      this.mockClients[index] = {
        ...this.mockClients[index],
        lead_score: score,
        updated_at: new Date().toISOString(),
      };
    }
  }

  async updateQualifiedInterests(clientId: string, interests: string[]): Promise<void> {
    await delay(500);
    console.log('MockClientService: Updating qualified interests', clientId, interests);
    
    const index = this.mockClients.findIndex(client => client.id === clientId);
    if (index !== -1) {
      this.mockClients[index] = {
        ...this.mockClients[index],
        qualified_interests: interests,
        updated_at: new Date().toISOString(),
      };
    }
  }
}

export const mockClientService = new MockClientService();
