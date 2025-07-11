
export interface Bed {
  id: string;
  number: number;
  name: string;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
  currentAppointment?: {
    clientName: string;
    artistName: string;
    startTime: string;
    endTime: string;
  };
}

export interface IBedService {
  fetchBeds(): Promise<Bed[]>;
  createBed(bed: Omit<Bed, 'id' | 'created_at' | 'updated_at'>): Promise<Bed>;
  updateBed(bedId: string, updates: Partial<Bed>): Promise<Bed>;
  deleteBed(bedId: string): Promise<void>;
  checkBedAvailability(bedId: string, date: string, startTime: string, endTime: string): Promise<boolean>;
}
