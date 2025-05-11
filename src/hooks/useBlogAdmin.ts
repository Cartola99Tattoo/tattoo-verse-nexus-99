
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types';

export const useBlogAdmin = () => {
  const queryClient = useQueryClient();
  
  const createPost = async (post: Partial<BlogPost> & { title: string; content: string }) => {
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
