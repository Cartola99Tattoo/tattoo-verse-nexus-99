import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Trash2, Eye, Filter, Users, Target, Lightbulb, Calendar, BarChart3, FileText, TrendingUp, Clock, CheckCircle2, Maximize2, Minimize2 } from "lucide-react";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getBlogService } from "@/services/serviceFactory";
import { BlogQueryParams } from "@/services/interfaces/IBlogService";
import { toast } from "@/hooks/use-toast";
import BlogPostForm from "@/components/admin/BlogPostForm";
import BlogCategoryManager from "@/components/admin/BlogCategoryManager";
import PersonaManager from "@/components/admin/PersonaManager";
import JourneyManager from "@/components/admin/JourneyManager";
import ContentProductionKanban from "@/components/admin/ContentProductionKanban";
import { ContentIdea, CreateContentIdeaData } from "@/types/contentIdea";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("production");
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [isKanbanFullscreen, setIsKanbanFullscreen] = useState(false);

  const blogService = getBlogService();

  const queryParams: BlogQueryParams = {
    search: searchTerm || undefined,
    status: selectedStatus === "all" ? undefined : selectedStatus as any,
    limit: 20,
    sort: 'latest'
  };

  const { data: blogData, loading, error, refresh } = useDataQuery(
    () => blogService.fetchBlogPosts(queryParams),
    [searchTerm, selectedStatus]
  );

  const { data: categories } = useDataQuery(
    () => blogService.fetchBlogCategories(),
    []
  );

  const { data: personas } = useDataQuery(
    () => Promise.resolve([]), // Mock - in real app this would fetch personas
    []
  );

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

  const handleDeletePost = async (postId: string) => {
    if (!blogService.deleteBlogPost) {
      toast({
        title: "Erro",
        description: "Funcionalidade não disponível no modo mock",
        variant: "destructive"
      });
      return;
    }

    try {
      await blogService.deleteBlogPost(postId);
      toast({
        title: "Sucesso",
        description: "Artigo excluído com sucesso!"
      });
      refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir artigo",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Rascunho';
      case 'archived': return 'Arquivado';
      default: return status;
    }
  };

  const toggleKanbanFullscreen = () => {
    setIsKanbanFullscreen(!isKanbanFullscreen);
  };

  // Handle fullscreen exit with Escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isKanbanFullscreen) {
        setIsKanbanFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isKanbanFullscreen]);

  // Calcular métricas do dashboard de progresso - usando propriedades corretas
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
        categories={categories || []}
        personas={personas || []}
        onSave={() => {
          setShowCreateForm(false);
          setEditingPost(null);
          refresh();
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
        {/* Fullscreen Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-3 md:p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black">
                Kanban de Produção - Modo Foco Total
              </h1>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 font-bold shadow-xl transition-all duration-300 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
              >
                <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Adicionar Card</span>
                <span className="sm:hidden">Card</span>
              </Button>
            </div>
            <Button
              onClick={toggleKanbanFullscreen}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
            >
              <Minimize2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Sair do Foco Total</span>
              <span className="hidden sm:inline lg:hidden">Foco Total</span>
              <span className="sm:hidden">Foco</span>
            </Button>
          </div>
        </div>

        {/* Fullscreen Kanban */}
        <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] overflow-hidden">
          <ContentProductionKanban 
            ideas={ideas} 
            personas={personas || []}
            categories={categories || []}
            onIdeaStatusUpdate={handleIdeaStatusUpdate}
            onIdeaCreate={handleCreateIdea}
            onIdeaUpdate={handleUpdateIdea}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with Action Buttons POSICIONADOS À ESQUERDA */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 md:gap-6">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tattoo-title-gradient bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-3 md:mb-4">
            Centro de Produção de Conteúdo 99Tattoo
          </h1>
          
          {/* Botões de Ação Principais - POSICIONADOS À ESQUERDA COM BOTÃO DE TELA CHEIA */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            <Button 
              onClick={() => setShowCreateForm(true)} 
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold text-sm md:text-base px-3 md:px-4 py-2"
            >
              <Plus className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Novo Artigo</span>
              <span className="sm:hidden">Artigo</span>
            </Button>
            
            <Button
              onClick={toggleKanbanFullscreen}
              className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm md:text-base px-3 md:px-4 py-2"
            >
              <Maximize2 className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
              <span className="hidden lg:inline">Modo Foco Total</span>
              <span className="hidden sm:inline lg:hidden">Foco Total</span>
              <span className="sm:hidden">Foco</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 bg-gradient-to-r from-red-50 to-red-100 border-red-200 shadow-lg">
          <TabsTrigger 
            value="production" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white font-bold text-xs md:text-sm"
          >
            <BarChart3 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Produção Central</span>
            <span className="sm:hidden">Produção</span>
          </TabsTrigger>
          <TabsTrigger 
            value="posts" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white font-bold text-xs md:text-sm"
          >
            <FileText className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Artigos
          </TabsTrigger>
          <TabsTrigger 
            value="categories" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white font-bold text-xs md:text-sm hidden md:flex"
          >
            Categorias
          </TabsTrigger>
          <TabsTrigger 
            value="personas" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white font-bold text-xs md:text-sm hidden md:flex"
          >
            <Users className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Personas
          </TabsTrigger>
          <TabsTrigger 
            value="journey" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white font-bold text-xs md:text-sm hidden md:flex"
          >
            <Target className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Jornada
          </TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="space-y-4 md:space-y-6">
          {/* Dashboard de Progresso Visual - Layout Mais Adaptativo e Fluido */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
            <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-red-700 flex items-center gap-1 md:gap-2 text-xs md:text-sm lg:text-lg font-bold">
                  <Lightbulb className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                  <span className="truncate">Total de Ideias</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl md:text-2xl lg:text-3xl font-black text-red-600">{metrics.totalIdeas}</div>
                <p className="text-xs text-gray-600 mt-1">Cards no Kanban</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-green-700 flex items-center gap-1 md:gap-2 text-xs md:text-sm lg:text-lg font-bold">
                  <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                  <span className="truncate">Rascunhos Desenvolvidos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl md:text-2xl lg:text-3xl font-black text-green-600">{metrics.wellDevelopedDrafts}</div>
                <p className="text-xs text-gray-600 mt-1">Prontos para transformar</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-blue-700 flex items-center gap-1 md:gap-2 text-xs md:text-sm lg:text-lg font-bold">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                  <span className="truncate">Publicados Este Mês</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl md:text-2xl lg:text-3xl font-black text-blue-600">{metrics.publishedThisMonth}</div>
                <p className="text-xs text-gray-600 mt-1">Meta: 8 artigos/mês</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-purple-700 flex items-center gap-1 md:gap-2 text-xs md:text-sm lg:text-lg font-bold">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                  <span className="truncate">Em Produção</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl md:text-2xl lg:text-3xl font-black text-purple-600">
                  {(metrics.statusCounts['Em Produção'] || 0) + (metrics.statusCounts['Em Revisão'] || 0)}
                </div>
                <p className="text-xs text-gray-600 mt-1">Cards ativos</p>
              </CardContent>
            </Card>
          </div>

          {/* Header do Kanban */}
          <div className="bg-gradient-to-r from-red-100 to-red-200 p-3 md:p-4 lg:p-6 rounded-lg border-2 border-red-300 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-red-800 mb-1 md:mb-2">
                  Kanban de Produção de Conteúdo
                </h2>
                <p className="text-xs md:text-sm lg:text-base text-red-700 font-medium">
                  Gerencie suas ideias de conteúdo desde a concepção até a publicação
                </p>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
                >
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Adicionar Card</span>
                  <span className="sm:hidden">Card</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Kanban Unificado de Produção */}
          <ContentProductionKanban 
            ideas={ideas} 
            personas={personas || []}
            categories={categories || []}
            onIdeaStatusUpdate={handleIdeaStatusUpdate}
            onIdeaCreate={handleCreateIdea}
            onIdeaUpdate={handleUpdateIdea}
          />
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          {/* Filtros */}
          <Card variant="tattooRed" className="tattoo-card-enhanced">
            <CardHeader variant="red">
              <CardTitle className="flex items-center gap-2 tattoo-title-red">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full tattoo-input-enhanced"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-red-200 rounded-md tattoo-input-enhanced focus:border-red-600 focus:ring-2 focus:ring-red-200"
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
          <Card variant="tattooRed" className="tattoo-card-enhanced">
            <CardHeader variant="red">
              <CardTitle className="tattoo-title-red">Artigos ({blogData?.totalPosts || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="tattoo-loading h-8 w-32 mx-auto rounded-md"></div>
                  <p className="mt-2 text-gray-600">Carregando artigos...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">Erro ao carregar artigos</div>
              ) : !blogData?.posts?.length ? (
                <div className="text-center py-8 text-gray-500">Nenhum artigo encontrado</div>
              ) : (
                <div className="space-y-4">
                  {blogData.posts.map((post) => (
                    <div key={post.id} className="border border-red-200 rounded-lg p-4 bg-gradient-to-br from-white to-red-50 hover:shadow-red-glow transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg tattoo-title-red">{post.title}</h3>
                            <Badge className={`${getStatusColor('published')} shadow-md`}>
                              {getStatusLabel('published')}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              Autor: {post.profiles ? 
                                (Array.isArray(post.profiles) ? 
                                  `${post.profiles[0]?.first_name} ${post.profiles[0]?.last_name}` :
                                  `${post.profiles.first_name} ${post.profiles.last_name}`
                                ) : 'Equipe 99Tattoo'}
                            </span>
                            <span>•</span>
                            <span>
                              {post.published_at ? 
                                new Date(post.published_at).toLocaleDateString('pt-BR') : 
                                'Sem data'
                              }
                            </span>
                            {post.blog_categories && (
                              <>
                                <span>•</span>
                                <span>
                                  {Array.isArray(post.blog_categories) ?
                                    post.blog_categories[0]?.name :
                                    post.blog_categories.name
                                  }
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/blog/${post.slug || post.id}`, '_blank')}
                            className="tattoo-button-secondary hover:bg-red-50 hover:border-red-300"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingPost(post)}
                            className="tattoo-button-secondary hover:bg-red-50 hover:border-red-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm('Tem certeza que deseja excluir este artigo?')) {
                                handleDeletePost(post.id);
                              }
                            }}
                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <BlogCategoryManager categories={categories || []} onUpdate={refresh} />
        </TabsContent>

        <TabsContent value="personas">
          <PersonaManager />
        </TabsContent>

        <TabsContent value="journey">
          <JourneyManager personas={personas || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Blog;
