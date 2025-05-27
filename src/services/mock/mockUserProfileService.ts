
import { IUserProfileService, UserProfile, TattooJourney } from "@/services/interfaces/IUserProfileService";

export class MockUserProfileService implements IUserProfileService {
  private profiles: Map<string, UserProfile> = new Map();

  constructor() {
    // Mock data para demonstração
    this.profiles.set('user-1', {
      id: 'profile-1',
      user_id: 'user-1',
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '(11) 99999-9999',
      birth_date: '1990-05-15',
      gender: 'male',
      address_street: 'Rua das Flores',
      address_number: '123',
      address_district: 'Centro',
      address_city: 'São Paulo',
      address_state: 'SP',
      address_zip_code: '01234-567',
      preferred_tattoo_styles: ['Realismo', 'Old School'],
      preferred_themes: ['Animais', 'Geométrica'],
      preferred_artists: ['artist-1', 'artist-2'],
      preferred_body_parts: ['Braço', 'Peito'],
      preferred_size: 'medium',
      additional_notes: 'Gosto de tatuagens coloridas e com bastante detalhe.',
      engagement_level: 8,
      profile_completeness: 85,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    console.log('MockUserProfileService: fetchUserProfile called for user:', userId);
    return this.profiles.get(userId) || null;
  }

  async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    console.log('MockUserProfileService: updateUserProfile called for user:', userId, profileData);
    
    const existingProfile = this.profiles.get(userId);
    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...profileData,
      user_id: userId,
      updated_at: new Date().toISOString(),
    } as UserProfile;

    // Recalcular nível de engajamento e completude
    updatedProfile.engagement_level = this.calculateEngagementLevel(updatedProfile);
    updatedProfile.profile_completeness = this.getProfileCompleteness(updatedProfile);

    this.profiles.set(userId, updatedProfile);
    return updatedProfile;
  }

  async createUserProfile(profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
    console.log('MockUserProfileService: createUserProfile called:', profileData);
    
    const newProfile: UserProfile = {
      ...profileData,
      id: `profile-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    newProfile.engagement_level = this.calculateEngagementLevel(newProfile);
    newProfile.profile_completeness = this.getProfileCompleteness(newProfile);

    this.profiles.set(profileData.user_id, newProfile);
    return newProfile;
  }

  calculateEngagementLevel(profile: UserProfile): number {
    let score = 0;
    
    // Informações básicas (30%)
    if (profile.name) score += 5;
    if (profile.email) score += 5;
    if (profile.phone) score += 5;
    if (profile.birth_date) score += 5;
    if (profile.gender) score += 5;
    if (profile.profile_image) score += 5;
    
    // Endereço (20%)
    if (profile.address_street) score += 3;
    if (profile.address_city) score += 3;
    if (profile.address_state) score += 3;
    if (profile.address_zip_code) score += 3;
    
    // Preferências de tatuagem (50%)
    if (profile.preferred_tattoo_styles?.length) score += 10;
    if (profile.preferred_themes?.length) score += 10;
    if (profile.preferred_artists?.length) score += 10;
    if (profile.preferred_body_parts?.length) score += 10;
    if (profile.preferred_size) score += 5;
    if (profile.additional_notes) score += 5;
    
    return Math.min(score, 10); // Máximo 10
  }

  getProfileCompleteness(profile: UserProfile): number {
    const totalFields = 16;
    let completedFields = 0;
    
    if (profile.name) completedFields++;
    if (profile.email) completedFields++;
    if (profile.phone) completedFields++;
    if (profile.birth_date) completedFields++;
    if (profile.gender) completedFields++;
    if (profile.profile_image) completedFields++;
    if (profile.address_street) completedFields++;
    if (profile.address_city) completedFields++;
    if (profile.address_state) completedFields++;
    if (profile.address_zip_code) completedFields++;
    if (profile.preferred_tattoo_styles?.length) completedFields++;
    if (profile.preferred_themes?.length) completedFields++;
    if (profile.preferred_artists?.length) completedFields++;
    if (profile.preferred_body_parts?.length) completedFields++;
    if (profile.preferred_size) completedFields++;
    if (profile.additional_notes) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  }

  async getTattooJourney(userId: string): Promise<TattooJourney> {
    console.log('MockUserProfileService: getTattooJourney called for user:', userId);
    
    // Mock data baseado no progresso do cliente
    return {
      total_tattoos: 3,
      stage: 'returning_client',
      next_appointment: {
        date: '2024-06-15',
        artist: 'Carlos Rodrigues'
      },
      loyalty_benefits: [
        'Desconto de 10% na próxima sessão',
        'Consulta gratuita para novo projeto',
        'Prioridade no agendamento'
      ]
    };
  }
}
