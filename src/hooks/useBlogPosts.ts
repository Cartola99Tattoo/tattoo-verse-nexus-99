
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
  
  // Nova estratégia: Uma única consulta sem necessidade de acessar a tabela users
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
          category:blog_categories(id, name, description),
          author:profiles(id, first_name, last_name, avatar_url)
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

      // Processar posts para garantir dados consistentes mesmo se o autor não estiver disponível
      const processedPosts = (data || []).map((post) => {
        // Criar um objeto de autor padrão se não houver informações
        if (!post.author || Object.keys(post.author).length === 0) {
          post.author = {
            id: post.author_id || '',
            first_name: 'Equipe',
            last_name: '99Tattoo',
            avatar_url: ''
          };
        }
        
        // Se o autor existe mas está faltando alguns dados, completar com valores padrão
        if (post.author) {
          post.author.first_name = post.author.first_name || 'Equipe';
          post.author.last_name = post.author.last_name || '99Tattoo';
        }
        
        return post;
      });
      
      console.log("Posts recuperados com sucesso:", processedPosts?.length || 0);
      console.log("Primeiro post (se existir):", processedPosts[0] ? processedPosts[0].title : "Nenhum post");
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
