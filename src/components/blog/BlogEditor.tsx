
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogAdmin, useBlogCategories, useUploadBlogImage } from "@/hooks/useBlog";
import { useAuth } from "@/hooks/useAuth";
import { BlogPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Importar um editor WYSIWYG - Usaremos uma implementação simples aqui
// Em um ambiente real, você usaria algo como TinyMCE, CKEditor ou Quill
const SimpleMDE = () => {
  return (
    <div className="border rounded-md p-4">
      <Textarea 
        placeholder="Conteúdo do post..." 
        className="min-h-[300px]"
        id="content" 
        name="content"
      />
      <p className="text-xs text-gray-500 mt-2">
        * Editor simples. Em ambiente de produção, recomendamos o uso de um editor WYSIWYG completo como TinyMCE ou CKEditor.
      </p>
    </div>
  );
};

interface BlogEditorProps {
  post?: BlogPost;
  mode: "create" | "edit";
}

const BlogEditor = ({ post, mode }: BlogEditorProps) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { createPost, updatePost, publishPost } = useBlogAdmin();
  const { categories } = useBlogCategories();
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadBlogImage();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    meta_description: post?.meta_description || "",
    meta_keywords: post?.meta_keywords || "",
    slug: post?.slug || "",
    category_id: post?.category_id || "",
    tags: post?.tags ? post.tags.join(", ") : "",
    cover_image: post?.cover_image || "",
    reading_time: post?.reading_time || 3,
  });
  
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  
  useEffect(() => {
    // Redirecionar se não estiver logado
    if (!session) {
      navigate("/auth");
      return;
    }
    
    // Preencher o formulário se estiver editando um post existente
    if (mode === "edit" && post) {
      setFormData({
        title: post.title || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        meta_description: post.meta_description || "",
        meta_keywords: post.meta_keywords || "",
        slug: post.slug || "",
        category_id: post.category_id || "",
        tags: post.tags ? post.tags.join(", ") : "",
        cover_image: post.cover_image || "",
        reading_time: post.reading_time || 3,
      });
    }
  }, [session, navigate, mode, post]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category_id: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
      
      // Pré-visualização
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, cover_image: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent, shouldPublish = false) => {
    e.preventDefault();
    
    try {
      if (shouldPublish) {
        setIsPublishing(true);
      } else {
        setIsSaving(true);
      }
      
      // Processar as tags
      const tagsArray = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean);
      
      // Fazer upload da imagem de capa, se houver
      let coverImageUrl = formData.cover_image;
      if (coverImageFile) {
        coverImageUrl = await uploadImage(coverImageFile);
      }
      
      // Preparar os dados do post
      const postData: Partial<BlogPost> = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        meta_description: formData.meta_description,
        meta_keywords: formData.meta_keywords,
        slug: formData.slug,
        category_id: formData.category_id || null,
        tags: tagsArray,
        cover_image: coverImageUrl,
        reading_time: parseInt(formData.reading_time.toString()),
        author_id: session?.user.id,
        is_draft: !shouldPublish,
        published_at: shouldPublish ? new Date().toISOString() : null,
      };
      
      let savedPost: BlogPost;
      
      if (mode === "create") {
        // Criar novo post
        savedPost = await createPost(postData);
        toast({
          title: "Post criado com sucesso!",
        });
      } else if (post?.id) {
        // Atualizar post existente
        savedPost = await updatePost(post.id, postData);
        toast({
          title: "Post atualizado com sucesso!",
        });
        
        // Publicar post, se necessário
        if (shouldPublish && post.is_draft) {
          await publishPost(post.id);
          toast({
            title: "Post publicado!",
          });
        }
      } else {
        throw new Error("ID do post não encontrado para edição");
      }
      
      // Redirecionar para a página do post
      navigate(`/blog/${savedPost.slug || savedPost.id}`);
      
    } catch (error: any) {
      toast({
        title: "Erro ao salvar o post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };
  
  return (
    <form className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título do post"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="slug-do-post"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL amigável. Deixe em branco para gerar automaticamente.
            </p>
          </div>
          
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category_id} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sem categoria</SelectItem>
                {categories?.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="excerpt">Resumo</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Um breve resumo do post"
            className="resize-none h-20"
          />
        </div>
        
        <div>
          <Label htmlFor="content">Conteúdo *</Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Conteúdo do post"
            className="resize-none h-64"
            required
          />
          {/* <SimpleMDE /> */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cover_image">Imagem de capa</Label>
            <Input
              id="cover_image"
              name="cover_image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            
            {formData.cover_image && (
              <div className="mt-2">
                <img
                  src={formData.cover_image}
                  alt="Pré-visualização da capa"
                  className="h-32 w-auto object-cover rounded-md"
                />
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="tag1, tag2, tag3"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separadas por vírgula (ex: tatuagem, arte, dicas)
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="reading_time">Tempo de leitura (min)</Label>
            <Input
              id="reading_time"
              name="reading_time"
              value={formData.reading_time}
              onChange={handleChange}
              type="number"
              min="1"
            />
          </div>
          
          <div>
            <Label htmlFor="meta_description">Meta Descrição (SEO)</Label>
            <Input
              id="meta_description"
              name="meta_description"
              value={formData.meta_description}
              onChange={handleChange}
              placeholder="Descrição para motores de busca"
            />
          </div>
          
          <div>
            <Label htmlFor="meta_keywords">Palavras-chave (SEO)</Label>
            <Input
              id="meta_keywords"
              name="meta_keywords"
              value={formData.meta_keywords}
              onChange={handleChange}
              placeholder="tatuagem, arte, 99tattoo"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/blog")}
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          variant="outline"
          disabled={isSaving || isPublishing || isUploading}
          onClick={(e) => handleSubmit(e, false)}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar como rascunho"
          )}
        </Button>
        
        <Button
          type="submit"
          disabled={isSaving || isPublishing || isUploading}
          onClick={(e) => handleSubmit(e, true)}
        >
          {isPublishing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publicando...
            </>
          ) : (
            "Publicar"
          )}
        </Button>
      </div>
    </form>
  );
};

export default BlogEditor;
