
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { useBlogPost, useBlogComments } from "@/hooks/useBlog";
import { BlogComment } from "@/types";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogComments from "@/components/blog/BlogComments";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { slug } = useParams();
  const { data: post, isLoading, error } = useBlogPost(slug || '');
  const { data: comments, isLoading: commentsLoading } = useBlogComments(post?.id || '');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  if (isLoading) {
    return <Layout>Carregando...</Layout>;
  }
  
  if (error) {
    return <Layout>Erro: {error.message}</Layout>;
  }
  
  if (!post) {
    return <Layout>Post não encontrado</Layout>;
  }
  
  return (
    <Layout>
      <Helmet>
        <title>{post.title} | 99Tattoo</title>
        <meta name="description" content={post.meta_description || post.excerpt || ''} />
        <meta name="keywords" content={post.meta_keywords || ''} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Conteúdo do Blog Post */}
          <div className="lg:w-2/3">
            {/* Título do Post */}
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            {/* Imagem de Capa */}
            {post.cover_image && (
              <img src={post.cover_image} alt={post.title} className="w-full rounded-lg mb-6" />
            )}
            
            {/* Meta Informações */}
            <div className="flex items-center text-gray-500 mb-4">
              <span className="mr-2">
                Publicado em: {new Date(post.published_at || post.created_at).toLocaleDateString()}
              </span>
              <span className="mr-2">|</span>
              <span className="mr-2">
                Autor: {post.author?.first_name} {post.author?.last_name}
              </span>
              <span className="mr-2">|</span>
              <span>
                Categoria: {post.category?.name}
              </span>
            </div>
            
            {/* Conteúdo do Post */}
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Link to={`/blog/tag/${encodeURIComponent(tag)}`} key={index} className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full px-3 py-1 text-sm font-medium">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Seção de Comentários */}
            <section className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">Comentários</h3>
              
              {/* Formulário de Comentário */}
              {/* <BlogCommentForm postId={post.id} /> */}
              
              {/* Lista de Comentários */}
              <BlogComments 
                postId={post.id} 
                loading={commentsLoading}
                commentList={comments as BlogComment[]} 
              />
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
