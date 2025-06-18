
import { supabase } from '@/integrations/supabase/client';
import { simulateNetworkDelay } from '../mock/mockUtils';

export interface Studio {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  settings: {
    timezone: string;
    currency: string;
    language: string;
    features_enabled: string[];
  };
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface StudioUser {
  id: string;
  studio_id: string;
  user_id: string;
  role: string;
  permissions: string[];
  invited_by?: string;
  invited_at?: string;
  accepted_at?: string;
  status: 'pending' | 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export class SupabaseStudioService {
  async fetchStudios(): Promise<Studio[]> {
    await simulateNetworkDelay();
    
    if (!supabase) {
      throw new Error('Supabase not connected');
    }

    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async fetchStudioById(id: string): Promise<Studio | null> {
    await simulateNetworkDelay();
    
    if (!supabase) {
      throw new Error('Supabase not connected');
    }

    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as Studio;
  }

  async createStudio(studioData: Omit<Studio, 'id' | 'created_at' | 'updated_at'>): Promise<Studio> {
    await simulateNetworkDelay();
    
    if (!supabase) {
      throw new Error('Supabase not connected');
    }

    const { data, error } = await supabase
      .from('studios')
      .insert({
        ...studioData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as Studio;
  }

  async updateStudio(id: string, studioData: Partial<Studio>): Promise<Studio> {
    await simulateNetworkDelay();
    
    if (!supabase) {
      throw new Error('Supabase not connected');
    }

    const { data, error } = await supabase
      .from('studios')
      .update({
        ...studioData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Studio;
  }

  async deleteStudio(id: string): Promise<boolean> {
    await simulateNetworkDelay();
    
    if (!supabase) {
      throw new Error('Supabase not connected');
    }

    const { error } = await supabase
      .from('studios')
      .delete()
      .eq('id', id);

    return !error;
  }

  async fetchStudioUsers(studioId: string): Promise<StudioUser[]> {
    await simulateNetworkDelay();
    
    if (!supabase) {
      throw new Error('Supabase not connected');
    }

    const { data, error } = await supabase
      .from('studio_users')
      .select(`
        *,
        profiles(first_name, last_name, email, avatar_url)
      `)
      .eq('studio_id', studioId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async inviteUserToStudio(
    studioId: string, 
    email: string, 
    role: string, 
    permissions: string[] = [],
    invitedBy: string
  ): Promise<StudioUser> {
    await simulateNetworkDelay();
    
    if (!supabase) {
      throw new Error('Supabase not connected');
    }

    // First, check if user exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    const userId = existingUser?.id;

    const { data, error } = await supabase
      .from('studio_users')
      .insert({
        studio_id: studioId,
        user_id: userId, // May be null if user doesn't exist yet
        role,
        permissions,
        invited_by: invitedBy,
        invited_at: new Date().toISOString(),
        status: userId ? 'active' : 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    // Send invitation email (this would be handled by an Edge Function)
    // await this.sendInvitationEmail(email, studioId, role);
    
    return data as StudioUser;
  }

  async acceptStudioInvitation(invitationId: string, userId: string): Promise<StudioUser> {
    await simulateNetworkDelay();
    
    if (!supabase) {
      throw new Error('Supabase not connected');
    }

    const { data, error } = await supabase
      .from('studio_users')
      .update({
        user_id: userId,
        accepted_at: new Date().toISOString(),
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', invitationId)
      .select()
      .single();

    if (error) throw error;
    return data as StudioUser;
  }

  async getUserStudios(userId: string): Promise<Studio[]> {
    await simulateNetworkDelay();
    
    if (!supabase) {
      throw new Error('Supabase not connected');
    }

    const { data, error } = await supabase
      .from('studio_users')
      .select(`
        studios(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;
    
    // Corrigir o retorno para extrair corretamente os studios
    const studios = data?.map(item => item.studios).filter(Boolean) as Studio[] || [];
    return studios;
  }
}

export const supabaseStudioService = new SupabaseStudioService();
