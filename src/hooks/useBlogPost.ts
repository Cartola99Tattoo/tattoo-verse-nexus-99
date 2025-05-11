
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Define proper types
type BlogPost = {
  id: number | string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  date?: string;
  category?: string;
  author?: string;
  view_count?: number;
  profiles?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
};

type FetchBlogPostError = {
  message: string;
  details?: string;
};

export function useBlogPost(postId: number | string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchBlogPostError | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Increment the view count using RPC
        try {
          await supabase.rpc("increment_view_count", { post_id: postId });
        } catch (rpcError) {
          console.warn("Failed to increment view count:", rpcError);
          // Continue execution even if view count increment fails
        }
        
        // Then fetch the post data
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*, profiles(first_name, last_name, avatar_url)")
          .eq("id", postId)
          .single();

        if (error) {
          throw {
            message: "Error fetching blog post",
            details: error.message
          };
        }

        if (data) {
          setPost(data as unknown as BlogPost);
        } else {
          throw {
            message: "Post não encontrado",
            details: "O artigo que você está procurando não existe ou foi removido."
          };
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        
        setError({
          message: "Erro ao carregar artigo",
          details: errorMessage
        });
        
        toast({
          title: "Erro ao carregar artigo",
          description: "Ocorreu um erro ao carregar o artigo. Por favor, tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return { post, isLoading, error };
}
