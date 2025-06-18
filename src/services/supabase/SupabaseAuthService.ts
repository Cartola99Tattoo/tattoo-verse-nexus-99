
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from "@supabase/supabase-js";
import { IAuthService } from '../interfaces/IAuthService';
import { UserProfile } from "@/contexts/AuthContext";

export interface UserRole {
  CLIENT: 'client';
  ADMIN_ESTUDIO: 'admin_estudio';
  TATUADOR_DA_NOVA_ERA: 'tatuador_da_nova_era';
  ADMIN_NAVE_MAE: 'admin_nave_mae';
}

export interface UserPermissions {
  role: string;
  studio_id?: string;
  permissions: string[];
}

export class SupabaseAuthService implements IAuthService {
  async getSession(): Promise<Session | null> {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  async getUser(): Promise<User | null> {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async signIn(email: string, password: string): Promise<{ error: any }> {
    if (!supabase) return { error: 'Supabase not connected' };
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  }

  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<{ error: any }> {
    if (!supabase) return { error: 'Supabase not connected' };
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (!error && data.user) {
      // Create profile
      await this.createProfile(data.user.id, {
        first_name: firstName,
        last_name: lastName,
        email,
        role: 'client' // Default role
      });
    }
    
    return { error };
  }

  async signOut(): Promise<void> {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  async resetPassword(email: string): Promise<{ error: any }> {
    if (!supabase) return { error: 'Supabase not connected' };
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  }

  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<{ error: any }> {
    if (!supabase) return { error: 'Supabase not connected' };
    
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
    
    return { error };
  }

  async fetchProfile(userId: string): Promise<UserProfile | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !data) return null;
    return data as UserProfile;
  }

  async createProfile(userId: string, profileData: Partial<UserProfile>): Promise<{ error: any }> {
    if (!supabase) return { error: 'Supabase not connected' };
    
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    
    return { error };
  }

  async getUserPermissions(userId: string): Promise<UserPermissions | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        role,
        studio_id,
        permissions,
        studios(name, settings)
      `)
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return null;
    return data as UserPermissions;
  }

  async assignUserRole(userId: string, role: string, studioId?: string, permissions: string[] = []): Promise<{ error: any }> {
    if (!supabase) return { error: 'Supabase not connected' };
    
    const { error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role,
        studio_id: studioId,
        permissions,
        updated_at: new Date().toISOString(),
      });
    
    return { error };
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void): { subscription: { unsubscribe: () => void } } {
    if (!supabase) {
      return { subscription: { unsubscribe: () => {} } };
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return { subscription };
  }
}

export const supabaseAuthService = new SupabaseAuthService();
