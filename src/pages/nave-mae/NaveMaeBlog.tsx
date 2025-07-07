import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Trash2, Eye, Filter, Users, Target, Lightbulb, Calendar, BarChart3, FileText, TrendingUp, Clock, CheckCircle2, Maximize2, Minimize2 } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";
import BlogPostForm from "@/components/admin/BlogPostForm";
import BlogCategoryManager from "@/components/admin/BlogCategoryManager";
import ContentProductionKanban from "@/components/admin/ContentProductionKanban";
import { ContentIdea, CreateContentIdeaData } from "@/types/contentIdea";
import { toast } from "@/hooks/use-toast";

// Mock data expandido e unificado
const mockBlogPosts = [
  {
    id: 1,
    title: "Tendências de Tatuagem 2024: O Que Está Dominando o Mercado",
    slug: "tendencias-tatuagem-2024",
    excerpt: "Explore as principais tendências que estão moldando o mundo da tatuagem neste ano, desde o minimalismo até técnicas inovadoras.",
    content: "# Tendências de Tatuagem 2024\n\nO mundo da tatuagem está em constante evolução...",
    category: "Tendências",
    status: "published",
    author: "Carolina Silva",
    publishDate: "2024-01-15",
    views: 2450,
    likes: 189,
    comments: 34,
    readTime: "8 min",
    featured: true,
    cover_image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=800&auto=format&fit=crop&q=60",
    tags: ["tendências", "2024", "estilos", "técnicas"]
  },
  {
    id: 2,
    title: "Cuidados Pós-Tatuagem: Guia Completo para Cicatrização",
    slug: "cuidados-pos-tatuagem-guia-completo",
    excerpt: "Um guia detalhado sobre como cuidar adequadamente de uma tatuagem recém-feita para garantir a melhor cicatrização.",
    content: "# Cuidados Pós-Tatuagem\n\nA cicatrização adequada é fundamental...",
    category: "Cuidados",
    status: "published",
    author: "Dr. Ricardo Mendes",
    publishDate: "2024-01-12",
    views: 1890,
    likes: 234,
    comments: 67,
    readTime: "10 min",
    featured: false,
    cover_image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=800&auto=format&fit=crop&q=60",
    tags: ["cuidados", "cicatrização", "saúde", "dicas"]
  },
  {
    id: 3,
    title: "Marketing Digital para Tatuadores: Construindo sua Marca Online",
    slug: "marketing-digital-tatuadores",
    excerpt: "Estratégias eficazes de marketing digital para tatuadores que querem expandir sua clientela e fortalecer sua marca.",
    content: "# Marketing Digital para Tatuadores\n\nNo mundo digital atual...",
    category: "Marketing",
    status: "published",
    author: "Ana Paula Costa",
    publishDate: "2024-01-10",
    views: 1340,
    likes: 98,
    comments: 23,
    readTime: "12 min",
    featured: false,
    cover_image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=60",
    tags: ["marketing", "digital", "negócios", "redes sociais"]
  },
  {
    id: 4,
    title: "Técnicas de Sombreamento: Dominando o Blackwork",
    slug: "tecnicas-sombreamento-blackwork",
    excerpt: "Aprenda as técnicas fundamentais de sombreamento no estilo blackwork e eleve o nível das suas tatuagens.",
    content: "# Técnicas de Sombreamento Blackwork\n\nO blackwork é uma arte...",
    category: "Técnicas",
    status: "draft",
    author: "Marcos Oliveira",
    publishDate: null,
    views: 0,
    likes: 0,
    comments: 0,
    readTime: "15 min",
    featured: false,
    cover_image: "https://images.unsplash.com/photo-1543767271-7c5f36dc5310?w=800&auto=format&fit=crop&q=60",
    tags: ["blackwork", "técnicas", "sombreamento", "tutorial"]
  },
  {
    id: 5,
    title: "História da Tatuagem: Das Origens aos Dias Atuais",
    slug: "historia-tatuagem-origens",
    excerpt: "Uma jornada através da rica história da tatuagem, desde suas origens ancestrais até as tendências modernas.",
    content: "# História da Tatuagem\n\nA tatuagem é uma das formas de arte mais antigas...",
    category: "História",
    status: "published",
    author: "Prof. Helena Ribeiro",
    publishDate: "2024-01-08",
    views: 890,
    likes: 145,
    comments: 18,
    readTime: "18 min",
    featured: false,
    cover_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60",
    tags: ["história", "cultura", "arte", "tradição"]
  }
];

const mockCategories = [
  { id: "1", name: "Tendências", description: "Últimas tendências do mundo da tatuagem", created_at: "2024-01-01" },
  { id: "2", name: "Cuidados", description: "Cuidados e manutenção de tatuagens", created_at: "2024-01-01" },
  { id: "3", name: "Marketing", description: "Marketing e negócios para tatuadores", created_at: "2024-01-01" },
  { id: "4", name: "Técnicas", description: "Técnicas e tutoriais de tatuagem", created_at: "2024-01-01" },
  { id: "5", name: "História", description: "História e cultura da tatuagem", created_at: "2024-01-01" },
  { id: "6", name: "Equipamentos", description: "Equipamentos e materiais", created_at: "2024-01-01" },
  { id: "7", name: "Negócios", description: "Gestão de estúdios e negócios", created_at: "2024-01-01" }
];

const NaveMaeBlog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("production");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [isKanbanFullscreen, setIsKanbanFullscreen] = useState(false);

  const filteredPosts = mockBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateIdea = (data: CreateContentIdeaData) => {
    const newIdea: ContentIdea = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setIdeas(prev => [...prev, newIdea]);
  };

  const handleUpdateIdea = (ideaToUpdate: ContentIdea, data: CreateContentIdeaData) => {
    const updatedIdea: ContentIdea = {
      ...ideaToUpdate,
      ...data,
      updated_at: new Date().toISOString(),
    };
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaToUpdate.id ? updatedIdea : idea
    ));
  };

  const handleIdeaStatusUpdate = (ideaId: string, newStatus: ContentIdea['status']) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId ? { ...idea, status: newStatus, updated_at: new Date().toISOString() } : idea
    ));
    toast({
      title: "Status Atualizado!",
      description: `A ideia foi movida para "${newStatus}".`
    });
  };

  const handleDeletePost = (postId: string) => {
    toast({
      title: "Artigo Excluído",
      description: "O artigo foi removido com sucesso (simulado)."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Rascunho';
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
      case 'Marketing': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleKanbanFullscreen = () => {
    setIsKanbanFullscreen(!isKanbanFullscreen);
  };

  // Métricas do dashboard
  const totalPosts = mockBlogPosts.length;
  const publishedPosts = mockBlogPosts.filter(p => p.status === 'published').length;
  const draftPosts = mockBlogPosts.filter(p => p.status === 'draft').length;
  const totalViews = mockBlogPosts.reduce((acc, p) => acc + p.views, 0);

  const getDashboardMetrics = () => {
    const statusCounts = ideas.reduce((acc, idea) => {
      acc[idea.status] = (acc[idea.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const publishedThisMonth = ideas.filter(idea => 
      idea.status === 'Publicado' && 
      new Date(idea.updated_at).getMonth() === new Date().getMonth()
    ).length;

    const wellDevelopedDrafts = ideas.filter(idea => {
      const draftCount = [
        idea.draftTitles?.length ? idea.draftTitles[0] : null, 
        idea.draftSummary, 
        idea.draftContent
      ].filter(Boolean).length;
      return draftCount >= 2;
    }).length;

    return {
      statusCounts,
      publishedThisMonth,
      wellDevelopedDrafts,
      totalIdeas: ideas.length
    };
  };

  const metrics = getDashboardMetrics();

  if (showCreateForm || editingPost) {
    return (
      <BlogPostForm
        post={editingPost}
        categories={mockCategories || []}
        personas={[]}
        onSave={() => {
          setShowCreateForm(false);
          setEditingPost(null);
          toast({
            title: "Sucesso!",
            description: editingPost ? "Artigo atualizado com sucesso!" : "Novo artigo criado com sucesso!"
          });
        }}
        onCancel={() => {
          setShowCreateForm(false);
          setEditingPost(null);
        }}
      />
    );
  }

  // Render fullscreen Kanban
  if (isKanbanFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-white to-red-50 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl lg:text-3xl font-black">
                Kanban de Produção - Modo Foco Total
              </h1>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-white hover:bg-purple-50 text-purple-600 hover:text-purple-700 font-bold shadow-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Artigo
              </Button>
            </div>
            <Button
              onClick={toggleKanbanFullscreen}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Minimize2 className="h-4 w-4 mr-2" />
              Sair do Foco Total
            </Button>
          </div>
        </div>

        <div className="h-[calc(100vh-80px)] overflow-hidden">
          <ContentProductionKanban 
            ideas={ideas} 
            personas={[]}
            categories={mockCategories || []}
            onIdeaStatusUpdate={handleIdeaStatusUpdate}
            onIdeaCreate={handleCreateIdea}
            onIdeaUpdate={handleUpdateIdea}
          />
        </div>
      </div>
    );
  }

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
              Centro de Produção de Conteúdo - Blog 99Tattoo
            </h1>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => setShowCreateForm(true)} 
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold"
              >
                <Plus className="h-5 w-5 mr-2" />
                Novo Artigo
              </Button>
              
              <Button
                onClick={toggleKanbanFullscreen}
                className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Maximize2 className="h-5 w-5 mr-2" />
                Modo Foco Total
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 shadow-lg">
            <TabsTrigger 
              value="production" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-800 data-[state=active]:text-white font-bold"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Produção
            </TabsTrigger>
            <TabsTrigger 
              value="posts" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-800 data-[state=active]:text-white font-bold"
            >
              <FileText className="h-4 w-4 mr-1" />
              Artigos
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-800 data-[state=active]:text-white font-bold"
            >
              Categorias
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-800 data-[state=active]:text-white font-bold"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-800 data-[state=active]:text-white font-bold"
            >
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="production" className="space-y-6">
            {/* Dashboard de Métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-purple-700 flex items-center gap-2 text-lg font-bold">
                    <FileText className="h-5 w-5" />
                    Total de Artigos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-purple-600">{totalPosts}</div>
                  <p className="text-xs text-gray-600 mt-1">No sistema</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-700 flex items-center gap-2 text-lg font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    Publicados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-green-600">{publishedPosts}</div>
                  <p className="text-xs text-gray-600 mt-1">Artigos ao vivo</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-yellow-50 border-yellow-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-yellow-700 flex items-center gap-2 text-lg font-bold">
                    <Clock className="h-5 w-5" />
                    Rascunhos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-yellow-600">{draftPosts}</div>
                  <p className="text-xs text-gray-600 mt-1">Em desenvolvimento</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-700 flex items-center gap-2 text-lg font-bold">
                    <Eye className="h-5 w-5" />
                    Visualizações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-blue-600">{totalViews.toLocaleString()}</div>
                  <p className="text-xs text-gray-600 mt-1">Total de views</p>
                </CardContent>
              </Card>
            </div>

            {/* Kanban Header */}
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-6 rounded-lg border-2 border-purple-300 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-black text-purple-800 mb-2">
                    Kanban de Produção de Conteúdo
                  </h2>
                  <p className="text-purple-700 font-medium">
                    Gerencie suas ideias de conteúdo desde a concepção até a publicação
                  </p>
                </div>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Card
                </Button>
              </div>
            </div>

            {/* Kanban de Produção */}
            <ContentProductionKanban 
              ideas={ideas} 
              personas={[]}
              categories={mockCategories || []}
              onIdeaStatusUpdate={handleIdeaStatusUpdate}
              onIdeaCreate={handleCreateIdea}
              onIdeaUpdate={handleUpdateIdea}
            />
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            {/* Filtros */}
            <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Filter className="h-5 w-5" />
                  Filtros e Busca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por título ou conteúdo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-purple-200 rounded-md focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  >
                    <option value="all">Todas as Categorias</option>
                    {mockCategories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-purple-200 rounded-md focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="published">Publicado</option>
                    <option value="draft">Rascunho</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Artigos */}
            <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-purple-700">Artigos de Blog ({filteredPosts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="border border-purple-200 rounded-lg p-4 bg-gradient-to-br from-white to-purple-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-purple-700">{post.title}</h3>
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
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
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
                              {post.views.toLocaleString()} views
                            </div>
                            <span>{post.readTime} leitura</span>
                          </div>

                          {post.status === 'published' && (
                            <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-purple-50 rounded-lg">
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
                              <Button size="sm" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                                <Eye className="h-3 w-3 mr-1" />
                                Visualizar
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-purple-200 text-purple-600 hover:bg-purple-50"
                              onClick={() => setEditingPost(post)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeletePost(post.id.toString())}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <BlogCategoryManager 
              categories={mockCategories}
              onUpdate={() => {
                toast({
                  title: "Categorias Atualizadas",
                  description: "As categorias foram atualizadas com sucesso!"
                });
              }}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-blue-700">Performance de Artigos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockBlogPosts.filter(p => p.status === 'published').slice(0, 3).map(post => (
                      <div key={post.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-blue-900">{post.title}</h4>
                          <p className="text-sm text-blue-600">{post.views} visualizações</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">{post.category}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-green-700">Categorias Mais Populares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCategories.slice(0, 4).map(category => (
                      <div key={category.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-green-900">{category.name}</h4>
                          <p className="text-sm text-green-600">{category.description}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {mockBlogPosts.filter(p => p.category === category.name).length} artigos
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-700">Configurações do Blog</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Configurações Gerais</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">Moderação de Comentários</h4>
                          <p className="text-sm text-gray-600">Aprovar comentários automaticamente</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Ativado</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">SEO Automático</h4>
                          <p className="text-sm text-gray-600">Gerar meta tags automaticamente</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Ativado</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">Notificações</h4>
                          <p className="text-sm text-gray-600">Enviar notificações para novos artigos</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Configurar</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeBlog;
