
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Trash2, Eye, Filter } from "lucide-react";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getBlogService } from "@/services/serviceFactory";
import { BlogQueryParams } from "@/services/interfaces/IBlogService";
import { toast } from "@/hooks/use-toast";
import BlogPostForm from "@/components/admin/BlogPostForm";
import BlogCategoryManager from "@/components/admin/BlogCategoryManager";

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
        <h1 className="text-3xl font-bold">Blog</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Artigo
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="posts">Artigos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
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
                    className="w-full"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border rounded-md"
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
          <Card>
            <CardHeader>
              <CardTitle>Artigos ({blogData?.totalPosts || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando artigos...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">Erro ao carregar artigos</div>
              ) : !blogData?.posts?.length ? (
                <div className="text-center py-8 text-gray-500">Nenhum artigo encontrado</div>
              ) : (
                <div className="space-y-4">
                  {blogData.posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{post.title}</h3>
                            <Badge className={getStatusColor('published')}>
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
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingPost(post)}
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
      </Tabs>
    </div>
  );
};

export default Blog;
