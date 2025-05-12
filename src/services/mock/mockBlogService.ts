
import { appConfig } from "@/config/appConfig";
import { BlogPostSummary } from "@/components/blog/BlogCard";
import { BlogPost } from "@/hooks/useBlogPost";
import { BlogPaginatedResponse, BlogQueryParams, IBlogService } from "../interfaces/IBlogService";
import { simulateNetworkDelay, simulateError } from "./mockUtils";

// Mock blog post data
const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "A História da Tatuagem no Brasil",
    slug: "historia-tatuagem-brasil",
    content: `
      <p>A história da tatuagem no Brasil remonta aos povos indígenas que utilizavam pigmentos naturais para marcar a pele em rituais importantes. Estas marcações tinham significados culturais profundos, relacionados a passagens de vida, status tribal e conexões espirituais.</p>
      
      <h2>A chegada da tatuagem moderna</h2>
      
      <p>A tatuagem moderna, no entanto, chegou ao Brasil principalmente através dos marinheiros europeus durante os séculos XIX e XX. Inicialmente associada a marinheiros e presidiários, a arte da tatuagem carregou um estigma por muitas décadas no país.</p>
      
      <p>Foi apenas na década de 1980 que começou a ganhar maior aceitação social, com a chegada dos primeiros tatuadores profissionais formados no exterior e o estabelecimento de estúdios especializados nas grandes cidades.</p>
      
      <h2>A revolução dos anos 90 e 2000</h2>
      
      <p>Durante os anos 1990 e 2000, houve uma verdadeira revolução na cena da tatuagem brasileira. Artistas nacionais começaram a desenvolver seus próprios estilos e técnicas, enquanto convenções internacionais de tatuagem passaram a incluir o Brasil em seus circuitos.</p>
      
      <p>O país viu nascer talentos reconhecidos mundialmente como:</p>
      
      <ul>
        <li>Adão Rosa, pioneiro da tatuagem realista no Brasil</li>
        <li>Mari Moreno, especialista em aquarela</li>
        <li>Tiago Ashanti, mestre do estilo neotribal</li>
      </ul>
      
      <h2>A tatuagem contemporânea brasileira</h2>
      
      <p>Atualmente, o Brasil possui uma das mais vibrantes cenas de tatuagem do mundo. Com um estilo próprio que muitas vezes incorpora elementos da rica cultura visual brasileira, os tatuadores brasileiros são reconhecidos internacionalmente por sua técnica, criatividade e abordagem única.</p>
      
      <p>A legislação e as normas sanitárias também evoluíram, tornando a prática mais segura e regulamentada. Hoje, existem mais de 80 mil estúdios de tatuagem registrados no país, demonstrando como esta forma de arte se tornou parte integrante da cultura contemporânea brasileira.</p>
      
      <blockquote>
        <p>"A tatuagem brasileira tem um DNA próprio, que mistura influências globais com nossa rica diversidade cultural. Isso criou um estilo que é imediatamente reconhecível em todo o mundo."</p>
        <cite>— Carlos Falcão, historiador da arte corporal</cite>
      </blockquote>
      
      <p>Os últimos anos têm visto um interesse crescente por estilos que resgatam elementos da cultura indígena brasileira e da arte popular, fechando um ciclo histórico que conecta as origens ancestrais da marcação corporal no território brasileiro com sua expressão contemporânea.</p>
    `,
    excerpt: "Conheça a rica história da tatuagem no Brasil, desde os povos indígenas até os estúdios modernos.",
    cover_image: "https://images.unsplash.com/photo-1598971639058-a2335bde0a49?q=80&w=2148&auto=format&fit=crop",
    published_at: "2024-05-01T14:30:00Z",
    reading_time: 8,
    view_count: 345,
    tags: ["História", "Cultura Brasileira", "Tatuagens Indígenas"],
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
    content: `
      <p>Os primeiros dias após uma tatuagem são cruciais para garantir uma boa cicatrização. Manter a área limpa e devidamente hidratada é essencial para preservar a qualidade da arte e evitar complicações.</p>
      
      <h2>Primeiras 24-48 horas</h2>
      
      <p>Durante as primeiras 24 a 48 horas, é fundamental seguir estas orientações:</p>
      
      <ul>
        <li>Mantenha o curativo original pelo tempo recomendado pelo seu tatuador (geralmente de 2 a 24 horas)</li>
        <li>Ao remover o curativo, lave delicadamente a área com água morna e sabão neutro</li>
        <li>Não esfregue a região; apenas faça movimentos suaves com as pontas dos dedos</li>
        <li>Seque com toalha limpa, pressionando suavemente (sem esfregar)</li>
        <li>Aplique uma fina camada do hidratante recomendado pelo seu tatuador</li>
      </ul>
      
      <h2>Primeira semana</h2>
      
      <p>Durante a primeira semana, você notará que a tatuagem começará a formar uma casquinha. Nesta fase:</p>
      
      <ul>
        <li>Continue lavando a área 2-3 vezes ao dia com sabão neutro</li>
        <li>Mantenha a hidratação com aplicações leves do produto recomendado</li>
        <li><strong>Nunca arranque as casquinhas</strong> que se formarem</li>
        <li>Evite exposição solar direta</li>
        <li>Não submerja a tatuagem em piscinas, mar, banheiras ou saunas</li>
      </ul>
      
      <blockquote>
        <p>"A cicatrização adequada é tão importante quanto a própria sessão de tatuagem. Um bom cuidado nos primeiros dias garante uma tatuagem bonita por muitos anos."</p>
        <cite>— Ana Mendes, tatuadora profissional</cite>
      </blockquote>
      
      <h2>Semanas seguintes</h2>
      
      <p>Após a primeira semana, a tatuagem entrará em uma fase de descamação mais leve e depois estabilizará. Neste período:</p>
      
      <ul>
        <li>Continue mantendo a área hidratada</li>
        <li>Comece a usar protetor solar (fator 30 ou superior) quando expor a área</li>
        <li>Evite roupas muito justas que possam friccionar contra a tatuagem</li>
      </ul>
      
      <h2>Cuidados de longo prazo</h2>
      
      <p>Para manter sua tatuagem vibrante por anos, adote estes cuidados permanentes:</p>
      
      <ul>
        <li>Use sempre protetor solar na área tatuada quando exposta ao sol</li>
        <li>Mantenha a pele hidratada regularmente</li>
        <li>Evite exposição prolongada ao sol, que pode desbotar os pigmentos</li>
      </ul>
      
      <p>Lembre-se que cada organismo reage de forma diferente, e alguns podem precisar de cuidados específicos. Em caso de vermelhidão excessiva, inchaço, secreções ou qualquer sinal de infecção, consulte imediatamente um médico.</p>
    `,
    excerpt: "Aprenda os cuidados essenciais para garantir a melhor cicatrização da sua nova tatuagem.",
    cover_image: "https://images.unsplash.com/photo-1565058398932-9a36a1a3c2b9?q=80&w=2148&auto=format&fit=crop",
    published_at: "2024-05-05T10:15:00Z",
    reading_time: 5,
    view_count: 521,
    tags: ["Cuidados", "Cicatrização", "Iniciantes"],
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
    content: `
      <p>O mundo da tatuagem está sempre em evolução. Em 2024, vemos o ressurgimento de estilos vintage misturados com tecnologias modernas e uma crescente conscientização ambiental influenciando as escolhas de desenhos e técnicas.</p>
      
      <h2>Minimalismo Sofisticado</h2>
      
      <p>O minimalismo continua forte, mas com uma nova sofisticação. Linhas finas e precisas são usadas para criar desenhos complexos que, à primeira vista, parecem simples. Estes designs frequentemente incorporam:</p>
      
      <ul>
        <li>Detalhes microscópicos que só são percebidos em uma observação mais próxima</li>
        <li>Composições geométricas com significados pessoais</li>
        <li>Uso estratégico de espaço negativo</li>
      </ul>
      
      <h2>Neo-Tradicional Contemporâneo</h2>
      
      <p>O estilo neo-tradicional está sendo reinventado com uma abordagem contemporânea, misturando elementos clássicos com técnicas modernas:</p>
      
      <ul>
        <li>Paletas de cores mais amplas e menos convencionais</li>
        <li>Temas tradicionais reinterpretados com perspectivas atuais</li>
        <li>Combinação de contornos bold com sombreamento suave</li>
      </ul>
      
      <h2>Tatuagens Biodinâmicas</h2>
      
      <p>As tatuagens biodinâmicas, que seguem o fluxo natural dos músculos e contornos do corpo, estão ganhando popularidade:</p>
      
      <ul>
        <li>Designs que parecem fluir com o movimento corporal</li>
        <li>Trabalhos que amplificam a anatomia natural em vez de apenas se posicionar sobre ela</li>
        <li>Combinação de estilos como biomecânica e ornamental</li>
      </ul>
      
      <h2>Tatuagens Expandidas por AR</h2>
      
      <p>Uma das inovações mais interessantes de 2024 é a integração de realidade aumentada com tatuagens:</p>
      
      <ul>
        <li>Tatuagens que funcionam como códigos QR para experiências de AR personalizadas</li>
        <li>Designs que ganham movimento e dimensões extras quando vistos através de apps específicos</li>
        <li>Possibilidade de atualizar o conteúdo digital associado à tatuagem ao longo do tempo</li>
      </ul>
      
      <blockquote>
        <p>"As tatuagens de 2024 são multidimensionais - não apenas visualmente, mas também em termos de significado e interatividade. Estamos vendo o início de uma nova era onde a arte corporal transcende as limitações físicas."</p>
        <cite>— Marcos Veiga, especialista em tendências de tatuagem</cite>
      </blockquote>
      
      <h2>Pigmentos Sustentáveis</h2>
      
      <p>A crescente consciência ambiental está impulsionando a popularidade de tintas orgânicas e veganas:</p>
      
      <ul>
        <li>Pigmentos derivados de plantas</li>
        <li>Formulações livres de químicos tóxicos</li>
        <li>Cores que envelhecem de forma mais natural e suave</li>
      </ul>
      
      <p>Estas tendências refletem não apenas evoluções estéticas, mas também mudanças culturais mais amplas em nossa relação com a expressão corporal e a tecnologia. À medida que avançamos, podemos esperar ainda mais inovações que continuarão a expandir as fronteiras desta antiga forma de arte.</p>
    `,
    excerpt: "Descubra as principais tendências de tatuagem que estão bombando em 2024.",
    cover_image: "https://images.unsplash.com/photo-1590246815107-56d48602592f?q=80&w=2148&auto=format&fit=crop",
    published_at: "2024-05-10T16:45:00Z",
    reading_time: 6,
    view_count: 278,
    tags: ["Tendências", "2024", "Estilos"],
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
  },
  {
    id: "4",
    title: "Os Diferentes Estilos de Tatuagem Explicados",
    slug: "estilos-tatuagem-explicados",
    content: "<p>Conheça os diferentes estilos de tatuagem, desde o tradicional americano até o watercolor...</p>",
    excerpt: "Um guia completo sobre os diferentes estilos de tatuagem para ajudar você a escolher o melhor para seu próximo trabalho.",
    cover_image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=2148&auto=format&fit=crop",
    published_at: "2024-04-22T09:15:00Z",
    reading_time: 10,
    view_count: 410,
    tags: ["Estilos", "Guia", "Técnicas"],
    profiles: {
      id: "4",
      first_name: "Carolina",
      last_name: "Santos",
      avatar_url: null
    },
    blog_categories: {
      id: "4",
      name: "Estilos",
      description: "Diferentes estilos artísticos de tatuagem"
    }
  },
  {
    id: "5",
    title: "Como Escolher o Melhor Tatuador para o Seu Projeto",
    slug: "escolher-melhor-tatuador",
    content: "<p>Dicas importantes para encontrar um profissional qualificado que entenda sua visão...</p>",
    excerpt: "Saiba como pesquisar, avaliar e escolher o tatuador ideal para transformar sua ideia em arte na pele.",
    cover_image: "https://images.unsplash.com/photo-1632397294790-78d4f9abc0ad?q=80&w=2148&auto=format&fit=crop",
    published_at: "2024-04-15T14:20:00Z",
    reading_time: 7,
    view_count: 325,
    tags: ["Escolha", "Tatuadores", "Dicas"],
    profiles: {
      id: "1",
      first_name: "João",
      last_name: "Silva",
      avatar_url: null
    },
    blog_categories: {
      id: "5",
      name: "Artistas",
      description: "Perfis de artistas renomados"
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

// Mock tags list extracted from all posts
const generateTagsList = (): string[] => {
  const allTags = new Set<string>();
  mockBlogPosts.forEach(post => {
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach(tag => allTags.add(tag));
    }
  });
  return Array.from(allTags);
};

// Mock BlogService implementation
export class MockBlogService implements IBlogService {
  async fetchBlogPosts(params: BlogQueryParams = {}): Promise<BlogPaginatedResponse> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockBlogService: fetchBlogPosts called with params:", params);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch blog posts");
    }
    
    // Get all posts and apply filters
    let filteredPosts = [...mockBlogPosts];
    
    // Filter by category if specified
    if (params.category && params.category !== 'Todos') {
      filteredPosts = filteredPosts.filter(post => {
        if (!post.blog_categories) return false;
        
        if (Array.isArray(post.blog_categories)) {
          return post.blog_categories.some(cat => cat.name === params.category);
        }
        
        return post.blog_categories.name === params.category;
      });
    }
    
    // Filter by tag if specified
    if (params.tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags?.includes(params.tag as string) ?? false
      );
    }
    
    // Apply search if specified
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        false
      );
    }
    
    // Apply sorting
    if (params.sort) {
      switch(params.sort) {
        case 'latest':
          filteredPosts.sort((a, b) => 
            new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime()
          );
          break;
        case 'oldest':
          filteredPosts.sort((a, b) => 
            new Date(a.published_at || '').getTime() - new Date(b.published_at || '').getTime()
          );
          break;
        case 'popular':
          filteredPosts.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
          break;
      }
    } else {
      // Default sort by latest
      filteredPosts.sort((a, b) => 
        new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime()
      );
    }
    
    // Calculate pagination
    const totalPosts = filteredPosts.length;
    const limit = params.limit || 10;
    const totalPages = Math.ceil(totalPosts / limit);
    const currentPage = params.page || 1;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Get current page posts
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex).map(post => ({
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
      posts: paginatedPosts,
      totalPosts,
      totalPages,
      currentPage
    };
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
  
  async fetchRelatedPosts(postId: string, limit: number = 3): Promise<BlogPostSummary[]> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockBlogService: fetchRelatedPosts called with postId:", postId, "limit:", limit);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch related posts");
    }
    
    // Find the current post
    const currentPost = mockBlogPosts.find(p => p.id === postId || p.slug === postId);
    if (!currentPost) {
      return [];
    }
    
    // Get the category of the current post
    let currentCategory = null;
    if (currentPost.blog_categories) {
      if (Array.isArray(currentPost.blog_categories) && currentPost.blog_categories.length > 0) {
        currentCategory = currentPost.blog_categories[0].name;
      } else if (!Array.isArray(currentPost.blog_categories)) {
        currentCategory = currentPost.blog_categories.name;
      }
    }
    
    // Find related posts by category or tags
    let relatedPosts = mockBlogPosts.filter(post => {
      // Don't include the current post
      if (post.id === currentPost.id) {
        return false;
      }
      
      // Check if there's a category match
      let categoryMatch = false;
      if (currentCategory && post.blog_categories) {
        if (Array.isArray(post.blog_categories)) {
          categoryMatch = post.blog_categories.some(cat => cat.name === currentCategory);
        } else {
          categoryMatch = post.blog_categories.name === currentCategory;
        }
      }
      
      // Check if there are matching tags
      let tagMatch = false;
      if (currentPost.tags && currentPost.tags.length > 0 && post.tags && post.tags.length > 0) {
        tagMatch = post.tags.some(tag => currentPost.tags?.includes(tag));
      }
      
      return categoryMatch || tagMatch;
    });
    
    // If we don't have enough related posts, add more recent posts
    if (relatedPosts.length < limit) {
      const otherPosts = mockBlogPosts
        .filter(post => post.id !== currentPost.id && !relatedPosts.includes(post))
        .sort((a, b) => 
          new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime()
        )
        .slice(0, limit - relatedPosts.length);
      
      relatedPosts = [...relatedPosts, ...otherPosts];
    }
    
    // Get only the first 'limit' posts and format them
    return relatedPosts.slice(0, limit).map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      cover_image: post.cover_image,
      published_at: post.published_at,
      slug: post.slug,
      profiles: post.profiles,
      blog_categories: post.blog_categories
    }));
  }
  
  async fetchTagsList(): Promise<string[]> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockBlogService: fetchTagsList called");
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch tags list");
    }
    
    return generateTagsList();
  }
  
  async searchBlogPosts(query: string): Promise<BlogPostSummary[]> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockBlogService: searchBlogPosts called with query:", query);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to search blog posts");
    }
    
    if (!query || query.trim() === '') {
      return [];
    }
    
    const queryLower = query.toLowerCase();
    const matchedPosts = mockBlogPosts
      .filter(post => 
        post.title.toLowerCase().includes(queryLower) ||
        post.excerpt?.toLowerCase().includes(queryLower) ||
        post.content.toLowerCase().includes(queryLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(queryLower)) ||
        false
      )
      .map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        cover_image: post.cover_image,
        published_at: post.published_at,
        slug: post.slug,
        profiles: post.profiles,
        blog_categories: post.blog_categories
      }));
    
    return matchedPosts;
  }
}

// Export a singleton instance of the service
export const mockBlogService = new MockBlogService();
