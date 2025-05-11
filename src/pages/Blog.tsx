
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BlogList from "@/components/blog/BlogList";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { useBlogCategories } from "@/hooks/useBlog";

const Blog = () => {
  const { categoryId, tag } = useParams();
  const navigate = useNavigate();
  const { categories, isLoading: categoriesLoading } = useBlogCategories();
  const [currentCategory, setCurrentCategory] = useState<string | undefined>(categoryId);
  const [currentTag, setCurrentTag] = useState<string | undefined>(tag);
  
  // Update state when params change
  useEffect(() => {
    setCurrentCategory(categoryId);
    setCurrentTag(tag);
  }, [categoryId, tag]);
  
  // Get page title based on current filters
  const getPageTitle = () => {
    if (currentCategory && categories) {
      const category = categories.find(cat => cat.id === currentCategory);
      if (category) {
        return `Categoria: ${category.name}`;
      }
    }
    
    if (currentTag) {
      return `Tag: ${decodeURIComponent(currentTag)}`;
    }
    
    return "Blog";
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Blog | 99Tattoo</title>
        <meta name="description" content="Confira as últimas novidades, dicas e informações sobre tatuagens no blog da 99Tattoo." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">{getPageTitle()}</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Confira as últimas novidades, dicas e informações sobre tatuagens, 
            estilos, cuidados e muito mais no blog da 99Tattoo.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
          {/* Blog Post List */}
          <div className="w-full lg:w-2/3">
            <BlogList categoryId={currentCategory} tag={currentTag} />
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
