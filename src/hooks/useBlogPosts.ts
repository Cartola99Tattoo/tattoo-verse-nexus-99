
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useBlogPosts = (options?: {
  category_id?: string;
  tags?: string[];
  search?: string;
  limit?: number;
  page?: number;
  published_only?: boolean;
  staleTime?: number;
}) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  
  const fetchPostsCount = async (): Promise<number> => {
    try {
      console.log("Contando posts com opções:", options);
      
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
        console.error("Erro ao buscar contagem de posts:", error);
        return 0;
      }
      
      console.log("Total de posts encontrados:", count);
      return count || 0;
    } catch (error) {
      console.error("Erro ao buscar contagem de posts:", error);
      return 0;
    }
  };
  
  const fetchPosts = async () => {
    try {
      console.log("Buscando posts do blog com opções:", options);
      
      // Query simplificada para evitar problemas com RLS
      let query = supabase
        .from('blog_posts')
        .select(`
          id, 
          title, 
          slug, 
          content, 
          excerpt, 
          cover_image, 
          author_id,
          category_id, 
          tags, 
          published_at, 
          is_draft, 
          reading_time, 
          meta_description, 
          meta_keywords, 
          view_count, 
          created_at, 
          updated_at,
          category:blog_categories(id, name, description)
        `)
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
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Erro na query do Supabase:", error);
        throw error;
      }
      
      // Agora fazemos uma segunda query para buscar os dados dos autores
      const processedPosts = await Promise.all((data || []).map(async (post) => {
        try {
          if (post.author_id) {
            const { data: authorData } = await supabase
              .from('profiles')
              .select('id, first_name, last_name, avatar_url')
              .eq('id', post.author_id)
              .single();
            
            return {
              ...post,
              author: authorData || {
                id: post.author_id,
                first_name: '',
                last_name: '',
                avatar_url: ''
              }
            };
          }
          return {
            ...post,
            author: {
              id: post.author_id || '',
              first_name: '',
              last_name: '',
              avatar_url: ''
            }
          };
        } catch (error) {
          console.log("Erro ao buscar autor do post:", error);
          return {
            ...post,
            author: {
              id: post.author_id || '',
              first_name: '',
              last_name: '',
              avatar_url: ''
            }
          };
        }
      }));
      
      console.log("Posts recuperados:", processedPosts?.length || 0);
      return processedPosts as unknown as BlogPost[];
    } catch (error: any) {
      console.error("Erro ao buscar posts:", error.message);
      toast({
        title: "Erro ao carregar posts",
        description: "Não foi possível carregar os artigos do blog. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return [];
    }
  };
  
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['blogPosts', options],
    queryFn: fetchPosts,
    staleTime: options?.staleTime || 60000, // Cache por 1 minuto por padrão
    retry: 1
  });
  
  useEffect(() => {
    const getCount = async () => {
      try {
        const count = await fetchPostsCount();
        setTotalCount(count);
      } catch (error) {
        console.error("Erro ao buscar contagem de posts:", error);
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
