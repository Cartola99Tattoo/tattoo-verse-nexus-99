
import { useState, useEffect } from "react";
import { useBlogPosts } from "@/hooks/useBlog";
import BlogSearch from "./BlogSearch";
import BlogGrid from "./BlogGrid";
import BlogPagination from "./BlogPagination";
import BlogEmptyState from "./BlogEmptyState";
import BlogLoadingState from "./BlogLoadingState";
import BlogErrorState from "./BlogErrorState";

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

  // Adicionar uma propriedade staleTime maior para reduzir consultas
  const { posts, isLoading, totalCount, error, refetch } = useBlogPosts({
    category_id: categoryId,
    tags: tag ? [tag] : undefined,
    search: searchQuery,
    limit: limit,
    page,
    published_only: true,
    staleTime: 300000 // Cache por 5 minutos
  });

  const totalPages = Math.max(Math.ceil((totalCount || 0) / limit), 1);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearch(query);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchQuery("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para lidar com erros e tentar novamente
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
  };

  useEffect(() => {
    // Recarregar automaticamente uma vez se a página é carregada sem dados
    if (!isLoading && posts.length === 0 && retryCount === 0 && !error && totalCount > 0) {
      const timer = setTimeout(() => {
        handleRetry();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, posts.length, retryCount, error, totalCount]);

  console.log("BlogList render:", { 
    postsLength: posts?.length, 
    totalCount,
    isLoading, 
    error, 
    categoryId, 
    tag,
    postsData: posts,
    retryCount
  });

  return (
    <div className="space-y-6">
      {/* Search Component */}
      {showSearch && (
        <BlogSearch 
          value={search}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
      )}

      {/* Error State */}
      {error ? (
        <BlogErrorState onRetry={handleRetry} />
      ) : isLoading ? (
        /* Loading State */
        <BlogLoadingState count={limit} />
      ) : (
        <>
          {/* Posts Grid or Empty State */}
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

      {/* Pagination Component */}
      {totalPages > 1 && posts && posts.length > 0 && (
        <BlogPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default BlogList;
