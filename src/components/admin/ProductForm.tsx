
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Tag, Trash, Upload, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Predefined options for checkboxes and selects
const sizeOptions = [
  { id: "pequeno", label: "Pequeno" },
  { id: "medio", label: "Médio" },
  { id: "grande", label: "Grande" },
  { id: "personalizado", label: "Personalizado" },
];

const bodyLocationOptions = [
  { id: "braco", label: "Braço" },
  { id: "perna", label: "Perna" },
  { id: "costas", label: "Costas" },
  { id: "peito", label: "Peito" },
  { id: "pescoco", label: "Pescoço" },
  { id: "mao", label: "Mão" },
  { id: "pe", label: "Pé" },
  { id: "rosto", label: "Rosto" },
  { id: "outro", label: "Outro" },
];

const styleTags = [
  "PopUp", "Old School", "New School", "Tribal", "Aquarela", 
  "Blackwork", "Tradicional", "Realista", "Minimalista", "Geométrico"
];

// Product status options
const statusOptions = [
  { value: "available", label: "Disponível" },
  { value: "unavailable", label: "Indisponível" },
  { value: "limited", label: "Limitado" },
];

// Schema for product form validation
const productSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  description: z.string().optional(),
  price: z.coerce.number().positive({ message: "Preço deve ser um valor positivo" }),
  category_id: z.string().optional(),
  artist_id: z.string().optional(),
  status: z.string({ required_error: "Selecione um status" }),
  images: z.array(z.string()).optional(),
  average_time: z.string().optional(),
  sizes: z.array(z.string()).optional().default([]),
  body_locations: z.array(z.string()).optional().default([]),
  style_tags: z.array(z.string()).optional().default([]),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void;
  onCancel: () => void;
  categories: { id: string; name: string }[];
  artists: { id: string; first_name: string; last_name: string }[];
  isSubmitting: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  categories,
  artists,
  isSubmitting
}) => {
  // Local state for image handling
  const [newTag, setNewTag] = useState("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || []);

  // Initialize the form with default values or initial data for editing
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      status: initialData?.status || "available",
      category_id: initialData?.category_id || "",
      artist_id: initialData?.artist_id || "",
      images: initialData?.images || [],
      average_time: initialData?.average_time || "",
      sizes: initialData?.sizes || [],
      body_locations: initialData?.body_locations || [],
      style_tags: initialData?.style_tags || [],
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData?.images) {
      setImageUrls(initialData.images);
    }
  }, [initialData]);

  // Handle image file selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    const maxFiles = 5 - (imageUrls.length + previewImages.length);
    const filesToProcess = files.slice(0, maxFiles);
    
    if (filesToProcess.length < files.length) {
      alert(`Apenas ${maxFiles} imagens adicionais podem ser carregadas. O limite é de 5 imagens.`);
    }
    
    filesToProcess.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove preview image
  const removePreviewImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove URL image
  const removeUrlImage = (index: number) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
    form.setValue("images", newImageUrls);
  };

  // Add URL image
  const addUrlImage = (url: string) => {
    if (imageUrls.length + previewImages.length >= 5) {
      alert("Não é possível adicionar mais de 5 imagens");
      return;
    }
    
    if (url.trim() === "") return;
    
    const newImageUrls = [...imageUrls, url];
    setImageUrls(newImageUrls);
    form.setValue("images", newImageUrls);
  };

  // Handle tag input
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const currentTags = form.getValues("style_tags") || [];
    if (currentTags.includes(newTag)) {
      setNewTag("");
      return;
    }
    
    form.setValue("style_tags", [...currentTags, newTag]);
    setNewTag("");
  };

  // Remove a tag
  const removeTag = (tag: string) => {
    const currentTags = form.getValues("style_tags") || [];
    form.setValue(
      "style_tags", 
      currentTags.filter(t => t !== tag)
    );
  };

  // Handle form submission
  const handleSubmit = (values: ProductFormValues) => {
    // Combine URL and preview images
    // In a real app, you'd upload the preview images first
    onSubmit({
      ...values,
      images: imageUrls,
    });
  };

  return (
    <ScrollArea className="max-h-[70vh]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 px-1 py-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Produto</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do produto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descrição do produto"
                    className="min-h-[100px]"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="average_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo Médio</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Clock className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Ex: 2 horas, 30 min" 
                        className="pl-8"
                        {...field}
                        value={field.value || ""}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Tempo médio para realizar a tatuagem
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="artist_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artista</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um artista" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {artists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id}>
                          {`${artist.first_name} ${artist.last_name}`.trim()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tamanhos */}
          <FormField
            control={form.control}
            name="sizes"
            render={() => (
              <FormItem>
                <FormLabel>Tamanhos</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="sizes"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-center space-x-1 space-y-0 rounded-md border p-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  return checked
                                    ? field.onChange([...currentValue, option.id])
                                    : field.onChange(
                                        currentValue.filter((value) => value !== option.id)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Locais do corpo recomendados */}
          <FormField
            control={form.control}
            name="body_locations"
            render={() => (
              <FormItem>
                <FormLabel>Locais do corpo recomendados</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {bodyLocationOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="body_locations"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-center space-x-1 space-y-0 rounded-md border p-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  return checked
                                    ? field.onChange([...currentValue, option.id])
                                    : field.onChange(
                                        currentValue.filter((value) => value !== option.id)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags de estilos */}
          <FormField
            control={form.control}
            name="style_tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags de estilos</FormLabel>
                <div className="space-y-3">
                  {/* Input para adicionar tags */}
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Adicionar tag de estilo..."
                        className="pl-8"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        list="style-suggestions"
                      />
                      <datalist id="style-suggestions">
                        {styleTags.map((tag) => (
                          <option key={tag} value={tag} />
                        ))}
                      </datalist>
                    </div>
                    <Button type="button" onClick={handleAddTag}>Adicionar</Button>
                  </div>

                  {/* Tags selecionadas */}
                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((tag) => (
                      <Badge key={tag} className="px-3 py-1.5 cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} <Trash className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Imagens */}
          <FormItem>
            <FormLabel>Imagens</FormLabel>
            <div className="space-y-3">
              {/* Upload de arquivo */}
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Arraste e solte imagens aqui ou clique para selecionar</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF até 5MB (máximo 5 imagens)</p>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* URL de imagem */}
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Image className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Ou insira URL da imagem..."
                    className="pl-8"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addUrlImage((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                </div>
                <Button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling?.querySelector('input');
                    if (input) {
                      addUrlImage(input.value);
                      input.value = '';
                    }
                  }}
                >
                  Adicionar
                </Button>
              </div>

              {/* Visualização das imagens */}
              <div className="grid grid-cols-3 gap-2">
                {/* Imagens da URL */}
                {imageUrls.map((url, index) => (
                  <div key={`url-${index}`} className="relative aspect-square rounded-md overflow-hidden border">
                    <img src={url} alt={`Imagem ${index + 1}`} className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => removeUrlImage(index)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {/* Previews das imagens carregadas */}
                {previewImages.map((preview, index) => (
                  <div key={`preview-${index}`} className="relative aspect-square rounded-md overflow-hidden border">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => removePreviewImage(index)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <FormMessage />
          </FormItem>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : initialData ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default ProductForm;
