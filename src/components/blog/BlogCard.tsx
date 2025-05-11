
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  // Formatação de data em português
  const formattedDate = post.published_at 
    ? format(new Date(post.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR })
    : "";

  // Nome do autor completo ou parcial
  const authorName = post.author 
    ? `${post.author.first_name || ""} ${post.author.last_name || ""}`.trim() 
    : "Admin";

  // Calcular se deve usar imagem de capa ou placeholder
  const imageUrl = post.cover_image || "/placeholder.svg";

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <Link to={`/blog/${post.slug || post.id}`} className="block h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </Link>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          {post.category && (
            <span className="bg-red-100 text-red-500 text-xs font-medium px-2 py-1 rounded">
              {post.category.name}
            </span>
          )}
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        <Link to={`/blog/${post.slug || post.id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-red-500 transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, "")}...
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Por {authorName}</span>
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
  );
};

export default BlogCard;
