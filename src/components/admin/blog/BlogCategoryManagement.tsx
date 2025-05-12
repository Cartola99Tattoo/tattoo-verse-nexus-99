
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Save, Trash, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface EditingCategory extends Partial<Category> {
  isNew?: boolean;
}

const BlogCategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar as categorias. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddCategory = () => {
    setEditingCategory({
      name: '',
      description: '',
      isNew: true
    });
  };
  
  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category });
  };
  
  const handleSaveCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome da categoria é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (editingCategory.isNew) {
        // Create new category
        const { data, error } = await supabase
          .from('blog_categories')
          .insert({
            name: editingCategory.name,
            description: editingCategory.description || null
          })
          .select();
        
        if (error) throw error;
        
        toast({
          title: "Categoria adicionada",
          description: "Nova categoria adicionada com sucesso.",
        });
        
        if (data) {
          setCategories([...categories, data[0]]);
        }
      } else {
        // Update existing category
        const { data, error } = await supabase
          .from('blog_categories')
          .update({
            name: editingCategory.name,
            description: editingCategory.description || null
          })
          .eq('id', editingCategory.id)
          .select();
        
        if (error) throw error;
        
        toast({
          title: "Categoria atualizada",
          description: "Categoria atualizada com sucesso.",
        });
        
        if (data) {
          setCategories(categories.map(cat => 
            cat.id === editingCategory.id ? data[0] : cat
          ));
        }
      }
      
      // Clear editing state
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Erro ao salvar categoria",
        description: "Não foi possível salvar a categoria. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      // Check if category is used in any blog post
      const { data: posts, error: checkError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('category_id', categoryId);
      
      if (checkError) throw checkError;
      
      if (posts && posts.length > 0) {
        toast({
          title: "Não é possível excluir",
          description: `Esta categoria está sendo usada em ${posts.length} artigos. Remova a categoria dos artigos primeiro.`,
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
      
      toast({
        title: "Categoria excluída",
        description: "Categoria excluída com sucesso.",
      });
      
      setCategories(categories.filter(cat => cat.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Erro ao excluir categoria",
        description: "Não foi possível excluir a categoria. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };
  
  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Categorias do Blog</CardTitle>
          <CardDescription>Gerencie as categorias do seu blog</CardDescription>
        </div>
        <Button onClick={handleAddCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
          </div>
        ) : (
          <>
            {editingCategory && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="text-lg font-medium mb-3">
                  {editingCategory.isNew ? 'Nova Categoria' : 'Editar Categoria'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="categoryName" className="block text-sm font-medium mb-1">
                      Nome
                    </label>
                    <Input
                      id="categoryName"
                      value={editingCategory.name || ''}
                      onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                      placeholder="Nome da categoria"
                    />
                  </div>
                  <div>
                    <label htmlFor="categoryDescription" className="block text-sm font-medium mb-1">
                      Descrição
                    </label>
                    <Textarea
                      id="categoryDescription"
                      value={editingCategory.description || ''}
                      onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                      placeholder="Breve descrição da categoria"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveCategory}>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                        Nenhuma categoria encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description || '—'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza de que deseja excluir a categoria "{category.name}"? 
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                                    Confirmar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogCategoryManagement;
