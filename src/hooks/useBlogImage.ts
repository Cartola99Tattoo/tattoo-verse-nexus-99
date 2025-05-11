
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUploadBlogImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileName = `${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('blog_images')
        .upload(`uploads/${fileName}`, file);
        
      if (error) {
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('blog_images')
        .getPublicUrl(data.path);
        
      return publicUrl;
    }
  });
};
