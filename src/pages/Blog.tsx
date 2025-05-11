
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Layout from "@/components/layout/Layout";
import BlogList from "@/components/blog/BlogList";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { useBlogCategories } from "@/hooks/useBlog";

const Blog = () => {
  const { categoryId, tag } = useParams();
  const navigate = useNavigate();
  const { categories } = useBlogCategories();
  const [currentCategory, setCurrentCategory] = useState<string | undefined>(categoryId);
  const [currentTag, setCurrentTag] = useState<string | undefined>(tag);
  
  // Atualizar estado quando os parâmetros mudarem
  useEffect(() => {
    setCurrentCategory(categoryId);
    setCurrentTag(tag);
  }, [categoryId, tag]);
  
  // Título da página baseado na categoria ou tag
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
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">{getPageTitle()}</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Confira as últimas novidades, dicas e informações sobre tatuagens, 
            estilos, cuidados e muito mais no blog da 99Tattoo.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Lista de Blog Posts */}
          <div className="lg:w-2/3">
            <BlogList categoryId={currentCategory} />
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
