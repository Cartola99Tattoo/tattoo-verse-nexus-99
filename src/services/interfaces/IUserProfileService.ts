
export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profile_image?: string;
  
  // Endereço
  address_street?: string;
  address_number?: string;
  address_district?: string;
  address_city?: string;
  address_state?: string;
  address_zip_code?: string;
  
  // Preferências de Tatuagem
  preferred_tattoo_styles?: string[];
  preferred_themes?: string[];
  preferred_artists?: string[];
  preferred_body_parts?: string[];
  preferred_size?: 'small' | 'medium' | 'large' | 'sleeve';
  additional_notes?: string;
  
  // Nível de engajamento (calculado)
  engagement_level?: number;
  profile_completeness?: number;
  
  created_at: string;
  updated_at: string;
}

export interface TattooJourney {
  total_tattoos: number;
  stage: 'new_client' | 'returning_client' | 'bronze_loyalty' | 'vip_client';
  next_appointment?: {
    date: string;
    artist: string;
  };
  loyalty_benefits?: string[];
}

export interface IUserProfileService {
  fetchUserProfile(userId: string): Promise<UserProfile | null>;
  updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile>;
  createUserProfile(profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile>;
  calculateEngagementLevel(profile: UserProfile): number;
  getProfileCompleteness(profile: UserProfile): number;
  getTattooJourney(userId: string): Promise<TattooJourney>;
}
