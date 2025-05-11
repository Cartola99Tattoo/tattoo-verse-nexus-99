
import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { useBlogPost, useBlogComments } from "@/hooks/useBlog";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogComments from "@/components/blog/BlogComments";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useBlogPost(slug || '');
  const { data: comments, isLoading: commentsLoading } = useBlogComments(post?.id || '');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-2/3">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-64 w-full rounded-lg mb-6" />
              <div className="flex items-center mb-4">
                <Skeleton className="h-4 w-40 mr-4" />
                <Skeleton className="h-4 w-40" />
              </div>
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full mb-2" />
              ))}
              <Skeleton className="h-32 w-full mt-8 mb-4" />
            </div>
            <div className="lg:w-1/3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="mb-8">
                  <Skeleton className="h-8 w-1/2 mb-4" />
                  <Skeleton className="h-24 w-full mb-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Post não encontrado</h1>
          <p className="text-gray-600 mb-6">O artigo que você está procurando não existe ou foi removido.</p>
          <Button onClick={() => navigate('/blog')}>Voltar para o Blog</Button>
        </div>
      </Layout>
    );
  }
  
  // Formatação da data
  const formattedDate = post.published_at 
    ? format(new Date(post.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR })
    : format(new Date(post.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR });

  // Nome do autor completo ou parcial
  const authorName = post.author 
    ? `${post.author.first_name || ""} ${post.author.last_name || ""}`.trim() || "Equipe 99Tattoo"
    : "Equipe 99Tattoo";

  return (
    <Layout>
      <Helmet>
        <title>{post.title} | 99Tattoo</title>
        <meta name="description" content={post.meta_description || post.excerpt || ''} />
        <meta name="keywords" content={post.meta_keywords || ''} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          {/* Conteúdo do Blog Post */}
          <div className="lg:w-2/3">
            {/* Título do Post */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            {/* Imagem de Capa */}
            {post.cover_image && (
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full rounded-lg mb-6 object-cover h-64 md:h-80"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }} 
              />
            )}
            
            {/* Meta Informações */}
            <div className="flex flex-col sm:flex-row sm:items-center text-gray-500 mb-6 text-sm">
              <span className="mb-1 sm:mb-0 sm:mr-2">
                Publicado em: {formattedDate}
              </span>
              <span className="hidden sm:inline sm:mr-2">|</span>
              <span className="mb-1 sm:mb-0 sm:mr-2">
                Autor: {authorName}
              </span>
              {post.category && (
                <>
                  <span className="hidden sm:inline sm:mr-2">|</span>
                  <span>
                    Categoria: {post.category.name || "Sem categoria"}
                  </span>
                </>
              )}
            </div>
            
            {/* Conteúdo do Post */}
            <div 
              className="blog-content prose prose-lg max-w-none" 
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Link 
                      to={`/blog/tag/${encodeURIComponent(tag)}`} 
                      key={index} 
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full px-3 py-1 text-sm font-medium"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Seção de Comentários */}
            <section className="mt-12">
              <h3 className="text-2xl font-semibold mb-4">Comentários</h3>
              
              {/* Lista de Comentários */}
              <BlogComments 
                postId={post.id}
              />
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
