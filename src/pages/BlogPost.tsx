import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import useBlogPost from "@/hooks/useBlogPost";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Bookmark, Facebook, Loader2, Share2, Twitter } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import BlogCard from "@/components/blog/BlogCard";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { BlogFiltersState } from "@/types/blog";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, isLoading, error } = useBlogPost(slug || "");
  const navigate = useNavigate();

  // Get related posts based on category or tags
  const relatedFilters: BlogFiltersState = {
    status: 'published',
    category: post?.category_id,
    sortBy: 'published_at:desc',
  };
  
  const { data: relatedPostsData, isLoading: loadingRelated } = useBlogPosts(relatedFilters, 1, 3);
  const relatedPosts = relatedPostsData?.data.filter(p => p.id !== post?.id).slice(0, 3) || [];

  // Format date function
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Get author full name
  const getAuthorName = () => {
    if (!post || !post.profiles) return "Equipe 99Tattoo";
    
    const firstName = post.profiles.first_name || "";
    const lastName = post.profiles.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();
    
    return fullName || "Equipe 99Tattoo";
  };

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-red-500 mb-4" />
            <p className="text-lg text-gray-600">Carregando artigo...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>{error?.message || "Artigo não encontrado"}</AlertTitle>
            <AlertDescription>
              O artigo que você está procurando não existe ou foi removido.
            </AlertDescription>
          </Alert>
          
          <div className="text-center mt-8">
            <Button variant="outline" className="mr-2" onClick={() => navigate(-1)}>
              <span className="flex items-center">
                <ArrowLeft size={16} className="mr-1" />
                Voltar
              </span>
            </Button>
            <Button asChild>
              <Link to="/blog">Ver todos os artigos</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formattedDate = formatDate(post.published_at);
  const authorName = getAuthorName();
  const categoryName = post.blog_categories?.name || "Geral";

  // Meta tags content
  const metaDescription = post.meta_description || post.excerpt || `${post.title} - Leia mais sobre tatuagens e arte no Blog da 99Tattoo`;
  const metaKeywords = post.meta_keywords || "tatuagem, arte, 99tattoo";

  return (
    <Layout>
      {/* SEO Optimization */}
      <Helmet>
        <title>{`${post.title} | Blog 99Tattoo`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={`${post.title} | Blog 99Tattoo`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | Blog 99Tattoo`} />
        <meta name="twitter:description" content={metaDescription} />
        {post.cover_image && <meta name="twitter:image" content={post.cover_image} />}
        {/* Article specific metadata */}
        {post.published_at && <meta property="article:published_time" content={post.published_at} />}
        <link rel="canonical" href={window.location.href} />
        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": "${post.title}",
              "image": "${post.cover_image || ''}",
              "datePublished": "${post.published_at || ''}",
              "description": "${metaDescription}",
              "author": {
                "@type": "Person",
                "name": "${authorName}"
              },
              "publisher": {
                "@type": "Organization",
                "name": "99Tattoo",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://99tattoo.com/logo.png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "${window.location.href}"
              }
            }
          `}
        </script>
      </Helmet>

      {/* Hero section */}
      <div className="w-full h-96 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
        <img 
          src={post.cover_image || 'https://images.unsplash.com/photo-1594067598377-478c61d59f3f?q=80&w=2148&auto=format&fit=crop'} 
          alt={post.title} 
          className="w-full h-full object-cover"
          loading="eager" // Load hero image eagerly for LCP optimization
        />
        <div className="container mx-auto px-4 absolute bottom-0 left-0 right-0 z-20 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/blog" className="text-white hover:text-red-500 transition-colors">
              Blog
            </Link>
            <span className="text-white">/</span>
            <span className="text-gray-300">{categoryName}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex items-center text-white">
            <span className="mr-4">{formattedDate}</span>
            <span className="mr-4">|</span>
            <span>By {authorName}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Reading time and view count */}
              <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="mr-4">{post.reading_time || 5} min read</span>
                </div>
                <div className="flex items-center">
                  <span>{post.view_count || 0} views</span>
                </div>
              </div>
              
              {/* Article excerpt if available */}
              {post.excerpt && (
                <div className="my-6 text-lg text-gray-700 italic border-l-4 border-red-500 pl-4 py-2">
                  {post.excerpt}
                </div>
              )}

              {/* Article content with rich text */}
              <article className="prose max-w-none">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </article>

              {/* Tags section if available */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Link 
                        key={index} 
                        to={`/blog?tag=${tag}`}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-8" />

              {/* Author info */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-4">
                  {post.profiles?.avatar_url ? (
                    <img 
                      src={post.profiles.avatar_url} 
                      alt={authorName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-red-500 text-white text-lg font-bold">
                      {authorName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold">{authorName}</p>
                  <p className="text-sm text-gray-600">Tattoo Artist at 99Tattoo</p>
                </div>
              </div>
            </div>

            {/* Share buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="outline" className="flex gap-2" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({ title: "Link copied!", description: "Article link copied to clipboard" });
              }}>
                <Share2 size={16} />
                Share
              </Button>
              <Button variant="outline" className="flex gap-2" onClick={() => {
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank');
              }}>
                <Twitter size={16} />
                Twitter
              </Button>
              <Button variant="outline" className="flex gap-2" onClick={() => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
              }}>
                <Facebook size={16} />
                Facebook
              </Button>
              <Button variant="outline" className="flex gap-2">
                <Bookmark size={16} />
                Save
              </Button>
            </div>

            {/* Comments section - placeholder */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold mb-6">Comments (0)</h3>
              <div className="border-b pb-6 mb-6">
                <textarea 
                  placeholder="Leave your comment..." 
                  className="w-full border rounded-md p-3 h-24"
                  aria-label="Comment area"
                ></textarea>
                <Button className="mt-4 bg-red-500 hover:bg-red-600">Comment</Button>
              </div>
              <div className="text-center text-gray-500">
                Be the first to comment!
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Related Posts */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 border-b border-red-500 pb-2 inline-block">
                Related Posts
              </h3>
              <div className="space-y-4 mt-4">
                {loadingRelated ? (
                  // Loading state for related posts
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                      </div>
                    </div>
                  ))
                ) : relatedPosts.length > 0 ? (
                  relatedPosts.map(post => (
                    <BlogCard key={post.id} post={post} compact />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No related posts available</p>
                )}
              </div>
              <Button asChild variant="outline" className="w-full mt-4 border-black text-black hover:bg-black hover:text-white">
                <Link to="/blog">View All Posts</Link>
              </Button>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-red-500 pb-2 inline-block">
                Categories
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/blog?category=care" className="flex justify-between items-center hover:text-red-500">
                    Care <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">5</span>
                  </Link>
                </li>
                <li>
                  <Link to="/blog?category=trends" className="flex justify-between items-center hover:text-red-500">
                    Trends <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">8</span>
                  </Link>
                </li>
                <li>
                  <Link to="/blog?category=information" className="flex justify-between items-center hover:text-red-500">
                    Information <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">12</span>
                  </Link>
                </li>
                <li>
                  <Link to="/blog?category=tips" className="flex justify-between items-center hover:text-red-500">
                    Tips <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">6</span>
                  </Link>
                </li>
                <li>
                  <Link to="/blog?category=history" className="flex justify-between items-center hover:text-red-500">
                    History <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">3</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
