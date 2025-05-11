
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Order, OrderItem, SchedulingPreference } from '@/types';

export const useOrders = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          shipping_address:shipping_addresses(*),
          billing_address:billing_addresses(*),
          items:order_items(
            *,
            product:products(*)
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data as Order[];
    },
    enabled: !!user
  });
};

export const useOrder = (id: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!user || !id) return null;
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          shipping_address:shipping_addresses(*),
          billing_address:billing_addresses(*),
          items:order_items(
            *,
            product:products(*)
          ),
          scheduling_preferences:scheduling_preferences(*)
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Create a new object to avoid modifying the original data
      const result = { ...data };
      
      // Check if scheduling_preferences exists and is an array
      if (result.scheduling_preferences && 
          Array.isArray(result.scheduling_preferences) && 
          result.scheduling_preferences.length > 0) {
        // Convert the array to a single object
        result.scheduling_preferences = result.scheduling_preferences[0] as unknown as SchedulingPreference;
      } else {
        result.scheduling_preferences = null;
      }
      
      return result as unknown as Order;
    },
    enabled: !!user && !!id
  });
};
