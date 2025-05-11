
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types';

export const useBlogPost = (slug: string) => {
  const incrementViewCount = async (postId: string) => {
    try {
      // First, call the RPC function to get the new count
      // We need to completely bypass type checking for this call since the RPC function expects a different type
      const { data: newCount } = await supabase.rpc(
        'increment', 
        { row_id: postId } as unknown as Record<string, never>
      );
      
      // Then update the post with the new count value
      await supabase
        .from('blog_posts')
        .update({ view_count: newCount })
        .eq('id', postId);
    } catch (error) {
      console.error("Erro ao incrementar visualizações:", error);
    }
  };

  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      // Primeiro, tente obter por slug
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles!blog_posts_author_id_fkey(*),
          category:blog_categories(*)
        `)
        .eq('slug', slug);
      
      let { data, error } = await query;
      
      // Se não encontrar por slug, tente por id
      if (!data || data.length === 0) {
        query = supabase
          .from('blog_posts')
          .select(`
            *,
            author:profiles!blog_posts_author_id_fkey(*),
            category:blog_categories(*)
          `)
          .eq('id', slug);
        
        const result = await query;
        data = result.data;
        error = result.error;
      }
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('Post não encontrado');
      }
      
      const post = data[0] as unknown as BlogPost;
      
      // Incrementar a contagem de visualizações
      if (post && post.id) {
        incrementViewCount(post.id);
      }
      
      return post;
    },
    enabled: !!slug
  });
};
