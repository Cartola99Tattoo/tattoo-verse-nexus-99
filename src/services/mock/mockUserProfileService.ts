
import { simulateNetworkDelay, simulateError } from "./mockUtils";
import { appConfig } from "@/config/appConfig";

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  bio?: string;
  avatar_url?: string;
  tattoo_preferences: TattooPreferences;
  personal_preferences: PersonalPreferences;
  loyalty_status: LoyaltyStatus;
  profile_completion: number;
  created_at: string;
  updated_at: string;
}

export interface TattooPreferences {
  favorite_styles: string[];
  preferred_body_parts: string[];
  budget_range: string;
  tattoo_frequency: string;
  current_inspirations: string;
  themes_of_interest: string[];
}

export interface PersonalPreferences {
  music_genres: string[];
  movie_series_genres: string[];
  favorite_books: string;
  hobbies_interests: string;
  personality_type: string;
  curiosity_about_you: string;
}

export interface LoyaltyStatus {
  level: string;
  points: number;
  next_level: string;
  points_to_next: number;
  benefits: string[];
}

// Mock data for user profile
const mockUserProfile: UserProfile = {
  id: "user_1",
  user_id: "auth_user_1",
  first_name: "João",
  last_name: "Silva",
  email: "joao.silva@email.com",
  phone: "(11) 99999-9999",
  date_of_birth: "1990-05-15",
  address: "Rua das Flores, 123 - Vila Madalena, São Paulo - SP",
  bio: "Apaixonado por tatuagens e arte corporal. Colecionador de trabalhos únicos e sempre em busca de novos estilos.",
  avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&auto=format&fit=crop",
  tattoo_preferences: {
    favorite_styles: ["Realismo", "Blackwork", "Geométrico"],
    preferred_body_parts: ["Braço", "Perna", "Costas"],
    budget_range: "R$ 1.000 - R$ 2.500",
    tattoo_frequency: "A cada 6 meses",
    current_inspirations: "Elementos da natureza, animais selvagens e geometria sagrada",
    themes_of_interest: ["Animais", "Natureza", "Geometria Sagrada"]
  },
  personal_preferences: {
    music_genres: ["Rock", "Eletrônica", "Metal"],
    movie_series_genres: ["Ficção Científica", "Fantasia", "Ação"],
    favorite_books: "1984 - George Orwell, O Senhor dos Anéis - J.R.R. Tolkien",
    hobbies_interests: "Fotografia, trilhas na natureza, jogos de RPG, culinária",
    personality_type: "Criativo",
    curiosity_about_you: "Tenho uma coleção de mais de 500 vinis antigos e toco guitarra desde os 14 anos."
  },
  loyalty_status: {
    level: "Bronze",
    points: 150,
    next_level: "Prata",
    points_to_next: 100,
    benefits: ["5% desconto", "Prioridade no agendamento"]
  },
  profile_completion: 85,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export class MockUserProfileService {
  private userProfile: UserProfile = { ...mockUserProfile };

  async getUserProfile(userId: string): Promise<UserProfile> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockUserProfileService: getUserProfile called for user:", userId);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch user profile");
    }
    
    return { ...this.userProfile };
  }

  async updateTattooPreferences(userId: string, preferences: Partial<TattooPreferences>): Promise<UserProfile> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockUserProfileService: updateTattooPreferences called with:", preferences);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to update tattoo preferences");
    }
    
    this.userProfile = {
      ...this.userProfile,
      tattoo_preferences: {
        ...this.userProfile.tattoo_preferences,
        ...preferences
      },
      updated_at: new Date().toISOString()
    };
    
    this.updateProfileCompletion();
    return { ...this.userProfile };
  }

  async updatePersonalPreferences(userId: string, preferences: Partial<PersonalPreferences>): Promise<UserProfile> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockUserProfileService: updatePersonalPreferences called with:", preferences);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to update personal preferences");
    }
    
    this.userProfile = {
      ...this.userProfile,
      personal_preferences: {
        ...this.userProfile.personal_preferences,
        ...preferences
      },
      updated_at: new Date().toISOString()
    };
    
    this.updateProfileCompletion();
    return { ...this.userProfile };
  }

  async updateBasicInfo(userId: string, basicInfo: Partial<UserProfile>): Promise<UserProfile> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockUserProfileService: updateBasicInfo called with:", basicInfo);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to update basic info");
    }
    
    this.userProfile = {
      ...this.userProfile,
      ...basicInfo,
      updated_at: new Date().toISOString()
    };
    
    this.updateProfileCompletion();
    return { ...this.userProfile };
  }

  private updateProfileCompletion(): void {
    const profile = this.userProfile;
    let completedFields = 0;
    const totalFields = 20; // Total number of profile fields

    // Basic info completion (8 fields)
    if (profile.first_name) completedFields++;
    if (profile.last_name) completedFields++;
    if (profile.email) completedFields++;
    if (profile.phone) completedFields++;
    if (profile.date_of_birth) completedFields++;
    if (profile.address) completedFields++;
    if (profile.bio) completedFields++;
    if (profile.avatar_url) completedFields++;

    // Tattoo preferences completion (6 fields)
    if (profile.tattoo_preferences.favorite_styles.length > 0) completedFields++;
    if (profile.tattoo_preferences.preferred_body_parts.length > 0) completedFields++;
    if (profile.tattoo_preferences.budget_range) completedFields++;
    if (profile.tattoo_preferences.tattoo_frequency) completedFields++;
    if (profile.tattoo_preferences.current_inspirations) completedFields++;
    if (profile.tattoo_preferences.themes_of_interest.length > 0) completedFields++;

    // Personal preferences completion (6 fields)
    if (profile.personal_preferences.music_genres.length > 0) completedFields++;
    if (profile.personal_preferences.movie_series_genres.length > 0) completedFields++;
    if (profile.personal_preferences.favorite_books) completedFields++;
    if (profile.personal_preferences.hobbies_interests) completedFields++;
    if (profile.personal_preferences.personality_type) completedFields++;
    if (profile.personal_preferences.curiosity_about_you) completedFields++;

    this.userProfile.profile_completion = Math.round((completedFields / totalFields) * 100);
  }
}

// Export singleton instance
export const mockUserProfileService = new MockUserProfileService();
