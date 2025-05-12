
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BlogFiltersState } from "@/types/blog";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useBlogCategories } from "@/hooks/useBlogCategories";
import BlogCard from "@/components/blog/BlogCard";
import BlogSearchInput from "@/components/blog/filters/BlogSearchInput";

const BlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || "all";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  const filters: BlogFiltersState = {
    search: searchQuery,
    status: 'published',
    category: activeCategory === 'all' ? undefined : activeCategory,
    sortBy: 'published_at:desc',
  };
  
  const { data: postsData, isLoading: isLoadingPosts } = useBlogPosts(filters);
  const posts = postsData?.data || [];
  
  const { data: categoriesData = [], isLoading: isLoadingCategories } = useBlogCategories();
  
  // Handle category change with URL params
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === "all") {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already applied through the filters object
  };

  return (
    <Layout>
      {/* Blog header */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog da <span className="text-red-500">99Tattoo</span></h1>
          <p className="text-xl max-w-2xl mx-auto">
            Dicas, novidades e conteúdo sobre o mundo das tatuagens.
          </p>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="md:w-1/3">
              <form onSubmit={handleSearchSubmit}>
                <BlogSearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Buscar no blog..."
                />
              </form>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeCategory === 'all'
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                aria-pressed={activeCategory === 'all'}
                aria-label="Show all categories"
              >
                Todas
              </button>
              
              {isLoadingCategories ? (
                <div className="px-3 py-1">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              ) : (
                categoriesData.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      activeCategory === category.id
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    aria-pressed={activeCategory === category.id}
                    aria-label={`Filter by ${category.name}`}
                  >
                    {category.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Blog content with loading state */}
      <div className="container mx-auto px-4 py-12">
        {isLoadingPosts ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-red-500 mb-4" />
            <p className="text-lg text-gray-600">Carregando artigos...</p>
          </div>
        ) : posts.length > 0 ? (
          <>
            {/* Featured post */}
            {activeCategory === "all" && searchQuery === "" && posts.length > 0 && (
              <div className="mb-12">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-12 lg:flex">
                  <div className="lg:w-1/2">
                    <img
                      src={posts[0].cover_image || "https://images.unsplash.com/photo-1594067598377-478c61d59f3f?q=80&w=2148&auto=format&fit=crop"}
                      alt={posts[0].title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                  <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                    <div className="flex items-center mb-4">
                      <span className="bg-red-100 text-red-500 text-xs font-medium px-2 py-1 rounded mr-2">
                        {posts[0].blog_categories?.name || "Sem categoria"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {posts[0].published_at ? 
                          new Date(posts[0].published_at).toLocaleDateString('pt-BR') : 
                          "Sem data"}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{posts[0].title}</h2>
                    <p className="text-gray-600 mb-6">{posts[0].excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Por {posts[0].profiles ? 
                          `${posts[0].profiles.first_name || ''} ${posts[0].profiles.last_name || ''}`.trim() || 'Equipe 99Tattoo' : 
                          'Equipe 99Tattoo'}
                      </span>
                      <Button asChild variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                        <a href={`/blog/${posts[0].slug || posts[0].id}`}>Ler artigo</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blog grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(activeCategory === "all" && searchQuery === "" ? 1 : 0).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination - Placeholder for now */}
            <div className="flex justify-center mt-12">
              <nav className="inline-flex" aria-label="Pagination">
                <button 
                  className="px-4 py-2 text-gray-500 bg-gray-200 rounded-l-md hover:bg-gray-300"
                  aria-label="Previous page"
                  disabled
                >
                  Previous
                </button>
                <button className="px-4 py-2 text-white bg-red-500" aria-current="page">1</button>
                <button className="px-4 py-2 text-gray-500 bg-gray-200 hover:bg-gray-300" disabled>2</button>
                <button className="px-4 py-2 text-gray-500 bg-gray-200 hover:bg-gray-300" disabled>3</button>
                <button 
                  className="px-4 py-2 text-gray-500 bg-gray-200 rounded-r-md hover:bg-gray-300"
                  aria-label="Next page"
                  disabled
                >
                  Next
                </button>
              </nav>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold mb-2">Nenhum artigo encontrado</h3>
            <p className="text-gray-600 mb-4">Tente ajustar sua busca para encontrar mais conteúdo.</p>
            <Button onClick={() => { setSearchQuery(""); handleCategoryChange("all"); }}>
              Ver todos os artigos
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogList;
