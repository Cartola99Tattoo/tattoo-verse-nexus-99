
import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Layout from "@/components/layout/Layout";
import { useBlogPost } from "@/hooks/useBlog";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogComments from "@/components/blog/BlogComments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Eye } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: post, isLoading, error } = useBlogPost(slug || "");
  
  useEffect(() => {
    // Rolar para o topo quando a página carregar
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-2/3 space-y-8">
              <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Voltar
              </Button>
              
              <Skeleton className="h-8 w-3/4" />
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-40" />
              </div>
              
              <Skeleton className="h-[400px] w-full" />
              
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Artigo não encontrado</h2>
            <p className="text-gray-600 mb-8">
              O artigo que você está procurando não existe ou foi removido.
            </p>
            <Button asChild>
              <Link to="/blog">Voltar para o Blog</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Formatar a data de publicação
  const formattedDate = post.published_at 
    ? format(new Date(post.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR })
    : "";
  
  // Nome completo do autor
  const authorName = post.author 
    ? `${post.author.first_name || ""} ${post.author.last_name || ""}`.trim() 
    : "Admin";

  return (
    <Layout>
      <Helmet>
        <title>{post.title} | 99Tattoo Blog</title>
        <meta name="description" content={post.meta_description || post.excerpt || post.content.substring(0, 160)} />
        {post.meta_keywords && <meta name="keywords" content={post.meta_keywords} />}
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3">
            {/* Navegação de volta */}
            <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6">
              <ArrowLeft size={16} />
              Voltar para o blog
            </Button>
            
            {/* Categoria */}
            {post.category && (
              <Link to={`/blog/categoria/${post.category.id}`}>
                <Badge className="mb-4">
                  {post.category.name}
                </Badge>
              </Link>
            )}
            
            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            
            {/* Metadados do post */}
            <div className="flex items-center gap-6 mb-6 flex-wrap">
              {/* Autor */}
              {post.author && (
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={post.author.avatar_url} />
                    <AvatarFallback>{post.author.first_name?.[0] || 'A'}</AvatarFallback>
                  </Avatar>
                  <span className="text-gray-700">{authorName}</span>
                </div>
              )}
              
              {/* Data */}
              {post.published_at && (
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <Calendar size={16} />
                  <span>{formattedDate}</span>
                </div>
              )}
              
              {/* Tempo de leitura */}
              {post.reading_time && (
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <Clock size={16} />
                  <span>{post.reading_time} min de leitura</span>
                </div>
              )}
              
              {/* Visualizações */}
              {post.view_count !== undefined && (
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <Eye size={16} />
                  <span>{post.view_count} visualizações</span>
                </div>
              )}
            </div>
            
            {/* Imagem de capa */}
            {post.cover_image && (
              <div className="mb-8">
                <img 
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
            )}
            
            {/* Conteúdo */}
            <div 
              className="prose max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-red-500"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link to={`/blog/tag/${encodeURIComponent(tag)}`} key={tag}>
                      <Badge variant="outline" className="hover:bg-red-50 transition-colors">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Seção de compartilhamento */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold mb-3">Compartilhe:</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`,
                      "_blank"
                    );
                  }}
                >
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sky-500 hover:bg-sky-50"
                  onClick={() => {
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        window.location.href
                      )}&text=${encodeURIComponent(post.title)}`,
                      "_blank"
                    );
                  }}
                >
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:bg-green-50"
                  onClick={() => {
                    window.open(
                      `https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `${post.title} ${window.location.href}`
                      )}`,
                      "_blank"
                    );
                  }}
                >
                  WhatsApp
                </Button>
              </div>
            </div>
            
            {/* Comentários */}
            <BlogComments postId={post.id} />
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3 mt-10 lg:mt-0">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
