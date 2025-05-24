
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, X } from "lucide-react";
import { getBlogService } from "@/services/serviceFactory";
import { BlogCategory, CreateBlogPostData, UpdateBlogPostData } from "@/services/interfaces/IBlogService";
import { toast } from "@/hooks/use-toast";
import EnhancedRichTextEditor from "@/components/admin/EnhancedRichTextEditor";
import BlogPreview from "@/components/admin/BlogPreview";

interface BlogPostFormProps {
  post?: any;
  categories: BlogCategory[];
  onSave: () => void;
  onCancel: () => void;
}

const BlogPostForm = ({ post, categories, onSave, onCancel }: BlogPostFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    author_id: 'admin',
    category_id: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    published_at: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    tags: [] as string[]
  });

  const [currentTag, setCurrentTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const blogService = getBlogService();

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        cover_image: post.cover_image || '',
        author_id: post.author_id || 'admin',
        category_id: post.category_id || '',
        status: post.status || 'draft',
        published_at: post.published_at ? post.published_at.split('T')[0] : '',
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        meta_keywords: post.meta_keywords || '',
        tags: post.tags || []
      });
    }
  }, [post]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      meta_title: prev.meta_title || title
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (post) {
        if (blogService.updateBlogPost) {
          const updateData: UpdateBlogPostData = {
            id: post.id,
            ...formData,
            tags: formData.tags.length > 0 ? formData.tags : undefined
          };
          await blogService.updateBlogPost(updateData);
          toast({
            title: "Sucesso",
            description: "Artigo atualizado com sucesso!"
          });
        } else {
          toast({
            title: "Aviso",
            description: "Modo mock - artigo não foi salvo no banco de dados"
          });
        }
      } else {
        if (blogService.createBlogPost) {
          const createData: CreateBlogPostData = {
            ...formData,
            tags: formData.tags.length > 0 ? formData.tags : undefined
          };
          await blogService.createBlogPost(createData);
          toast({
            title: "Sucesso",
            description: "Artigo criado com sucesso!"
          });
        } else {
          toast({
            title: "Aviso",
            description: "Modo mock - artigo não foi salvo no banco de dados"
          });
        }
      }
      onSave();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar artigo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category_id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">
            {post ? 'Editar Artigo' : 'Novo Artigo'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            disabled={!formData.title || !formData.content}
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            Pré-visualizar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Conteúdo do Artigo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Digite o título do artigo..."
                  className="border-red-200 focus:border-red-500"
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Amigável (Slug)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="meu-artigo-sobre-tatuagem"
                  className="border-red-200 focus:border-red-500"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Breve descrição do artigo..."
                  rows={3}
                  className="border-red-200 focus:border-red-500"
                />
              </div>

              <div>
                <Label>Conteúdo *</Label>
                <EnhancedRichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publicação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Publicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-red-200 rounded-md focus:border-red-500 focus:outline-none"
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Arquivado</option>
                </select>
              </div>

              <div>
                <Label htmlFor="published_at">Data de Publicação</Label>
                <Input
                  id="published_at"
                  type="date"
                  value={formData.published_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
                  className="border-red-200 focus:border-red-500"
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <select
                  id="category"
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-red-200 rounded-md focus:border-red-500 focus:outline-none"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Imagem Destacada */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Imagem Destacada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.cover_image && (
                <div className="relative">
                  <img
                    src={formData.cover_image}
                    alt="Imagem destacada"
                    className="w-full h-32 object-cover rounded"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData(prev => ({ ...prev, cover_image: '' }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setFormData(prev => ({ ...prev, cover_image: imageUrl }));
                    }
                  }}
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              <div>
                <Input
                  value={formData.cover_image}
                  onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                  placeholder="Ou cole a URL da imagem..."
                  className="border-red-200 focus:border-red-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Nova tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="border-red-200 focus:border-red-500"
                />
                <Button 
                  onClick={addTag} 
                  disabled={!currentTag.trim()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  +
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer bg-red-100 text-red-800">
                    {tag}
                    <X
                      className="h-3 w-3 ml-1"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Título</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="Título para SEO..."
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              <div>
                <Label htmlFor="meta_description">Meta Descrição</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Descrição para SEO..."
                  rows={3}
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              <div>
                <Label htmlFor="meta_keywords">Palavras-chave</Label>
                <Input
                  id="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                  placeholder="palavra1, palavra2, palavra3..."
                  className="border-red-200 focus:border-red-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <BlogPreview
          title={formData.title}
          content={formData.content}
          excerpt={formData.excerpt}
          coverImage={formData.cover_image}
          tags={formData.tags}
          category={selectedCategory?.name}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default BlogPostForm;
