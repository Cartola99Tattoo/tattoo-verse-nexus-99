
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, BlogCategory, BlogComment } from '@/types';

export const useBlogPosts = (options?: {
  category_id?: string;
  tags?: string[];
  search?: string;
  limit?: number;
  page?: number;
  published_only?: boolean;
}) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  
  const fetchPostsCount = async () => {
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
      throw error;
    }
    
    return data as unknown as BlogPost[];
  };
  
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['blogPosts', options],
    queryFn: fetchPosts
  });
  
  useEffect(() => {
    fetchPostsCount().then(count => setTotalCount(count));
  }, [options?.category_id, options?.tags, options?.search, options?.published_only]);
  
  return { posts, isLoading, error, refetch, totalCount };
};

export const useBlogPost = (slug: string) => {
  const incrementViewCount = async (postId: string) => {
    await supabase
      .from('blog_posts')
      .update({ view_count: supabase.rpc('increment', { row_id: postId, table_name: 'blog_posts', column_name: 'view_count' }) })
      .eq('id', postId);
  };

  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      // Primeiro, tente obter por slug
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles!blog_posts_author_id_fkey(*),
          category:blog_categories(*)
        `)
        .eq('slug', slug);
      
      let { data, error } = await query;
      
      // Se não encontrar por slug, tente por id
      if (!data || data.length === 0) {
        query = supabase
          .from('blog_posts')
          .select(`
            *,
            author:profiles!blog_posts_author_id_fkey(*),
            category:blog_categories(*)
          `)
          .eq('id', slug);
        
        const result = await query;
        data = result.data;
        error = result.error;
      }
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('Post não encontrado');
      }
      
      const post = data[0] as BlogPost;
      
      // Incrementar a contagem de visualizações
      incrementViewCount(post.id);
      
      return post;
    },
    enabled: !!slug
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

export const useBlogComments = (postId: string) => {
  return useQuery({
    queryKey: ['blogComments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          *,
          user:profiles!blog_comments_user_id_fkey(*)
        `)
        .eq('post_id', postId)
        .eq('is_approved', true)
        .is('parent_id', null)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Buscar respostas para cada comentário
      const commentIds = data.map(comment => comment.id);
      
      if (commentIds.length > 0) {
        const { data: replies, error: repliesError } = await supabase
          .from('blog_comments')
          .select(`
            *,
            user:profiles!blog_comments_user_id_fkey(*)
          `)
          .in('parent_id', commentIds)
          .eq('is_approved', true)
          .order('created_at', { ascending: true });
          
        if (repliesError) {
          throw repliesError;
        }
        
        // Organizar respostas por comentário pai
        data.forEach(comment => {
          comment.replies = replies.filter(reply => reply.parent_id === comment.id);
        });
      }
      
      return data as unknown as BlogComment[];
    },
    enabled: !!postId
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      postId, 
      content, 
      parentId = null 
    }: { 
      postId: string; 
      content: string; 
      parentId?: string | null 
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Você precisa estar logado para comentar');
      }
      
      const { data, error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: postId,
          user_id: session.user.id,
          parent_id: parentId,
          content,
          is_approved: false // Comentários precisam ser aprovados
        })
        .select();
        
      if (error) {
        throw error;
      }
      
      return data[0];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogComments', variables.postId] });
    }
  });
};

export const useBlogAdmin = () => {
  const queryClient = useQueryClient();
  
  const createPost = async (post: Partial<BlogPost>) => {
    // Gerar slug a partir do título se não fornecido
    if (!post.slug && post.title) {
      post.slug = post.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s]+/g, '-')
        .trim();
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select();
      
    if (error) {
      throw error;
    }
    
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    return data[0] as BlogPost;
  };
  
  const updatePost = async (id: string, post: Partial<BlogPost>) => {
    // Gerar slug a partir do título se não fornecido
    if (!post.slug && post.title) {
      post.slug = post.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s]+/g, '-')
        .trim();
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update(post)
      .eq('id', id)
      .select();
      
    if (error) {
      throw error;
    }
    
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    queryClient.invalidateQueries({ queryKey: ['blogPost', id] });
    queryClient.invalidateQueries({ queryKey: ['blogPost', post.slug || ''] });
    
    return data[0] as BlogPost;
  };
  
  const deletePost = async (id: string) => {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
  };
  
  const publishPost = async (id: string) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        published_at: new Date().toISOString(),
        is_draft: false
      })
      .eq('id', id)
      .select();
      
    if (error) {
      throw error;
    }
    
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    queryClient.invalidateQueries({ queryKey: ['blogPost', id] });
    
    return data[0] as BlogPost;
  };
  
  const unpublishPost = async (id: string) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        published_at: null,
        is_draft: true
      })
      .eq('id', id)
      .select();
      
    if (error) {
      throw error;
    }
    
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    queryClient.invalidateQueries({ queryKey: ['blogPost', id] });
    
    return data[0] as BlogPost;
  };
  
  return {
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost
  };
};

export const useUploadBlogImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileName = `${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('blog_images')
        .upload(`uploads/${fileName}`, file);
        
      if (error) {
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('blog_images')
        .getPublicUrl(data.path);
        
      return publicUrl;
    }
  });
};
