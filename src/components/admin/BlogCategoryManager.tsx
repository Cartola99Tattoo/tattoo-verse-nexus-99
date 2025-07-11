
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { BlogCategory } from "@/services/interfaces/IBlogService";
import { getBlogService } from "@/services/serviceFactory";
import { toast } from "@/hooks/use-toast";

interface BlogCategoryManagerProps {
  categories: BlogCategory[];
  onUpdate: () => void;
}

const BlogCategoryManager = ({ categories, onUpdate }: BlogCategoryManagerProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const blogService = getBlogService();

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setShowCreateForm(false);
    setEditingCategory(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingCategory) {
        // Update category
        if (blogService.updateBlogCategory) {
          await blogService.updateBlogCategory(editingCategory.id, formData);
          toast({
            title: "Sucesso",
            description: "Categoria atualizada com sucesso!"
          });
        } else {
          toast({
            title: "Aviso",
            description: "Modo mock - categoria não foi salva no banco de dados"
          });
        }
      } else {
        // Create category
        if (blogService.createBlogCategory) {
          await blogService.createBlogCategory(formData);
          toast({
            title: "Sucesso",
            description: "Categoria criada com sucesso!"
          });
        } else {
          toast({
            title: "Aviso",
            description: "Modo mock - categoria não foi salva no banco de dados"
          });
        }
      }
      resetForm();
      onUpdate();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar categoria",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      if (blogService.deleteBlogCategory) {
        await blogService.deleteBlogCategory(categoryId);
        toast({
          title: "Sucesso",
          description: "Categoria excluída com sucesso!"
        });
        onUpdate();
      } else {
        toast({
          title: "Aviso",
          description: "Modo mock - categoria não foi excluída do banco de dados"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir categoria",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categorias do Blog</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="category-name">Nome *</Label>
              <Input
                id="category-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome da categoria..."
              />
            </div>
            <div>
              <Label htmlFor="category-description">Descrição</Label>
              <Textarea
                id="category-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da categoria..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias Existentes ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma categoria encontrada
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      {category.description && (
                        <p className="text-gray-600 mt-1">{category.description}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Criada em: {new Date(category.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
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
    </div>
  );
};

export default BlogCategoryManager;
