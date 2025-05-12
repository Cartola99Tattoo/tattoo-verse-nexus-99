
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BlogPost } from '@/types/blog';

export interface BlogPostSummary {
  id: string;
  title: string;
  excerpt?: string | null;
  cover_image?: string | null;
  published_at?: string | null;
  slug?: string | null;
  profiles?: {
    first_name?: string | null;
    last_name?: string | null;
  } | null;
  blog_categories?: {
    name?: string | null;
  } | null;
}

interface BlogCardProps {
  post: BlogPostSummary | BlogPost;
  compact?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, compact = false }) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "dd 'de' MMM, yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const getAuthorName = () => {
    if (!post.profiles) return 'Equipe 99Tattoo';
    
    const firstName = post.profiles.first_name || '';
    const lastName = post.profiles.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    
    return fullName || 'Equipe 99Tattoo';
  };

  if (compact) {
    return (
      <Link to={`/blog/${post.slug || post.id}`} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md transition-colors">
        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <img 
            src={post.cover_image || "https://via.placeholder.com/300x200?text=99Tattoo"} 
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{post.title}</h3>
          <p className="text-xs text-gray-500">{formatDate(post.published_at)}</p>
        </div>
      </Link>
    );
  }

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link to={`/blog/${post.slug || post.id}`}>
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={post.cover_image || "https://via.placeholder.com/800x450?text=99Tattoo"}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">
            {post.blog_categories?.name || "Sem categoria"}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(post.published_at)}
          </span>
        </div>
        <Link to={`/blog/${post.slug || post.id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-red-500 transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {post.excerpt || ""}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Por {getAuthorName()}</span>
          <Link
            to={`/blog/${post.slug || post.id}`}
            className="text-sm font-medium text-red-500 hover:text-red-700"
          >
            Ler mais &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
