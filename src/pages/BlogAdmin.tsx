
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useBlogPost, useBlogPosts, useBlogAdmin } from "@/hooks/useBlog";
import BlogEditor from "@/components/blog/BlogEditor";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Eye, Plus, ArrowLeft, Check, X } from "lucide-react";

const BlogAdmin = () => {
  const { action, id } = useParams();
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const { posts, isLoading, refetch } = useBlogPosts({ published_only: false });
  const { data: post } = useBlogPost(id || "");
  const { deletePost, publishPost, unpublishPost } = useBlogAdmin();
  
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  
  useEffect(() => {
    // Redirecionar se não estiver logado
    if (!session) {
      navigate("/auth");
      return;
    }
    
    // Redirecionar se não for admin ou editor
    if (profile && !['admin', 'editor'].includes(profile.role)) {
      navigate("/blog");
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta área.",
        variant: "destructive",
      });
      return;
    }
  }, [session, profile, navigate]);
  
  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      toast({
        title: "Post excluído com sucesso!",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir o post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletePostId(null);
    }
  };
  
  const handlePublishToggle = async (postId: string, isDraft: boolean) => {
    try {
      if (isDraft) {
        await publishPost(postId);
        toast({
          title: "Post publicado com sucesso!",
        });
      } else {
        await unpublishPost(postId);
        toast({
          title: "Post despublicado com sucesso!",
        });
      }
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao alterar status do post",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Página de criação/edição de post
  if (action === "create" || action === "edit") {
    return (
      <Layout>
        <Helmet>
          <title>{action === "create" ? "Novo Post" : "Editar Post"} | 99Tattoo Blog</title>
        </Helmet>
        
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/blog/admin")}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Voltar
              </Button>
              <h1 className="text-3xl font-bold">
                {action === "create" ? "Novo Post" : "Editar Post"}
              </h1>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <BlogEditor post={post} mode={action as "create" | "edit"} />
          </div>
        </div>
      </Layout>
    );
  }
  
  // Página principal da administração do blog
  return (
    <Layout>
      <Helmet>
        <title>Administração do Blog | 99Tattoo</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Gerenciar Blog</h1>
          <Button onClick={() => navigate("/blog/admin/create")} className="flex items-center gap-2">
            <Plus size={16} />
            Novo Post
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          {isLoading ? (
            <div className="text-center py-12">Carregando...</div>
          ) : (
            <>
              {posts && posts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>
                          {post.published_at ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Publicado
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Rascunho
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{post.category?.name || "Sem categoria"}</TableCell>
                        <TableCell>
                          {post.published_at 
                            ? new Date(post.published_at).toLocaleDateString('pt-BR')
                            : new Date(post.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePublishToggle(post.id, !post.published_at)}
                            >
                              {post.published_at ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/blog/${post.slug || post.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/blog/admin/edit/${post.id}`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog open={deletePostId === post.id} onOpenChange={() => setDeletePostId(null)}>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => setDeletePostId(post.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir post</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(post.id)}
                                    className="bg-red-500 hover:bg-red-700"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Nenhum post encontrado.</p>
                  <Button onClick={() => navigate("/blog/admin/create")}>
                    Criar primeiro post
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogAdmin;
