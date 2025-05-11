
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
      console.log("[useBlogPosts] Contando posts com opções:", options);
      
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
        console.error("[useBlogPosts] Erro ao buscar contagem de posts:", error);
        return 0;
      }
      
      console.log("[useBlogPosts] Total de posts encontrados:", count);
      return count || 0;
    } catch (error) {
      console.error("[useBlogPosts] Erro ao buscar contagem de posts:", error);
      return 0;
    }
  };
  
  // Nova abordagem: Duas consultas separadas para evitar problemas de permissão
  const fetchPosts = async () => {
    try {
      console.log("[useBlogPosts] Buscando posts do blog com opções:", options);
      
      // 1. Primeiro, buscar os posts básicos sem joins
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
          updated_at
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
      
      const { data: postsData, error: postsError } = await query;
      
      if (postsError) {
        console.error("[useBlogPosts] Erro na query de posts:", postsError);
        throw postsError;
      }

      if (!postsData || postsData.length === 0) {
        console.log("[useBlogPosts] Nenhum post encontrado");
        return [];
      }

      console.log("[useBlogPosts] Posts recuperados com sucesso:", postsData.length);
      
      // 2. Buscar categorias dos posts encontrados
      const categoryIds = [...new Set(postsData.filter(post => post.category_id).map(post => post.category_id))];
      
      let categories = {};
      if (categoryIds.length > 0) {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('blog_categories')
          .select('id, name, description')
          .in('id', categoryIds);
          
        if (categoriesError) {
          console.error("[useBlogPosts] Erro ao buscar categorias:", categoriesError);
        } else if (categoriesData) {
          categories = categoriesData.reduce((acc, cat) => {
            acc[cat.id] = cat;
            return acc;
          }, {});
          console.log("[useBlogPosts] Categorias encontradas:", Object.keys(categories).length);
        }
      }
      
      // 3. Buscar autores dos posts encontrados (da tabela profiles, não auth.users)
      const authorIds = [...new Set(postsData.filter(post => post.author_id).map(post => post.author_id))];
      
      let authors = {};
      if (authorIds.length > 0) {
        const { data: authorsData, error: authorsError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', authorIds);
          
        if (authorsError) {
          console.error("[useBlogPosts] Erro ao buscar autores:", authorsError);
        } else if (authorsData) {
          authors = authorsData.reduce((acc, author) => {
            acc[author.id] = author;
            return acc;
          }, {});
          console.log("[useBlogPosts] Autores encontrados:", Object.keys(authors).length);
        }
      }
      
      // 4. Combinar os dados em um único objeto para cada post
      const processedPosts = postsData.map((post) => {
        // Adicionar categoria ao post
        if (post.category_id && categories[post.category_id]) {
          post.category = categories[post.category_id];
        } else {
          post.category = {
            id: post.category_id || '',
            name: 'Sem categoria',
            description: ''
          };
        }
        
        // Adicionar autor ao post
        if (post.author_id && authors[post.author_id]) {
          post.author = authors[post.author_id];
        } else {
          // Autor padrão se não encontrado
          post.author = {
            id: post.author_id || '',
            first_name: 'Equipe',
            last_name: '99Tattoo',
            avatar_url: ''
          };
        }
        
        return post;
      });
      
      console.log("[useBlogPosts] Posts processados com sucesso:", processedPosts.length);
      console.log("[useBlogPosts] Exemplo de post processado:", processedPosts[0] ? {
        id: processedPosts[0].id,
        title: processedPosts[0].title,
        author: processedPosts[0].author,
        category: processedPosts[0].category
      } : "Nenhum post");
      
      return processedPosts as unknown as BlogPost[];
    } catch (error: any) {
      console.error("[useBlogPosts] Erro ao buscar posts:", error.message);
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
        console.error("[useBlogPosts] Erro ao buscar contagem de posts:", error);
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
