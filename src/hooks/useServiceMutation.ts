
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceError } from '@/services/base/BaseService';
import { toast } from '@/hooks/use-toast';

interface UseServiceMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData) => void;
  onError?: (error: ServiceError) => void;
  invalidateQueries?: string[];
  successMessage?: string;
  errorMessage?: string;
}

export function useServiceMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseServiceMutationOptions<TData, TVariables> = {}
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      // Invalidate related queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }

      // Show success message
      if (options.successMessage) {
        toast({
          title: "Sucesso",
          description: options.successMessage,
        });
      }

      // Call custom success handler
      options.onSuccess?.(data);
    },
    onError: (error: any) => {
      console.error('Service mutation error:', error);

      let errorMessage = options.errorMessage || 'Ocorreu um erro inesperado';
      
      if (error instanceof ServiceError) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });

      // Call custom error handler
      options.onError?.(error);
    },
  });
}
