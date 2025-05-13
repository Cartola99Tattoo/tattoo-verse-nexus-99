
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface BlogSidebarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  tags: string[];
  activeTag: string;
  onTagChange: (tag: string) => void;
  isLoadingCategories: boolean;
  isLoadingTags: boolean;
}

const BlogSidebar = ({
  categories,
  activeCategory,
  onCategoryChange,
  tags,
  activeTag,
  onTagChange,
  isLoadingCategories,
  isLoadingTags
}: BlogSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {isLoadingCategories ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-gray-500">Carregando categorias...</span>
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`px-3 py-2 text-left rounded-md transition-colors ${
                    activeCategory === category
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  aria-pressed={activeCategory === category}
                  aria-label={`Filtrar por ${category}`}
                >
                  {category}
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Tags */}
      {tags && tags.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {isLoadingTags ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-gray-500">Carregando tags...</span>
                </div>
              ) : (
                tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagChange(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      activeTag === tag
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    aria-pressed={activeTag === tag}
                    aria-label={`Filtrar por tag ${tag}`}
                  >
                    {tag}
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogSidebar;
