
import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook para otimizações de performance
 */
export function usePerformanceOptimization() {
  const mountedRef = useRef(true);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Cleanup function para evitar vazamentos de memória
  const cleanup = useCallback(() => {
    mountedRef.current = false;
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
  }, []);

  // Safe async function que só executa se o componente ainda estiver montado
  const safeAsync = useCallback(<T,>(asyncFn: () => Promise<T>) => {
    return new Promise<T>((resolve, reject) => {
      if (!mountedRef.current) return;
      
      asyncFn()
        .then(result => {
          if (mountedRef.current) resolve(result);
        })
        .catch(error => {
          if (mountedRef.current) reject(error);
        });
    });
  }, []);

  // Safe timeout que é limpo automaticamente
  const safeTimeout = useCallback((callback: () => void, delay: number) => {
    const timeout = setTimeout(() => {
      if (mountedRef.current) {
        callback();
        timeoutRefs.current = timeoutRefs.current.filter(t => t !== timeout);
      }
    }, delay);
    
    timeoutRefs.current.push(timeout);
    return timeout;
  }, []);

  // Debounce otimizado
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = safeTimeout(() => func(...args), delay);
    };
  }, [safeTimeout]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    safeAsync,
    safeTimeout,
    debounce,
    cleanup,
    isMounted: () => mountedRef.current
  };
}

export default usePerformanceOptimization;
