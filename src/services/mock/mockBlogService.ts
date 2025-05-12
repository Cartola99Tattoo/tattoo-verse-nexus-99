
import { appConfig } from "@/config/appConfig";
import { BlogPostSummary } from "@/components/blog/BlogCard";
import { BlogPost } from "@/hooks/useBlogPost";
import { IBlogService } from "../interfaces/IBlogService";
import { simulateNetworkDelay, simulateError } from "./mockUtils";

// Mock blog post data
const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "A História da Tatuagem no Brasil",
    slug: "historia-tatuagem-brasil",
    content: "A história da tatuagem no Brasil remonta aos povos indígenas que utilizavam pigmentos naturais para marcar a pele em rituais importantes...",
    excerpt: "Conheça a rica história da tatuagem no Brasil, desde os povos indígenas até os estúdios modernos.",
    cover_image: "https://images.unsplash.com/photo-1598971639058-a2335bde0a49?q=80&w=2148&auto=format&fit=crop",
    published_at: "2024-05-01T14:30:00Z",
    reading_time: 8,
    view_count: 345,
    profiles: {
      id: "1",
      first_name: "João",
      last_name: "Silva",
      avatar_url: null
    },
    blog_categories: {
      id: "1",
      name: "História",
      description: "Artigos sobre a história da tatuagem"
    }
  },
  {
    id: "2",
    title: "Cuidados Após Fazer uma Tatuagem",
    slug: "cuidados-apos-tatuagem",
    content: "Os primeiros dias após uma tatuagem são cruciais para garantir uma boa cicatrização. Manter a área limpa...",
    excerpt: "Aprenda os cuidados essenciais para garantir a melhor cicatrização da sua nova tatuagem.",
    cover_image: "https://images.unsplash.com/photo-1565058398932-9a36a1a3c2b9?q=80&w=2148&auto=format&fit=crop",
    published_at: "2024-05-05T10:15:00Z",
    reading_time: 5,
    view_count: 521,
    profiles: {
      id: "2",
      first_name: "Maria",
      last_name: "Oliveira",
      avatar_url: null
    },
    blog_categories: {
      id: "2",
      name: "Cuidados",
      description: "Dicas de cuidados para tatuagens"
    }
  },
  {
    id: "3",
    title: "Tendências de Tatuagem para 2024",
    slug: "tendencias-tatuagem-2024",
    content: "O mundo da tatuagem está sempre em evolução. Em 2024, vemos o ressurgimento de estilos vintage...",
    excerpt: "Descubra as principais tendências de tatuagem que estão bombando em 2024.",
    cover_image: "https://images.unsplash.com/photo-1590246815107-56d48602592f?q=80&w=2148&auto=format&fit=crop",
    published_at: "2024-05-10T16:45:00Z",
    reading_time: 6,
    view_count: 278,
    profiles: {
      id: "3",
      first_name: "André",
      last_name: "Mendes",
      avatar_url: null
    },
    blog_categories: {
      id: "3",
      name: "Tendências",
      description: "Novidades e tendências no mundo das tatuagens"
    }
  }
];

// Mock blog categories
const mockBlogCategories = [
  { id: "1", name: "História", description: "Artigos sobre a história da tatuagem" },
  { id: "2", name: "Cuidados", description: "Dicas de cuidados para tatuagens" },
  { id: "3", name: "Tendências", description: "Novidades e tendências no mundo das tatuagens" },
  { id: "4", name: "Estilos", description: "Diferentes estilos artísticos de tatuagem" },
  { id: "5", name: "Artistas", description: "Perfis de artistas renomados" }
];

// Mock BlogService implementation
export class MockBlogService implements IBlogService {
  async fetchBlogPosts(limit?: number): Promise<BlogPostSummary[]> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockBlogService: fetchBlogPosts called with limit:", limit);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch blog posts");
    }
    
    const posts = [...mockBlogPosts].map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      cover_image: post.cover_image,
      published_at: post.published_at,
      slug: post.slug,
      profiles: post.profiles,
      blog_categories: post.blog_categories
    }));
    
    return limit ? posts.slice(0, limit) : posts;
  }

  async fetchBlogCategories(): Promise<{ id: string; name: string; description: string | null }[]> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockBlogService: fetchBlogCategories called");
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch blog categories");
    }
    
    return [...mockBlogCategories];
  }

  async fetchBlogPost(idOrSlug: string): Promise<BlogPost | null> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockBlogService: fetchBlogPost called with idOrSlug:", idOrSlug);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch blog post");
    }
    
    const post = mockBlogPosts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    
    if (post) {
      // Simulate view count increment
      const postWithIncrementedView = {
        ...post,
        view_count: (post.view_count || 0) + 1
      };
      
      return postWithIncrementedView;
    }
    
    return null;
  }
}

// Export a singleton instance of the service
export const mockBlogService = new MockBlogService();
