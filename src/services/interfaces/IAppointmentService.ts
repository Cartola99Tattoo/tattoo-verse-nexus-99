
import { BaseService, CRUDOperations } from '../base/BaseService';

export interface AppointmentConflict {
  type: 'artist' | 'bed' | 'time';
  message: string;
  conflictingAppointment?: Appointment;
}

export interface AppointmentFilters {
  artistId?: string;
  bedId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  clientId?: string;
}

export interface IAppointmentService extends CRUDOperations<Appointment> {
  // Core CRUD
  createAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment>;
  fetchAppointments(filters?: AppointmentFilters): Promise<Appointment[]>;
  fetchAppointmentById(id: string): Promise<Appointment | null>;
  updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment>;
  deleteAppointment(id: string): Promise<void>;
  
  // Specialized methods
  fetchUpcomingAppointments(limit?: number): Promise<Appointment[]>;
  fetchAppointmentsByClient(clientId: string): Promise<Appointment[]>;
  fetchAppointmentsByArtist(artistId: string, startDate?: string, endDate?: string): Promise<Appointment[]>;
  updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void>;
  
  // Conflict detection
  checkConflicts(appointmentData: {
    artist_id: string;
    bed_id?: string;
    date: string;
    time: string;
    duration_minutes: number;
    excludeAppointmentId?: string;
  }): Promise<AppointmentConflict[]>;
  
  // Quick operations
  rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<Appointment>;
  bulkUpdateStatus(appointmentIds: string[], status: Appointment['status']): Promise<void>;
}

// Import existing types from IClientService for Appointment
import { Appointment } from './IClientService';
