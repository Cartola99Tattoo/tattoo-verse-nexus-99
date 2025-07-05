
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Plus, Eye, Edit, Calendar, User, TrendingUp } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockBlogPosts = [
  {
    id: 1,
    title: "As Tendências de Tatuagem para 2024",
    excerpt: "Exploramos as principais tendências que estão dominando o mundo da tatuagem neste ano...",
    category: "Tendências",
    status: "published",
    author: "Equipe Editorial 99Tattoo",
    publishDate: "2024-07-15",
    views: 1250,
    likes: 89,
    comments: 23,
    readTime: "5 min",
    featured: true
  },
  {
    id: 2,
    title: "Cuidados Pós-Tatuagem: Guia Completo",
    excerpt: "Um guia detalhado sobre como cuidar adequadamente de uma tatuagem recém-feita...",
    category: "Cuidados",
    status: "published",
    author: "Dr. Carlos Medeiros",
    publishDate: "2024-07-12",
    views: 980,
    likes: 156,
    comments: 45,
    readTime: "8 min",
    featured: false
  },
  {
    id: 3,
    title: "História da Tatuagem no Brasil",
    excerpt: "Uma jornada através da evolução da arte da tatuagem em território brasileiro...",
    category: "História",
    status: "draft",
    author: "Maria Santos",
    publishDate: null,
    views: 0,
    likes: 0,
    comments: 0,
    readTime: "12 min",
    featured: false
  }
];

const NaveMaeBlog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPosts = mockBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Rascunho';
      case 'scheduled': return 'Agendado';
      case 'archived': return 'Arquivado';
      default: return status;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Tendências': return 'bg-purple-100 text-purple-800';
      case 'Cuidados': return 'bg-blue-100 text-blue-800';
      case 'História': return 'bg-yellow-100 text-yellow-800';
      case 'Técnicas': return 'bg-red-100 text-red-800';
      case 'Produtos': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPosts = mockBlogPosts.length;
  const publishedPosts = mockBlogPosts.filter(p => p.status === 'published').length;
  const draftPosts = mockBlogPosts.filter(p => p.status === 'draft').length;
  const totalViews = mockBlogPosts.reduce((acc, p) => acc + p.views, 0);

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total de Posts</p>
                  <p className="text-3xl font-bold text-blue-800">{totalPosts}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Publicados</p>
                  <p className="text-3xl font-bold text-green-800">{publishedPosts}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Rascunhos</p>
                  <p className="text-3xl font-bold text-yellow-800">{draftPosts}</p>
                </div>
                <Edit className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Views</p>
                  <p className="text-3xl font-bold text-purple-800">{totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-96 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4 items-center">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    <SelectItem value="Tendências">Tendências</SelectItem>
                    <SelectItem value="Cuidados">Cuidados</SelectItem>
                    <SelectItem value="História">História</SelectItem>
                    <SelectItem value="Técnicas">Técnicas</SelectItem>
                    <SelectItem value="Produtos">Produtos</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                      {post.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Destaque
                        </Badge>
                      )}
                      <Badge className={`${getCategoryColor(post.category)}`}>
                        {post.category}
                      </Badge>
                      <Badge className={`${getStatusColor(post.status)}`}>
                        {getStatusText(post.status)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{post.excerpt}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      {post.publishDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.publishDate).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        {post.views.toLocaleString()} visualizações
                      </div>
                      <span>{post.readTime} leitura</span>
                    </div>
                  </div>
                </div>

                {post.status === 'published' && (
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{post.views}</div>
                      <div className="text-xs text-gray-500">Visualizações</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">{post.likes}</div>
                      <div className="text-xs text-gray-500">Curtidas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{post.comments}</div>
                      <div className="text-xs text-gray-500">Comentários</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {post.status === 'published' && (
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Visualizar
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  {post.status === 'draft' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Publicar
                    </Button>
                  )}
                  {post.status === 'published' && (
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      Analytics
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum post encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca' 
                : 'Crie o primeiro post do blog corporativo'
              }
            </p>
          </div>
        )}
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeBlog;
