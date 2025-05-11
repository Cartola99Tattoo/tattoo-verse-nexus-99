
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useBlogPost = (slug: string) => {
  const incrementViewCount = async (postId: string) => {
    try {
      // First, call the RPC function to get the new count
      // The TypeScript error happens because the RPC function has incorrect type definitions
      // We need to fully bypass the type checking for this RPC call
      const { data: newCount, error: rpcError } = await (supabase.rpc as any)(
        'increment', 
        { row_id: postId }
      );
      
      if (rpcError) {
        console.error("Erro ao incrementar visualizações (RPC):", rpcError);
        return;
      }
      
      // Then update the post with the new count value
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ view_count: newCount })
        .eq('id', postId);
        
      if (updateError) {
        console.error("Erro ao atualizar contagem de visualizações:", updateError);
      }
    } catch (error) {
      console.error("Erro ao incrementar visualizações:", error);
    }
  };

  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      try {
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
      } catch (error: any) {
        console.error("Erro ao buscar post:", error.message);
        toast({
          title: "Erro ao carregar artigo",
          description: error.message || "Não foi possível carregar o artigo solicitado.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!slug,
    retry: 1
  });
};
