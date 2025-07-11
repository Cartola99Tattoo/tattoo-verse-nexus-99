
import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";

export interface BlogPostSummary {
  id: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  slug?: string | null;
  profiles?: {
    first_name?: string | null;
    last_name?: string | null;
    avatar_url?: string | null;
  } | {
    first_name?: string | null;
    last_name?: string | null;
    avatar_url?: string | null;
  }[] | null;
  blog_categories?: {
    name?: string | null;
    id?: string;
  } | {
    name?: string | null;
    id?: string;
  }[] | null;
}

interface BlogCardProps {
  post: BlogPostSummary;
  variant?: 'default' | 'compact' | 'featured';
}

const BlogCard = ({ post, variant = 'default' }: BlogCardProps) => {
  // Formatação do nome da categoria
  let categoryName = 'Geral';
  
  if (post.blog_categories) {
    if (Array.isArray(post.blog_categories)) {
      categoryName = post.blog_categories[0]?.name || 'Geral';
    } else {
      categoryName = post.blog_categories.name || 'Geral';
    }
  }
  
  // Formatação da data
  const formattedDate = post.published_at ? 
    new Date(post.published_at).toLocaleDateString('pt-BR') : 
    "Sem data";
  
  // Formatação do nome do autor
  let authorName = 'Equipe 99Tattoo';
  let authorAvatar = null;
  
  if (post.profiles) {
    if (Array.isArray(post.profiles) && post.profiles.length > 0) {
      const profile = post.profiles[0];
      authorName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Equipe 99Tattoo';
      authorAvatar = profile?.avatar_url || null;
    } else if (!Array.isArray(post.profiles)) {
      authorName = `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim() || 'Equipe 99Tattoo';
      authorAvatar = post.profiles.avatar_url || null;
    }
  }

  // Usar slug se disponível, senão usar id
  const postLink = `/blog/${post.slug || post.id}`;
  
  // Se for variante compacta, renderiza um layout mais simples
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 mb-4 group">
        <Link to={postLink} className="shrink-0 w-16 h-16 overflow-hidden rounded">
          <img
            src={post.cover_image || "https://images.unsplash.com/photo-1594067598377-478c61d59f3f?q=80&w=2148&auto=format&fit=crop"}
            alt=""
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            loading="lazy"
          />
        </Link>
        <div>
          <Link to={postLink}>
            <h3 className="font-medium line-clamp-2 group-hover:text-red-500 transition-colors">
              {post.title}
            </h3>
          </Link>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Calendar className="h-3 w-3 mr-1" />
            <time dateTime={post.published_at || ''}>
              {formattedDate}
            </time>
          </div>
        </div>
      </div>
    );
  }
  
  // Se for variante featured, renderiza um layout destacado
  if (variant === 'featured') {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          <Link to={postLink} className="md:w-1/2 h-60 md:h-auto overflow-hidden">
            <img
              src={post.cover_image || "https://images.unsplash.com/photo-1594067598377-478c61d59f3f?q=80&w=2148&auto=format&fit=crop"}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="eager"
            />
          </Link>
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-3">
                <span className="bg-red-100 text-red-500 text-xs font-medium px-2 py-1 rounded mr-2">
                  {categoryName}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  <time dateTime={post.published_at || ''}>
                    {formattedDate}
                  </time>
                </div>
              </div>
              <Link to={postLink}>
                <h2 className="text-2xl font-bold mb-3 hover:text-red-500 transition-colors line-clamp-2">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-6 line-clamp-3">{post.excerpt}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                  {authorAvatar ? (
                    <img
                      src={authorAvatar}
                      alt={authorName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {authorName}
                </span>
              </div>
              <Link
                to={postLink}
                className="text-red-500 hover:text-red-700 transition-colors text-sm flex items-center"
                aria-label={`Ler mais sobre ${post.title}`}
              >
                Ler mais
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
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
      </div>
    );
  }
  
  // Layout padrão
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <Link to={postLink} className="block h-48 overflow-hidden">
        <img
          src={post.cover_image || "https://images.unsplash.com/photo-1594067598377-478c61d59f3f?q=80&w=2148&auto=format&fit=crop"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
      </Link>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="bg-red-100 text-red-500 text-xs font-medium px-2 py-1 rounded">
            {categoryName}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <time className="text-xs text-gray-500" dateTime={post.published_at || ''}>
              {formattedDate}
            </time>
          </div>
        </div>
        <Link to={postLink}>
          <h3 className="text-xl font-bold mb-2 hover:text-red-500 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="h-3 w-3 text-gray-500" />
              )}
            </div>
            <span className="text-sm text-gray-500">
              {authorName}
            </span>
          </div>
          <Link
            to={postLink}
            className="text-red-500 hover:text-red-700 transition-colors text-sm flex items-center"
            aria-label={`Ler mais sobre ${post.title}`}
          >
            Ler mais
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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
  );
};

export default BlogCard;
