
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
  
  // Função simplificada para contar posts que correspondam aos critérios
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
  
  // Nova estratégia de busca: uma única consulta com joins para dados de autor e categoria
  const fetchPosts = async () => {
    try {
      console.log("Buscando posts do blog com opções:", options);
      
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

      // Processar os posts recuperados e adicionar informações de autor (se estiver disponível)
      const processedPosts = await Promise.all((data || []).map(async (post) => {
        try {
          // Criar um objeto de autor padrão caso não consigamos buscar o autor
          const defaultAuthor = {
            id: post.author_id || '',
            first_name: 'Equipe',
            last_name: '99Tattoo',
            avatar_url: ''
          };
          
          // Se não temos author_id, retornar com autor padrão
          if (!post.author_id) {
            console.log("Post sem author_id:", post.id);
            return { ...post, author: defaultAuthor };
          }
          
          // Tentativa de buscar informações de autor
          try {
            const { data: authorData, error: authorError } = await supabase
              .from('profiles')
              .select('id, first_name, last_name, avatar_url')
              .eq('id', post.author_id)
              .single();
            
            if (authorError || !authorData) {
              console.log("Erro ao buscar autor ou autor não encontrado:", authorError);
              return { ...post, author: defaultAuthor };
            }
            
            return { ...post, author: authorData };
          } catch (authorError) {
            console.log("Exceção ao buscar autor do post:", authorError);
            return { ...post, author: defaultAuthor };
          }
        } catch (error) {
          console.error("Erro ao processar post:", error);
          return {
            ...post,
            author: {
              id: post.author_id || '',
              first_name: 'Equipe',
              last_name: '99Tattoo',
              avatar_url: ''
            }
          };
        }
      }));
      
      console.log("Posts recuperados com sucesso:", processedPosts?.length || 0);
      return processedPosts as unknown as BlogPost[];
    } catch (error: any) {
      console.error("Erro ao buscar posts:", error.message);
      // Usando um toast para notificar o usuário de forma amigável
      toast({
        title: "Erro ao carregar posts",
        description: "Não foi possível carregar os artigos do blog. Tente novamente mais tarde.",
        variant: "destructive",
      });
      // Retornar array vazio para evitar erros de renderização
      return [];
    }
  };
  
  // Configuração do useQuery com melhor estratégia de cache e retry
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['blogPosts', options],
    queryFn: fetchPosts,
    staleTime: options?.staleTime || 300000, // Cache por 5 minutos por padrão
    gcTime: 600000, // Manter cache por 10 minutos mesmo após o componente desmontar
    retry: 2, // Tentar novamente até 2 vezes em caso de erro
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Backoff exponencial
  });
  
  // Buscar a contagem total apenas quando os filtros relevantes mudarem
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
