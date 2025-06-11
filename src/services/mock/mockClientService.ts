import { faker } from '@faker-js/faker';
import { Client, CreateClientData, Appointment, CreateAppointmentData } from '../interfaces/IClientService';
import { addDays, format, addHours, subDays } from 'date-fns';

class MockClientService {
  private clients: Client[] = [];
  private appointments: Appointment[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Gerar clientes simulados
    this.clients = Array.from({ length: 50 }, (_, index) => ({
      id: `client-${index + 1}`,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number('(##) #####-####'),
      birth_date: format(faker.date.birthdate({ min: 18, max: 65, mode: 'age' }), 'yyyy-MM-dd'),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip_code: faker.location.zipCode(),
      },
      emergency_contact: {
        name: faker.person.fullName(),
        phone: faker.phone.number('(##) #####-####'),
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
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
    }));

    // Gerar agendamentos variados para demonstrar robustez do calendário
    this.appointments = this.generateVariousAppointments();
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

  async fetchClients(options?: { limit?: number; search?: string }): Promise<Client[]> {
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

  async deleteClient(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const initialLength = this.clients.length;
    this.clients = this.clients.filter(c => c.id !== id);
    
    return this.clients.length < initialLength;
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

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    return this.updateAppointment(id, { status });
  }

  async deleteAppointment(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const initialLength = this.appointments.length;
    this.appointments = this.appointments.filter(a => a.id !== id);
    
    return this.appointments.length < initialLength;
  }
}

export default MockClientService;
