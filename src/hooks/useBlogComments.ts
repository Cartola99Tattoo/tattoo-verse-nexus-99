
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogComment } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useBlogComments = (postId: string) => {
  return useQuery({
    queryKey: ['blogComments', postId],
    queryFn: async () => {
      try {
        console.log("[useBlogComments] Fetching comments for post:", postId);
        
        // Step 1: Fetch parent comments
        const { data, error } = await supabase
          .from('blog_comments')
          .select(`
            id, 
            post_id,
            user_id,
            parent_id,
            content,
            is_approved,
            created_at,
            updated_at
          `)
          .eq('post_id', postId)
          .eq('is_approved', true)
          .is('parent_id', null)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("[useBlogComments] Error fetching comments:", error);
          throw error;
        }
        
        console.log("[useBlogComments] Comments fetched:", data?.length);
        
        // Step 2: Get all user IDs from comments to fetch profiles
        const comments = data as BlogComment[];
        const userIds = comments.map(comment => comment.user_id);
        
        // Step 3: Fetch user profiles for these comments
        if (userIds.length > 0) {
          console.log("[useBlogComments] Fetching user profiles for comments");
          
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .in('id', userIds);
            
          if (profilesError) {
            console.error("[useBlogComments] Error fetching profiles:", profilesError);
          } else if (profiles) {
            // Map profiles to comments
            const profileMap = profiles.reduce((acc, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {} as Record<string, any>);
            
            comments.forEach(comment => {
              comment.user = profileMap[comment.user_id];
            });
          }
        }
        
        // Step 4: Fetch replies for these comments
        const commentIds = comments.map(comment => comment.id);
        
        if (commentIds.length > 0) {
          console.log("[useBlogComments] Fetching replies for comments");
          
          const { data: repliesData, error: repliesError } = await supabase
            .from('blog_comments')
            .select(`
              id, 
              post_id,
              user_id,
              parent_id,
              content,
              is_approved,
              created_at,
              updated_at
            `)
            .in('parent_id', commentIds)
            .eq('is_approved', true)
            .order('created_at', { ascending: true });
            
          if (repliesError) {
            console.error("[useBlogComments] Error fetching replies:", repliesError);
          } else if (repliesData) {
            const replies = repliesData as BlogComment[];
            console.log("[useBlogComments] Replies fetched:", replies.length);
            
            // Step 5: Fetch user profiles for replies
            const replyUserIds = replies.map(reply => reply.user_id);
            
            if (replyUserIds.length > 0) {
              const { data: replyProfiles, error: replyProfilesError } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, avatar_url')
                .in('id', replyUserIds);
                
              if (replyProfilesError) {
                console.error("[useBlogComments] Error fetching reply profiles:", replyProfilesError);
              } else if (replyProfiles) {
                // Map profiles to replies
                const replyProfileMap = replyProfiles.reduce((acc, profile) => {
                  acc[profile.id] = profile;
                  return acc;
                }, {} as Record<string, any>);
                
                replies.forEach(reply => {
                  reply.user = replyProfileMap[reply.user_id];
                });
              }
            }
            
            // Group replies by parent comment
            comments.forEach(comment => {
              comment.replies = replies.filter(reply => reply.parent_id === comment.id);
            });
          }
        }
        
        return comments;
      } catch (error) {
        console.error("[useBlogComments] Error:", error);
        toast({
          title: "Erro ao carregar comentários",
          description: "Não foi possível carregar os comentários. Tente novamente mais tarde.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!postId,
    staleTime: 60000, // 1 minute
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
      console.log("[useCreateComment] Creating comment", { postId, parentId });
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("[useCreateComment] Not authenticated");
        throw new Error('Você precisa estar logado para comentar');
      }
      
      const { data, error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: postId,
          user_id: session.user.id,
          parent_id: parentId,
          content,
          is_approved: false // Comments need approval
        })
        .select();
        
      if (error) {
        console.error("[useCreateComment] Error:", error);
        throw error;
      }
      
      console.log("[useCreateComment] Comment created successfully");
      return data[0];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogComments', variables.postId] });
      toast({
        title: "Comentário enviado com sucesso!",
        description: "Seu comentário será exibido após aprovação.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao enviar comentário",
        description: error.message || "Ocorreu um erro ao enviar seu comentário.",
        variant: "destructive",
      });
    }
  });
};
