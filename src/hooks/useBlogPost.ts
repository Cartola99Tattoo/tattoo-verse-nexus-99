
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Define proper types
export type BlogPost = {
  id: number | string;
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  published_at?: string;
  category_id?: string;
  author_id?: string;
  reading_time?: number;
  tags?: string[];
  view_count?: number;
  slug?: string;
  meta_description?: string;
  meta_keywords?: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    id?: string;
  };
  blog_categories?: {
    name?: string;
    id?: string;
    description?: string;
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
        
        // Then fetch the post data with author and category information
        const { data: postData, error: postError } = await supabase
          .from("blog_posts")
          .select(`
            *,
            profiles:author_id(*),
            blog_categories:category_id(*)
          `)
          .eq("id", postId)
          .single();

        if (postError) {
          console.error("Database error:", postError);
          throw {
            message: "Erro ao buscar artigo",
            details: postError.message
          };
        }

        if (postData) {
          console.log("Post data fetched:", postData);
          setPost(postData as unknown as BlogPost);
        } else {
          throw {
            message: "Artigo não encontrado",
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
