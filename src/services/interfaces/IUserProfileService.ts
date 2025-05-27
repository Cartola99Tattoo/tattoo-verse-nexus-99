
export interface UserProfileData {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  
  // Preferências de tatuagem
  preferred_styles?: string[];
  body_locations?: string[];
  size_preference?: string;
  budget_range?: string;
  color_preference?: string;
  timeframe?: string;
  special_interests?: string;
  
  // Jornada do cliente
  total_tattoos: number;
  current_stage: string;
  loyalty_level: string;
  engagement_score: number;
  next_appointment?: string;
  
  created_at: string;
  updated_at: string;
}

export interface IUserProfileService {
  fetchUserProfile(userId: string): Promise<UserProfileData>;
  updateUserProfile(userId: string, data: Partial<UserProfileData>): Promise<UserProfileData>;
  calculateEngagementScore(profile: UserProfileData): number;
  syncWithClientData(userId: string, clientId: string): Promise<void>;
}
