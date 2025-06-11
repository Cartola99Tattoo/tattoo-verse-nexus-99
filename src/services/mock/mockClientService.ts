import { faker } from '@faker-js/faker';
import { Client, CreateClientData, Appointment, CreateAppointmentData, ClientStats, ClientInteraction, KanbanStage, PageVisit, IClientService } from '../interfaces/IClientService';
import { addDays, format, addHours, subDays } from 'date-fns';

class MockClientService implements IClientService {
  private clients: Client[] = [];
  private appointments: Appointment[] = [];
  private interactions: ClientInteraction[] = [];
  private kanbanStages: KanbanStage[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Gerar clientes simulados
    this.clients = Array.from({ length: 50 }, (_, index) => ({
      id: `client-${index + 1}`,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      birth_date: format(faker.date.birthdate({ min: 18, max: 65, mode: 'age' }), 'yyyy-MM-dd'),
      status: faker.helpers.arrayElement(['new', 'active', 'inactive', 'interested', 'pending', 'completed', 'returning', 'vip'] as const),
      total_spent: faker.number.float({ min: 0, max: 5000, fractionDigits: 2 }),
      total_orders: faker.number.int({ min: 0, max: 20 }),
      address: faker.location.streetAddress(),
      tags: faker.helpers.arrayElements(['VIP', 'Primeira Vez', 'Retorno', 'Indicação'], { min: 0, max: 2 }),
      notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }) || '',
      emergency_contact: {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        relationship: faker.helpers.arrayElement(['Mãe', 'Pai', 'Cônjuge', 'Irmão/Irmã', 'Amigo(a)']),
      },
      medical_info: {
        allergies: faker.helpers.arrayElement(['Nenhuma', 'Látex', 'Medicamentos', 'Alimentos']),
        medications: faker.helpers.arrayElement(['Nenhum', 'Antibióticos', 'Anti-inflamatórios']),
        health_conditions: faker.helpers.arrayElement(['Nenhuma', 'Diabetes', 'Hipertensão', 'Cardíaco']),
      },
      tattoo_history: {
        has_tattoos: faker.datatype.boolean(),
        tattoo_count: faker.number.int({ min: 0, max: 10 }),
        last_tattoo_date: format(faker.date.recent({ days: 365 }), 'yyyy-MM-dd'),
        preferred_style: faker.helpers.arrayElement(['Realismo', 'Old School', 'Blackwork', 'Aquarela', 'Minimalista']),
      },
      preferences: {
        communication_method: faker.helpers.arrayElement(['email', 'phone', 'whatsapp']),
        appointment_reminders: faker.datatype.boolean(),
        marketing_emails: faker.datatype.boolean(),
      },
      temperature: faker.helpers.arrayElement(['hot', 'warm', 'cold'] as const),
      temperature_score: faker.number.int({ min: 0, max: 100 }),
      preferred_artist_id: faker.helpers.arrayElement(['1', '2', '3']),
      preferred_style: faker.helpers.arrayElement(['Realismo', 'Old School', 'Blackwork', 'Aquarela', 'Minimalista']),
      lead_score: faker.number.int({ min: 0, max: 100 }),
      last_activity: faker.date.recent().toISOString(),
      qualified_interests: faker.helpers.arrayElements(['Tatuagem', 'Piercing', 'Consulta'], { min: 1, max: 3 }),
      origin: faker.helpers.arrayElement(['Instagram', 'Facebook', 'Indicação', 'Google', 'Site']),
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
    }));

    // Gerar agendamentos variados para demonstrar robustez do calendário
    this.appointments = this.generateVariousAppointments();

    // Initialize kanban stages
    this.kanbanStages = [
      { id: '1', name: 'Novos Leads', status_key: 'new', order: 1, color: '#3b82f6', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: '2', name: 'Interessados', status_key: 'interested', order: 2, color: '#f59e0b', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: '3', name: 'Ativos', status_key: 'active', order: 3, color: '#10b981', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: '4', name: 'VIP', status_key: 'vip', order: 4, color: '#8b5cf6', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];
  }

  private generateVariousAppointments(): Appointment[] {
    const appointments: Appointment[] = [];
    const artists = ['1', '2', '3']; // João Silva, Maria Santos, Pedro Costa
    const beds = ['bed-1', 'bed-2', 'bed-3', 'bed-4']; // Assumindo que temos 4 macas
    const serviceTypes: Array<'tattoo' | 'piercing' | 'consultation'> = ['tattoo', 'piercing', 'consultation'];
    const statuses: Array<Appointment['status']> = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    
    // Gerar agendamentos para os próximos 30 dias
    for (let dayOffset = -7; dayOffset <= 30; dayOffset++) {
      const currentDate = format(addDays(new Date(), dayOffset), 'yyyy-MM-dd');
      
      // Gerar 2-6 agendamentos por dia (variação realista)
      const appointmentsPerDay = faker.number.int({ min: 2, max: 6 });
      
      for (let i = 0; i < appointmentsPerDay; i++) {
        const startHour = faker.number.int({ min: 8, max: 18 });
        const startMinute = faker.helpers.arrayElement([0, 30]);
        const timeString = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
        
        // Duração variada baseada no tipo de serviço
        const serviceType = faker.helpers.arrayElement(serviceTypes);
        let duration: number;
        switch (serviceType) {
          case 'consultation':
            duration = faker.helpers.arrayElement([30, 60]);
            break;
          case 'piercing':
            duration = faker.helpers.arrayElement([30, 60, 90]);
            break;
          case 'tattoo':
            duration = faker.helpers.arrayElement([120, 180, 240, 300, 360]);
            break;
          default:
            duration = 120;
        }

        const clientId = faker.helpers.arrayElement(this.clients).id;
        const artistId = faker.helpers.arrayElement(artists);
        const bedId = faker.datatype.boolean() ? faker.helpers.arrayElement(beds) : undefined;
        const status = faker.helpers.arrayElement(statuses);
        
        // Preços realistas baseados no tipo de serviço
        let price: number;
        switch (serviceType) {
          case 'consultation':
            price = faker.number.int({ min: 50, max: 100 });
            break;
          case 'piercing':
            price = faker.number.int({ min: 80, max: 200 });
            break;
          case 'tattoo':
            price = faker.number.int({ min: 200, max: 1500 });
            break;
          default:
            price = 200;
        }

        appointments.push({
          id: `appointment-${appointments.length + 1}`,
          client_id: clientId,
          artist_id: artistId,
          bed_id: bedId,
          date: currentDate,
          time: timeString,
          duration_minutes: duration,
          service_type: serviceType,
          service_description: this.generateServiceDescription(serviceType),
          status: status,
          estimated_price: price,
          price: status === 'completed' ? price : 0,
          notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }) || '',
          created_at: faker.date.past().toISOString(),
          updated_at: faker.date.recent().toISOString(),
        });
      }
    }

    return appointments;
  }

  private generateServiceDescription(serviceType: 'tattoo' | 'piercing' | 'consultation'): string {
    switch (serviceType) {
      case 'tattoo':
        const tattooStyles = ['Realismo', 'Old School', 'Blackwork', 'Aquarela', 'Minimalista', 'Geométrica'];
        const tattooLocations = ['Braço', 'Perna', 'Costas', 'Peito', 'Antebraço', 'Panturrilha'];
        const tattooSizes = ['Pequena (5-10cm)', 'Média (10-20cm)', 'Grande (20-30cm)', 'Extra Grande (30cm+)'];
        
        return `Tatuagem ${faker.helpers.arrayElement(tattooStyles)} - ${faker.helpers.arrayElement(tattooLocations)} - ${faker.helpers.arrayElement(tattooSizes)}`;
      
      case 'piercing':
        const piercingTypes = ['Orelha', 'Nariz', 'Sobrancelha', 'Lábio', 'Língua', 'Umbigo'];
        return `Piercing ${faker.helpers.arrayElement(piercingTypes)}`;
      
      case 'consultation':
        const consultationTypes = ['Orçamento', 'Análise de Cicatrização', 'Discussão de Design', 'Primeira Consulta'];
        return `${faker.helpers.arrayElement(consultationTypes)}`;
      
      default:
        return 'Serviço personalizado';
    }
  }

  // Base CRUD methods
  async create(data: CreateClientData): Promise<Client> {
    return this.createClient(data);
  }

  async read(id: string): Promise<Client | null> {
    return this.fetchClientById(id);
  }

  async update(id: string, data: Partial<Client>): Promise<Client> {
    return this.updateClient(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.deleteClient(id);
  }

  async list(options?: any): Promise<Client[]> {
    return this.fetchClients(options);
  }

  // Missing methods from CRUDOperations interface
  async fetchAll(options?: any): Promise<Client[]> {
    return this.fetchClients(options);
  }

  async fetchById(id: string): Promise<Client | null> {
    return this.fetchClientById(id);
  }

  async fetchClients(options?: { search?: string; status?: string; temperature?: string; limit?: number; offset?: number }): Promise<Client[]> {
    console.log('Using mock client service');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filteredClients = this.clients;
    
    if (options?.search) {
      const searchTerm = options.search.toLowerCase();
      filteredClients = this.clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm)
      );
    }
    
    if (options?.limit) {
      return filteredClients.slice(0, options.limit);
    }
    
    return filteredClients;
  }

  async fetchClientById(id: string): Promise<Client | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.clients.find(client => client.id === id) || null;
  }

  async createClient(clientData: CreateClientData): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newClient: Client = {
      id: `client-${Date.now()}`,
      ...clientData,
      total_spent: clientData.total_spent || 0,
      total_orders: clientData.total_orders || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    this.clients.push(newClient);
    return newClient;
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const clientIndex = this.clients.findIndex(c => c.id === id);
    if (clientIndex === -1) {
      throw new Error('Cliente não encontrado');
    }
    
    this.clients[clientIndex] = {
      ...this.clients[clientIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    return this.clients[clientIndex];
  }

  async deleteClient(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const initialLength = this.clients.length;
    this.clients = this.clients.filter(c => c.id !== id);
    
    if (this.clients.length === initialLength) {
      throw new Error('Cliente não encontrado');
    }
  }

  async fetchUpcomingAppointments(limit: number = 50): Promise<Appointment[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return this.appointments
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
      .slice(0, limit);
  }

  async createAppointment(appointmentData: CreateAppointmentData): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newAppointment: Appointment = {
      id: `appointment-${Date.now()}`,
      ...appointmentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    this.appointments.push(newAppointment);
    console.log('New appointment created:', newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const appointmentIndex = this.appointments.findIndex(a => a.id === id);
    if (appointmentIndex === -1) {
      throw new Error('Agendamento não encontrado');
    }
    
    this.appointments[appointmentIndex] = {
      ...this.appointments[appointmentIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    return this.appointments[appointmentIndex];
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
    await this.updateAppointment(id, { status });
  }

  async deleteAppointment(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const initialLength = this.appointments.length;
    this.appointments = this.appointments.filter(a => a.id !== id);
    
    if (this.appointments.length === initialLength) {
      throw new Error('Agendamento não encontrado');
    }
  }

  async fetchClientAppointments(clientId: string): Promise<Appointment[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.appointments.filter(appointment => appointment.client_id === clientId);
  }

  async fetchAppointmentsByClient(clientId: string): Promise<Appointment[]> {
    return this.fetchClientAppointments(clientId);
  }

  // Client stats and extended methods
  async fetchClientStats(): Promise<ClientStats> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const totalClients = this.clients.length;
    const activeClients = this.clients.filter(c => c.status === 'active').length;
    const vipClients = this.clients.filter(c => c.status === 'vip').length;
    const hotClients = this.clients.filter(c => c.temperature === 'hot').length;
    const warmClients = this.clients.filter(c => c.temperature === 'warm').length;
    const coldClients = this.clients.filter(c => c.temperature === 'cold').length;
    
    return {
      total_clients: totalClients,
      new_clients_this_month: Math.floor(totalClients * 0.1),
      active_clients: activeClients,
      vip_clients: vipClients,
      hot_clients: hotClients,
      warm_clients: warmClients,
      cold_clients: coldClients,
      average_order_value: 350.50,
      client_retention_rate: 85.5,
      conversion_rate: 68.2,
      average_conversion_time: 15.5,
      scheduled_appointments: this.appointments.filter(a => a.status === 'scheduled').length,
      confirmed_appointments: this.appointments.filter(a => a.status === 'confirmed').length,
    };
  }

  async updateClientTemperature(id: string, temperature: 'hot' | 'warm' | 'cold', score?: number): Promise<Client> {
    return this.updateClient(id, { temperature, temperature_score: score });
  }

  async fetchClientInteractions(clientId: string): Promise<ClientInteraction[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.interactions.filter(interaction => interaction.client_id === clientId);
  }

  async createClientInteraction(interactionData: Omit<ClientInteraction, 'id' | 'created_at'>): Promise<ClientInteraction> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newInteraction: ClientInteraction = {
      id: `interaction-${Date.now()}`,
      ...interactionData,
      created_at: new Date().toISOString(),
    };
    
    this.interactions.push(newInteraction);
    return newInteraction;
  }

  async fetchClientPurchaseHistory(clientId: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return []; // Mock empty purchase history
  }

  // Kanban methods
  async fetchKanbanStages(): Promise<KanbanStage[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.kanbanStages;
  }

  async createKanbanStage(stageData: Omit<KanbanStage, 'id' | 'created_at' | 'updated_at'>): Promise<KanbanStage> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newStage: KanbanStage = {
      id: `stage-${Date.now()}`,
      ...stageData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    this.kanbanStages.push(newStage);
    return newStage;
  }

  async updateKanbanStage(id: string, stageData: Partial<KanbanStage>): Promise<KanbanStage> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const stageIndex = this.kanbanStages.findIndex(s => s.id === id);
    if (stageIndex === -1) {
      throw new Error('Stage não encontrado');
    }
    
    this.kanbanStages[stageIndex] = {
      ...this.kanbanStages[stageIndex],
      ...stageData,
      updated_at: new Date().toISOString(),
    };
    
    return this.kanbanStages[stageIndex];
  }

  async deleteKanbanStage(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const initialLength = this.kanbanStages.length;
    this.kanbanStages = this.kanbanStages.filter(s => s.id !== id);
    
    if (this.kanbanStages.length === initialLength) {
      throw new Error('Stage não encontrado');
    }
  }

  // Lead qualification methods
  async fetchClientPageVisits(clientId: string): Promise<PageVisit[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return []; // Mock empty page visits
  }

  async updateLeadScore(clientId: string, score: number): Promise<void> {
    await this.updateClient(clientId, { lead_score: score });
  }

  async updateQualifiedInterests(clientId: string, interests: string[]): Promise<void> {
    await this.updateClient(clientId, { qualified_interests: interests });
  }
}

export const mockClientService = new MockClientService();
export default MockClientService;
