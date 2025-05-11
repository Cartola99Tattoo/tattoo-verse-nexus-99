
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useUploadBlogImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      try {
        console.log("[useUploadBlogImage] Uploading image:", file.name);
        
        // Generate a unique filename
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        
        // Upload the file to Supabase Storage
        const { data, error } = await supabase.storage
          .from('blog_images')
          .upload(`uploads/${fileName}`, file);
          
        if (error) {
          console.error("[useUploadBlogImage] Upload error:", error);
          throw error;
        }
        
        console.log("[useUploadBlogImage] Image uploaded successfully:", data.path);
        
        // Get the public URL of the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('blog_images')
          .getPublicUrl(data.path);
          
        console.log("[useUploadBlogImage] Public URL:", publicUrl);
        return publicUrl;
      } catch (error) {
        console.error("[useUploadBlogImage] Error:", error);
        toast({
          title: "Erro ao fazer upload",
          description: "Não foi possível fazer o upload da imagem. Tente novamente.",
          variant: "destructive",
        });
        throw error;
      }
    }
  });
};
