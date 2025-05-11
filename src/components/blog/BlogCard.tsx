
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  if (!post) {
    return null;
  }

  // Formatação de data em português ou exibe data atual se não houver data de publicação
  const formattedDate = post.published_at 
    ? format(new Date(post.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR })
    : "";

  // Nome do autor completo, parcial ou default
  const authorName = post.author 
    ? `${post.author.first_name || ""} ${post.author.last_name || ""}`.trim() || "Equipe 99Tattoo"
    : "Equipe 99Tattoo";

  // Calcular se deve usar imagem de capa ou placeholder
  const imageUrl = post.cover_image || "/placeholder.svg";

  // Garantir que temos um trecho de texto mesmo quando o excerpt estiver vazio
  const excerpt = post.excerpt || post.content?.substring(0, 150).replace(/<[^>]*>/g, "") || "";

  // Gerar um slug seguro para o link
  const postLink = `/blog/${post.slug || post.id}`;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <Link to={postLink} className="block h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          {post.category && (
            <span className="bg-red-100 text-red-500 text-xs font-medium px-2 py-1 rounded">
              {post.category.name || "Sem categoria"}
            </span>
          )}
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        <Link to={postLink} className="flex-grow">
          <h3 className="text-xl font-bold mb-2 hover:text-red-500 transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {excerpt}...
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm text-gray-500">Por {authorName}</span>
          <Link
            to={postLink}
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
