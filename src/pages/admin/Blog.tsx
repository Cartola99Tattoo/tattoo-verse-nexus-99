import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Trash2, Eye, Filter, Users, Target, Lightbulb, Calendar, BarChart3 } from "lucide-react";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getBlogService } from "@/services/serviceFactory";
import { BlogQueryParams } from "@/services/interfaces/IBlogService";
import { toast } from "@/hooks/use-toast";
import BlogPostForm from "@/components/admin/BlogPostForm";
import BlogCategoryManager from "@/components/admin/BlogCategoryManager";
import PersonaManager from "@/components/admin/PersonaManager";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("posts");

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

  if (showCreateForm || editingPost) {
    return (
      <BlogPostForm
        post={editingPost}
        categories={categories || []}
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tattoo-title-gradient">Blog & Produção de Conteúdo</h1>
        <Button onClick={() => setShowCreateForm(true)} variant="tattoo" className="tattoo-button-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Artigo
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <TabsTrigger value="posts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white">
            Artigos
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white">
            Categorias
          </TabsTrigger>
          <TabsTrigger value="personas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white">
            <Users className="h-4 w-4 mr-1" />
            Personas
          </TabsTrigger>
          <TabsTrigger value="journey" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white">
            <Target className="h-4 w-4 mr-1" />
            Jornada
          </TabsTrigger>
          <TabsTrigger value="ideas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white">
            <Lightbulb className="h-4 w-4 mr-1" />
            Ideias
          </TabsTrigger>
          <TabsTrigger value="production" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4 mr-1" />
            Produção
          </TabsTrigger>
        </TabsList>

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
          <div className="space-y-6">
            <Card variant="tattooRed" className="tattoo-card-enhanced">
              <CardHeader variant="red">
                <CardTitle className="tattoo-title-red flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Jornada de Compra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto text-red-300 mb-4" />
                  <p>Jornada de Compra em desenvolvimento...</p>
                  <p className="text-sm mt-2">Em breve você poderá mapear a jornada completa dos seus clientes aqui.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ideas">
          <div className="space-y-6">
            <Card variant="tattooRed" className="tattoo-card-enhanced">
              <CardHeader variant="red">
                <CardTitle className="tattoo-title-red flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Ideias de Conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Lightbulb className="h-12 w-12 mx-auto text-red-300 mb-4" />
                  <p>Banco de Ideias em desenvolvimento...</p>
                  <p className="text-sm mt-2">Em breve você poderá gerenciar suas ideias de conteúdo de forma estratégica aqui.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="production">
          <div className="space-y-6">
            <Card variant="tattooRed" className="tattoo-card-enhanced">
              <CardHeader variant="red">
                <CardTitle className="tattoo-title-red flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Kanban de Produção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto text-red-300 mb-4" />
                  <p>Kanban de Produção em desenvolvimento...</p>
                  <p className="text-sm mt-2">Em breve você terá um quadro completo para gerenciar a produção de conteúdo aqui.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Blog;
