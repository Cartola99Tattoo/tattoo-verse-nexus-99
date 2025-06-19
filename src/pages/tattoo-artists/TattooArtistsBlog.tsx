
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, Eye, Heart, MessageCircle, Search, Filter, BookOpen, TrendingUp, Clock, Share2 } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const mockBlogPosts = [
  {
    id: 1,
    title: "Técnicas Avançadas de Sombreamento em Tatuagens Realistas",
    excerpt: "Descubra os segredos para criar sombreamentos perfeitos que dão vida às suas tatuagens realistas...",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Carlos Mendes",
    category: "Técnicas",
    date: "2024-07-15",
    readTime: "8 min",
    views: 1250,
    likes: 89,
    comments: 23,
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e7?w=600&h=300&fit=crop",
    featured: true,
    tags: ["realismo", "sombreamento", "técnicas"]
  },
  {
    id: 2,
    title: "Cuidados Pós-Tatuagem: Guia Completo para Clientes",
    excerpt: "Um guia essencial sobre como orientar seus clientes para o cuidado adequado das tatuagens recém-feitas...",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Ana Costa",
    category: "Cuidados",
    date: "2024-07-12",
    readTime: "6 min",
    views: 980,
    likes: 76,
    comments: 15,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=300&fit=crop",
    featured: false,
    tags: ["cuidados", "cicatrização", "orientação"]
  },
  {
    id: 3,
    title: "Tendências 2024: Estilos de Tatuagem em Alta",
    excerpt: "Explore os estilos de tatuagem que estão dominando o cenário artístico em 2024...",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Rafael Lima",
    category: "Tendências",
    date: "2024-07-10",
    readTime: "10 min",
    views: 1500,
    likes: 112,
    comments: 34,
    image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=600&h=300&fit=crop",
    featured: true,
    tags: ["tendências", "estilos", "2024"]
  },
  {
    id: 4,
    title: "Como Construir um Portfólio Profissional de Tatuagem",
    excerpt: "Dicas essenciais para criar um portfólio que destaque seu trabalho e atraia mais clientes...",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Mariana Silva",
    category: "Negócios",
    date: "2024-07-08",
    readTime: "12 min",
    views: 2100,
    likes: 145,
    comments: 28,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=300&fit=crop",
    featured: false,
    tags: ["portfólio", "marketing", "profissional"]
  },
  {
    id: 5,
    title: "Higiene e Segurança no Estúdio de Tatuagem",
    excerpt: "Protocolos essenciais de higiene e segurança que todo tatuador deve seguir...",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",  
    author: "Dr. João Santos",
    category: "Segurança",
    date: "2024-07-05",
    readTime: "15 min",
    views: 890,
    likes: 67,
    comments: 19,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&h=300&fit=crop",
    featured: false,
    tags: ["higiene", "segurança", "protocolos"]
  },
  {
    id: 6,
    title: "A Arte da Tatuagem Oriental: História e Técnicas",
    excerpt: "Mergulhe na rica tradição da tatuagem oriental e aprenda suas técnicas ancestrais...",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Kenji Tanaka",
    category: "História",
    date: "2024-07-02",
    readTime: "18 min",
    views: 1800,
    likes: 134,
    comments: 42,
    image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=600&h=300&fit=crop",
    featured: true,
    tags: ["oriental", "história", "tradição"]
  }
];

const TattooArtistsBlog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'Técnicas', label: 'Técnicas' },
    { value: 'Cuidados', label: 'Cuidados' },
    { value: 'Tendências', label: 'Tendências' },
    { value: 'Negócios', label: 'Negócios' },
    { value: 'Segurança', label: 'Segurança' },
    { value: 'História', label: 'História' },
  ];

  const filteredPosts = mockBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = mockBlogPosts.filter(post => post.featured);
  const totalViews = mockBlogPosts.reduce((acc, post) => acc + post.views, 0);
  const totalLikes = mockBlogPosts.reduce((acc, post) => acc + post.likes, 0);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Técnicas': return 'bg-blue-100 text-blue-800';
      case 'Cuidados': return 'bg-green-100 text-green-800';
      case 'Tendências': return 'bg-purple-100 text-purple-800';
      case 'Negócios': return 'bg-yellow-100 text-yellow-800';
      case 'Segurança': return 'bg-red-100 text-red-800';
      case 'História': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedPost) {
    return (
      <TattooArtistLayout>
        <div className="container mx-auto px-4 py-16">
          <Button 
            onClick={() => setSelectedPost(null)}
            variant="outline"
            className="mb-6"
          >
            ← Voltar ao Blog
          </Button>
          
          <article className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Badge className={`mb-4 ${getCategoryColor(selectedPost.category)}`}>
                {selectedPost.category}
              </Badge>
              <h1 className="text-4xl font-bold text-white mb-4">{selectedPost.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {selectedPost.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedPost.date).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {selectedPost.readTime}
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {selectedPost.views} visualizações
                </div>
              </div>
            </div>

            <div className="mb-8">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-xl text-gray-300 mb-6">{selectedPost.excerpt}</p>
              <div className="text-gray-200 space-y-4">
                <p>{selectedPost.content}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {selectedPost.likes} Curtidas
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {selectedPost.comments} Coment.
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap gap-2">
                {selectedPost.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </article>
        </div>
      </TattooArtistLayout>
    );
  }

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Blog dos
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Tatuadores</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Conhecimento, técnicas e inspiração para elevar sua arte ao próximo nível
          </p>
        </div>

        {/* Estatísticas do Blog */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{mockBlogPosts.length}</div>
              <div className="text-gray-300">Artigos Publicados</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">{totalViews.toLocaleString()}</div>
              <div className="text-gray-300">Visualizações</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{totalLikes}</div>
              <div className="text-gray-300">Curtidas</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{featuredPosts.length}</div>
              <div className="text-gray-300">Em Destaque</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
              <Input
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30"
              />
            </div>
            
            <div className="flex gap-4 items-center">
              <Filter className="h-5 w-5 text-white" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="text-white">
                      {category.label}  
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Posts em Destaque */}
        {featuredPosts.length > 0 && selectedCategory === 'all' && !searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-red-400" />
              Artigos em Destaque
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.slice(0, 3).map((post) => (
                <Card key={post.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={`text-xs ${getCategoryColor(post.category)} font-medium`}>
                        {post.category}
                      </Badge>
                      <Badge className="text-xs bg-yellow-100 text-yellow-800">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.comments}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                      onClick={() => setSelectedPost(post)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ler Artigo
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Todos os Posts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-red-400" />
            {searchTerm || selectedCategory !== 'all' ? 'Resultados da Busca' : 'Todos os Artigos'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`text-xs ${getCategoryColor(post.category)} font-medium`}>
                      {post.category}
                    </Badge>
                    {post.featured && (
                      <Badge className="text-xs bg-yellow-100 text-yellow-800">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-gray-500 border-gray-300">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    onClick={() => setSelectedPost(post)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Ler Artigo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum artigo encontrado</h3>
            <p className="text-gray-300">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsBlog;
