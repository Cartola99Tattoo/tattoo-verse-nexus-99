
import { CRUDOperations } from '../base/BaseService';

export interface IEvent {
  id: string;
  name: string;
  description: string;
  detailedDescription?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  fullAddress?: string;
  featuredImage?: string;
  eventType: 'flash_day' | 'workshop' | 'collection_launch' | 'exhibition' | 'other';
  isPublic: boolean;
  price?: number;
  ticketLink?: string;
  participatingArtists?: string[];
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  smartGoals?: IEventSmartGoal[];
  createdAt: string;
  updatedAt: string;
}

export interface IEventSmartGoal {
  id: string;
  eventId: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  createdAt: string;
}

export interface IEventLead {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: string;
}

export interface IEventService extends CRUDOperations<IEvent> {
  fetchEvents(): Promise<IEvent[]>;
  fetchPublicEvents(): Promise<IEvent[]>;
  createEvent(event: Omit<IEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<IEvent>;
  updateEvent(id: string, event: Partial<IEvent>): Promise<IEvent>;
  deleteEvent(id: string): Promise<void>;
  
  fetchEventSmartGoals(eventId: string): Promise<IEventSmartGoal[]>;
  createEventSmartGoal(goal: Omit<IEventSmartGoal, 'id' | 'createdAt'>): Promise<IEventSmartGoal>;
  updateEventSmartGoal(id: string, goal: Partial<IEventSmartGoal>): Promise<IEventSmartGoal>;
  deleteEventSmartGoal(id: string): Promise<void>;
  
  fetchEventLeads(eventId: string): Promise<IEventLead[]>;
  createEventLead(lead: Omit<IEventLead, 'id' | 'createdAt'>): Promise<IEventLead>;
}
