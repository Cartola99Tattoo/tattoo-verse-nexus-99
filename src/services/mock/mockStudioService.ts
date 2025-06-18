
import { appConfig } from "@/config/appConfig";
import { simulateNetworkDelay, simulateError } from "./mockUtils";
import { Studio, StudioUser } from "../supabase/SupabaseStudioService";

// Mock data for studios
const mockStudios: Studio[] = [
  {
    id: "studio-1",
    name: "Ink Masters Studio",
    description: "Estúdio especializado em tatuagens realistas e blackwork",
    address: "Rua das Artes, 123 - Vila Madalena, São Paulo - SP",
    phone: "(11) 99999-1234",
    email: "contato@inkmasters.com",
    website: "https://inkmasters.com",
    logo_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop&crop=center",
    subscription_plan: "premium",
    settings: {
      timezone: "America/Sao_Paulo",
      currency: "BRL",
      language: "pt-BR",
      features_enabled: ["appointments", "products", "loyalty", "analytics"]
    },
    status: "active",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-06-15T15:30:00Z"
  },
  {
    id: "studio-2",
    name: "Black Rose Tattoo",
    description: "Especialistas em tatuagens femininas e delicadas",
    address: "Av. Paulista, 456 - Bela Vista, São Paulo - SP",
    phone: "(11) 88888-5678",
    email: "hello@blackrose.art",
    website: "https://blackrose.art",
    logo_url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop&crop=center",
    subscription_plan: "basic",
    settings: {
      timezone: "America/Sao_Paulo",
      currency: "BRL",
      language: "pt-BR",
      features_enabled: ["appointments", "products"]
    },
    status: "active",
    created_at: "2024-02-20T14:00:00Z",
    updated_at: "2024-06-10T09:15:00Z"
  },
  {
    id: "studio-3",
    name: "Electric Needle Co.",
    description: "Tatuagens old school e neo-tradicional",
    address: "Rua Augusta, 789 - Consolação, São Paulo - SP",
    phone: "(11) 77777-9012",
    email: "info@electricneedle.co",
    website: null,
    logo_url: null,
    subscription_plan: "enterprise",
    settings: {
      timezone: "America/Sao_Paulo",
      currency: "BRL",
      language: "pt-BR",
      features_enabled: ["appointments", "products", "loyalty", "analytics", "multi_location"]
    },
    status: "active",
    created_at: "2024-03-10T08:30:00Z",
    updated_at: "2024-06-12T11:45:00Z"
  },
  {
    id: "studio-4",
    name: "Suspended Studio",
    description: "Estúdio temporariamente suspenso",
    address: "Rua Teste, 321 - Centro, São Paulo - SP",
    phone: "(11) 66666-3456",
    email: "suspended@test.com",
    website: null,
    logo_url: null,
    subscription_plan: "basic",
    settings: {
      timezone: "America/Sao_Paulo",
      currency: "BRL",
      language: "pt-BR",
      features_enabled: ["appointments"]
    },
    status: "suspended",
    created_at: "2024-04-01T12:00:00Z",
    updated_at: "2024-05-01T16:00:00Z"
  }
];

export class MockStudioService {
  private studios: Studio[] = [...mockStudios];

  async fetchStudios(): Promise<Studio[]> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockStudioService: fetchStudios called");
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch studios");
    }
    
    return [...this.studios];
  }

  async fetchStudioById(id: string): Promise<Studio | null> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockStudioService: fetchStudioById called with id:", id);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch studio");
    }
    
    const studio = this.studios.find(s => s.id === id);
    return studio || null;
  }

  async createStudio(studioData: Omit<Studio, 'id' | 'created_at' | 'updated_at'>): Promise<Studio> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockStudioService: createStudio called with:", studioData);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to create studio");
    }
    
    const newStudio: Studio = {
      ...studioData,
      id: `studio-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.studios.push(newStudio);
    return newStudio;
  }

  async updateStudio(id: string, studioData: Partial<Studio>): Promise<Studio> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockStudioService: updateStudio called with id:", id, "data:", studioData);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to update studio");
    }
    
    const index = this.studios.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error("Studio not found");
    }
    
    this.studios[index] = {
      ...this.studios[index],
      ...studioData,
      updated_at: new Date().toISOString()
    };
    
    return this.studios[index];
  }

  async deleteStudio(id: string): Promise<boolean> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockStudioService: deleteStudio called with id:", id);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to delete studio");
    }
    
    const index = this.studios.findIndex(s => s.id === id);
    if (index === -1) {
      return false;
    }
    
    this.studios.splice(index, 1);
    return true;
  }

  async fetchStudioUsers(studioId: string): Promise<StudioUser[]> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockStudioService: fetchStudioUsers called with studioId:", studioId);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch studio users");
    }
    
    // Mock studio users data
    return [
      {
        id: "user-1",
        studio_id: studioId,
        user_id: "admin-1",
        role: "admin",
        permissions: ["all"],
        status: "active",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-06-15T15:30:00Z"
      }
    ];
  }

  async inviteUserToStudio(
    studioId: string, 
    email: string, 
    role: string, 
    permissions: string[] = [],
    invitedBy: string
  ): Promise<StudioUser> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockStudioService: inviteUserToStudio called");
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to invite user");
    }
    
    return {
      id: `invitation-${Date.now()}`,
      studio_id: studioId,
      user_id: null, // Will be set when user accepts
      role,
      permissions,
      invited_by: invitedBy,
      invited_at: new Date().toISOString(),
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  async acceptStudioInvitation(invitationId: string, userId: string): Promise<StudioUser> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockStudioService: acceptStudioInvitation called");
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to accept invitation");
    }
    
    return {
      id: invitationId,
      studio_id: "studio-1",
      user_id: userId,
      role: "artist",
      permissions: ["appointments", "clients"],
      accepted_at: new Date().toISOString(),
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  async getUserStudios(userId: string): Promise<Studio[]> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockStudioService: getUserStudios called with userId:", userId);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch user studios");
    }
    
    // Return first 2 studios as example
    return this.studios.slice(0, 2);
  }
}

export const mockStudioService = new MockStudioService();
