
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPostSummary } from "@/components/blog/BlogCard";
import BlogCard from "@/components/blog/BlogCard";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getBlogService } from "@/services/serviceFactory";

const BlogPreview = () => {
  const blogService = getBlogService();
  
  const { data, loading: isLoading, error } = useDataQuery(
    async () => {
      const response = await blogService.fetchBlogPosts({ limit: 3, sort: 'latest' });
      return response;
    },
    []
  );
  
  const posts = data?.posts || [];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            Últimas do <span className="text-red-500">Blog</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Artigos, dicas e novidades do mundo das tatuagens.
            Fique por dentro das tendências e aprenda a cuidar melhor da sua arte.
          </p>
        </div>

        {isLoading ? (
          // Estado de carregamento com skeletons
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Erro ao carregar artigos. Tente novamente mais tarde.</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum artigo disponível no momento.</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Button asChild className="bg-black hover:bg-gray-800 text-white">
            <Link to="/blog">Ver Todos os Artigos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
