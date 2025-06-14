import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Eye, X, Users, Target, FileText, Image, Tags, Search, Sparkles, CheckCircle2 } from "lucide-react";
import { getBlogService } from "@/services/serviceFactory";
import { BlogCategory, CreateBlogPostData, UpdateBlogPostData } from "@/services/interfaces/IBlogService";
import { toast } from "@/hooks/use-toast";
import { Persona } from "@/types/persona";
import EnhancedRichTextEditor from "@/components/admin/EnhancedRichTextEditor";
import BlogPreview from "@/components/admin/BlogPreview";

interface BlogPostFormProps {
  post?: any;
  categories: BlogCategory[];
  personas?: Persona[];
  initialData?: {
    title?: string;
    excerpt?: string;
    content?: string;
    focusPersonas?: string[];
    purchaseStage?: string;
  };
  onSave: () => void;
  onCancel: () => void;
}

const BlogPostForm = ({ post, categories, personas = [], initialData, onSave, onCancel }: BlogPostFormProps) => {
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
    tags: [] as string[],
    // Campos estratégicos para análise
    focusPersonas: [] as string[],
    purchaseStage: '' as string
  });

  const [currentTag, setCurrentTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const blogService = getBlogService();

  const purchaseStages = [
    'Aprendizado e Descoberta',
    'Reconhecimento do Problema', 
    'Consideração da Solução',
    'Decisão de Compra'
  ];

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
        tags: post.tags || [],
        focusPersonas: post.focusPersonas || [],
        purchaseStage: post.purchaseStage || ''
      });
    } else if (initialData) {
      setFormData(prev => ({
        ...prev,
        title: initialData.title || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        focusPersonas: initialData.focusPersonas || [],
        purchaseStage: initialData.purchaseStage || '',
        meta_title: initialData.title || '',
        slug: initialData.title ? generateSlug(initialData.title) : ''
      }));
    }
  }, [post, initialData]);

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

  const togglePersona = (personaId: string) => {
    setFormData(prev => ({
      ...prev,
      focusPersonas: prev.focusPersonas.includes(personaId)
        ? prev.focusPersonas.filter(id => id !== personaId)
        : [...prev.focusPersonas, personaId]
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
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-red-100 p-6">
      {/* Header com Identidade Visual 99Tattoo APRIMORADO */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 rounded-xl shadow-2xl mb-8 border-2 border-red-400/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="border-white/30 text-white hover:bg-white/10 shadow-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar ao Kanban
            </Button>
            <div>
              <h1 className="text-4xl font-black text-white drop-shadow-lg">
                {post ? 'Editar Artigo Final' : 'Criar Artigo Final'}
              </h1>
              {initialData && (
                <div className="mt-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg px-4 py-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-300" />
                  <p className="text-green-100 font-bold">
                    Criado a partir do rascunho do Kanban
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              disabled={!formData.title || !formData.content}
              className="border-white/30 text-white hover:bg-white/10 shadow-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
            >
              <Eye className="h-5 w-5 mr-2" />
              Pré-visualizar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white shadow-2xl font-black transform hover:scale-105 transition-all duration-300 px-8 py-3"
            >
              <Save className="h-5 w-5 mr-2" />
              {isLoading ? 'Salvando...' : 'Publicar Artigo'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal - Conteúdo do Artigo */}
        <div className="lg:col-span-2 space-y-8">
          {/* Card de Conteúdo Principal */}
          <Card className="bg-white border-2 border-red-200 shadow-2xl shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-lg p-6">
              <CardTitle className="flex items-center gap-3 text-xl font-black">
                <FileText className="h-6 w-6" />
                Conteúdo do Artigo Final
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div>
                <Label htmlFor="title" className="text-red-700 font-bold text-lg mb-3 block">
                  Título do Artigo *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Digite o título do artigo..."
                  className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-lg p-4 shadow-lg"
                />
              </div>

              <div>
                <Label htmlFor="slug" className="text-red-700 font-bold mb-3 block">
                  URL Amigável (Slug)
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="meu-artigo-sobre-tatuagem"
                  className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 shadow-lg"
                />
              </div>

              <div>
                <Label htmlFor="excerpt" className="text-red-700 font-bold mb-3 block">
                  Resumo do Artigo
                </Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Breve descrição do artigo..."
                  rows={4}
                  className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 shadow-lg resize-none"
                />
              </div>

              <div>
                <Label className="text-red-700 font-bold text-lg mb-3 block">
                  Conteúdo do Artigo *
                </Label>
                <div className="border-2 border-red-200 rounded-lg shadow-lg overflow-hidden">
                  <EnhancedRichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Configurações e Metadados */}
        <div className="space-y-8">
          {/* Card de Publicação */}
          <Card className="bg-white border-2 border-red-200 shadow-2xl shadow-red-500/20">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-lg p-4">
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Publicação
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="status" className="text-red-700 font-bold mb-2 block">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none shadow-lg bg-white"
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Arquivado</option>
                </select>
              </div>

              <div>
                <Label htmlFor="published_at" className="text-red-700 font-bold mb-2 block">Data de Publicação</Label>
                <Input
                  id="published_at"
                  type="date"
                  value={formData.published_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
                  className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 shadow-lg"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-red-700 font-bold mb-2 block">Categoria</Label>
                <select
                  id="category"
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none shadow-lg bg-white"
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

          {/* CARD DE ESTRATÉGIA DE CONTEÚDO - DESTACADO E VISUAL */}
          <Card className="bg-white border-4 border-blue-300 shadow-2xl shadow-blue-500/30">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-t-lg p-6">
              <CardTitle className="flex items-center justify-between text-xl font-black">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6" />
                  Tags Estratégicas para Análise
                </div>
                <Sparkles className="h-6 w-6 animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Seção de Personas */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300 shadow-lg">
                <Label className="text-blue-800 font-black text-lg mb-4 flex items-center gap-3 block">
                  <Users className="h-6 w-6" />
                  Personas Alvo
                  <Badge className="bg-blue-600 text-white">Para Análise</Badge>
                </Label>
                
                <div className="space-y-3 max-h-48 overflow-y-auto bg-white p-4 rounded-lg border-2 border-blue-200">
                  {personas.length > 0 ? (
                    personas.map((persona) => (
                      <div key={persona.id} className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <Checkbox
                          id={`persona-${persona.id}`}
                          checked={formData.focusPersonas.includes(persona.id)}
                          onCheckedChange={() => togglePersona(persona.id)}
                          className="border-blue-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <Label
                          htmlFor={`persona-${persona.id}`}
                          className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-800 cursor-pointer"
                        >
                          {persona.name}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-blue-600 text-sm italic text-center py-4">Nenhuma persona disponível</p>
                  )}
                </div>
                
                {formData.focusPersonas.length > 0 && (
                  <div className="mt-4 bg-white p-3 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <p className="text-sm text-blue-700 font-bold">Personas Selecionadas:</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.focusPersonas.map(personaId => {
                        const persona = personas.find(p => p.id === personaId);
                        return (
                          <Badge key={personaId} className="bg-blue-600 text-white border border-blue-400 shadow-md">
                            {persona?.name || personaId}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Seção de Jornada de Compra */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-300 shadow-lg">
                <Label className="text-purple-800 font-black text-lg mb-4 flex items-center gap-3 block">
                  <Target className="h-6 w-6" />
                  Etapa da Jornada de Compra
                  <Badge className="bg-purple-600 text-white">Para Análise</Badge>
                </Label>
                
                <select
                  value={formData.purchaseStage}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchaseStage: e.target.value }))}
                  className="w-full px-4 py-4 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none shadow-lg bg-white text-purple-800 font-bold"
                >
                  <option value="">Selecione uma etapa</option>
                  {purchaseStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
                
                {formData.purchaseStage && (
                  <div className="mt-4 bg-white p-3 rounded-lg border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      <p className="text-sm text-purple-700 font-bold">Etapa Selecionada:</p>
                    </div>
                    <Badge className="bg-purple-600 text-white border border-purple-400 shadow-md">
                      {formData.purchaseStage}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Resumo das Tags Estratégicas */}
              {(formData.focusPersonas.length > 0 || formData.purchaseStage) && (
                <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg border-2 border-green-300">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <p className="font-bold text-green-800">Tags Estratégicas Configuradas</p>
                  </div>
                  <p className="text-sm text-green-700">
                    Este artigo será rastreado para análise de performance com as personas e etapas selecionadas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card de Imagem Destacada */}
          <Card className="bg-white border-2 border-purple-200 shadow-2xl shadow-purple-500/20">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-t-lg p-4">
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Imagem Destacada
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {formData.cover_image && (
                <div className="relative">
                  <img
                    src={formData.cover_image}
                    alt="Imagem destacada"
                    className="w-full h-32 object-cover rounded-lg shadow-lg border-2 border-purple-200"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
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
                  className="border-purple-200 focus:border-purple-500 shadow-lg"
                />
              </div>
              <div>
                <Input
                  value={formData.cover_image}
                  onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                  placeholder="Ou cole a URL da imagem..."
                  className="border-purple-200 focus:border-purple-500 shadow-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card de Tags */}
          <Card className="bg-white border-2 border-green-200 shadow-2xl shadow-green-500/20">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-t-lg p-4">
              <CardTitle className="flex items-center gap-2">
                <Tags className="h-5 w-5" />
                Tags do Artigo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Nova tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="border-green-200 focus:border-green-500 shadow-lg"
                />
                <Button 
                  onClick={addTag} 
                  disabled={!currentTag.trim()}
                  className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white shadow-lg"
                >
                  +
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 transition-colors">
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

          {/* Card de SEO */}
          <Card className="bg-white border-2 border-orange-200 shadow-2xl shadow-orange-500/20">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-t-lg p-4">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="meta_title" className="text-orange-700 font-bold mb-2 block">Meta Título</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="Título para SEO..."
                  className="border-orange-200 focus:border-orange-500 shadow-lg"
                />
              </div>
              <div>
                <Label htmlFor="meta_description" className="text-orange-700 font-bold mb-2 block">Meta Descrição</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Descrição para SEO..."
                  rows={3}
                  className="border-orange-200 focus:border-orange-500 shadow-lg resize-none"
                />
              </div>
              <div>
                <Label htmlFor="meta_keywords" className="text-orange-700 font-bold mb-2 block">Palavras-chave</Label>
                <Input
                  id="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                  placeholder="palavra1, palavra2, palavra3..."
                  className="border-orange-200 focus:border-orange-500 shadow-lg"
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
