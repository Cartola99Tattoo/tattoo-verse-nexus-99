
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import BlogCard, { BlogPostSummary } from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getBlogService } from "@/services/serviceFactory";
import { useDataQuery } from "@/hooks/useDataQuery";

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || "Todos";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  const blogService = getBlogService();
  
  // Usar useDataQuery para buscar posts do blog
  const { data: posts = [], loading: isLoadingPosts, error: postsError } = useDataQuery<BlogPostSummary[]>(
    () => blogService.fetchBlogPosts().then(posts => 
      (posts || []).map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        cover_image: post.cover_image,
        published_at: post.published_at,
        slug: post.slug,
        profiles: post.profiles,
        blog_categories: post.blog_categories
      }))
    ),
    [activeCategory]
  );
  
  // Usar useDataQuery para buscar categorias
  const { data: categoriesData = [], loading: isLoadingCategories } = useDataQuery(
    () => blogService.fetchBlogCategories(),
    []
  );
  
  // Transformar os dados das categorias - garantir que categoriesData não seja null
  const categories = ["Todos", ...(categoriesData?.map(cat => cat.name || "") || [])].filter(Boolean);
  
  // Handle category change with URL params
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === "Todos") {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  // Função auxiliar para verificar se o nome do autor contém a consulta de pesquisa
  const checkAuthorName = (post: BlogPostSummary, query: string): boolean => {
    if (!post.profiles) return false;
    
    if (Array.isArray(post.profiles)) {
      return post.profiles.some(profile => {
        const firstName = profile?.first_name?.toLowerCase() || '';
        const lastName = profile?.last_name?.toLowerCase() || '';
        return firstName.includes(query) || lastName.includes(query);
      });
    } else {
      const firstName = post.profiles?.first_name?.toLowerCase() || '';
      const lastName = post.profiles?.last_name?.toLowerCase() || '';
      return firstName.includes(query) || lastName.includes(query);
    }
  };

  // Função para obter o nome da categoria para filtro
  const getCategoryName = (post: BlogPostSummary): string => {
    if (!post.blog_categories) return "";
    
    if (Array.isArray(post.blog_categories)) {
      if (post.blog_categories.length > 0) {
        return post.blog_categories[0]?.name || "";
      }
      return "";
    }
    
    return post.blog_categories?.name || "";
  };

  // Filtrar os posts com base na categoria e pesquisa
  const filteredPosts = posts ? posts.filter(post => {
    // Filtro por categoria
    const categoryMatch = activeCategory === "Todos" || 
      getCategoryName(post) === activeCategory;
    
    // Filtro por pesquisa
    const searchMatch = searchQuery === "" || 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      checkAuthorName(post, searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  }) : [];

  // Formatar os dados dos posts para o formato esperado pelo BlogCard
  const formattedPosts = filteredPosts;

  // Função para formatar o nome do autor com segurança
  const getAuthorName = (post: BlogPostSummary): string => {
    if (!post.profiles) return 'Equipe 99Tattoo';
    
    if (Array.isArray(post.profiles)) {
      if (post.profiles.length > 0) {
        const profile = post.profiles[0];
        return `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Equipe 99Tattoo';
      }
      return 'Equipe 99Tattoo';
    } else {
      return `${post.profiles?.first_name || ''} ${post.profiles?.last_name || ''}`.trim() || 'Equipe 99Tattoo';
    }
  };

  return (
    <Layout>
      {/* Blog header */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog da <span className="text-red-500">99Tattoo</span></h1>
          <p className="text-xl max-w-2xl mx-auto">
            Dicas, novidades e conteúdo sobre o mundo das tatuagens.
          </p>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="md:w-1/3">
              <Input
                type="search"
                placeholder="Buscar no blog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                aria-label="Buscar artigos"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {isLoadingCategories ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-gray-500">Carregando categorias...</span>
                </div>
              ) : (
                categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      activeCategory === category
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    aria-pressed={activeCategory === category}
                    aria-label={`Filtrar por ${category}`}
                  >
                    {category}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Blog content with loading state */}
      <div className="container mx-auto px-4 py-12">
        {isLoadingPosts ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-red-500 mb-4" />
            <p className="text-lg text-gray-600">Carregando artigos...</p>
          </div>
        ) : postsError ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold mb-2 text-red-500">Erro ao carregar artigos</h3>
            <p className="text-gray-600 mb-4">Ocorreu um erro ao carregar os artigos. Por favor, tente novamente.</p>
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          </div>
        ) : formattedPosts.length > 0 ? (
          <>
            {/* Featured post */}
            {activeCategory === "Todos" && searchQuery === "" && formattedPosts.length > 0 && (
              <div className="mb-12">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-12 lg:flex">
                  <div className="lg:w-1/2">
                    <img
                      src={formattedPosts[0].cover_image || "https://images.unsplash.com/photo-1594067598377-478c61d59f3f?q=80&w=2148&auto=format&fit=crop"}
                      alt={formattedPosts[0].title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                  <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                    <div className="flex items-center mb-4">
                      <span className="bg-red-100 text-red-500 text-xs font-medium px-2 py-1 rounded mr-2">
                        {getCategoryName(formattedPosts[0]) || "Sem categoria"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formattedPosts[0].published_at ? 
                          new Date(formattedPosts[0].published_at).toLocaleDateString('pt-BR') : 
                          "Sem data"}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{formattedPosts[0].title}</h2>
                    <p className="text-gray-600 mb-6">{formattedPosts[0].excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Por {getAuthorName(formattedPosts[0])}
                      </span>
                      <Button asChild variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                        <a href={`/blog/${formattedPosts[0].slug || formattedPosts[0].id}`}>Ler artigo</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blog grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {formattedPosts.slice(activeCategory === "Todos" && searchQuery === "" ? 1 : 0).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <nav className="inline-flex" aria-label="Paginação">
                <button 
                  className="px-4 py-2 text-gray-500 bg-gray-200 rounded-l-md hover:bg-gray-300"
                  aria-label="Página anterior"
                  disabled
                >
                  Anterior
                </button>
                <button className="px-4 py-2 text-white bg-red-500" aria-current="page">1</button>
                <button className="px-4 py-2 text-gray-500 bg-gray-200 hover:bg-gray-300" disabled>2</button>
                <button className="px-4 py-2 text-gray-500 bg-gray-200 hover:bg-gray-300" disabled>3</button>
                <button 
                  className="px-4 py-2 text-gray-500 bg-gray-200 rounded-r-md hover:bg-gray-300"
                  aria-label="Próxima página"
                  disabled
                >
                  Próxima
                </button>
              </nav>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold mb-2">Nenhum artigo encontrado</h3>
            <p className="text-gray-600 mb-4">Tente ajustar sua busca para encontrar mais conteúdo.</p>
            <Button onClick={() => {setSearchQuery(""); handleCategoryChange("Todos");}}>
              Ver todos os artigos
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blog;
