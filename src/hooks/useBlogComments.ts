
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogComment } from '@/types';

export const useBlogComments = (postId: string) => {
  return useQuery({
    queryKey: ['blogComments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          *,
          user:profiles!blog_comments_user_id_fkey(*)
        `)
        .eq('post_id', postId)
        .eq('is_approved', true)
        .is('parent_id', null)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Buscar respostas para cada comentário
      const comments = data as unknown as BlogComment[];
      const commentIds = comments.map(comment => comment.id);
      
      if (commentIds.length > 0) {
        const { data: replies, error: repliesError } = await supabase
          .from('blog_comments')
          .select(`
            *,
            user:profiles!blog_comments_user_id_fkey(*)
          `)
          .in('parent_id', commentIds)
          .eq('is_approved', true)
          .order('created_at', { ascending: true });
          
        if (repliesError) {
          throw repliesError;
        }
        
        // Processamento das respostas
        const repliesData = replies as unknown as BlogComment[];
        
        // Garantindo que cada comentário tenha um array de respostas
        comments.forEach(comment => {
          if (typeof comment === 'object' && comment !== null) {
            (comment as any).replies = repliesData.filter(reply => 
              reply.parent_id === comment.id
            );
          }
        });
      }
      
      return comments;
    },
    enabled: !!postId
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      postId, 
      content, 
      parentId = null 
    }: { 
      postId: string; 
      content: string; 
      parentId?: string | null 
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Você precisa estar logado para comentar');
      }
      
      const { data, error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: postId,
          user_id: session.user.id,
          parent_id: parentId,
          content,
          is_approved: false // Comentários precisam ser aprovados
        })
        .select();
        
      if (error) {
        throw error;
      }
      
      return data[0];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogComments', variables.postId] });
    }
  });
};
