
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogCategory } from '@/types';

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blogCategories'],
    queryFn: async () => {
      console.log('Fetching blog categories');
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching blog categories:', error);
        throw error;
      }
      
      console.log('Fetched blog categories:', data?.length);
      return data as BlogCategory[];
    },
    staleTime: 300000, // 5 minutes
  });
};
