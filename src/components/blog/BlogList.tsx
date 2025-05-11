
import { useState, useEffect } from "react";
import { useBlogPosts } from "@/hooks/useBlog";
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

  // Configurações para o hook useBlogPosts com parâmetros aprimorados
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
    
    // Feedback visual para pesquisa
    if (query) {
      toast({
        title: "Buscando artigos",
        description: `Pesquisando por "${query}"...`,
      });
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchQuery("");
    setPage(1);
    
    // Feedback visual para limpeza da pesquisa
    toast({
      title: "Busca limpa",
      description: "Mostrando todos os artigos disponíveis.",
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top when changing page with smooth behavior
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função aprimorada para lidar com erros e tentar novamente
  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await refetch();
      toast({
        title: "Recarregando artigos",
        description: "Tentando carregar os artigos novamente...",
      });
    } catch (e) {
      console.error("Erro ao tentar recarregar:", e);
    } finally {
      setIsRetrying(false);
    }
  };

  // Efeito para monitorar mudanças nos parâmetros e registrar informações úteis para debugging
  useEffect(() => {
    // Debug logs mais detalhados
    console.log("BlogList render:", { 
      postsLength: posts?.length, 
      totalCount,
      isLoading, 
      error, 
      categoryId, 
      tag,
      searchQuery,
      page,
      retryCount
    });
    
    // Tentar recarregar automaticamente uma vez se a página é carregada sem dados
    // mas apenas se houver posts no banco de dados (totalCount > 0)
    if (!isLoading && posts.length === 0 && retryCount === 0 && !error && totalCount > 0) {
      console.log("Tentando recarregar dados automaticamente...");
      const timer = setTimeout(() => {
        handleRetry();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, posts, retryCount, error, totalCount, categoryId, tag, searchQuery, page]);

  // Renderização principal com tratamento de estados melhorado
  return (
    <div className="space-y-6">
      {/* Componente de busca */}
      {showSearch && (
        <BlogSearch 
          value={search}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
      )}

      {/* Componente de diagnóstico - visível apenas em desenvolvimento */}
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

      {/* Estado de erro */}
      {error ? (
        <BlogErrorState onRetry={handleRetry} />
      ) : isLoading ? (
        /* Estado de carregamento */
        <BlogLoadingState count={limit} />
      ) : (
        <>
          {/* Posts Grid ou Estado vazio */}
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

      {/* Componente de paginação */}
      {totalPages > 1 && posts && posts.length > 0 && (
        <BlogPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Feedback adicional para usuários */}
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
