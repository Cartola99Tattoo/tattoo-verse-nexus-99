
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface BlogPostCreate extends Partial<BlogPost> {
  title: string;
  content: string;
}

export const useBlogAdmin = () => {
  const queryClient = useQueryClient();
  
  const createPost = async (post: BlogPostCreate) => {
    try {
      console.log("[useBlogAdmin] Creating post:", post.title);
      
      // Generate slug from title if not provided
      if (!post.slug && post.title) {
        post.slug = post.title
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .trim();
      }
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(post)
        .select();
        
      if (error) {
        console.error("[useBlogAdmin] Error creating post:", error);
        throw error;
      }
      
      console.log("[useBlogAdmin] Post created successfully:", data[0].id);
      
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      return data[0] as BlogPost;
    } catch (error) {
      console.error("[useBlogAdmin] Error creating post:", error);
      throw error;
    }
  };
  
  const updatePost = async (id: string, post: Partial<BlogPost>) => {
    try {
      console.log("[useBlogAdmin] Updating post:", id);
      
      // Generate slug from title if not provided but title is
      if (!post.slug && post.title) {
        post.slug = post.title
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .trim();
      }
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select();
        
      if (error) {
        console.error("[useBlogAdmin] Error updating post:", error);
        throw error;
      }
      
      console.log("[useBlogAdmin] Post updated successfully:", id);
      
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', id] });
      if (post.slug) {
        queryClient.invalidateQueries({ queryKey: ['blogPost', post.slug] });
      }
      
      return data[0] as BlogPost;
    } catch (error) {
      console.error("[useBlogAdmin] Error updating post:", error);
      throw error;
    }
  };
  
  const deletePost = async (id: string) => {
    try {
      console.log("[useBlogAdmin] Deleting post:", id);
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("[useBlogAdmin] Error deleting post:", error);
        throw error;
      }
      
      console.log("[useBlogAdmin] Post deleted successfully:", id);
      
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "Post excluído",
        description: "O post foi excluído com sucesso.",
      });
    } catch (error) {
      console.error("[useBlogAdmin] Error deleting post:", error);
      throw error;
    }
  };
  
  const publishPost = async (id: string) => {
    try {
      console.log("[useBlogAdmin] Publishing post:", id);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          published_at: new Date().toISOString(),
          is_draft: false
        })
        .eq('id', id)
        .select();
        
      if (error) {
        console.error("[useBlogAdmin] Error publishing post:", error);
        throw error;
      }
      
      console.log("[useBlogAdmin] Post published successfully:", id);
      
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', id] });
      
      toast({
        title: "Post publicado",
        description: "O post foi publicado com sucesso.",
      });
      
      return data[0] as BlogPost;
    } catch (error) {
      console.error("[useBlogAdmin] Error publishing post:", error);
      throw error;
    }
  };
  
  const unpublishPost = async (id: string) => {
    try {
      console.log("[useBlogAdmin] Unpublishing post:", id);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          published_at: null,
          is_draft: true
        })
        .eq('id', id)
        .select();
        
      if (error) {
        console.error("[useBlogAdmin] Error unpublishing post:", error);
        throw error;
      }
      
      console.log("[useBlogAdmin] Post unpublished successfully:", id);
      
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', id] });
      
      toast({
        title: "Post despublicado",
        description: "O post foi despublicado com sucesso.",
      });
      
      return data[0] as BlogPost;
    } catch (error) {
      console.error("[useBlogAdmin] Error unpublishing post:", error);
      throw error;
    }
  };
  
  return {
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost
  };
};
