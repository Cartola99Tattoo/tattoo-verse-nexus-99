
import React from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
  compact?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, compact = false }) => {
  // Safely get category name
  const categoryName = post.blog_categories?.name || "General";
  
  // Format date
  const formattedDate = post.published_at ? 
    new Date(post.published_at).toLocaleDateString('pt-BR') : 
    "No date";
  
  // Get author name
  let authorName = 'Equipe 99Tattoo';
  
  if (post.profiles) {
    const firstName = post.profiles.first_name || '';
    const lastName = post.profiles.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName) authorName = fullName;
  }

  // Use slug if available, otherwise use id
  const postUrl = `/blog/${post.slug || post.id}`;
  
  // Compact card layout for sidebar widgets
  if (compact) {
    return (
      <div className="flex items-center space-x-3 py-3 border-b last:border-0">
        <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
          <img
            src={post.cover_image || "https://images.unsplash.com/photo-1594067598377-478c61d59f3f?q=80&w=2148&auto=format&fit=crop"}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link to={postUrl}>
            <h4 className="font-medium text-sm leading-tight mb-1 truncate hover:text-red-500 transition-colors">
              {post.title}
            </h4>
          </Link>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
      </div>
    );
  }
  
  // Standard card layout
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <Link to={postUrl} className="block h-48 overflow-hidden">
        <img
          src={post.cover_image || "https://images.unsplash.com/photo-1594067598377-478c61d59f3f?q=80&w=2148&auto=format&fit=crop"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
      </Link>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <span className="bg-red-100 text-red-500 text-xs font-medium px-2 py-1 rounded">
            {categoryName}
          </span>
          <time className="text-xs text-gray-500" dateTime={post.published_at || ''}>
            {formattedDate}
          </time>
        </div>
        <Link to={postUrl} className="flex-grow">
          <h3 className="text-xl font-bold mb-2 hover:text-red-500 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm text-gray-500">By {authorName}</span>
          <Link
            to={postUrl}
            className="text-red-500 hover:text-red-700 transition-colors text-sm flex items-center"
            aria-label={`Read more about ${post.title}`}
          >
            Read more
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
