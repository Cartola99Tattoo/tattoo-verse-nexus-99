
import { appConfig } from "@/config/appConfig";
import { simulateNetworkDelay, simulateError } from "./mockUtils";

export interface StudioSettings {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  social: {
    instagram: string | null;
    facebook: string | null;
    tiktok: string | null;
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  settings: {
    totalBeds: number;
    defaultAppointmentDuration: number;
    defaultCommission: number;
    paymentMethods: string[];
  };
  created_at: string;
  updated_at: string;
}

// Mock data for studio settings
const mockStudioSettings: StudioSettings = {
  id: "1",
  name: "99 Tattoo Studio",
  description: "Estúdio de tatuagem especializado em arte de qualidade e atendimento personalizado",
  logo_url: null,
  address: {
    street: "Rua das Tattoos, 99",
    neighborhood: "Vila Madalena",
    city: "São Paulo",
    state: "SP",
    cep: "01234-567"
  },
  contact: {
    phone: "(11) 99999-9999",
    email: "contato@99tattoo.com",
    whatsapp: "(11) 99999-9999"
  },
  social: {
    instagram: "@99tattoo_oficial",
    facebook: "99TattooStudio",
    tiktok: "@99tattoo"
  },
  hours: {
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "18:00", closed: false },
    saturday: { open: "10:00", close: "16:00", closed: false },
    sunday: { open: "10:00", close: "16:00", closed: true }
  },
  settings: {
    totalBeds: 4,
    defaultAppointmentDuration: 60,
    defaultCommission: 50,
    paymentMethods: ["Cartão de Crédito", "PIX", "Dinheiro", "Cartão de Débito"]
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export class MockStudioService {
  private studioSettings: StudioSettings = { ...mockStudioSettings };

  async getStudioSettings(): Promise<StudioSettings> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockStudioService: getStudioSettings called");
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch studio settings");
    }
    
    return { ...this.studioSettings };
  }

  async updateStudioSettings(settings: Partial<StudioSettings>): Promise<StudioSettings> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockStudioService: updateStudioSettings called with:", settings);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to update studio settings");
    }
    
    this.studioSettings = {
      ...this.studioSettings,
      ...settings,
      updated_at: new Date().toISOString()
    };
    
    return { ...this.studioSettings };
  }

  async uploadLogo(file: File): Promise<string> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockStudioService: uploadLogo called with file:", file.name);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to upload logo");
    }
    
    // Simulate file upload and return a mock URL
    const mockUrl = `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop&crop=center`;
    
    this.studioSettings.logo_url = mockUrl;
    this.studioSettings.updated_at = new Date().toISOString();
    
    return mockUrl;
  }
}

// Export singleton instance
export const mockStudioService = new MockStudioService();
