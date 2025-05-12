
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogAuthor } from "@/types/blog";
import { toast } from "@/components/ui/use-toast";

export const useBlogAuthors = () => {
  const fetchAuthors = async (): Promise<BlogAuthor[]> => {
    console.log("Fetching blog authors...");

    // Get unique authors who have blog posts
    const { data: postsData, error: postsError } = await supabase
      .from('blog_posts')
      .select('author_id')
      .not('author_id', 'is', null);
      
    if (postsError) {
      console.error("Error fetching blog posts for authors:", postsError);
      throw postsError;
    }
    
    // Extract unique author IDs
    const authorIds = [...new Set(postsData.map(post => post.author_id))].filter(Boolean);
    
    if (authorIds.length === 0) {
      return [];
    }
    
    // Get author profiles
    const { data: authorsData, error: authorsError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, role')
      .in('id', authorIds);
      
    if (authorsError) {
      console.error("Error fetching author profiles:", authorsError);
      throw authorsError;
    }
    
    return authorsData as BlogAuthor[];
  };

  return useQuery({
    queryKey: ['blog-authors'],
    queryFn: fetchAuthors,
    staleTime: 10 * 60 * 1000, // 10 minutes
    meta: {
      onError: (error: any) => {
        toast({
          title: "Error fetching authors",
          description: error.message || "Failed to load blog authors",
          variant: "destructive",
        });
      }
    }
  });
};

export default useBlogAuthors;
