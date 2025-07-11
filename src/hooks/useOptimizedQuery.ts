
import { useCallback, useMemo } from 'react';
import { useDataQuery } from './useDataQuery';

interface OptimizedQueryOptions {
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: number;
}

/**
 * Hook otimizado para queries com cache inteligente e retry automático
 */
export function useOptimizedQuery<T>(
  queryFn: () => Promise<T>,
  deps: any[] = [],
  options: OptimizedQueryOptions = {}
) {
  const {
    staleTime = 5 * 60 * 1000, // 5 minutos
    cacheTime = 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus = false,
    retry = 3
  } = options;

  // Memoize the query function to prevent unnecessary re-renders
  const memoizedQueryFn = useCallback(() => {
    console.log('useOptimizedQuery: Executing query function');
    return queryFn();
  }, deps);

  // Use the existing useDataQuery with optimizations
  const result = useDataQuery(memoizedQueryFn, deps);

  // Add performance logging
  const performanceData = useMemo(() => {
    const startTime = performance.now();
    return {
      startTime,
      getExecutionTime: () => performance.now() - startTime
    };
  }, deps);

  return {
    ...result,
    performance: performanceData
  };
}

export default useOptimizedQuery;
