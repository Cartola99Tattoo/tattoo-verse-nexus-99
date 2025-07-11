
import { IBedService, Bed } from '../interfaces/IBedService';
import { mockUtils } from './mockUtils';

class MockBedService implements IBedService {
  private beds: Bed[] = [
    {
      id: '1',
      number: 1,
      name: 'Maca Principal',
      isActive: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z',
    },
    {
      id: '2',
      number: 2,
      name: 'Maca VIP',
      isActive: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z',
    },
    {
      id: '3',
      number: 3,
      name: 'Sala Privativa',
      isActive: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z',
    },
  ];

  async fetchBeds(): Promise<Bed[]> {
    await mockUtils.simulateDelay();
    console.log('MockBedService: Fetching beds');
    return [...this.beds];
  }

  async createBed(bedData: Omit<Bed, 'id' | 'created_at' | 'updated_at'>): Promise<Bed> {
    await mockUtils.simulateDelay();
    console.log('MockBedService: Creating bed', bedData);
    
    const newBed: Bed = {
      ...bedData,
      id: mockUtils.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.beds.push(newBed);
    return newBed;
  }

  async updateBed(bedId: string, updates: Partial<Bed>): Promise<Bed> {
    await mockUtils.simulateDelay();
    console.log('MockBedService: Updating bed', bedId, updates);
    
    const bedIndex = this.beds.findIndex(bed => bed.id === bedId);
    if (bedIndex === -1) {
      throw new Error('Maca não encontrada');
    }

    this.beds[bedIndex] = {
      ...this.beds[bedIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return this.beds[bedIndex];
  }

  async deleteBed(bedId: string): Promise<void> {
    await mockUtils.simulateDelay();
    console.log('MockBedService: Deleting bed', bedId);
    
    const bedIndex = this.beds.findIndex(bed => bed.id === bedId);
    if (bedIndex === -1) {
      throw new Error('Maca não encontrada');
    }

    this.beds.splice(bedIndex, 1);
  }

  async checkBedAvailability(bedId: string, date: string, startTime: string, endTime: string): Promise<boolean> {
    await mockUtils.simulateDelay();
    console.log('MockBedService: Checking bed availability', { bedId, date, startTime, endTime });
    
    // Simular verificação de disponibilidade
    // Em um cenário real, isso verificaria agendamentos existentes
    return Math.random() > 0.1; // 90% de chance de estar disponível
  }
}

export const mockBedService = new MockBedService();
