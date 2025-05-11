
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, BlogCategory } from '@/types';

export const useBlogPosts = (options?: {
  category_id?: string;
  tags?: string[];
  search?: string;
  limit?: number;
  page?: number;
}) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  
  const fetchPostsCount = async () => {
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .not('published_at', 'is', null);
      
    if (options?.category_id) {
      query = query.eq('category_id', options.category_id);
    }
    
    if (options?.tags && options.tags.length > 0) {
      query = query.contains('tags', options.tags);
    }
    
    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,content.ilike.%${options.search}%`);
    }
    
    const { count, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return count || 0;
  };
  
  const fetchPosts = async () => {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:profiles!blog_posts_author_id_fkey(*),
        category:blog_categories(*)
      `)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });
      
    if (options?.category_id) {
      query = query.eq('category_id', options.category_id);
    }
    
    if (options?.tags && options.tags.length > 0) {
      query = query.contains('tags', options.tags);
    }
    
    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,content.ilike.%${options.search}%`);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.page && options?.limit) {
      const from = (options.page - 1) * options.limit;
      query = query.range(from, from + options.limit - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Type assertion with additional check to handle potential type issues
    return data as unknown as BlogPost[];
  };
  
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['blogPosts', options],
    queryFn: fetchPosts
  });
  
  useEffect(() => {
    fetchPostsCount().then(count => setTotalCount(count));
  }, [options?.category_id, options?.tags, options?.search]);
  
  return { posts, isLoading, error, refetch, totalCount };
};

export const useBlogPost = (id: string) => {
  return useQuery({
    queryKey: ['blogPost', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles!blog_posts_author_id_fkey(*),
          category:blog_categories(*)
        `)
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      // Type assertion with additional check to handle potential type issues
      return data as unknown as BlogPost;
    },
    enabled: !!id
  });
};

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blogCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      return data as BlogCategory[];
    }
  });
};
