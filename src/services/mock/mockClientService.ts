import { faker } from '@faker-js/faker';
import { IClientService, Client, ClientInteraction, ClientStats } from '../interfaces/IClientService';
import { generateMockId, delay } from './mockUtils';

class MockClientService implements IClientService {
  private mockClients: Client[] = [];
  private mockInteractions: ClientInteraction[] = [];

  constructor() {
    this.generateMockData();
  }

  private generateMockData() {
    // Gerar clientes mock
    for (let i = 0; i < 50; i++) {
      const client: Client = {
        id: generateMockId(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        birth_date: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
        status: faker.helpers.arrayElement(['new', 'interested', 'pending', 'completed', 'returning', 'vip']),
        tags: faker.helpers.arrayElements(['Old School', 'Realismo', 'Minimalista', 'Blackwork', 'Colorido'], { min: 0, max: 3 }),
        total_spent: faker.number.int({ min: 200, max: 5000 }),
        total_orders: faker.number.int({ min: 1, max: 10 }),
        preferred_artist_id: generateMockId(),
        preferred_style: faker.helpers.arrayElement(['Realismo', 'Old School', 'Minimalista', 'Blackwork']),
        notes: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
        created_at: faker.date.recent({ days: 365 }).toISOString(),
        updated_at: faker.date.recent({ days: 30 }).toISOString(),
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
  }

  async fetchClients(options: { search?: string; status?: string; limit?: number; offset?: number } = {}): Promise<Client[]> {
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
      average_order_value: this.mockClients.reduce((sum, c) => sum + c.total_spent, 0) / Math.max(this.mockClients.reduce((sum, c) => sum + c.total_orders, 0), 1),
      client_retention_rate: 85.5,
      conversion_rate: 24.5,
      average_conversion_time: 12
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
    // Mock purchase history
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

  async fetchClientAppointments(clientId: string): Promise<any[]> {
    await delay(600);
    // Mock appointments
    return [
      {
        id: generateMockId(),
        date: faker.date.future().toISOString(),
        time: '14:00',
        artist: 'Ana Costa',
        service: 'Tatuagem Realismo',
        status: 'scheduled'
      },
      {
        id: generateMockId(),
        date: faker.date.recent({ days: 15 }).toISOString(),
        time: '10:30',
        artist: 'João Santos',
        service: 'Consulta',
        status: 'completed'
      }
    ];
  }
}

export const mockClientService = new MockClientService();
