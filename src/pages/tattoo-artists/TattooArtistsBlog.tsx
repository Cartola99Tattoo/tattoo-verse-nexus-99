
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Eye, Heart, MessageCircle, ArrowRight } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const mockBlogPosts = [
  {
    id: 1,
    title: "As Tendências de Tatuagem para 2024",
    excerpt: "Exploramos as principais tendências que estão dominando o mundo da tatuagem neste ano, desde estilos minimalistas até técnicas inovadoras...",
    category: "Tendências",
    author: "João Silva Santos",
    publishDate: "2024-07-15",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1565058379802-bbe93b2b2a98?w=400&h=250&fit=crop",
    views: 1250,
    likes: 89,
    comments: 23,
    featured: true
  },
  {
    id: 2,
    title: "Cuidados Pós-Tatuagem: Guia Completo",
    excerpt: "Um guia detalhado sobre como cuidar adequadamente de uma tatuagem recém-feita para garantir a melhor cicatrização...",
    category: "Cuidados",
    author: "Maria Fernanda Costa",
    publishDate: "2024-07-12",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1596730018434-f2b4a4e73e8c?w=400&h=250&fit=crop",
    views: 980,
    likes: 156,
    comments: 45,
    featured: false
  },
  {
    id: 3,
    title: "A Arte do Realismo em Tatuagens",
    excerpt: "Técnicas avançadas para criar tatuagens realistas que impressionam pela qualidade e detalhamento...",
    category: "Técnicas",
    author: "Carlos Montenegro",
    publishDate: "2024-07-08",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1564131072-6c4d41e23ba6?w=400&h=250&fit=crop",
    views: 750,
    likes: 92,
    comments: 18,
    featured: false
  },
  {
    id: 4,
    title: "Tatuagem Aquarela: Cores que Ganham Vida",
    excerpt: "Descubra os segredos por trás das incríveis tatuagens em estilo aquarela e como dominar esta técnica única...",
    category: "Estilos",
    author: "Ana Beatriz Silva",
    publishDate: "2024-07-05",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=250&fit=crop",
    views: 850,
    likes: 134,
    comments: 29,
    featured: false
  },
  {
    id: 5,
    title: "Equipamentos Essenciais para Tatuadores",
    excerpt: "Lista completa dos equipamentos indispensáveis para qualquer tatuador profissional em 2024...",
    category: "Equipamentos",
    author: "Roberto Martins",
    publishDate: "2024-07-01",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1606830713264-f1b9f00a0e4d?w=400&h=250&fit=crop",
    views: 1100,
    likes: 78,
    comments: 35,
    featured: false
  }
];

const TattooArtistsBlog = () => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Tendências': return 'bg-purple-100 text-purple-800';
      case 'Cuidados': return 'bg-blue-100 text-blue-800';
      case 'Técnicas': return 'bg-red-100 text-red-800';
      case 'Estilos': return 'bg-green-100 text-green-800';
      case 'Equipamentos': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const featuredPost = mockBlogPosts.find(post => post.featured);
  const regularPosts = mockBlogPosts.filter(post => !post.featured);

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Blog <span className="text-red-400">99Tattoo</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Conteúdo exclusivo sobre técnicas, tendências e o universo da tatuagem profissional
          </p>
        </div>

        {/* Post em Destaque */}
        {featuredPost && (
          <Card className="mb-12 bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-64 md:h-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-l-lg overflow-hidden">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-red-500 text-white">Em Destaque</Badge>
                  <Badge className={getCategoryColor(featuredPost.category)}>
                    {featuredPost.category}
                  </Badge>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {featuredPost.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(featuredPost.publishDate).toLocaleDateString('pt-BR')}
                  </div>
                  <span>{featuredPost.readTime} leitura</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {featuredPost.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {featuredPost.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {featuredPost.comments}
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                    Ler Artigo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Posts Regulares */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Card key={post.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </CardTitle>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.publishDate).toLocaleDateString('pt-BR')}
                  </div>
                  <span>{post.readTime}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {post.comments}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                    Ler Mais
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-to-r from-red-600/10 to-red-700/10 border-red-500/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Quer compartilhar seu conhecimento?
              </h3>
              <p className="text-gray-300 mb-6">
                Junte-se à nossa comunidade de tatuadores e compartilhe suas técnicas e experiências com milhares de profissionais.
              </p>
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                Enviar Artigo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsBlog;
