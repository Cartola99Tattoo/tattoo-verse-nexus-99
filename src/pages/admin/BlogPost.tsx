import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Image, Save, X, Eye, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { BlogPost } from '@/hooks/useBlogPost';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';

// Extend the BlogPost type to ensure it includes all the properties we need
interface ExtendedBlogPost extends BlogPost {
  is_draft?: boolean;
}

interface FormValues {
  title: string;
  content: string;
  excerpt: string;
  category_id: string;
  tags: string[];
  published_at: Date | null;
  cover_image: string;
  is_draft: boolean;
  slug: string;
  meta_description: string;
  meta_keywords: string;
}

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);
  
  // Form state
  const [formValues, setFormValues] = useState<FormValues>({
    title: '',
    content: '',
    excerpt: '',
    category_id: '',
    tags: [],
    published_at: null,
    cover_image: '',
    is_draft: true,
    slug: '',
    meta_description: '',
    meta_keywords: '',
  });
  
  // Additional state
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Refs
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchPost();
    }
  }, [id]);
  
  // Update metadata when content changes
  useEffect(() => {
    const content = formValues.content;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const chars = content.length;
    
    // Calculate reading time (average reading speed is ~200-250 words per minute)
    const time = Math.ceil(words / 200);
    
    setWordCount(words);
    setCharCount(chars);
    setReadingTime(time);
  }, [formValues.content]);
  
  // Generate slug from title
  useEffect(() => {
    if (!isEditing || !formValues.slug) {
      const slug = formValues.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      
      setFormValues(prev => ({ ...prev, slug }));
    }
  }, [formValues.title, isEditing]);
  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('id, name')
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
    }
  };
  
  const fetchPost = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Artigo não encontrado",
          description: "O artigo que você está tentando editar não existe.",
          variant: "destructive",
        });
        navigate('/admin/blog');
        return;
      }
      
      const post = data as ExtendedBlogPost;
      
      setFormValues({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        category_id: post.category_id || '',
        tags: post.tags || [],
        published_at: post.published_at ? new Date(post.published_at) : null,
        cover_image: post.cover_image || '',
        is_draft: post.is_draft ?? true,
        slug: post.slug || '',
        meta_description: post.meta_description || '',
        meta_keywords: post.meta_keywords || '',
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: "Erro ao carregar artigo",
        description: "Não foi possível carregar o artigo para edição.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formValues.title.trim()) {
      errors.title = 'O título é obrigatório';
    }
    
    if (!formValues.content.trim()) {
      errors.content = 'O conteúdo é obrigatório';
    }
    
    if (!formValues.category_id) {
      errors.category_id = 'A categoria é obrigatória';
    }
    
    if (!formValues.slug.trim()) {
      errors.slug = 'O slug é obrigatório';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSaveDraft = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSaving(true);
      
      const postData = {
        title: formValues.title,
        content: formValues.content,
        excerpt: formValues.excerpt || null,
        category_id: formValues.category_id,
        tags: formValues.tags,
        published_at: null, // No publication date for drafts
        cover_image: formValues.cover_image || null,
        is_draft: true,
        slug: formValues.slug,
        meta_description: formValues.meta_description || null,
        meta_keywords: formValues.meta_keywords || null,
        reading_time: readingTime || null,
        author_id: user?.id,
      };
      
      let result;
      
      if (isEditing) {
        // Update existing post
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);
      } else {
        // Create new post
        result = await supabase
          .from('blog_posts')
          .insert(postData);
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: "Rascunho salvo",
        description: "O artigo foi salvo como rascunho com sucesso.",
      });
      
      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Erro ao salvar rascunho",
        description: "Não foi possível salvar o rascunho. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handlePublish = async () => {
    if (!validateForm()) return;
    
    try {
      setIsPublishing(true);
      
      const postData = {
        title: formValues.title,
        content: formValues.content,
        excerpt: formValues.excerpt || null,
        category_id: formValues.category_id,
        tags: formValues.tags,
        published_at: formValues.published_at || new Date(),
        cover_image: formValues.cover_image || null,
        is_draft: false,
        slug: formValues.slug,
        meta_description: formValues.meta_description || null,
        meta_keywords: formValues.meta_keywords || null,
        reading_time: readingTime || null,
        author_id: user?.id,
      };
      
      let result;
      
      if (isEditing) {
        // Update existing post
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);
      } else {
        // Create new post
        result = await supabase
          .from('blog_posts')
          .insert(postData);
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: "Artigo publicado",
        description: formValues.published_at && formValues.published_at > new Date() 
          ? "O artigo foi agendado para publicação."
          : "O artigo foi publicado com sucesso.",
      });
      
      navigate('/admin/blog');
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Erro ao publicar artigo",
        description: "Não foi possível publicar o artigo. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formValues.tags.includes(tagInput.trim())) {
        setFormValues(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setFormValues(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>{isEditing ? 'Editar Artigo' : 'Novo Artigo'} | 99Tattoo Admin</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/admin/blog')} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Editar Artigo' : 'Novo Artigo'}
            </h1>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-2">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={isSaving || isPublishing || loading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
            </Button>
            <Button 
              onClick={handlePublish}
              disabled={isSaving || isPublishing || loading}
            >
              <Eye className="mr-2 h-4 w-4" />
              {isPublishing ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando artigo...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Title */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título <span className="text-red-500">*</span></Label>
                      <Input 
                        id="title"
                        name="title"
                        value={formValues.title}
                        onChange={handleInputChange}
                        placeholder="Digite o título do artigo"
                        className={formErrors.title ? 'border-red-500' : ''}
                      />
                      {formErrors.title && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                      )}
                    </div>
                    
                    {/* Slug */}
                    <div>
                      <Label htmlFor="slug">
                        URL amigável <span className="text-red-500">*</span>
                        <span className="text-gray-500 text-xs ml-2">
                          (Ex: /blog/{formValues.slug || 'titulo-do-artigo'})
                        </span>
                      </Label>
                      <Input 
                        id="slug"
                        name="slug"
                        value={formValues.slug}
                        onChange={handleInputChange}
                        placeholder="titulo-do-artigo"
                        className={formErrors.slug ? 'border-red-500' : ''}
                      />
                      {formErrors.slug && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.slug}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Content */}
              <Card>
                <CardContent className="pt-6">
                  <div>
                    <Label htmlFor="content">
                      Conteúdo <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-1">
                      <Textarea 
                        id="content"
                        name="content"
                        value={formValues.content}
                        onChange={handleInputChange}
                        placeholder="Digite o conteúdo do artigo..."
                        rows={15}
                        className={`resize-y min-h-[300px] ${formErrors.content ? 'border-red-500' : ''}`}
                        ref={contentRef}
                      />
                      {formErrors.content && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>
                      )}
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-500 flex justify-between">
                      <span>Palavras: {wordCount}</span>
                      <span>Caracteres: {charCount}</span>
                      <span>Tempo de leitura: {readingTime} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Excerpt */}
              <Card>
                <CardContent className="pt-6">
                  <div>
                    <Label htmlFor="excerpt">Resumo</Label>
                    <div className="mt-1">
                      <Textarea 
                        id="excerpt"
                        name="excerpt"
                        value={formValues.excerpt}
                        onChange={handleInputChange}
                        placeholder="Digite um breve resumo do artigo..."
                        rows={3}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Este texto será exibido nos cards e listagens de artigos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Schedule */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">Status e Agendamento</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_draft">Rascunho</Label>
                      <Switch 
                        id="is_draft"
                        checked={formValues.is_draft}
                        onCheckedChange={(checked) => 
                          setFormValues(prev => ({ ...prev, is_draft: checked }))
                        }
                      />
                    </div>
                    
                    <div>
                      <Label>Data de Publicação</Label>
                      <div className="mt-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formValues.published_at ? (
                                format(formValues.published_at, 'PPP HH:mm', { locale: ptBR })
                              ) : (
                                <span className="text-gray-400">Escolha uma data</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formValues.published_at || undefined}
                              onSelect={(date) => 
                                setFormValues(prev => ({ ...prev, published_at: date }))
                              }
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              initialFocus
                            />
                            <div className="border-t p-3">
                              <Input
                                type="time"
                                value={formValues.published_at 
                                  ? format(formValues.published_at, 'HH:mm')
                                  : format(new Date(), 'HH:mm')
                                }
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(':').map(Number);
                                  const date = formValues.published_at || new Date();
                                  date.setHours(hours, minutes);
                                  setFormValues(prev => ({ ...prev, published_at: new Date(date) }));
                                }}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      {formValues.published_at && formValues.published_at > new Date() && (
                        <Alert className="mt-2">
                          <AlertDescription>
                            Este artigo será publicado automaticamente em{' '}
                            {format(formValues.published_at, 'PPP', { locale: ptBR })}{' '}
                            às {format(formValues.published_at, 'HH:mm', { locale: ptBR })}.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Category */}
              <Card>
                <CardContent className="pt-6">
                  <div>
                    <Label htmlFor="category_id">
                      Categoria <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formValues.category_id}
                      onValueChange={(value) => {
                        setFormValues(prev => ({ ...prev, category_id: value }));
                        if (formErrors.category_id) {
                          setFormErrors(prev => ({ ...prev, category_id: '' }));
                        }
                      }}
                    >
                      <SelectTrigger 
                        className={`mt-1 ${formErrors.category_id ? 'border-red-500' : ''}`}
                      >
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.category_id && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.category_id}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Tags */}
              <Card>
                <CardContent className="pt-6">
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="mt-1">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Digite uma tag e pressione Enter"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formValues.tags.map((tag, index) => (
                          <div 
                            key={index}
                            className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md flex items-center text-sm"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Pressione Enter após cada tag para adicioná-la.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Featured Image */}
              <Card>
                <CardContent className="pt-6">
                  <div>
                    <Label htmlFor="cover_image">Imagem de Destaque</Label>
                    <div className="mt-1">
                      <Input
                        id="cover_image"
                        name="cover_image"
                        value={formValues.cover_image}
                        onChange={handleInputChange}
                        placeholder="URL da imagem"
                      />
                    </div>
                    
                    {formValues.cover_image && (
                      <div className="mt-2 relative rounded-md overflow-hidden aspect-video">
                        <img
                          src={formValues.cover_image}
                          alt="Imagem de destaque"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/800x450?text=Imagem+invalida';
                          }}
                        />
                      </div>
                    )}
                    
                    {!formValues.cover_image && (
                      <div className="mt-2 bg-gray-100 rounded-md flex items-center justify-center aspect-video">
                        <div className="text-center text-gray-400">
                          <Image className="h-10 w-10 mx-auto" />
                          <p className="mt-1">Nenhuma imagem</p>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-500 mt-2">
                      URL da imagem que será exibida como destaque do artigo.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* SEO */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">SEO</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="meta_description">Meta Descrição</Label>
                      <Textarea 
                        id="meta_description"
                        name="meta_description"
                        value={formValues.meta_description}
                        onChange={handleInputChange}
                        placeholder="Descrição para mecanismos de busca"
                        rows={2}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recomendado: até 155 caracteres
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="meta_keywords">Meta Palavras-chave</Label>
                      <Input 
                        id="meta_keywords"
                        name="meta_keywords"
                        value={formValues.meta_keywords}
                        onChange={handleInputChange}
                        placeholder="palavra1, palavra2, palavra3"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separe as palavras-chave por vírgulas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogPostPage;
