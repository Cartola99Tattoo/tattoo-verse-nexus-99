
import { IUserProfileService, UserProfileData } from "../interfaces/IUserProfileService";

class MockUserProfileService implements IUserProfileService {
  private mockProfile: UserProfileData = {
    id: "1",
    user_id: "user-123",
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-9999",
    address: "São Paulo, SP",
    birth_date: "1990-01-01",
    preferred_styles: ["Realismo", "Traditional"],
    body_locations: ["Braço", "Antebraço"],
    size_preference: "media",
    budget_range: "1000-2000",
    color_preference: "ambas",
    timeframe: "3-months",
    special_interests: "Natureza, animais, símbolos celtas",
    total_tattoos: 3,
    current_stage: "Cliente Recorrente",
    loyalty_level: "Bronze",
    engagement_score: 75,
    next_appointment: "2024-02-15",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  async fetchUserProfile(userId: string): Promise<UserProfileData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...this.mockProfile, user_id: userId };
  }

  async updateUserProfile(userId: string, data: Partial<UserProfileData>): Promise<UserProfileData> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.mockProfile = {
      ...this.mockProfile,
      ...data,
      user_id: userId,
      updated_at: new Date().toISOString()
    };
    
    // Recalcular engagement score
    this.mockProfile.engagement_score = this.calculateEngagementScore(this.mockProfile);
    
    return { ...this.mockProfile };
  }

  calculateEngagementScore(profile: UserProfileData): number {
    let score = 0;
    
    // Pontuação por informações básicas preenchidas
    if (profile.name) score += 10;
    if (profile.phone) score += 10;
    if (profile.address) score += 5;
    if (profile.birth_date) score += 5;
    
    // Pontuação por preferências de tatuagem
    if (profile.preferred_styles?.length) score += 15;
    if (profile.body_locations?.length) score += 10;
    if (profile.size_preference) score += 5;
    if (profile.budget_range) score += 10;
    if (profile.color_preference) score += 5;
    if (profile.timeframe) score += 10;
    if (profile.special_interests) score += 10;
    
    // Pontuação por histórico
    score += Math.min(profile.total_tattoos * 5, 25);
    
    return Math.min(score, 100);
  }

  async syncWithClientData(userId: string, clientId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Implementar sincronização bidirecional entre user profile e client data
    console.log(`Sincronizando dados entre usuário ${userId} e cliente ${clientId}`);
  }
}

export const mockUserProfileService = new MockUserProfileService();
