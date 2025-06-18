
import { Session, User } from "@supabase/supabase-js";
import { UserProfile } from "@/contexts/AuthContext";
import { UserPermissions } from "@/services/supabase/SupabaseAuthService";

export interface IAuthService {
  // Core authentication methods
  getSession(): Promise<Session | null>;
  getUser(): Promise<User | null>;
  signIn(email: string, password: string): Promise<{ error: any }>;
  signUp(email: string, password: string, firstName: string, lastName: string): Promise<{ error: any }>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<{ error: any }>;
  updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<{ error: any }>;
  fetchProfile(userId: string): Promise<UserProfile | null>;
  onAuthStateChange(callback: (event: string, session: Session | null) => void): { subscription: { unsubscribe: () => void } };
  
  // NEW: Multi-tenant methods
  getUserPermissions?(userId: string): Promise<UserPermissions | null>;
  assignUserRole?(userId: string, role: string, studioId?: string, permissions?: string[]): Promise<{ error: any }>;
  createProfile?(userId: string, profileData: Partial<UserProfile>): Promise<{ error: any }>;
}
