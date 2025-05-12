
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogCategory } from "@/types/blog";
import { toast } from "@/components/ui/use-toast";

export const useBlogCategories = () => {
  const fetchCategories = async (): Promise<BlogCategory[]> => {
    console.log("Fetching blog categories...");
    
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error fetching blog categories:", error);
      throw error;
    }
    
    return data || [];
  };

  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: fetchCategories,
    onError: (error: any) => {
      toast({
        title: "Error fetching categories",
        description: error.message || "Failed to load blog categories",
        variant: "destructive",
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
