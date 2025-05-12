
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Image, Save, X, Eye, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { BlogPost } from '@/types/blog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { useBlogCategories } from '@/hooks/useBlogCategories';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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

const BlogPostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  const { data: categories = [] } = useBlogCategories();
  
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
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Fetch post data if editing
  const { data: post, isLoading: loadingPost } = useQuery({
    queryKey: ['blog-post-edit', id],
    queryFn: async () => {
      if (!isEditing) return null;
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as BlogPost;
    },
    enabled: isEditing,
    onError: (error) => {
      console.error('Error fetching post:', error);
      toast({
        title: "Error loading post",
        description: "Could not load the post for editing",
        variant: "destructive",
      });
      navigate('/admin/blog');
    }
  });
  
  // Set form values from post data when available
  useEffect(() => {
    if (post) {
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
    }
  }, [post]);
  
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
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formValues.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formValues.content.trim()) {
      errors.content = 'Content is required';
    }
    
    if (!formValues.category_id) {
      errors.category_id = 'Category is required';
    }
    
    if (!formValues.slug.trim()) {
      errors.slug = 'Slug is required';
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
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      
      toast({
        title: "Draft saved",
        description: "The post has been saved as a draft.",
      });
      
      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error saving draft",
        description: error.message || "Could not save the draft. Try again later.",
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
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      
      toast({
        title: "Post published",
        description: formValues.published_at && formValues.published_at > new Date() 
          ? "The post has been scheduled for publication."
          : "The post has been published successfully.",
      });
      
      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Error publishing post:', error);
      toast({
        title: "Error publishing post",
        description: error.message || "Could not publish the post. Try again later.",
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

  if (loadingPost) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center">
            <p className="text-lg text-gray-600">Loading post...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>{isEditing ? 'Edit Post' : 'New Post'} | 99Tattoo Admin</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/admin/blog')} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Edit Post' : 'New Post'}
            </h1>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-2">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={isSaving || isPublishing || loading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button 
              onClick={handlePublish}
              disabled={isSaving || isPublishing || loading}
            >
              <Eye className="mr-2 h-4 w-4" />
              {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                    <Input 
                      id="title"
                      name="title"
                      value={formValues.title}
                      onChange={handleInputChange}
                      placeholder="Post title"
                      className={formErrors.title ? 'border-red-500' : ''}
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                    )}
                  </div>
                  
                  {/* Slug */}
                  <div>
                    <Label htmlFor="slug">
                      URL Slug <span className="text-red-500">*</span>
                      <span className="text-gray-500 text-xs ml-2">
                        (E.g.: /blog/{formValues.slug || 'post-title'})
                      </span>
                    </Label>
                    <Input 
                      id="slug"
                      name="slug"
                      value={formValues.slug}
                      onChange={handleInputChange}
                      placeholder="post-title"
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
                    Content <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-1">
                    <Textarea 
                      id="content"
                      name="content"
                      value={formValues.content}
                      onChange={handleInputChange}
                      placeholder="Write post content..."
                      rows={15}
                      className={`resize-y min-h-[300px] ${formErrors.content ? 'border-red-500' : ''}`}
                    />
                    {formErrors.content && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500 flex justify-between">
                    <span>Words: {wordCount}</span>
                    <span>Characters: {charCount}</span>
                    <span>Reading time: {readingTime} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Excerpt */}
            <Card>
              <CardContent className="pt-6">
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <div className="mt-1">
                    <Textarea 
                      id="excerpt"
                      name="excerpt"
                      value={formValues.excerpt}
                      onChange={handleInputChange}
                      placeholder="Write a brief summary of the post..."
                      rows={3}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    This text will be displayed in cards and post listings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Post Settings</h3>
                
                {/* Category */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
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
                        className={formErrors.category_id ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Select category" />
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
                  
                  {/* Tags */}
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="mt-1">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Add tag and press Enter"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formValues.tags.map((tag) => (
                        <div 
                          key={tag} 
                          className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm flex items-center"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-gray-500 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Featured Image */}
                  <div>
                    <Label htmlFor="cover_image">Featured Image URL</Label>
                    <div className="mt-1">
                      <Input
                        id="cover_image"
                        name="cover_image"
                        value={formValues.cover_image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    {formValues.cover_image && (
                      <div className="mt-2 rounded-md overflow-hidden max-h-40">
                        <img
                          src={formValues.cover_image}
                          alt="Featured"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                          }}
                        />
                      </div>
                    )}
                    {!formValues.cover_image && (
                      <div className="mt-2 bg-gray-100 rounded-md p-8 flex items-center justify-center">
                        <Image className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Featured image for social sharing and listings.
                    </p>
                  </div>
                  
                  {/* Publication Date */}
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="published_at">Publication Date</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formValues.published_at !== null}
                          onCheckedChange={(checked) => {
                            setFormValues(prev => ({
                              ...prev,
                              published_at: checked ? new Date() : null
                            }));
                          }}
                        />
                        <span className="text-sm">
                          {formValues.published_at !== null ? 'Scheduled' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    {formValues.published_at !== null && (
                      <div className="mt-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formValues.published_at ? (
                                format(formValues.published_at, 'PPP', { locale: ptBR })
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formValues.published_at || undefined}
                              onSelect={(date) => {
                                setFormValues(prev => ({
                                  ...prev,
                                  published_at: date || new Date()
                                }));
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* SEO */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <div className="mt-1">
                      <Textarea
                        id="meta_description"
                        name="meta_description"
                        value={formValues.meta_description}
                        onChange={handleInputChange}
                        placeholder="Brief description for search engines..."
                        rows={3}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formValues.meta_description.length}/160 characters (recommended)
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="meta_keywords">Meta Keywords</Label>
                    <div className="mt-1">
                      <Input
                        id="meta_keywords"
                        name="meta_keywords"
                        value={formValues.meta_keywords}
                        onChange={handleInputChange}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Comma-separated list of keywords
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Instructions */}
            <Card className="bg-blue-50 border border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-2">
                  <div>
                    <h3 className="text-lg font-medium text-blue-800 mb-2">Posting Tips</h3>
                    <ul className="text-blue-800 text-sm list-disc pl-4 space-y-1">
                      <li>Use clear, descriptive titles</li>
                      <li>Include relevant images</li>
                      <li>Structure content with headings</li>
                      <li>Keep paragraphs short and readable</li>
                      <li>Add tags to improve discoverability</li>
                      <li>Schedule posts during peak engagement times</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogPostEditor;
