
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBlogPosts } from "@/services/supabaseService";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { BlogPostSummary } from "@/components/blog/BlogCard";

const BlogPreview = () => {
  const { data: posts = [], loading: isLoading } = useSupabaseQuery<BlogPostSummary[]>(
    () => fetchBlogPosts(3).then(posts => 
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
    []
  );

  // Função para formatar a data
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  // Função para formatar o nome do autor
  const getAuthorName = (post: BlogPostSummary) => {
    if (!post.profiles) return "Equipe 99Tattoo";
    
    if (Array.isArray(post.profiles)) {
      if (post.profiles.length > 0) {
        const firstName = post.profiles[0]?.first_name || '';
        const lastName = post.profiles[0]?.last_name || '';
        return `${firstName} ${lastName}`.trim() || "Equipe 99Tattoo";
      }
      return "Equipe 99Tattoo";
    }
    
    const firstName = post.profiles?.first_name || '';
    const lastName = post.profiles?.last_name || '';
    return `${firstName} ${lastName}`.trim() || "Equipe 99Tattoo";
  };

  // Função para obter o nome da categoria
  const getCategoryName = (post: BlogPostSummary) => {
    if (!post.blog_categories) return "Geral";
    
    if (Array.isArray(post.blog_categories)) {
      if (post.blog_categories.length > 0) {
        return post.blog_categories[0]?.name || "Geral";
      }
      return "Geral";
    }
    
    return post.blog_categories?.name || "Geral";
  };

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
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Link to={`/blog/${post.slug || post.id}`} className="block h-48 overflow-hidden">
                  <img
                    src={post.cover_image || "https://images.unsplash.com/photo-1594067598377-478c61d59f3f?q=80&w=2148&auto=format&fit=crop"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </Link>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-red-100 text-red-500 text-xs font-medium px-2 py-1 rounded">
                      {getCategoryName(post)}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(post.published_at)}</span>
                  </div>
                  <Link to={`/blog/${post.slug || post.id}`}>
                    <h3 className="text-xl font-bold mb-2 hover:text-red-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Por {getAuthorName(post)}</span>
                    <Link
                      to={`/blog/${post.slug || post.id}`}
                      className="text-red-500 hover:text-red-700 transition-colors text-sm flex items-center"
                    >
                      Ler mais
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
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
