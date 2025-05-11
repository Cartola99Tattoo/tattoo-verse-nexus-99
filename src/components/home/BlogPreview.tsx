
import { Link } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlog";
import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPreview = () => {
  const { posts, isLoading, error } = useBlogPosts({ limit: 3 });

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Nosso Blog</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Fique por dentro das últimas novidades, dicas e informações sobre o mundo das tatuagens.
          </p>
        </div>

        {error ? (
          <div className="text-center py-6">
            <p className="text-red-500">
              Ocorreu um erro ao carregar os artigos. Por favor, tente novamente mais tarde.
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600">Ainda não há posts publicados.</p>
              </div>
            )}
          </>
        )}

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link to="/blog">Ver todos os artigos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
