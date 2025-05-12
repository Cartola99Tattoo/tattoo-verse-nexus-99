
import { BlogPostSummary } from "@/components/blog/BlogCard";
import { BlogPost } from "@/hooks/useBlogPost";

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'oldest';
}

export interface BlogPaginatedResponse {
  posts: BlogPostSummary[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
}

export interface IBlogService {
  fetchBlogPosts(params?: BlogQueryParams): Promise<BlogPaginatedResponse>;
  fetchBlogCategories(): Promise<{ id: string; name: string; description: string | null }[]>;
  fetchBlogPost(idOrSlug: string): Promise<BlogPost | null>;
  fetchRelatedPosts(postId: string, limit?: number): Promise<BlogPostSummary[]>;
  fetchTagsList(): Promise<string[]>;
  searchBlogPosts(query: string): Promise<BlogPostSummary[]>;
}
