import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Calendar, Edit, Eye, MoreVertical, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogPost } from '@/hooks/useBlogPost';
import { useSearchParams } from 'react-router-dom';

const BlogPostTable = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get filter values from URL params
  const statusFilter = searchParams.get('status') || 'all';
  const categoryFilter = searchParams.get('category') || '';
  const authorFilter = searchParams.get('author') || '';
  const searchQuery = searchParams.get('search') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const sortBy = searchParams.get('sortBy') || 'published_at:desc';
  
  // Parse the sort parameter
  const [sortField, sortDirection] = sortBy.split(':');

  useEffect(() => {
    fetchPosts();
  }, [currentPage, statusFilter, categoryFilter, authorFilter, searchQuery, startDate, endDate, sortBy]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Build the query
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:author_id(*),
          blog_categories:category_id(*)
        `, { count: 'exact' });
      
      // Apply filters
      if (statusFilter !== 'all') {
        if (statusFilter === 'published') {
          query = query.not('published_at', 'is', null);
        } else if (statusFilter === 'draft') {
          query = query.is('published_at', null).eq('is_draft', true);
        } else if (statusFilter === 'scheduled') {
          const now = new Date().toISOString();
          query = query.gt('published_at', now);
        }
      }
      
      if (categoryFilter) {
        query = query.eq('category_id', categoryFilter);
      }
      
      if (authorFilter) {
        query = query.eq('author_id', authorFilter);
      }
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }
      
      if (startDate && endDate) {
        query = query.gte('created_at', startDate).lte('created_at', endDate);
      } else if (startDate) {
        query = query.gte('created_at', startDate);
      } else if (endDate) {
        query = query.lte('created_at', endDate);
      }
      
      // Apply sorting
      query = query.order(sortField as any, { ascending: sortDirection === 'asc' });
      
      // Apply pagination
      const from = (currentPage - 1) * postsPerPage;
      const to = from + postsPerPage - 1;
      
      const { data, error, count } = await query.range(from, to);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setPosts(data as BlogPost[]);
        if (count !== null) {
          setTotalPosts(count);
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Erro ao carregar artigos",
        description: "Não foi possível carregar os artigos. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(posts.map(post => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedPosts([...selectedPosts, postId]);
    } else {
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      setPosts(posts.filter(post => post.id !== postId));
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
      
      toast({
        title: "Artigo excluído",
        description: "O artigo foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Erro ao excluir artigo",
        description: "Não foi possível excluir o artigo. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .in('id', selectedPosts);
      
      if (error) throw error;
      
      setPosts(posts.filter(post => !selectedPosts.includes(post.id)));
      setSelectedPosts([]);
      
      toast({
        title: "Artigos excluídos",
        description: `${selectedPosts.length} artigos foram excluídos com sucesso.`,
      });
    } catch (error) {
      console.error('Error deleting posts:', error);
      toast({
        title: "Erro ao excluir artigos",
        description: "Não foi possível excluir os artigos. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (post: BlogPost) => {
    if (!post.published_at) {
      return <Badge variant="outline" className="bg-gray-100">Rascunho</Badge>;
    }
    
    const publishDate = new Date(post.published_at);
    const now = new Date();
    
    if (publishDate > now) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          Agendado
        </Badge>
      );
    }
    
    return <Badge variant="outline" className="bg-green-100 text-green-800">Publicado</Badge>;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"><Skeleton className="h-4 w-4" /></TableHead>
                <TableHead><Skeleton className="h-4 w-40" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {selectedPosts.length > 0 && (
        <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedPosts.length} {selectedPosts.length === 1 ? 'artigo' : 'artigos'} selecionado(s)
          </span>
          <div className="space-x-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir artigos</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza de que deseja excluir os {selectedPosts.length} artigos selecionados? 
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={posts.length > 0 && selectedPosts.length === posts.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Visualizações</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-gray-500">Nenhum artigo encontrado</p>
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/admin/blog/new')}
                    className="mt-2"
                  >
                    Criar novo artigo
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedPosts.includes(post.id)}
                      onCheckedChange={(checked) => handleSelectPost(post.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{post.title}</div>
                    {post.slug && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        /{post.slug}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {post.profiles?.first_name} {post.profiles?.last_name}
                  </TableCell>
                  <TableCell>
                    {post.blog_categories?.name || '—'}
                  </TableCell>
                  <TableCell>
                    {formatDate(post.published_at || post.created_at || '')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(post)}
                  </TableCell>
                  <TableCell>
                    {post.view_count || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/admin/blog/edit/${post.id}`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/blog/${post.slug || post.id}`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Link>
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir artigo</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza de que deseja excluir o artigo "{post.title}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(post.id)}>
                                Confirmar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="py-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                
                // Logic to show the current page in the middle when possible
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === pageNum}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default BlogPostTable;
