
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogFiltersState, BlogPost } from "@/types/blog";
import { toast } from "@/components/ui/use-toast";

export const useBlogPosts = (filters: BlogFiltersState = {}, page: number = 1, limit: number = 10) => {
  const fetchPosts = async (): Promise<{ data: BlogPost[], count: number }> => {
    console.log("Fetching blog posts with filters:", filters);
    
    // Build the query
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        profiles:author_id(id, first_name, last_name, avatar_url),
        blog_categories:category_id(id, name)
      `, { count: 'exact' });
    
    // Apply filters
    if (filters.status) {
      if (filters.status === 'published') {
        query = query.not('published_at', 'is', null).lte('published_at', new Date().toISOString());
      } else if (filters.status === 'draft') {
        query = query.is('published_at', null).eq('is_draft', true);
      } else if (filters.status === 'scheduled') {
        query = query.gt('published_at', new Date().toISOString());
      }
    }
    
    if (filters.category) {
      query = query.eq('category_id', filters.category);
    }
    
    if (filters.author) {
      query = query.eq('author_id', filters.author);
    }
    
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
    }
    
    if (filters.startDate && filters.endDate) {
      query = query.gte('created_at', filters.startDate.toISOString())
                  .lte('created_at', filters.endDate.toISOString());
    } else if (filters.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString());
    } else if (filters.endDate) {
      query = query.lte('created_at', filters.endDate.toISOString());
    }
    
    // Apply sorting
    if (filters.sortBy) {
      const [field, direction] = filters.sortBy.split(':');
      query = query.order(field as any, { ascending: direction === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error("Error fetching blog posts:", error);
      throw error;
    }
    
    return { data: data as BlogPost[] || [], count: count || 0 };
  };

  return useQuery({
    queryKey: ['blog-posts', filters, page, limit],
    queryFn: fetchPosts,
    staleTime: 60 * 1000, // 1 minute
    meta: {
      onError: (error: any) => {
        toast({
          title: "Error fetching blog posts",
          description: error.message || "Failed to load blog posts",
          variant: "destructive",
        });
      }
    }
  });
};

export default useBlogPosts;
