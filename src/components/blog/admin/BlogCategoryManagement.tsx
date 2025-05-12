
import React, { useState } from 'react';
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
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useBlogCategories } from '@/hooks/useBlogCategories';
import { BlogCategory } from '@/types/blog';
import { useQueryClient } from '@tanstack/react-query';

interface EditingCategory extends Partial<BlogCategory> {
  isNew?: boolean;
}

const BlogCategoryManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading } = useBlogCategories();
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  
  const handleAddCategory = () => {
    setEditingCategory({
      name: '',
      description: '',
      isNew: true
    });
  };
  
  const handleEditCategory = (category: BlogCategory) => {
    setEditingCategory({ ...category });
  };
  
  const handleSaveCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast({
        title: "Name required",
        description: "Category name is required.",
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
          title: "Category added",
          description: "New category added successfully.",
        });
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
          title: "Category updated",
          description: "Category updated successfully.",
        });
      }
      
      // Invalidate the categories query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      
      // Clear editing state
      setEditingCategory(null);
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: "Error saving category",
        description: error.message || "Could not save the category. Try again later.",
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
          title: "Cannot delete",
          description: `This category is used in ${posts.length} posts. Remove the category from posts first.`,
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
        title: "Category deleted",
        description: "Category deleted successfully.",
      });
      
      // Invalidate the categories query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error deleting category",
        description: error.message || "Could not delete the category. Try again later.",
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
          <CardTitle>Blog Categories</CardTitle>
          <CardDescription>Manage your blog categories</CardDescription>
        </div>
        <Button onClick={handleAddCategory}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
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
                  {editingCategory.isNew ? 'New Category' : 'Edit Category'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="categoryName" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <Input
                      id="categoryName"
                      value={editingCategory.name || ''}
                      onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                      placeholder="Category name"
                    />
                  </div>
                  <div>
                    <label htmlFor="categoryDescription" className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <Textarea
                      id="categoryDescription"
                      value={editingCategory.description || ''}
                      onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                      placeholder="Brief category description"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button onClick={handleSaveCategory}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                        No categories found
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
                                  <AlertDialogTitle>Delete category</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the category "{category.name}"? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                                    Confirm
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
