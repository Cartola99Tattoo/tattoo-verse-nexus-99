
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, User, ArrowRight, Search, Edit, Plus } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getTattooArtistService } from "@/services/serviceFactory";

const blogCategories = [
  { value: 'todos', label: 'Todos' },
  { value: 'tecnicas', label: 'Técnicas' },
  { value: 'cuidados', label: 'Cuidados' },
  { value: 'tendencias', label: 'Tendências' },
  { value: 'negocios', label: 'Negócios' }
];

const TattooArtistsBlog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  // Mock artist ID - em produção viria do contexto de autenticação
  const currentArtistId = "artist_1";

  const { data: blogPosts = [], loading } = useDataQuery(
    () => getTattooArtistService().getBlogPosts(currentArtistId),
    [currentArtistId]
  );

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || post.category === selectedCategory;
    return matchesSearch && matchesCategory && post.status === 'published';
  });

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Meu
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Blog</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Compartilhe conhecimento, construa autoridade e conecte-se com a comunidade de tatuadores
          </p>
        </div>

        {/* Controles de Busca e Filtros */}
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
              <div className="flex gap-2">
                {blogCategories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      selectedCategory === category.value
                        ? "bg-red-600 text-white"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                <Plus className="h-4 w-4 mr-2" />
                Novo Artigo
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className="h-48 overflow-hidden">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                      <Edit className="h-12 w-12 text-red-400" />
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs">
                      {blogCategories.find(cat => cat.value === post.category)?.label || post.category}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-3 line-clamp-2">
                    {post.title}
                  </CardTitle>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                      Ver artigo
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Edit className="h-16 w-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || selectedCategory !== 'todos' ? 'Nenhum artigo encontrado' : 'Ainda não há artigos'}
            </h3>
            <p className="text-gray-300 mb-6">
              {searchTerm || selectedCategory !== 'todos' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece a compartilhar seu conhecimento criando seu primeiro artigo'
              }
            </p>
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Artigo
            </Button>
          </div>
        )}

        {/* Dicas para Blog */}
        <div className="mt-16">
          <Card className="bg-red-600/10 border-red-500/30">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Dicas para um Blog de Sucesso</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Edit className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Conteúdo de Qualidade</h3>
                  <p className="text-gray-300">Compartilhe técnicas, experiências e conhecimento valioso</p>
                </div>
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Consistência</h3>
                  <p className="text-gray-300">Publique regularmente para manter o engajamento</p>
                </div>
                <div className="text-center">
                  <User className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Conecte-se</h3>
                  <p className="text-gray-300">Interaja com a comunidade e construa relacionamentos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsBlog;
