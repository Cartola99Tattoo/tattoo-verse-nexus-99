
import { supabase } from '@/integrations/supabase/client';
import { simulateNetworkDelay } from '../mock/mockUtils';

export interface ConsolidatedMetrics {
  totalStudios: number;
  totalArtists: number;
  totalClients: number;
  totalAppointments: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  averageRevenuePerStudio: number;
  monthlyGrowth: number;
  revenueByStudio: Array<{
    studio_id: string;
    studio_name: string;
    revenue: number;
    appointments: number;
    clients: number;
  }>;
  appointmentsByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  topArtists: Array<{
    artist_id: string;
    artist_name: string;
    studio_name: string;
    revenue: number;
    appointments: number;
    rating: number;
  }>;
}

export interface NaveMaeNotification {
  id: string;
  type: 'studio_signup' | 'artist_application' | 'financial_alert' | 'system_alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  studio_id?: string;
  artist_id?: string;
  metadata?: any;
  read: boolean;
  created_at: string;
}

export class SupabaseNaveMaeService {
  async getConsolidatedMetrics(
    startDate?: string, 
    endDate?: string
  ): Promise<ConsolidatedMetrics> {
    await simulateNetworkDelay();
    
    if (!supabase) {
      throw new Error('Supabase not connected');
    }

    // This would be implemented with complex aggregation queries
    // For now, return mock data structure
    const mockMetrics: ConsolidatedMetrics = {
      totalStudios: 0,
      totalArtists: 0,
      totalClients: 0,
      totalAppointments: 0,
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      averageRevenuePerStudio: 0,
      monthlyGrowth: 0,
      revenueByStudio: [],
      appointmentsByStatus: [],
      topArtists: []
    };

    // Execute parallel queries for better performance
    const [studiosResult, appointmentsResult, transactionsResult] = await Promise.all([
      supabase.from('studios').select('id, name', { count: 'exact' }),
      supabase.from('appointments').select('id, status, studio_id', { count: 'exact' }),
      supabase.from('financial_transactions').select('amount, type, studio_id')
    ]);

    if (studiosResult.data) {
      mockMetrics.totalStudios = studiosResult.count || 0;
    }

    if (appointmentsResult.data) {
      mockMetrics.totalAppointments = appointmentsResult.count || 0;
      
      // Calculate appointments by status
      const statusCounts = appointmentsResult.data.reduce((acc, appointment) => {
        acc[appointment.status] = (acc[appointment.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      mockMetrics.appointmentsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        percentage: (count / mockMetrics.totalAppointments) * 100
      }));
    }

    if (transactionsResult.data) {
      const revenue = transactionsResult.data
        .filter(t => t.type === 'entrada')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = transactionsResult.data
        .filter(t => t.type === 'saida')
        .reduce((sum, t) => sum + t.amount, 0);

      mockMetrics.totalRevenue = revenue;
      mockMetrics.totalExpenses = expenses;
      mockMetrics.netProfit = revenue - expenses;
      mockMetrics.averageRevenuePerStudio = mockMetrics.totalStudios > 0 
        ? revenue / mockMetrics.totalStudios 
        : 0;
    }

    return mockMetrics;
  }

  async getStudioPerformance(studioId?: string): Promise<any[]> {
    await simulateNetworkDelay();
    
    if (!supabase) {
      throw new Error('Supabase not connected');
    }

    let query = supabase
      .from('studios')
      .select(`
        id,
        name,
        appointments(count),
        financial_transactions(amount, type)
      `);

    if (studioId) {
      query = query.eq('id', studioId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getNaveMaeNotifications(
    limit: number = 50,
    unreadOnly: boolean = false
  ): Promise<NaveMaeNotification[]> {
    await simulateNetworkDelay();
    
    if (!supabase) {
      throw new Error('Supabase not connected');
    }

    let query = supabase
      .from('nave_mae_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    await simulateNetworkDelay();
    
    if (!supabase) {
      throw new Error('Supabase not connected');
    }

    const { error } = await supabase
      .from('nave_mae_notifications')
      .update({ read: true })
      .eq('id', notificationId);

    return !error;
  }

  async createSystemAlert(
    type: NaveMaeNotification['type'],
    title: string,
    message: string,
    priority: NaveMaeNotification['priority'] = 'medium',
    metadata?: any
  ): Promise<NaveMaeNotification> {
    await simulateNetworkDelay();
    
    if (!supabase) {
      throw new Error('Supabase not connected');
    }

    const { data, error } = await supabase
      .from('nave_mae_notifications')
      .insert({
        type,
        title,
        message,
        priority,
        metadata,
        read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as NaveMaeNotification;
  }

  async getSystemHealth(): Promise<{
    database_status: 'healthy' | 'degraded' | 'down';
    api_latency: number;
    active_connections: number;
    error_rate: number;
    last_backup: string;
  }> {
    await simulateNetworkDelay();
    
    // This would typically call a health check endpoint
    // For now, return mock healthy status
    return {
      database_status: 'healthy',
      api_latency: 150,
      active_connections: 25,
      error_rate: 0.1,
      last_backup: new Date().toISOString()
    };
  }
}

export const supabaseNaveMaeService = new SupabaseNaveMaeService();
