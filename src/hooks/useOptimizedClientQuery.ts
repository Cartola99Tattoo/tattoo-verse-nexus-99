
import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getClientService } from '@/services/serviceFactory';

interface ClientQueryOptions {
  search?: string;
  status?: string;
  temperature?: string;
  limit?: number;
  select?: string[];
}

/**
 * Hook otimizado para queries de clientes com cache inteligente
 */
export function useOptimizedClientQuery(options: ClientQueryOptions = {}) {
  const clientService = getClientService();
  
  // Memoize query key para evitar re-renders desnecessários
  const queryKey = useMemo(() => 
    ['clients', JSON.stringify(options)], 
    [options.search, options.status, options.temperature, options.limit]
  );

  // Memoize query function
  const queryFn = useCallback(async () => {
    console.log('useOptimizedClientQuery: Fetching clients with options:', options);
    return clientService.fetchClients(options);
  }, [clientService, options.search, options.status, options.temperature, options.limit]);

  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 1,
    select: useCallback((data: any) => {
      // Filtrar apenas campos necessários se especificado
      if (options.select && Array.isArray(data)) {
        return data.map(item => {
          const filtered = {};
          options.select!.forEach(field => {
            if (field in item) filtered[field] = item[field];
          });
          return { ...item, ...filtered };
        });
      }
      return data;
    }, [options.select])
  });
}

export default useOptimizedClientQuery;
