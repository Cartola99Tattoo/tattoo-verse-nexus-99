
import { BlogPostSummary } from "@/components/blog/BlogCard";
import { BlogPost } from "@/hooks/useBlogPost";

export interface IBlogService {
  fetchBlogPosts(limit?: number): Promise<BlogPostSummary[]>;
  fetchBlogCategories(): Promise<{ id: string; name: string; description: string | null }[]>;
  fetchBlogPost(idOrSlug: string): Promise<BlogPost | null>;
}
