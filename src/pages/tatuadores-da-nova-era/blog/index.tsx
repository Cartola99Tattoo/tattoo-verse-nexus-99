
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, Tag, Eye, Clock } from "lucide-react";
import TatuadoresLayout from "@/components/layouts/TatuadoresLayout";

// Mock data para artigos do blog
const mockArticles = [
  {
    id: "1",
    title: "Dominando a Arte do Realismo: Técnicas Avançadas",
    excerpt: "Descubra as técnicas profissionais para criar tatuagens realistas impressionantes que destacam seu trabalho no mercado.",
    content: "O realismo na tatuagem é uma das técnicas mais desafiadoras e recompensadoras...",
    author: "Carlos Silva",
    publishedAt: "2024-01-15",
    category: "Técnicas",
    tags: ["realismo", "técnicas avançadas", "sombreamento"],
    readTime: 8,
    views: 1250,
    featured: true,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "2", 
    title: "Marketing Digital para Tatuadores: Estratégias que Funcionam",
    excerpt: "Como usar as redes sociais e marketing digital para atrair mais clientes qualificados para seu estúdio.",
    content: "O marketing digital revolucionou a forma como tatuadores conectam-se com clientes...",
    author: "Ana Martins",
    publishedAt: "2024-01-12",
    category: "Marketing",
    tags: ["marketing digital", "redes sociais", "clientes"],
    readTime: 6,
    views: 980,
    featured: true,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "3",
    title: "Fineline: A Arte da Precisão e Delicadeza",
    excerpt: "Tudo sobre a técnica fineline: equipamentos, técnicas e dicas para dominar esse estilo em alta.",
    content: "O estilo fineline tem ganhado popularidade mundial...",
    author: "Pedro Santos",
    publishedAt: "2024-01-10",
    category: "Estilos",
    tags: ["fineline", "precisão", "tendências"],
    readTime: 7,
    views: 756,
    featured: false,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "4",
    title: "Gestão Financeira para Artistas Independentes",
    excerpt: "Dicas práticas para organizar suas finanças, precificar seus trabalhos e construir um negócio sustentável.",
    content: "A gestão financeira é fundamental para o sucesso de qualquer tatuador...",
    author: "Maria Oliveira",
    publishedAt: "2024-01-08",
    category: "Negócios",
    tags: ["finanças", "precificação", "gestão"],
    readTime: 10,
    views: 1100,
    featured: false,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "5",
    title: "Hygiene e Segurança: Protocolos Essenciais",
    excerpt: "Guia completo sobre protocolos de higiene e segurança no estúdio de tatuagem para profissionais.",
    content: "A segurança e higiene são aspectos fundamentais na tatuagem profissional...",
    author: "Dr. Roberto Lima",
    publishedAt: "2024-01-05",
    category: "Segurança",
    tags: ["higiene", "segurança", "protocolos"],
    readTime: 12,
    views: 890,
    featured: false,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80"
  }
];

const categories = ["Todos", "Técnicas", "Marketing", "Estilos", "Negócios", "Segurança"];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "Todos" || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const getCategoryColor = (category: string) => {
    const colors = {
      "Técnicas": "bg-red-100 text-red-800",
      "Marketing": "bg-blue-100 text-blue-800", 
      "Estilos": "bg-purple-100 text-purple-800",
      "Negócios": "bg-green-100 text-green-800",
      "Segurança": "bg-yellow-100 text-yellow-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <TatuadoresLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-red-800">Blog Tatuadores da Nova Era</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conteúdo exclusivo para elevar sua arte e negócio ao próximo nível
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-red-200 focus:border-red-600"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-red-600 hover:bg-red-700" : "border-red-200 text-red-600 hover:bg-red-50"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-800">Artigos em Destaque</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden border-red-200 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white">
                      Destaque
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(article.publishedAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-red-900 hover:text-red-700 transition-colors">
                      <Link to={`/tatuadores-da-nova-era/blog/${article.id}`}>
                        {article.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{article.readTime} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{article.views}</span>
                        </div>
                      </div>
                      <Link to={`/tatuadores-da-nova-era/blog/${article.id}`}>
                        <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                          Ler Artigo
                        </Button>
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Articles */}
        {regularArticles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-800">Todos os Artigos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden border-red-200 hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(article.publishedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-red-900 hover:text-red-700 transition-colors line-clamp-2">
                      <Link to={`/tatuadores-da-nova-era/blog/${article.id}`}>
                        {article.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-2">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-3 w-3" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                    <Link to={`/tatuadores-da-nova-era/blog/${article.id}`}>
                      <Button variant="outline" size="sm" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                        Ler Artigo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum artigo encontrado</h3>
            <p className="text-gray-500">Tente ajustar sua busca ou filtros</p>
          </div>
        )}
      </div>
    </TatuadoresLayout>
  );
};

export default Blog;
