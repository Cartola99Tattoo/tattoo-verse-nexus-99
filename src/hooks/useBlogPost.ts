
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useBlogPost = (slug: string) => {
  // Function to increment view count
  const incrementViewCount = async (postId: string) => {
    try {
      console.log("[useBlogPost] Incrementing view count for post:", postId);
      
      // Call the Supabase RPC function
      const { error } = await supabase.rpc('increment_view_count', {
        post_id: postId
      });
      
      if (error) {
        console.error("[useBlogPost] Error incrementing view count:", error);
      }
    } catch (error) {
      console.error("[useBlogPost] Error incrementing view count:", error);
    }
  };

  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      try {
        console.log("[useBlogPost] Fetching post with slug:", slug);
        
        // Step 1: Fetch the post by slug or id
        let { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();
        
        // If not found by slug, try by id
        if (postError || !postData) {
          console.log("[useBlogPost] Post not found by slug, trying by id");
          
          const result = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', slug)
            .single();
            
          postData = result.data;
          postError = result.error;
        }
        
        if (postError) {
          console.error("[useBlogPost] Error fetching post:", postError);
          throw postError;
        }
        
        if (!postData) {
          console.error("[useBlogPost] Post not found");
          throw new Error('Post não encontrado');
        }
        
        console.log("[useBlogPost] Post found:", postData.title);
        
        // Step 2: Fetch category
        let category = null;
        if (postData.category_id) {
          console.log("[useBlogPost] Fetching category:", postData.category_id);
          
          const { data: categoryData } = await supabase
            .from('blog_categories')
            .select('*')
            .eq('id', postData.category_id)
            .single();
            
          if (categoryData) {
            category = categoryData;
          }
        }
        
        // Step 3: Fetch author from profiles
        let author = null;
        if (postData.author_id) {
          console.log("[useBlogPost] Fetching author:", postData.author_id);
          
          const { data: authorData } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .eq('id', postData.author_id)
            .single();
            
          if (authorData) {
            author = authorData;
          }
        }
        
        // Step 4: Build complete post object
        const post: BlogPost = {
          ...postData,
          category: category || {
            id: postData.category_id || '',
            name: 'Sem categoria',
            description: '',
            created_at: postData.created_at,
            updated_at: postData.updated_at
          },
          author: author || {
            id: postData.author_id || '',
            first_name: 'Equipe',
            last_name: '99Tattoo',
            avatar_url: ''
          }
        };
        
        // Step 5: Increment view count
        if (post.id) {
          await incrementViewCount(post.id);
        }
        
        return post;
      } catch (error: any) {
        console.error("[useBlogPost] Error:", error.message);
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
    staleTime: 300000, // 5 minutes
  });
};
