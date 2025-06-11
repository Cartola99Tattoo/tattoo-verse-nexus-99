
import { BaseService, ServiceError } from '../base/BaseService';
import { IAppointmentService, AppointmentConflict, AppointmentFilters } from '../interfaces/IAppointmentService';
import { Appointment } from '../interfaces/IClientService';

export class SupabaseAppointmentService extends BaseService implements IAppointmentService {
  // Mock data for demonstration
  private mockAppointments: Appointment[] = [
    {
      id: '1',
      client_id: 'client-1',
      artist_id: '1',
      bed_id: 'bed-1',
      date: '2025-01-15',
      time: '14:00',
      duration_minutes: 120,
      service_type: 'tattoo',
      service_description: 'Tatuagem tribal no braço',
      estimated_price: 350,
      price: 350,
      status: 'confirmed',
      notes: 'Cliente chegou pontualmente',
      created_at: '2025-01-10T10:00:00Z',
      updated_at: '2025-01-10T10:00:00Z',
    },
    {
      id: '2', 
      client_id: 'client-2',
      artist_id: '2',
      bed_id: 'bed-2',
      date: '2025-01-16',
      time: '10:00',
      duration_minutes: 180,
      service_type: 'tattoo',
      service_description: 'Tatuagem floral colorida',
      estimated_price: 500,
      price: 500,
      status: 'scheduled',
      notes: 'Primeira sessão',
      created_at: '2025-01-11T09:00:00Z',
      updated_at: '2025-01-11T09:00:00Z',
    }
  ];

  async create(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
    try {
      await this.simulateDelay(700);
      
      // Validations
      this.validateRequired(appointmentData, ['client_id', 'artist_id', 'date', 'time', 'service_type']);
      
      // Check for conflicts
      const conflicts = await this.checkConflicts({
        artist_id: appointmentData.artist_id,
        bed_id: appointmentData.bed_id,
        date: appointmentData.date,
        time: appointmentData.time,
        duration_minutes: appointmentData.duration_minutes,
      });

      if (conflicts.length > 0) {
        throw new ServiceError(
          `Conflito detectado: ${conflicts[0].message}`,
          'CONFLICT_ERROR',
          'createAppointment'
        );
      }

      const newAppointment: Appointment = {
        ...appointmentData,
        id: this.generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to mock data
      this.mockAppointments.push(newAppointment);

      console.log('SupabaseAppointmentService: Creating appointment with financial data', newAppointment);
      
      // Log financial integration
      if (appointmentData.price) {
        console.log(`Financial Integration: Appointment created with value R$ ${appointmentData.price}`);
      }
      
      return newAppointment;
    } catch (error) {
      this.handleError(error, 'criar agendamento');
    }
  }

  async fetchAll(filters?: AppointmentFilters): Promise<Appointment[]> {
    try {
      await this.simulateDelay(300);
      console.log('SupabaseAppointmentService: Fetching appointments with filters', filters);
      
      // Return mock data for demonstration
      return this.mockAppointments;
    } catch (error) {
      this.handleError(error, 'buscar agendamentos');
    }
  }

  async fetchById(id: string): Promise<Appointment | null> {
    try {
      await this.simulateDelay(300);
      console.log('SupabaseAppointmentService: Fetching appointment by ID', id);
      
      const appointment = this.mockAppointments.find(apt => apt.id === id);
      return appointment || null;
    } catch (error) {
      this.handleError(error, 'buscar agendamento');
    }
  }

  async update(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    try {
      await this.simulateDelay(500);
      console.log('SupabaseAppointmentService: Updating appointment', id, updates);
      
      const appointmentIndex = this.mockAppointments.findIndex(apt => apt.id === id);
      
      if (appointmentIndex === -1) {
        throw new ServiceError('Agendamento não encontrado', 'NOT_FOUND', 'update');
      }

      // Check for conflicts if date/time/artist/bed changed
      if (updates.date || updates.time || updates.artist_id || updates.bed_id) {
        const currentAppointment = this.mockAppointments[appointmentIndex];
        const conflicts = await this.checkConflicts({
          artist_id: updates.artist_id || currentAppointment.artist_id,
          bed_id: updates.bed_id || currentAppointment.bed_id,
          date: updates.date || currentAppointment.date,
          time: updates.time || currentAppointment.time,
          duration_minutes: updates.duration_minutes || currentAppointment.duration_minutes,
          excludeAppointmentId: id
        });

        if (conflicts.length > 0) {
          throw new ServiceError(
            `Conflito detectado: ${conflicts[0].message}`,
            'CONFLICT_ERROR',
            'update'
          );
        }
      }

      const updatedAppointment = {
        ...this.mockAppointments[appointmentIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };

      this.mockAppointments[appointmentIndex] = updatedAppointment;
      
      return updatedAppointment;
    } catch (error) {
      this.handleError(error, 'atualizar agendamento');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.simulateDelay(500);
      console.log('SupabaseAppointmentService: Deleting appointment', id);
      
      const appointmentIndex = this.mockAppointments.findIndex(apt => apt.id === id);
      
      if (appointmentIndex === -1) {
        throw new ServiceError('Agendamento não encontrado', 'NOT_FOUND', 'delete');
      }

      this.mockAppointments.splice(appointmentIndex, 1);
    } catch (error) {
      this.handleError(error, 'excluir agendamento');
    }
  }

  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
    return this.create(appointmentData);
  }

  async fetchAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
    return this.fetchAll(filters);
  }

  async fetchAppointmentById(id: string): Promise<Appointment | null> {
    return this.fetchById(id);
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    return this.update(id, updates);
  }

  async deleteAppointment(id: string): Promise<void> {
    return this.delete(id);
  }

  async fetchUpcomingAppointments(limit?: number): Promise<Appointment[]> {
    try {
      await this.simulateDelay(300);
      console.log('SupabaseAppointmentService: Fetching upcoming appointments', limit);
      
      const today = new Date().toISOString().split('T')[0];
      const upcomingAppointments = this.mockAppointments
        .filter(apt => apt.date >= today)
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
      
      return limit ? upcomingAppointments.slice(0, limit) : upcomingAppointments;
    } catch (error) {
      this.handleError(error, 'buscar próximos agendamentos');
    }
  }

  async fetchAppointmentsByClient(clientId: string): Promise<Appointment[]> {
    try {
      await this.simulateDelay(600);
      console.log('SupabaseAppointmentService: Fetching appointments by client', clientId);
      
      return this.mockAppointments.filter(apt => apt.client_id === clientId);
    } catch (error) {
      this.handleError(error, 'buscar agendamentos do cliente');
    }
  }

  async fetchAppointmentsByArtist(artistId: string, startDate?: string, endDate?: string): Promise<Appointment[]> {
    try {
      await this.simulateDelay(600);
      console.log('SupabaseAppointmentService: Fetching appointments by artist', artistId, startDate, endDate);
      
      let appointments = this.mockAppointments.filter(apt => apt.artist_id === artistId);
      
      if (startDate) {
        appointments = appointments.filter(apt => apt.date >= startDate);
      }
      
      if (endDate) {
        appointments = appointments.filter(apt => apt.date <= endDate);
      }
      
      return appointments;
    } catch (error) {
      this.handleError(error, 'buscar agendamentos do artista');
    }
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
    try {
      await this.simulateDelay(500);
      console.log('SupabaseAppointmentService: Updating appointment status', id, status);
      
      const appointmentIndex = this.mockAppointments.findIndex(apt => apt.id === id);
      
      if (appointmentIndex === -1) {
        throw new ServiceError('Agendamento não encontrado', 'NOT_FOUND', 'updateStatus');
      }

      this.mockAppointments[appointmentIndex] = {
        ...this.mockAppointments[appointmentIndex],
        status,
        updated_at: new Date().toISOString()
      };
      
      // Simulate financial integration for completed appointments
      if (status === 'completed') {
        const appointment = this.mockAppointments[appointmentIndex];
        console.log(`Financial Integration: Appointment ${id} marked as completed - check for revenue recording`);
        
        if (appointment.price) {
          console.log(`Revenue of R$ ${appointment.price} confirmed for appointment ${id}`);
        }
      }
    } catch (error) {
      this.handleError(error, 'atualizar status do agendamento');
    }
  }

  async checkConflicts(appointmentData: {
    artist_id: string;
    bed_id?: string;
    date: string;
    time: string;
    duration_minutes: number;
    excludeAppointmentId?: string;
  }): Promise<AppointmentConflict[]> {
    try {
      await this.simulateDelay(300);
      console.log('SupabaseAppointmentService: Checking conflicts', appointmentData);
      
      const conflicts: AppointmentConflict[] = [];
      
      const newStart = new Date(`${appointmentData.date}T${appointmentData.time}`);
      const newEnd = new Date(newStart.getTime() + appointmentData.duration_minutes * 60000);
      
      // Check for artist conflicts
      const artistConflicts = this.mockAppointments.filter(apt => {
        if (appointmentData.excludeAppointmentId && apt.id === appointmentData.excludeAppointmentId) {
          return false;
        }
        
        if (apt.artist_id !== appointmentData.artist_id || apt.date !== appointmentData.date) {
          return false;
        }
        
        const aptStart = new Date(`${apt.date}T${apt.time}`);
        const aptEnd = new Date(aptStart.getTime() + apt.duration_minutes * 60000);
        
        return (newStart < aptEnd && newEnd > aptStart);
      });
      
      if (artistConflicts.length > 0) {
        conflicts.push({
          type: 'artist',
          message: `Artista já possui agendamento das ${artistConflicts[0].time} às ${format(new Date(new Date(`${artistConflicts[0].date}T${artistConflicts[0].time}`).getTime() + artistConflicts[0].duration_minutes * 60000), 'HH:mm')}`,
        });
      }
      
      // Check for bed conflicts
      if (appointmentData.bed_id) {
        const bedConflicts = this.mockAppointments.filter(apt => {
          if (appointmentData.excludeAppointmentId && apt.id === appointmentData.excludeAppointmentId) {
            return false;
          }
          
          if (apt.bed_id !== appointmentData.bed_id || apt.date !== appointmentData.date) {
            return false;
          }
          
          const aptStart = new Date(`${apt.date}T${apt.time}`);
          const aptEnd = new Date(aptStart.getTime() + apt.duration_minutes * 60000);
          
          return (newStart < aptEnd && newEnd > aptStart);
        });
        
        if (bedConflicts.length > 0) {
          conflicts.push({
            type: 'bed',
            message: `Maca já está ocupada das ${bedConflicts[0].time} às ${format(new Date(new Date(`${bedConflicts[0].date}T${bedConflicts[0].time}`).getTime() + bedConflicts[0].duration_minutes * 60000), 'HH:mm')}`,
          });
        }
      }
      
      return conflicts;
    } catch (error) {
      this.handleError(error, 'verificar conflitos');
    }
  }

  async rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<Appointment> {
    try {
      await this.simulateDelay(700);
      console.log('SupabaseAppointmentService: Rescheduling appointment', id, newDate, newTime);
      
      return this.update(id, { date: newDate, time: newTime });
    } catch (error) {
      this.handleError(error, 'reagendar compromisso');
    }
  }

  async bulkUpdateStatus(appointmentIds: string[], status: Appointment['status']): Promise<void> {
    try {
      await this.simulateDelay(800);
      console.log('SupabaseAppointmentService: Bulk updating status', appointmentIds, status);
      
      for (const id of appointmentIds) {
        await this.updateAppointmentStatus(id, status);
      }
    } catch (error) {
      this.handleError(error, 'atualizar status em lote');
    }
  }
}

export const supabaseAppointmentService = new SupabaseAppointmentService();
