
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import BlogCard from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Filter } from "lucide-react";
import { getBlogService } from "@/services/serviceFactory";
import { useDataQuery } from "@/hooks/useDataQuery";
import { BlogQueryParams } from "@/services/interfaces/IBlogService";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ITEMS_PER_PAGE = 9;
const sortOptions = [
  { value: 'latest', label: 'Mais recentes' },
  { value: 'oldest', label: 'Mais antigos' },
  { value: 'popular', label: 'Mais populares' }
];

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial values from URL parameters
  const initialCategory = searchParams.get('category') || "Todos";
  const initialPage = parseInt(searchParams.get('page') || '1');
  const initialTag = searchParams.get('tag') || "";
  const initialSort = searchParams.get('sort') as "latest" | "oldest" | "popular" || "latest";
  const initialSearch = searchParams.get('search') || "";
  
  // State for filters and search
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [activeTag, setActiveTag] = useState(initialTag);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [sortMethod, setSortMethod] = useState<'latest' | 'oldest' | 'popular'>(initialSort);
  
  // Get blog service
  const blogService = getBlogService();
  
  // Build query parameters for fetching blog posts
  const buildQueryParams = (): BlogQueryParams => {
    return {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      category: activeCategory !== "Todos" ? activeCategory : undefined,
      tag: activeTag || undefined,
      search: searchQuery || undefined,
      sort: sortMethod
    };
  };
  
  // Fetch blog posts with filters
  const { 
    data: blogData, 
    loading: isLoadingPosts, 
    error: postsError,
    refresh: refreshPosts
  } = useDataQuery(
    () => blogService.fetchBlogPosts(buildQueryParams()),
    [activeCategory, currentPage, activeTag, searchQuery, sortMethod]
  );
  
  // Fetch categories
  const { 
    data: categoriesData = [], 
    loading: isLoadingCategories 
  } = useDataQuery(
    () => blogService.fetchBlogCategories(),
    []
  );
  
  // Fetch tags for filters
  const {
    data: tagsData = [],
    loading: isLoadingTags
  } = useDataQuery(
    () => blogService.fetchTagsList(),
    []
  );
  
  // Transform categories data
  const categories = ["Todos", ...(categoriesData?.map(cat => cat.name || "") || [])].filter(Boolean);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (activeCategory !== "Todos") {
      params.set('category', activeCategory);
    }
    
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    if (activeTag) {
      params.set('tag', activeTag);
    }
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    if (sortMethod !== 'latest') {
      params.set('sort', sortMethod);
    }
    
    setSearchParams(params);
  }, [activeCategory, currentPage, activeTag, searchQuery, sortMethod, setSearchParams]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeTag, searchQuery, sortMethod]);
  
  // Handle filter changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };
  
  const handleTagChange = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(''); // Toggle off if already selected
    } else {
      setActiveTag(tag);
    }
  };
  
  const handleSortChange = (sort: 'latest' | 'oldest' | 'popular') => {
    setSortMethod(sort);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setActiveCategory("Todos");
    setActiveTag("");
    setSearchQuery("");
    setSearchInput("");
    setSortMethod("latest");
    setCurrentPage(1);
  };
  
  // Calculate pagination
  const totalPosts = blogData?.totalPosts || 0;
  const totalPages = blogData?.totalPages || 1;
  const posts = blogData?.posts || [];
  
  // Generate pagination items
  const generatePaginationItems = () => {
    let items = [];
    const maxVisiblePages = 5;
    
    // Start and end page calculation
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add first page
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Add ellipsis if needed
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
    }
    
    // Add pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Blog | 99Tattoo</title>
        <meta name="description" content="Artigos, dicas e novidades sobre tatuagem no blog oficial da 99Tattoo." />
      </Helmet>
      
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
      <div className="bg-white py-8 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="md:w-1/3">
              <form onSubmit={handleSearch} className="flex">
                <Input
                  type="search"
                  placeholder="Buscar no blog..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full"
                  aria-label="Buscar artigos"
                />
                <Button type="submit" variant="outline" className="ml-2">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Buscar</span>
                </Button>
              </form>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Sort dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Ordenar: {sortOptions.find(opt => opt.value === sortMethod)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {sortOptions.map(option => (
                    <DropdownMenuItem 
                      key={option.value}
                      onClick={() => handleSortChange(option.value as 'latest' | 'oldest' | 'popular')}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Reset filters button */}
              {(activeCategory !== "Todos" || activeTag || searchQuery || sortMethod !== "latest") && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleResetFilters}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
          
          {/* Categories */}
          <div className="mt-4">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Categorias:</h2>
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
          
          {/* Tags */}
          {tagsData && tagsData.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-medium text-gray-700 mb-2">Tags:</h2>
              <div className="flex flex-wrap gap-2">
                {isLoadingTags ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-500">Carregando tags...</span>
                  </div>
                ) : (
                  tagsData.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagChange(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        activeTag === tag
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      aria-pressed={activeTag === tag}
                      aria-label={`Filtrar por tag ${tag}`}
                    >
                      {tag}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Filter status summary */}
          {(activeCategory !== "Todos" || activeTag || searchQuery) && (
            <div className="mt-4 text-sm text-gray-600">
              <p>
                Mostrando resultados para
                {activeCategory !== "Todos" && <span> categoria <strong>{activeCategory}</strong></span>}
                {activeTag && <span> tag <strong>{activeTag}</strong></span>}
                {searchQuery && <span> busca <strong>"{searchQuery}"</strong></span>}
              </p>
            </div>
          )}
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
            <Button onClick={() => refreshPosts()}>Tentar novamente</Button>
          </div>
        ) : posts.length > 0 ? (
          <>
            {/* Featured post only on first page with no filters */}
            {currentPage === 1 && activeCategory === "Todos" && !activeTag && !searchQuery && posts.length > 0 && (
              <div className="mb-12">
                <BlogCard post={posts[0]} variant="featured" />
              </div>
            )}

            {/* Blog grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts
                .slice(
                  currentPage === 1 && activeCategory === "Todos" && !activeTag && !searchQuery ? 1 : 0
                )
                .map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {/* Dynamic pagination items */}
                    {generatePaginationItems()}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Card className="max-w-lg mx-auto p-6">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Nenhum artigo encontrado</h3>
                <p className="text-gray-600 mb-4">
                  Não encontramos artigos que correspondam aos filtros aplicados.
                </p>
                <Button onClick={handleResetFilters}>
                  Ver todos os artigos
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {/* Newsletter signup section */}
      <div className="bg-red-50 py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Fique por dentro das novidades</h2>
          <p className="text-gray-600 mb-6">
            Inscreva-se na nossa newsletter e receba artigos e novidades diretamente no seu email.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Seu melhor email"
              className="flex-grow"
              required
            />
            <Button type="submit">Inscrever</Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;

