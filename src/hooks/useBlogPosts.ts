
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, BlogCategory } from '@/types';
import { toast } from '@/components/ui/use-toast';

export interface BlogPostsOptions {
  category_id?: string;
  tags?: string[];
  search?: string;
  limit?: number;
  page?: number;
  published_only?: boolean;
  staleTime?: number;
}

export const useBlogPosts = (options?: BlogPostsOptions) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  
  // Function to count posts based on filters
  const fetchPostsCount = async (): Promise<number> => {
    try {
      console.log("[useBlogPosts] Counting posts with options:", options);
      
      let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });
        
      if (options?.published_only !== false) {
        query = query.not('published_at', 'is', null);
      }
        
      if (options?.category_id) {
        query = query.eq('category_id', options.category_id);
      }
      
      if (options?.tags && options.tags.length > 0) {
        query = query.contains('tags', options.tags);
      }
      
      if (options?.search) {
        query = query.or(`title.ilike.%${options.search}%,content.ilike.%${options.search}%,excerpt.ilike.%${options.search}%`);
      }
      
      const { count, error } = await query;
      
      if (error) {
        console.error("[useBlogPosts] Error counting posts:", error);
        return 0;
      }
      
      console.log("[useBlogPosts] Total posts count:", count);
      return count || 0;
    } catch (error) {
      console.error("[useBlogPosts] Error counting posts:", error);
      return 0;
    }
  };
  
  // Main function to fetch blog posts
  const fetchPosts = async (): Promise<BlogPost[]> => {
    try {
      console.log("[useBlogPosts] Fetching posts with options:", options);
      
      // Step 1: Fetch posts with basic data
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
        
      if (options?.published_only !== false) {
        query = query.not('published_at', 'is', null);
      }
        
      if (options?.category_id) {
        query = query.eq('category_id', options.category_id);
      }
      
      if (options?.tags && options.tags.length > 0) {
        query = query.contains('tags', options.tags);
      }
      
      if (options?.search) {
        query = query.or(`title.ilike.%${options.search}%,content.ilike.%${options.search}%,excerpt.ilike.%${options.search}%`);
      }
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      if (options?.page && options?.limit) {
        const from = (options.page - 1) * options.limit;
        query = query.range(from, from + options.limit - 1);
      }
      
      const { data: postsData, error: postsError } = await query;
      
      if (postsError) {
        console.error("[useBlogPosts] Error fetching posts:", postsError);
        throw postsError;
      }

      if (!postsData || postsData.length === 0) {
        console.log("[useBlogPosts] No posts found");
        return [];
      }

      console.log("[useBlogPosts] Posts fetched successfully:", postsData.length);
      
      // Step 2: Fetch categories for these posts
      const categoryIds = postsData
        .filter(post => post.category_id)
        .map(post => post.category_id as string);
      
      let categories: Record<string, BlogCategory> = {};
      if (categoryIds.length > 0) {
        const uniqueCategoryIds = [...new Set(categoryIds)];
        console.log("[useBlogPosts] Fetching categories with IDs:", uniqueCategoryIds);
        
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('blog_categories')
          .select('*')
          .in('id', uniqueCategoryIds);
          
        if (categoriesError) {
          console.error("[useBlogPosts] Error fetching categories:", categoriesError);
        } else if (categoriesData) {
          categories = categoriesData.reduce((acc, cat) => {
            acc[cat.id] = cat;
            return acc;
          }, {} as Record<string, BlogCategory>);
          console.log("[useBlogPosts] Categories fetched:", Object.keys(categories).length);
        }
      }
      
      // Step 3: Fetch authors (from profiles table, not auth.users)
      const authorIds = postsData
        .filter(post => post.author_id)
        .map(post => post.author_id as string);
      
      let authors: Record<string, { id: string; first_name?: string; last_name?: string; avatar_url?: string }> = {};
      if (authorIds.length > 0) {
        const uniqueAuthorIds = [...new Set(authorIds)];
        console.log("[useBlogPosts] Fetching authors with IDs:", uniqueAuthorIds);
        
        const { data: authorsData, error: authorsError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', uniqueAuthorIds);
          
        if (authorsError) {
          console.error("[useBlogPosts] Error fetching authors:", authorsError);
        } else if (authorsData) {
          authors = authorsData.reduce((acc, author) => {
            acc[author.id] = author;
            return acc;
          }, {} as Record<string, { id: string; first_name?: string; last_name?: string; avatar_url?: string }>);
          console.log("[useBlogPosts] Authors fetched:", Object.keys(authors).length);
        }
      }
      
      // Step 4: Combine data into blog post objects
      const processedPosts: BlogPost[] = postsData.map((post): BlogPost => {
        // For each post, construct a complete BlogPost object
        const processedPost: BlogPost = {
          ...post,
          // Add category data
          category: post.category_id && categories[post.category_id] 
            ? categories[post.category_id] 
            : {
                id: post.category_id || '',
                name: 'Sem categoria',
                description: '',
                created_at: post.created_at,
                updated_at: post.updated_at
              },
          
          // Add author data
          author: post.author_id && authors[post.author_id]
            ? authors[post.author_id]
            : {
                id: post.author_id || '',
                first_name: 'Equipe',
                last_name: '99Tattoo',
                avatar_url: ''
              }
        };
        
        return processedPost;
      });
      
      console.log("[useBlogPosts] Posts processed successfully:", processedPosts.length);
      
      if (processedPosts.length > 0) {
        console.log("[useBlogPosts] Sample processed post:", {
          id: processedPosts[0].id,
          title: processedPosts[0].title,
          author: processedPosts[0].author,
          category: processedPosts[0].category
        });
      }
      
      return processedPosts;
    } catch (error: any) {
      console.error("[useBlogPosts] Error fetching posts:", error.message);
      toast({
        title: "Erro ao carregar posts",
        description: "Não foi possível carregar os artigos do blog. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return [];
    }
  };
  
  // Set up useQuery with caching strategy
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['blogPosts', options],
    queryFn: fetchPosts,
    staleTime: options?.staleTime || 300000, // 5 minutes cache by default
    gcTime: 600000, // Keep cache for 10 minutes after component unmounts
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
  
  // Fetch total count when relevant filters change
  useEffect(() => {
    const getCount = async () => {
      try {
        const count = await fetchPostsCount();
        setTotalCount(count);
      } catch (error) {
        console.error("[useBlogPosts] Error fetching count:", error);
      }
    };
    
    getCount();
  }, [options?.category_id, options?.tags, options?.search, options?.published_only]);
  
  return { 
    posts: posts || [], 
    isLoading, 
    error, 
    refetch, 
    totalCount 
  };
};
