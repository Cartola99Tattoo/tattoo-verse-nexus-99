import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from '@tanstack/react-query';

// Define proper types
export interface BlogPost {
  id: string;
  title: string;
  slug?: string | null;
  content: string;
  excerpt?: string | null;
  cover_image?: string | null;
  tags?: string[];
  category_id?: string | null;
  author_id?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  view_count?: number | null;
  reading_time?: number | null;
  is_draft?: boolean | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  profiles?: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    avatar_url?: string | null;
  } | null;
  blog_categories?: {
    id: string;
    name: string;
  } | null;
}

type FetchBlogPostError = {
  message: string;
  details?: string;
};

export function useBlogPost(postIdOrSlug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchBlogPostError | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postIdOrSlug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching post with identifier:", postIdOrSlug);
        
        // Determinar se estamos buscando por id ou slug
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postIdOrSlug);
        
        // Primeiro, vamos buscar o post
        const query = supabase
          .from("blog_posts")
          .select(`
            *,
            profiles:author_id(*),
            blog_categories:category_id(*)
          `);
        
        // Aplicar o filtro correto com base no identificador
        const { data: postData, error: postError } = await (isUuid 
          ? query.eq("id", postIdOrSlug) 
          : query.eq("slug", postIdOrSlug))
          .maybeSingle();

        if (postError) {
          console.error("Database error:", postError);
          throw {
            message: "Erro ao buscar artigo",
            details: postError.message
          };
        }

        if (!postData) {
          throw {
            message: "Artigo não encontrado",
            details: "O artigo que você está procurando não existe ou foi removido."
          };
        }

        console.log("Post data fetched:", postData);
        setPost(postData as BlogPost);
        
        // Depois de buscar com sucesso, incrementamos a contagem de visualizações
        try {
          // Verifica se o post existe antes de incrementar a visualização
          if (postData) {
            const { error: updateError } = await supabase
              .from("blog_posts")
              .update({ view_count: (postData.view_count || 0) + 1 })
              .eq("id", postData.id);
            
            if (updateError) {
              console.warn("Failed to increment view count:", updateError);
            }
          }
        } catch (rpcError) {
          console.warn("Failed to increment view count:", rpcError);
          // Continue execution even if view count increment fails
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        
        setError({
          message: "Erro ao carregar artigo",
          details: typeof error === 'object' && error !== null && 'details' in error
            ? (error as any).details
            : errorMessage
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

    if (postIdOrSlug) {
      fetchPost();
    }
  }, [postIdOrSlug]);

  return { post, isLoading, error };
}
