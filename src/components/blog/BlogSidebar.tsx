
import { Link } from "react-router-dom";
import { useBlogCategories, useBlogPosts } from "@/hooks/useBlog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const BlogSidebar = () => {
  const { categories, isLoading: isLoadingCategories } = useBlogCategories();
  const { posts: recentPosts, isLoading: isLoadingPosts } = useBlogPosts({
    limit: 5,
    page: 1,
  });

  // Extrair tags únicas de todos os posts recentes
  const allTags = recentPosts?.reduce((tags, post) => {
    if (post.tags && Array.isArray(post.tags)) {
      return [...tags, ...post.tags];
    }
    return tags;
  }, [] as string[]);
  
  const uniqueTags = [...new Set(allTags || [])].slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Categorias */}
      <div>
        <h4 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
          Categorias
        </h4>
        {isLoadingCategories ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-6 w-full" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {categories?.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/blog/categoria/${category.id}`}
                  className="text-gray-700 hover:text-red-500 transition-colors flex justify-between items-center"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Posts recentes */}
      <div>
        <h4 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
          Posts Recentes
        </h4>
        {isLoadingPosts ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex gap-3">
                <Skeleton className="h-16 w-16 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-4">
            {recentPosts?.map((post) => (
              <li key={post.id} className="flex gap-3">
                <Link to={`/blog/${post.slug || post.id}`} className="block h-16 w-16 overflow-hidden rounded">
                  <img
                    src={post.cover_image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div>
                  <Link
                    to={`/blog/${post.slug || post.id}`}
                    className="font-medium text-sm hover:text-red-500 transition-colors line-clamp-2"
                  >
                    {post.title}
                  </Link>
                  <span className="text-xs text-gray-500 block mt-1">
                    {post.published_at 
                      ? new Date(post.published_at).toLocaleDateString('pt-BR')
                      : ''}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tags */}
      <div>
        <h4 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
          Tags
        </h4>
        <div className="flex flex-wrap gap-2">
          {uniqueTags.map((tag) => (
            <Link to={`/blog/tag/${encodeURIComponent(tag)}`} key={tag}>
              <Badge variant="outline" className="hover:bg-red-50 hover:text-red-500 cursor-pointer">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
