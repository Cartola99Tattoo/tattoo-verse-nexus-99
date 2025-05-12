import { useDataQuery } from './useDataQuery';
import { getBlogService } from '@/services/serviceFactory';

// Define proper types (keep existing type definition)
export type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  cover_image?: string | null;
  published_at?: string | null;
  category_id?: string;
  author_id?: string;
  reading_time?: number | null;
  tags?: string[] | null;
  view_count?: number | null;
  slug?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  profiles?: {
    first_name?: string | null;
    last_name?: string | null;
    avatar_url?: string | null;
    id?: string;
  } | {
    first_name?: string | null;
    last_name?: string | null;
    avatar_url?: string | null;
    id?: string;
  }[] | null;
  blog_categories?: {
    name?: string | null;
    id?: string;
    description?: string | null;
  } | {
    name?: string | null;
    id?: string;
    description?: string | null;
  }[] | null;
};

export function useBlogPost(postIdOrSlug: string) {
  const blogService = getBlogService();
  
  const { data: post, loading: isLoading, error, refresh } = useDataQuery<BlogPost | null>(
    () => blogService.fetchBlogPost(postIdOrSlug),
    [postIdOrSlug]
  );

  return { 
    post, 
    isLoading, 
    error: error ? {
      message: "Erro ao carregar artigo",
      details: error.message
    } : null,
    refresh
  };
}
