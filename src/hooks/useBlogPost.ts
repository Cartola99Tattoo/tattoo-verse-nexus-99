
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useBlogPost = (slug: string) => {
  const incrementViewCount = async (postId: string) => {
    try {
      // We need to make a direct fetch call to the edge function instead of using RPC
      // since the types are not correctly aligned with the database function
      await fetch(`https://hlirmvgytxjvfoorvxsv.supabase.co/functions/v1/increment_view_count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`
        },
        body: JSON.stringify({ post_id: postId })
      });
    } catch (error) {
      console.error("Erro ao incrementar visualizações:", error);
    }
  };

  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      try {
        console.log("Buscando post com slug:", slug);
        
        // Primeiro, tente obter por slug
        let query = supabase
          .from('blog_posts')
          .select(`
            *,
            author:profiles(id, first_name, last_name, avatar_url),
            category:blog_categories(id, name, description)
          `)
          .eq('slug', slug);
        
        let { data, error } = await query;
        
        // Se não encontrar por slug, tente por id
        if (!data || data.length === 0) {
          console.log("Post não encontrado pelo slug, tentando pelo ID");
          
          query = supabase
            .from('blog_posts')
            .select(`
              *,
              author:profiles(id, first_name, last_name, avatar_url),
              category:blog_categories(id, name, description)
            `)
            .eq('id', slug);
          
          const result = await query;
          data = result.data;
          error = result.error;
        }
        
        if (error) {
          console.error("Erro na query do Supabase:", error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.error("Post não encontrado");
          throw new Error('Post não encontrado');
        }
        
        const post = data[0] as unknown as BlogPost;
        console.log("Post encontrado:", post.title);
        
        // Incrementar a contagem de visualizações
        if (post && post.id) {
          await incrementViewCount(post.id);
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
