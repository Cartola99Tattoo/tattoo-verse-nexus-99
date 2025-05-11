
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogCategory } from '@/types';

export const useBlogCategories = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      return data as unknown as BlogCategory[];
    }
  });
  
  return { categories: data, isLoading, error };
};
