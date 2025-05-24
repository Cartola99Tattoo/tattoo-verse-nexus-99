
import { 
  IBlogService, 
  BlogQueryParams, 
  BlogPaginatedResponse,
  BlogCategory,
  CreateBlogPostData,
  UpdateBlogPostData
} from '../interfaces/IBlogService';
import { BlogPostSummary } from '@/components/blog/BlogCard';
import { BlogPost } from '@/hooks/useBlogPost';

// Mock data for categories
const mockCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Cuidados Pós-Tatuagem',
    description: 'Dicas e orientações para cuidar da sua tatuagem após a sessão',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Estilos de Tatuagem',
    description: 'Explorando diferentes estilos e técnicas de tatuagem',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Notícias do Estúdio',
    description: 'Novidades e atualizações do estúdio 99Tattoo',
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Dicas de Design',
    description: 'Inspiração e orientações para design de tatuagens',
    created_at: '2024-01-04T00:00:00Z'
  }
];

// Enhanced mock posts with more fields
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Como cuidar da sua tatuagem nos primeiros dias',
    slug: 'como-cuidar-da-sua-tatuagem-nos-primeiros-dias',
    content: `
# Como cuidar da sua tatuagem nos primeiros dias

Os primeiros dias após fazer uma tatuagem são **cruciais** para a cicatrização adequada. Aqui estão algumas dicas importantes:

## Primeiras 24 horas
- Mantenha o filme protetor por 2-4 horas
- Lave suavemente com sabão neutro
- Aplique pomada cicatrizante

## Dias 2-7
- Continue lavando 2-3 vezes ao dia
- Use pomada específica para tatuagem
- Evite exposição solar direta

## O que evitar
- Não coce ou esfregue a tatuagem
- Evite piscinas e mar
- Não use produtos com álcool

Lembre-se: uma boa cicatrização garante que sua tatuagem ficará linda por muitos anos!
    `,
    excerpt: 'Aprenda os cuidados essenciais para garantir uma cicatrização perfeita da sua nova tatuagem.',
    cover_image: 'https://images.unsplash.com/photo-1594067598377-478c61d59f3f?q=80&w=2148&auto=format&fit=crop',
    published_at: '2024-01-15T10:00:00Z',
    category_id: '1',
    author_id: 'admin',
    reading_time: 5,
    tags: ['cuidados', 'cicatrização', 'pós-tatuagem'],
    view_count: 1250,
    meta_description: 'Guia completo de cuidados pós-tatuagem para uma cicatrização perfeita',
    meta_keywords: 'tatuagem, cuidados, cicatrização, pós-tatuagem',
    profiles: {
      first_name: 'Equipe',
      last_name: '99Tattoo',
      avatar_url: null
    },
    blog_categories: {
      id: '1',
      name: 'Cuidados Pós-Tatuagem',
      description: 'Dicas e orientações para cuidar da sua tatuagem após a sessão'
    }
  },
  {
    id: '2',
    title: 'Tendências de tatuagem para 2024',
    slug: 'tendencias-de-tatuagem-para-2024',
    content: `
# Tendências de tatuagem para 2024

Este ano promete trazer **novidades incríveis** no mundo da tatuagem. Confira as principais tendências:

## Fine Line
Traços finos e delicados continuam em alta, especialmente para:
- Desenhos minimalistas
- Elementos florais
- Símbolos geométricos

## Aquarela
O estilo aquarela ganhou força com:
- Cores vibrantes
- Efeitos de tinta escorrida
- Combinação com elementos realistas

## Blackwork
O preto absoluto domina com:
- Preenchimentos sólidos
- Contrastes marcantes
- Designs abstratos

Qual estilo mais combina com você?
    `,
    excerpt: 'Descubra as principais tendências de tatuagem que dominarão 2024 e inspire-se para sua próxima tattoo.',
    cover_image: 'https://images.unsplash.com/photo-1590246815107-56d48602592f?w=800&auto=format&fit=crop&q=60',
    published_at: '2024-01-10T14:30:00Z',
    category_id: '2',
    author_id: 'admin',
    reading_time: 7,
    tags: ['tendências', '2024', 'estilos', 'fine-line', 'aquarela'],
    view_count: 890,
    meta_description: 'Conheça as principais tendências de tatuagem para 2024',
    meta_keywords: 'tendências tatuagem, 2024, estilos, fine line, aquarela',
    profiles: {
      first_name: 'Carlos',
      last_name: 'Silva',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    blog_categories: {
      id: '2',
      name: 'Estilos de Tatuagem',
      description: 'Explorando diferentes estilos e técnicas de tatuagem'
    }
  },
  {
    id: '3',
    title: 'Novidade no estúdio: Equipamentos de última geração',
    slug: 'novidade-no-studio-equipamentos-de-ultima-geracao',
    content: `
# Novidade no estúdio: Equipamentos de última geração

Estamos **super empolgados** em anunciar que acabamos de adquirir novos equipamentos para oferecer ainda mais qualidade nos nossos trabalhos!

## Novas máquinas
- Máquinas rotativas de última geração
- Menor vibração = mais conforto
- Precisão milimétrica nos traços

## Agulhas premium
- Agulhas esterilizadas individuais
- Diversos tipos para cada técnica
- Qualidade internacional

## Tintas de alta qualidade
- Pigmentos premium importados
- Cores mais vivas e duradouras
- Segurança e qualidade garantidas

Venha conhecer nosso estúdio renovado!
    `,
    excerpt: 'Conheça os novos equipamentos de última geração que adquirimos para oferecer ainda mais qualidade.',
    cover_image: 'https://images.unsplash.com/photo-1565058398932-9a36a1a3c2b9?w=800&auto=format&fit=crop&q=60',
    published_at: '2024-01-05T09:00:00Z',
    category_id: '3',
    author_id: 'admin',
    reading_time: 3,
    tags: ['novidades', 'equipamentos', 'qualidade', 'estúdio'],
    view_count: 456,
    meta_description: 'Conheça os novos equipamentos de última geração do nosso estúdio',
    meta_keywords: 'equipamentos tatuagem, máquinas, qualidade, estúdio',
    profiles: {
      first_name: 'Ana',
      last_name: 'Costa',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    blog_categories: {
      id: '3',
      name: 'Notícias do Estúdio',
      description: 'Novidades e atualizações do estúdio 99Tattoo'
    }
  }
];

// Simple slug generator
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const mockBlogService: IBlogService = {
  async fetchBlogPosts(params: BlogQueryParams = {}): Promise<BlogPaginatedResponse> {
    console.log('MockBlogService: fetchBlogPosts called with params:', params);
    
    let filteredPosts = [...mockBlogPosts];

    // Apply filters
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower)
      );
    }

    if (params.category) {
      filteredPosts = filteredPosts.filter(post => post.category_id === params.category);
    }

    if (params.status && params.status !== 'all') {
      // For mock, we'll assume all posts are published
      if (params.status !== 'published') {
        filteredPosts = [];
      }
    }

    if (params.author_id) {
      filteredPosts = filteredPosts.filter(post => post.author_id === params.author_id);
    }

    if (params.tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags?.includes(params.tag!)
      );
    }

    // Apply sorting
    if (params.sort === 'oldest') {
      filteredPosts.sort((a, b) => new Date(a.published_at || 0).getTime() - new Date(b.published_at || 0).getTime());
    } else {
      filteredPosts.sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime());
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    // Convert to BlogPostSummary format
    const posts: BlogPostSummary[] = paginatedPosts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      cover_image: post.cover_image,
      published_at: post.published_at,
      slug: post.slug,
      profiles: post.profiles,
      blog_categories: post.blog_categories
    }));

    return {
      posts,
      totalPosts: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / limit),
      currentPage: page
    };
  },

  async fetchBlogCategories(): Promise<BlogCategory[]> {
    console.log('MockBlogService: fetchBlogCategories called');
    return [...mockCategories];
  },

  async fetchBlogPost(idOrSlug: string): Promise<BlogPost | null> {
    console.log('MockBlogService: fetchBlogPost called with:', idOrSlug);
    
    const post = mockBlogPosts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    return post || null;
  },

  async fetchRelatedPosts(postId: string, limit: number = 3): Promise<BlogPostSummary[]> {
    console.log('MockBlogService: fetchRelatedPosts called with postId:', postId, 'limit:', limit);
    
    const currentPost = mockBlogPosts.find(p => p.id === postId);
    if (!currentPost) return [];

    // Get posts from same category, excluding current post
    const relatedPosts = mockBlogPosts
      .filter(p => p.id !== postId && p.category_id === currentPost.category_id)
      .slice(0, limit);

    return relatedPosts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      cover_image: post.cover_image,
      published_at: post.published_at,
      slug: post.slug,
      profiles: post.profiles,
      blog_categories: post.blog_categories
    }));
  },

  async fetchTagsList(): Promise<string[]> {
    console.log('MockBlogService: fetchTagsList called');
    
    const allTags = mockBlogPosts.flatMap(post => post.tags || []);
    return [...new Set(allTags)].sort();
  },

  async searchBlogPosts(query: string): Promise<BlogPostSummary[]> {
    console.log('MockBlogService: searchBlogPosts called with query:', query);
    
    const result = await this.fetchBlogPosts({ search: query, limit: 10 });
    return result.posts;
  },

  // Admin methods
  async createBlogPost(data: CreateBlogPostData): Promise<BlogPost> {
    console.log('MockBlogService: createBlogPost called with data:', data);
    
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: data.title,
      slug: data.slug || generateSlug(data.title),
      content: data.content,
      excerpt: data.excerpt || '',
      cover_image: data.cover_image || null,
      published_at: data.published_at || new Date().toISOString(),
      category_id: data.category_id,
      author_id: data.author_id,
      reading_time: Math.ceil(data.content.length / 1000), // Rough estimate
      tags: data.tags || [],
      view_count: 0,
      meta_description: data.meta_description || '',
      meta_keywords: data.meta_keywords || '',
      profiles: {
        first_name: 'Equipe',
        last_name: '99Tattoo',
        avatar_url: null
      },
      blog_categories: mockCategories.find(c => c.id === data.category_id) || null
    };

    mockBlogPosts.unshift(newPost);
    return newPost;
  },

  async updateBlogPost(data: UpdateBlogPostData): Promise<BlogPost> {
    console.log('MockBlogService: updateBlogPost called with data:', data);
    
    const index = mockBlogPosts.findIndex(p => p.id === data.id);
    if (index === -1) {
      throw new Error('Post not found');
    }

    const updatedPost = {
      ...mockBlogPosts[index],
      ...data,
      slug: data.slug || mockBlogPosts[index].slug
    };

    mockBlogPosts[index] = updatedPost;
    return updatedPost;
  },

  async deleteBlogPost(id: string): Promise<boolean> {
    console.log('MockBlogService: deleteBlogPost called with id:', id);
    
    const index = mockBlogPosts.findIndex(p => p.id === id);
    if (index === -1) {
      return false;
    }

    mockBlogPosts.splice(index, 1);
    return true;
  },

  async createBlogCategory(data: { name: string; description?: string }): Promise<BlogCategory> {
    console.log('MockBlogService: createBlogCategory called with data:', data);
    
    const newCategory: BlogCategory = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description || null,
      created_at: new Date().toISOString()
    };

    mockCategories.push(newCategory);
    return newCategory;
  },

  async updateBlogCategory(id: string, data: { name: string; description?: string }): Promise<BlogCategory> {
    console.log('MockBlogService: updateBlogCategory called with id:', id, 'data:', data);
    
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }

    const updatedCategory = {
      ...mockCategories[index],
      ...data,
      description: data.description || null
    };

    mockCategories[index] = updatedCategory;
    return updatedCategory;
  },

  async deleteBlogCategory(id: string): Promise<boolean> {
    console.log('MockBlogService: deleteBlogCategory called with id:', id);
    
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) {
      return false;
    }

    mockCategories.splice(index, 1);
    return true;
  },

  generateSlug(title: string): string {
    return generateSlug(title);
  }
};
