
import { useState } from "react";
import { useBlogPosts } from "@/hooks/useBlog";
import BlogCard from "./BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface BlogListProps {
  categoryId?: string;
  tag?: string;
  limit?: number;
  showSearch?: boolean;
}

const BlogList = ({ categoryId, tag, limit, showSearch = true }: BlogListProps) => {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { posts, isLoading, totalCount, error } = useBlogPosts({
    category_id: categoryId,
    tags: tag ? [tag] : undefined,
    search: searchQuery,
    limit: limit || 6,
    page,
  });

  const totalPages = Math.max(Math.ceil((totalCount || 0) / (limit || 6)), 1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchQuery("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {showSearch && (
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Buscar no blog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Buscar</Button>
        </form>
      )}

      {error ? (
        <div className="text-center py-6">
          <p className="text-red-500">
            Ocorreu um erro ao carregar os artigos. Por favor, tente novamente mais tarde.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(limit || 6).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-20 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-700">
                Nenhum artigo encontrado
              </h3>
              {searchQuery && (
                <p className="mt-2 text-gray-500">
                  Não encontramos resultados para "{searchQuery}"
                </p>
              )}
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleClearSearch}
              >
                Ver todos os artigos
              </Button>
            </div>
          )}
        </>
      )}

      {/* Paginação */}
      {totalPages > 1 && posts && posts.length > 0 && (
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            size="sm"
          >
            Anterior
          </Button>
          
          <div className="flex items-center gap-1 flex-wrap justify-center">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
              let pageNumber;
              
              // Lógica para mostrar páginas relevantes quando houver muitas
              if (totalPages <= 5) {
                // Se tiver 5 ou menos páginas, mostra todas
                pageNumber = index + 1;
              } else {
                // Se estiver nas primeiras páginas
                if (page <= 3) {
                  if (index < 4) {
                    pageNumber = index + 1;
                  } else {
                    pageNumber = totalPages;
                  }
                } 
                // Se estiver nas últimas páginas
                else if (page > totalPages - 3) {
                  if (index === 0) {
                    pageNumber = 1;
                  } else {
                    pageNumber = totalPages - (4 - index);
                  }
                }
                // Se estiver no meio
                else {
                  if (index === 0) {
                    pageNumber = 1;
                  } else if (index === 4) {
                    pageNumber = totalPages;
                  } else {
                    pageNumber = page + (index - 2);
                  }
                }
              }
              
              return (
                <Button
                  key={pageNumber}
                  variant={page === pageNumber ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            size="sm"
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
