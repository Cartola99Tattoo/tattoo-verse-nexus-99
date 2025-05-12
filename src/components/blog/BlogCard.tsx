
import { Link } from "react-router-dom";

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
  } | {
    first_name?: string | null;
    last_name?: string | null;
  }[] | null;
  blog_categories?: {
    name?: string | null;
  } | {
    name?: string | null;
  }[] | null;
}

interface BlogCardProps {
  post: BlogPostSummary;
}

const BlogCard = ({ post }: BlogCardProps) => {
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
  
  if (post.profiles) {
    if (Array.isArray(post.profiles) && post.profiles.length > 0) {
      const profile = post.profiles[0];
      authorName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Equipe 99Tattoo';
    } else if (!Array.isArray(post.profiles)) {
      authorName = `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim() || 'Equipe 99Tattoo';
    }
  }

  // Usar slug se disponível, senão usar id
  const postLink = `/blog/${post.slug || post.id}`;
  
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
          <time className="text-xs text-gray-500" dateTime={post.published_at || ''}>{formattedDate}</time>
        </div>
        <Link to={postLink}>
          <h3 className="text-xl font-bold mb-2 hover:text-red-500 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Por {authorName}</span>
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
