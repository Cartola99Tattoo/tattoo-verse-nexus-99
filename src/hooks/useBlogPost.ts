
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";

interface UseBlogPostResult {
  post: BlogPost | null;
  isLoading: boolean;
  error: Error | null;
}

export const useBlogPost = (slug: string): UseBlogPostResult => {
  const fetchPost = async (): Promise<BlogPost> => {
    console.log("Fetching blog post with slug:", slug);
    
    // First try to fetch by slug
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        profiles:author_id(id, first_name, last_name, avatar_url),
        blog_categories:category_id(id, name)
      `);
    
    // Try by slug first, then by id if slug is a UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    
    if (isUuid) {
      query = query.or(`slug.eq.${slug},id.eq.${slug}`);
    } else {
      query = query.eq('slug', slug);
    }
    
    const { data, error } = await query.maybeSingle();
    
    if (error) {
      console.error("Error fetching blog post:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("Blog post not found");
    }

    // Increment view count
    if (data && !data.is_draft) {
      try {
        await supabase
          .from('blog_posts')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', data.id);
      } catch (countError) {
        console.error("Error updating view count:", countError);
        // Don't throw error for view count update failures
      }
    }
    
    return data as BlogPost;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: fetchPost,
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    post: data || null,
    isLoading,
    error: error as Error | null,
  };
};
