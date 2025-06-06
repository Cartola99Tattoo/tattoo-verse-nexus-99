
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, ArrowRight, Clock } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Guia Completo: Como Cuidar da Sua Tatuagem Recém Feita",
    slug: "como-cuidar-tatuagem-recem-feita",
    excerpt: "Aprenda os cuidados essenciais para garantir que sua nova tatuagem cicatrize perfeitamente e mantenha suas cores vibrantes por muito tempo.",
    author: "Mariana Silva",
    date: "2024-01-15",
    category: "Cuidados",
    image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2070&auto=format&fit=crop",
    readTime: "8 min"
  },
  {
    id: 2,
    title: "Tendências de Tatuagem 2024: O Que Está em Alta",
    slug: "tendencias-tatuagem-2024",
    excerpt: "Descubra os estilos e técnicas que estão dominando o mundo da tatuagem neste ano, desde minimalismo até realismo hiper-detalhado.",
    author: "Rafael Costa",
    date: "2024-01-10",
    category: "Tendências",
    image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1974&auto=format&fit=crop",
    readTime: "6 min"
  },
  {
    id: 3,
    title: "A História e Significado das Tatuagens Tribais",
    slug: "historia-significado-tatuagens-tribais",
    excerpt: "Explore as origens culturais e os simbolismos por trás das tatuagens tribais, uma das formas mais antigas de arte corporal.",
    author: "Juliana Mendes",
    date: "2024-01-08",
    category: "História",
    image: "https://images.unsplash.com/photo-1543767271-7c5f36dc5310?q=80&w=1974&auto=format&fit=crop",
    readTime: "10 min"
  },
  {
    id: 4,
    title: "Escolhendo o Local Perfeito para Sua Primeira Tatuagem",
    slug: "escolhendo-local-primeira-tatuagem",
    excerpt: "Dicas importantes para escolher a melhor localização no corpo para sua primeira tatuagem, considerando dor, cicatrização e visibilidade.",
    author: "Carlos Fernandes",
    date: "2024-01-05",
    category: "Iniciantes",
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e7?q=80&w=1974&auto=format&fit=crop",
    readTime: "7 min"
  },
  {
    id: 5,
    title: "Tatuagens Coloridas vs Preto e Cinza: Qual Escolher?",
    slug: "tatuagens-coloridas-vs-preto-cinza",
    excerpt: "Entenda as diferenças, vantagens e desvantagens entre tatuagens coloridas e em preto e cinza para tomar a melhor decisão.",
    author: "Mariana Silva",
    date: "2024-01-03",
    category: "Dicas",
    image: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=1974&auto=format&fit=crop",
    readTime: "9 min"
  },
  {
    id: 6,
    title: "O Processo Criativo: Da Ideia ao Desenho Final",
    slug: "processo-criativo-ideia-desenho-final",
    excerpt: "Acompanhe o processo completo de criação de uma tatuagem, desde a primeira consulta até o resultado final na pele.",
    author: "Rafael Costa",
    date: "2024-01-01",
    category: "Processo",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1974&auto=format&fit=crop",
    readTime: "12 min"
  }
];

const categories = ["Todas", "Cuidados", "Tendências", "História", "Iniciantes", "Dicas", "Processo"];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const navigate = useNavigate();

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog <span className="text-white">99Tattoo</span>
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Dicas, tendências e tudo sobre o mundo das tatuagens
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                variant="tattoo"
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 shadow-lg"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-red-glow"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-red-600 mb-8 text-center">Artigo em Destaque</h2>
            <Card 
              variant="tattoo" 
              className="group cursor-pointer overflow-hidden max-w-4xl mx-auto shadow-2xl hover:shadow-red-glow transition-all duration-300 transform hover:scale-[1.02]"
              onClick={() => navigate(`/blog/${featuredPost.slug}`)}
            >
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full overflow-hidden">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <Badge variant="tattoo" className="mb-4">
                    {featuredPost.category}
                  </Badge>
                  <h3 className="text-2xl md:text-3xl font-bold text-red-600 mb-4 group-hover:text-red-700 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-red-500" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-red-500" />
                      <span>{new Date(featuredPost.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-red-500" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <Button variant="tattoo" className="shadow-lg hover:shadow-xl">
                    Ler Artigo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Regular Posts Grid */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-red-600 mb-8 text-center">Últimos Artigos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map(post => (
              <Card 
                key={post.id} 
                variant="tattoo" 
                className="group cursor-pointer overflow-hidden h-full shadow-xl hover:shadow-red-glow transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <CardContent className="p-6 flex flex-col flex-1">
                  <Badge variant="tattooOutline" className="mb-3 w-fit">
                    {post.category}
                  </Badge>
                  
                  <h3 className="text-xl font-bold text-red-600 mb-3 group-hover:text-red-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 text-red-500" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-red-500" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-red-500" />
                      <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <Button variant="tattooOutline" size="sm" className="w-full">
                      Ler Mais
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-red-600 mb-2">Nenhum artigo encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
