
import { useParams, Navigate } from "react-router-dom";
import { useBlogPost } from "@/hooks/useBlogPost";
import Layout from "@/components/layout/Layout";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, isLoading, error } = useBlogPost(slug || "");

  useEffect(() => {
    // Set page title when post is loaded
    if (post?.title) {
      document.title = `${post.title} | 99Tattoo Blog`;
    }
    return () => {
      document.title = "99Tattoo";
    };
  }, [post]);

  // Safety check - if no slug is provided, redirect to blog listing
  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Sem data";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAuthorName = (post: any) => {
    if (!post?.profiles) return "Equipe 99Tattoo";
    
    if (Array.isArray(post.profiles)) {
      if (post.profiles.length > 0) {
        const profile = post.profiles[0];
        if (!profile) return "Equipe 99Tattoo";
        return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Equipe 99Tattoo';
      }
      return 'Equipe 99Tattoo';
    } 
    
    const profiles = post.profiles;
    return `${profiles.first_name || ''} ${profiles.last_name || ''}`.trim() || 'Equipe 99Tattoo';
  };

  const getCategoryName = (post: any) => {
    if (!post?.blog_categories) return "Sem categoria";
    
    if (Array.isArray(post.blog_categories)) {
      if (post.blog_categories.length > 0) {
        const category = post.blog_categories[0];
        if (!category) return "Sem categoria";
        return category.name || "Sem categoria";
      }
      return "Sem categoria";
    } 
    
    const category = post.blog_categories;
    return category.name || "Sem categoria";
  };

  return (
    <Layout>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-red-500 mb-4" />
          <p className="text-lg text-gray-600">Carregando artigo...</p>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Erro ao carregar o artigo</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <Button asChild>
            <a href="/blog">Voltar para o Blog</a>
          </Button>
        </div>
      ) : !post ? (
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Artigo não encontrado</h2>
          <p className="text-gray-600 mb-6">
            O artigo que você está procurando não existe ou foi removido.
          </p>
          <Button asChild>
            <a href="/blog">Voltar para o Blog</a>
          </Button>
        </div>
      ) : (
        <>
          {/* Cover Image */}
          <div className="w-full h-[40vh] relative">
            <img
              src={post.cover_image || "https://images.unsplash.com/photo-1562864758-143c0cc8b5a4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>

          <article className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <header className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span className="bg-red-100 text-red-500 px-2 py-1 rounded">
                    {getCategoryName(post)}
                  </span>
                  <span>•</span>
                  <time dateTime={post.published_at || ""}>
                    {formatDate(post.published_at)}
                  </time>
                  {post.reading_time && (
                    <>
                      <span>•</span>
                      <span>{post.reading_time} min de leitura</span>
                    </>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Por {getAuthorName(post)}</p>
                  </div>
                </div>
              </header>

              {/* Content */}
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-bold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Back link */}
              <div className="mt-12 border-t pt-6">
                <Button asChild variant="outline">
                  <a href="/blog">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Voltar para o Blog
                  </a>
                </Button>
              </div>
            </div>
          </article>
        </>
      )}
    </Layout>
  );
};

export default BlogPost;
