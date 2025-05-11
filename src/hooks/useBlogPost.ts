
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useBlogPost = (slug: string) => {
  const incrementViewCount = async (postId: string) => {
    try {
      // We need to make a direct fetch call to the edge function instead of using RPC
      // since the types are not correctly aligned with the database function
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token || '';
      
      await fetch(`https://hlirmvgytxjvfoorvxsv.supabase.co/functions/v1/increment_view_count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ post_id: postId })
      });
    } catch (error) {
      console.error("[useBlogPost] Erro ao incrementar visualizações:", error);
    }
  };

  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      try {
        console.log("[useBlogPost] Buscando post com slug:", slug);
        
        // Buscar o post principal primeiro
        let { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();
        
        // Se não encontrar por slug, tente por id
        if (postError || !postData) {
          console.log("[useBlogPost] Post não encontrado pelo slug, tentando pelo ID");
          
          const result = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', slug)
            .single();
            
          postData = result.data;
          postError = result.error;
        }
        
        if (postError) {
          console.error("[useBlogPost] Erro na query do post:", postError);
          throw postError;
        }
        
        if (!postData) {
          console.error("[useBlogPost] Post não encontrado");
          throw new Error('Post não encontrado');
        }
        
        console.log("[useBlogPost] Post encontrado:", postData.title);
        
        // Buscar categoria do post
        let category = null;
        if (postData.category_id) {
          const { data: categoryData } = await supabase
            .from('blog_categories')
            .select('id, name, description')
            .eq('id', postData.category_id)
            .single();
            
          if (categoryData) {
            category = categoryData;
          }
        }
        
        // Buscar autor do post (da tabela profiles)
        let author = null;
        if (postData.author_id) {
          const { data: authorData } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .eq('id', postData.author_id)
            .single();
            
          if (authorData) {
            author = authorData;
          }
        }
        
        // Construir o objeto completo do post
        const post: BlogPost = {
          ...postData,
          category: category || {
            id: postData.category_id || '',
            name: 'Sem categoria',
            description: ''
          },
          author: author || {
            id: postData.author_id || '',
            first_name: 'Equipe',
            last_name: '99Tattoo',
            avatar_url: ''
          }
        };
        
        // Incrementar a contagem de visualizações
        if (post.id) {
          await incrementViewCount(post.id);
        }
        
        return post;
      } catch (error: any) {
        console.error("[useBlogPost] Erro ao buscar post:", error.message);
        toast({
          title: "Erro ao carregar artigo",
          description: error.message || "Não foi possível carregar o artigo solicitado.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!slug,
    retry: 1,
    staleTime: 300000, // Cache por 5 minutos
  });
};
