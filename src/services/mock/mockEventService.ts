
import { IEvent, IEventService, IEventSmartGoal, IEventLead } from '@/services/interfaces/IEventService';
import { simulateNetworkDelay } from './mockUtils';
import { getProductService } from '../serviceFactory';

class MockEventService implements IEventService {
  private events: IEvent[] = [
    {
      id: '1',
      name: 'Flash Day Verão 2024',
      description: 'Evento especial de tatuagens flash com designs exclusivos de verão',
      detailedDescription: 'Um dia inteiro dedicado a flash tattoos exclusivas criadas pelos nossos artistas. Preços especiais e designs únicos disponíveis apenas neste dia. Venha conferir nossa seleção especial de designs de verão!',
      startDate: '2024-07-15',
      endDate: '2024-07-15',
      startTime: '10:00',
      endTime: '18:00',
      location: 'Estúdio 99Tattoo',
      fullAddress: 'Av. Paulista, 1000 - São Paulo, SP',
      featuredImage: 'https://images.unsplash.com/photo-1552627019-947c3789ffb5?q=80&w=2069&auto=format&fit=crop',
      eventType: 'flash_day',
      isPublic: true,
      price: 150,
      participatingArtists: ['João Silva', 'Maria Santos'],
      status: 'active',
      projectId: 'proj_1',
      ticketProduct: {
        isEnabled: true,
        productName: 'Ingresso Flash Day Verão 2024',
        productPrice: 150,
        ticketStock: 50,
        productCategory: 'Ingressos',
        productDescription: 'Ingresso para participar do Flash Day Verão 2024',
        productId: 'ticket_prod_1'
      },
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'Workshop de Aquarela Tattoo',
      description: 'Workshop exclusivo sobre técnicas de tatuagem aquarela',
      detailedDescription: 'Aprenda as técnicas mais avançadas de tatuagem em estilo aquarela com nossa artista especializada. Workshop limitado a 10 participantes para garantir atenção personalizada.',
      startDate: '2024-08-05',
      endDate: '2024-08-05',
      startTime: '14:00',
      endTime: '17:00',
      location: 'Estúdio 99Tattoo',
      fullAddress: 'Av. Paulista, 1000 - São Paulo, SP',
      featuredImage: 'https://images.unsplash.com/photo-1521375712389-33c1ce3b8732?q=80&w=2070&auto=format&fit=crop',
      eventType: 'workshop',
      isPublic: true,
      price: 200,
      participatingArtists: ['Juliana Mendes'],
      status: 'pending',
      ticketProduct: {
        isEnabled: true,
        productName: 'Ingresso Workshop Aquarela',
        productPrice: 200,
        ticketStock: 10,
        productCategory: 'Workshops',
        productDescription: 'Workshop exclusivo de técnicas de aquarela tattoo',
        productId: 'ticket_prod_2'
      },
      createdAt: '2024-01-15T14:00:00Z',
      updatedAt: '2024-01-15T14:00:00Z'
    }
  ];

  private eventSmartGoals: IEventSmartGoal[] = [
    {
      id: '1',
      eventId: '1',
      title: 'Faturamento Esperado',
      description: 'Meta de receita total do evento',
      targetValue: 7500,
      currentValue: 4800,
      unit: 'R$',
      deadline: '2024-07-15',
      metricType: 'currency',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      eventId: '1',
      title: 'Número de Participantes',
      description: 'Atrair pelo menos 50 clientes para o Flash Day',
      targetValue: 50,
      currentValue: 32,
      unit: 'pessoas',
      deadline: '2024-07-15',
      metricType: 'count',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '3',
      eventId: '1',
      title: 'Leads Capturados',
      description: 'Meta de leads interessados no evento',
      targetValue: 100,
      currentValue: 67,
      unit: 'leads',
      deadline: '2024-07-15',
      metricType: 'count',
      createdAt: '2024-01-01T10:00:00Z'
    }
  ];

  private eventLeads: IEventLead[] = [
    {
      id: '1',
      eventId: '1',
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      phone: '11999999999',
      message: 'Tenho muito interesse no Flash Day!',
      createdAt: '2024-06-20T15:30:00Z'
    }
  ];

  async fetchEvents(): Promise<IEvent[]> {
    console.log('MockEventService: fetchEvents called');
    await simulateNetworkDelay();
    return this.events;
  }

  async fetchPublicEvents(): Promise<IEvent[]> {
    console.log('MockEventService: fetchPublicEvents called');
    await simulateNetworkDelay();
    return this.events.filter(event => event.isPublic && event.status === 'active');
  }

  async createEvent(event: Omit<IEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<IEvent> {
    console.log('MockEventService: createEvent called with:', event);
    await simulateNetworkDelay();
    
    const newEvent: IEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Se o evento tem configuração de ingresso, criar o produto na loja
    if (newEvent.ticketProduct?.isEnabled) {
      try {
        const productId = await this.createTicketProduct(newEvent);
        newEvent.ticketProduct.productId = productId;
      } catch (error) {
        console.warn('Error creating ticket product:', error);
      }
    }
    
    this.events.push(newEvent);
    return newEvent;
  }

  async updateEvent(id: string, event: Partial<IEvent>): Promise<IEvent> {
    console.log('MockEventService: updateEvent called with id:', id, 'data:', event);
    await simulateNetworkDelay();
    
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Event not found');
    }
    
    this.events[index] = {
      ...this.events[index],
      ...event,
      updatedAt: new Date().toISOString()
    };
    
    // Se o evento tem configuração de ingresso, atualizar o produto na loja
    if (this.events[index].ticketProduct?.isEnabled) {
      try {
        await this.updateTicketProduct(this.events[index]);
      } catch (error) {
        console.warn('Error updating ticket product:', error);
      }
    }
    
    return this.events[index];
  }

  async deleteEvent(id: string): Promise<void> {
    console.log('MockEventService: deleteEvent called with id:', id);
    await simulateNetworkDelay();
    
    this.events = this.events.filter(e => e.id !== id);
    this.eventSmartGoals = this.eventSmartGoals.filter(g => g.eventId !== id);
    this.eventLeads = this.eventLeads.filter(l => l.eventId !== id);
  }

  async fetchEventSmartGoals(eventId: string): Promise<IEventSmartGoal[]> {
    console.log('MockEventService: fetchEventSmartGoals called with eventId:', eventId);
    await simulateNetworkDelay();
    return this.eventSmartGoals.filter(goal => goal.eventId === eventId);
  }

  async createEventSmartGoal(goal: Omit<IEventSmartGoal, 'id' | 'createdAt'>): Promise<IEventSmartGoal> {
    console.log('MockEventService: createEventSmartGoal called with:', goal);
    await simulateNetworkDelay();
    
    const newGoal: IEventSmartGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.eventSmartGoals.push(newGoal);
    return newGoal;
  }

  async updateEventSmartGoal(id: string, goal: Partial<IEventSmartGoal>): Promise<IEventSmartGoal> {
    console.log('MockEventService: updateEventSmartGoal called with id:', id, 'data:', goal);
    await simulateNetworkDelay();
    
    const index = this.eventSmartGoals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Event smart goal not found');
    }
    
    this.eventSmartGoals[index] = { ...this.eventSmartGoals[index], ...goal };
    return this.eventSmartGoals[index];
  }

  async deleteEventSmartGoal(id: string): Promise<void> {
    console.log('MockEventService: deleteEventSmartGoal called with id:', id);
    await simulateNetworkDelay();
    this.eventSmartGoals = this.eventSmartGoals.filter(g => g.id !== id);
  }

  async updateSmartGoalProgress(eventId: string, goalTitle: string, newValue: number): Promise<void> {
    console.log('MockEventService: updateSmartGoalProgress called with:', eventId, goalTitle, newValue);
    await simulateNetworkDelay();
    
    const goal = this.eventSmartGoals.find(g => g.eventId === eventId && g.title === goalTitle);
    if (goal) {
      goal.currentValue = newValue;
    }
  }

  async fetchEventLeads(eventId: string): Promise<IEventLead[]> {
    console.log('MockEventService: fetchEventLeads called with eventId:', eventId);
    await simulateNetworkDelay();
    return this.eventLeads.filter(lead => lead.eventId === eventId);
  }

  async createEventLead(lead: Omit<IEventLead, 'id' | 'createdAt'>): Promise<IEventLead> {
    console.log('MockEventService: createEventLead called with:', lead);
    await simulateNetworkDelay();
    
    const newLead: IEventLead = {
      ...lead,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.eventLeads.push(newLead);
    
    // Atualizar meta de leads capturados
    await this.updateSmartGoalProgress(lead.eventId, 'Leads Capturados', this.eventLeads.filter(l => l.eventId === lead.eventId).length);
    
    return newLead;
  }

  async createTicketProduct(event: IEvent): Promise<string> {
    console.log('MockEventService: createTicketProduct called for event:', event.id);
    await simulateNetworkDelay();
    
    if (!event.ticketProduct?.isEnabled) {
      throw new Error('Ticket product not enabled for this event');
    }
    
    const productService = getProductService();
    const productData = {
      name: event.ticketProduct.productName,
      description: event.ticketProduct.productDescription,
      price: event.ticketProduct.productPrice,
      images: event.featuredImage ? [event.featuredImage] : [],
      category_id: event.ticketProduct.productCategory,
      artist_id: event.participatingArtists?.[0] || 'default',
      status: 'available' as const
    };
    
    const product = await productService.createProduct(productData);
    console.log('MockEventService: Ticket product created with ID:', product.id);
    return product.id;
  }

  async updateTicketProduct(event: IEvent): Promise<void> {
    console.log('MockEventService: updateTicketProduct called for event:', event.id);
    await simulateNetworkDelay();
    
    if (!event.ticketProduct?.isEnabled || !event.ticketProduct.productId) {
      return;
    }
    
    const productService = getProductService();
    const productData = {
      name: event.ticketProduct.productName,
      description: event.ticketProduct.productDescription,
      price: event.ticketProduct.productPrice,
      images: event.featuredImage ? [event.featuredImage] : []
    };
    
    await productService.updateProduct(event.ticketProduct.productId, productData);
    console.log('MockEventService: Ticket product updated for event:', event.id);
  }

  // Base CRUD operations (from CRUDOperations interface)
  async create(item: Omit<IEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<IEvent> {
    return this.createEvent(item);
  }

  async fetchAll(): Promise<IEvent[]> {
    return this.fetchEvents();
  }

  async fetchById(id: string): Promise<IEvent | null> {
    console.log('MockEventService: fetchById called with id:', id);
    await simulateNetworkDelay();
    return this.events.find(e => e.id === id) || null;
  }

  async update(id: string, item: Partial<IEvent>): Promise<IEvent> {
    return this.updateEvent(id, item);
  }

  async delete(id: string): Promise<void> {
    return this.deleteEvent(id);
  }
}

export default new MockEventService();
