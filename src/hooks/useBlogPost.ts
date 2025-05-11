
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useBlogPost(postId: number | string) {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        // Increment the view count using RPC
        // Using type assertion to bypass TypeScript's strict checking
        // since the function exists in the database but isn't in the TypeScript definitions
        await (supabase.rpc as any)("increment_view_count", { post_id: postId });
        
        // Then fetch the post data
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*, profiles(first_name, last_name, avatar_url)")
          .eq("id", postId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setPost(data);
        } else {
          toast({
            title: "Post não encontrado",
            description: "O artigo que você está procurando não existe ou foi removido.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
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

  return { post, isLoading };
}
