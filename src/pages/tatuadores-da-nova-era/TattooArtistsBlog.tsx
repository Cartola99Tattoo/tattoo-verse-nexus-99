import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, Search, ArrowRight, Eye } from "lucide-react";

// Dados mock unificados
const blogPosts = [
  {
    id: 1,
    title: "Tendências de Tatuagem 2024: O Que Está Dominando o Mercado",
    slug: "tendencias-tatuagem-2024",
    excerpt: "Explore as principais tendências que estão moldando o mundo da tatuagem neste ano, desde o minimalismo até técnicas inovadoras.",
    author: "Carolina Silva",
    date: "2024-01-15",
    category: "Tendências",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=800&auto=format&fit=crop&q=60",
    featured: true,
    views: 2450,
    likes: 189
  },
  {
    id: 2,
    title: "Cuidados Pós-Tatuagem: Guia Completo para Cicatrização",
    slug: "cuidados-pos-tatuagem-guia-completo",
    excerpt: "Um guia detalhado sobre como cuidar adequadamente de uma tatuagem recém-feita para garantir a melhor cicatrização.",
    author: "Dr. Ricardo Mendes",
    date: "2024-01-12",
    category: "Cuidados",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=800&auto=format&fit=crop&q=60",
    featured: false,
    views: 1890,
    likes: 234
  },
  {
    id: 3,
    title: "Marketing Digital para Tatuadores: Construindo sua Marca Online",
    slug: "marketing-digital-tatuadores",
    excerpt: "Estratégias eficazes de marketing digital para tatuadores que querem expandir sua clientela e fortalecer sua marca.",
    author: "Ana Paula Costa",
    date: "2024-01-10",
    category: "Marketing",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=60",
    featured: false,
    views: 1340,
    likes: 98
  },
  {
    id: 4,
    title: "Técnicas de Sombreamento: Dominando o Blackwork",
    slug: "tecnicas-sombreamento-blackwork",
    excerpt: "Aprenda as técnicas fundamentais de sombreamento no estilo blackwork e eleve o nível das suas tatuagens.",
    author: "Marcos Oliveira",
    date: "2024-01-08",
    category: "Técnicas",
    readTime: "15 min",
    image: "https://images.unsplash.com/photo-1543767271-7c5f36dc5310?w=800&auto=format&fit=crop&q=60",
    featured: false,
    views: 890,
    likes: 145
  },
  {
    id: 5,
    title: "História da Tatuagem: Das Origens aos Dias Atuais",
    slug: "historia-tatuagem-origens",
    excerpt: "Uma jornada através da rica história da tatuagem, desde suas origens ancestrais até as tendências modernas.",
    author: "Prof. Helena Ribeiro",
    date: "2024-01-05",
    category: "História",
    readTime: "18 min",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60",
    featured: false,
    views: 1230,
    likes: 156
  }
];

const categories = ["Todos", "Tendências", "Cuidados", "Marketing", "Técnicas", "História", "Equipamentos"];

const TattooArtistsBlog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const navigate = useNavigate();

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const handlePostClick = (post: any) => {
    navigate(`/tatuadores-da-nova-era/blog/${post.slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Blog <span className="text-white">99Tattoo</span>
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-white">
              Descubra dicas, tendências e histórias do universo da tatuagem
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 h-4 w-4" />
              <Input
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 shadow-lg"
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

      <div className="container mx-auto px-4 py-12">
        {/* Featured Post */}
        {featuredPost && selectedCategory === "Todos" && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-red-600 mb-8">Artigo em Destaque</h2>
            <Card 
              className="group cursor-pointer overflow-hidden bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl hover:shadow-red-glow transition-all duration-300 transform hover:scale-[1.02]"
              onClick={() => handlePostClick(featuredPost)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="h-64 lg:h-auto overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 shadow-lg"
                  />
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge className="mb-4 w-fit bg-gradient-to-r from-red-600 to-red-800 text-white">
                    {featuredPost.category}
                  </Badge>
                  <h3 className="text-2xl md:text-3xl font-bold text-red-600 mb-4 group-hover:text-red-700 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-red-500" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-red-500" />
                      <span>{new Date(featuredPost.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-red-500" />
                      <span>{featuredPost.readTime} de leitura</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-red-500" />
                      <span>{featuredPost.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button className="w-fit bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    Ler Artigo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </section>
        )}

        {/* Regular Posts Grid */}
        <section>
          <h2 className="text-3xl font-bold text-red-600 mb-8">
            {selectedCategory === "Todos" ? "Últimos Artigos" : `Artigos - ${selectedCategory}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map(post => (
              <Card 
                key={post.id}
                className="group cursor-pointer overflow-hidden bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-lg hover:shadow-xl hover:border-red-400 transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => handlePostClick(post)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 shadow-md"
                  />
                </div>
                
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3 border-red-200 text-red-600 hover:bg-red-50">
                    {post.category}
                  </Badge>
                  
                  <h3 className="text-xl font-bold text-red-600 mb-3 group-hover:text-red-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-red-500" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-red-500" />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-red-500" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString('pt-BR')}
                    </span>
                    <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400">
                      Ler mais
                      <ArrowRight className="h-3 w-3 ml-1" />
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
        </section>
      </div>
    </div>
  );
};

export default TattooArtistsBlog;
