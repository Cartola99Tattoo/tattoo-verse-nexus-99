
import { useState, useEffect } from "react";
import { useBlogPosts, BlogPostsOptions } from "@/hooks/useBlogPosts";
import BlogSearch from "./BlogSearch";
import BlogGrid from "./BlogGrid";
import BlogPagination from "./BlogPagination";
import BlogEmptyState from "./BlogEmptyState";
import BlogLoadingState from "./BlogLoadingState";
import BlogErrorState from "./BlogErrorState";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BlogListProps {
  categoryId?: string;
  tag?: string;
  limit?: number;
  showSearch?: boolean;
}

const BlogList = ({ categoryId, tag, limit = 6, showSearch = true }: BlogListProps) => {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Configure options for useBlogPosts
  const options: BlogPostsOptions = {
    category_id: categoryId,
    tags: tag ? [tag] : undefined,
    search: searchQuery,
    limit,
    page,
    published_only: true,
    staleTime: 180000 // 3 minutes cache
  };

  // Fetch blog posts
  const { posts, isLoading, totalCount, error, refetch } = useBlogPosts(options);

  const totalPages = Math.max(Math.ceil((totalCount || 0) / limit), 1);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearch(query);
    setPage(1);
    
    toast({
      title: "Buscando artigos",
      description: `Pesquisando por "${query}"...`,
    });
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchQuery("");
    setPage(1);
    
    toast({
      title: "Busca limpa",
      description: "Mostrando todos os artigos disponíveis.",
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Smooth scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle retry on error
  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      toast({
        title: "Recarregando artigos",
        description: "Tentando carregar os artigos novamente...",
      });
      await refetch();
    } catch (e) {
      console.error("[BlogList] Retry error:", e);
    } finally {
      setIsRetrying(false);
    }
  };

  // Log debug info and auto-retry
  useEffect(() => {
    console.log("[BlogList] Debug info:", { 
      postsLength: posts?.length, 
      totalCount,
      isLoading, 
      hasError: !!error, 
      categoryId, 
      tag,
      searchQuery,
      page,
      retryCount
    });

    // Log sample post data if available
    if (posts && posts.length > 0) {
      console.log("[BlogList] First post sample:", {
        id: posts[0].id,
        title: posts[0].title,
        hasAuthor: !!posts[0].author,
        authorName: posts[0].author 
          ? `${posts[0].author.first_name || ''} ${posts[0].author.last_name || ''}`.trim() || 'Unnamed' 
          : 'No author',
        hasCategory: !!posts[0].category,
        categoryName: posts[0].category?.name || 'No category'
      });
    }
    
    // Auto-retry once if no data but totalCount > 0
    if (!isLoading && posts?.length === 0 && retryCount === 0 && !error && totalCount > 0) {
      console.log("[BlogList] Auto-retrying fetch...");
      const timer = setTimeout(() => {
        handleRetry();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, posts, retryCount, error, totalCount, categoryId, tag, searchQuery, page]);

  return (
    <div className="space-y-6">
      {/* Search component */}
      {showSearch && (
        <BlogSearch 
          value={search}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
      )}

      {/* Diagnostic info - development only */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <h4 className="font-medium text-yellow-800 mb-1">Diagnóstico</h4>
          <ul className="text-xs space-y-1 text-yellow-700">
            <li>Posts carregados: {posts?.length || 0}</li>
            <li>Total no banco: {totalCount || 0}</li>
            <li>Estado: {isLoading ? "Carregando" : error ? "Erro" : "Pronto"}</li>
            <li>Página: {page}/{totalPages}</li>
            <li>Categoria: {categoryId || "Todas"}</li>
            <li>Tag: {tag || "Todas"}</li>
            <li>Busca: {searchQuery || "Nenhuma"}</li>
            <li>Tentativas: {retryCount}</li>
          </ul>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 h-7 text-xs"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? "Recarregando..." : "Recarregar dados"}
          </Button>
        </div>
      )}

      {/* Content states */}
      {error ? (
        <BlogErrorState onRetry={handleRetry} />
      ) : isLoading ? (
        <BlogLoadingState count={limit} />
      ) : (
        <>
          {posts && posts.length > 0 ? (
            <BlogGrid posts={posts} />
          ) : (
            <BlogEmptyState 
              searchQuery={searchQuery} 
              onClearSearch={handleClearSearch} 
            />
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && posts && posts.length > 0 && (
        <BlogPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Additional feedback */}
      {!isLoading && !error && posts?.length === 0 && totalCount > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-3">
            Parece que estamos com dificuldade para exibir os artigos.
          </p>
          <Button 
            onClick={handleRetry} 
            variant="outline"
            disabled={isRetrying}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isRetrying ? "animate-spin" : ""} />
            {isRetrying ? "Tentando..." : "Tentar novamente"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
