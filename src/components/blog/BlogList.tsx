
import { useState } from "react";
import { useBlogPosts } from "@/hooks/useBlog";
import BlogSearch from "./BlogSearch";
import BlogGrid from "./BlogGrid";
import BlogPagination from "./BlogPagination";
import BlogEmptyState from "./BlogEmptyState";
import BlogLoadingState from "./BlogLoadingState";
import BlogErrorState from "./BlogErrorState";

interface BlogListProps {
  categoryId?: string;
  tag?: string;
  limit?: number;
  showSearch?: boolean;
}

const BlogList = ({ categoryId, tag, limit = 6, showSearch = true }: BlogListProps) => {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { posts, isLoading, totalCount, error, refetch } = useBlogPosts({
    category_id: categoryId,
    tags: tag ? [tag] : undefined,
    search: searchQuery,
    limit: limit,
    page,
    published_only: true,
  });

  const totalPages = Math.max(Math.ceil((totalCount || 0) / limit), 1);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchQuery("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  console.log("BlogList render:", { 
    postsLength: posts?.length, 
    totalCount,
    isLoading, 
    error, 
    categoryId, 
    tag,
    postsData: posts 
  });

  return (
    <div className="space-y-6">
      {/* Search Component */}
      {showSearch && (
        <BlogSearch 
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
      )}

      {/* Error State */}
      {error ? (
        <BlogErrorState onRetry={refetch} />
      ) : isLoading ? (
        /* Loading State */
        <BlogLoadingState count={limit} />
      ) : (
        <>
          {/* Posts Grid or Empty State */}
          {posts && posts.length > 0 ? (
            <BlogGrid posts={posts} />
          ) : (
            <BlogEmptyState 
              searchQuery={searchQuery} 
              onClearSearch={handleClearSearch} 
            />
          )}
        </>
      )}

      {/* Pagination Component */}
      {totalPages > 1 && posts && posts.length > 0 && (
        <BlogPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default BlogList;
