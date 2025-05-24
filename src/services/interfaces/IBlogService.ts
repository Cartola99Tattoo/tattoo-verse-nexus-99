import { BlogPostSummary } from "@/components/blog/BlogCard";
import { BlogPost } from "@/hooks/useBlogPost";

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'oldest';
  status?: 'published' | 'draft' | 'archived' | 'all';
  author_id?: string;
}

export interface BlogPaginatedResponse {
  posts: BlogPostSummary[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface CreateBlogPostData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  author_id: string;
  category_id?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  tags?: string[];
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string;
}

export interface IBlogService {
  fetchBlogPosts(params?: BlogQueryParams): Promise<BlogPaginatedResponse>;
  fetchBlogCategories(): Promise<BlogCategory[]>;
  fetchBlogPost(idOrSlug: string): Promise<BlogPost | null>;
  fetchRelatedPosts(postId: string, limit?: number): Promise<BlogPostSummary[]>;
  fetchTagsList(): Promise<string[]>;
  searchBlogPosts(query: string): Promise<BlogPostSummary[]>;
  
  createBlogPost?: (data: CreateBlogPostData) => Promise<BlogPost>;
  updateBlogPost?: (data: UpdateBlogPostData) => Promise<BlogPost>;
  deleteBlogPost?: (id: string) => Promise<boolean>;
  createBlogCategory?: (data: { name: string; description?: string }) => Promise<BlogCategory>;
  updateBlogCategory?: (id: string, data: { name: string; description?: string }) => Promise<BlogCategory>;
  deleteBlogCategory?: (id: string) => Promise<boolean>;
  generateSlug?: (title: string) => string;
}
