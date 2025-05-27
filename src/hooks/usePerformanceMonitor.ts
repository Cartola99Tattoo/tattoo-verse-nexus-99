
import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  loadTime: number;
  interactionTime?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const startTimeRef = useRef<number>(0);
  const mountTimeRef = useRef<number>(0);

  useEffect(() => {
    // Marcar tempo de início do componente
    mountTimeRef.current = performance.now();
    startTimeRef.current = performance.now();

    // Medir performance após o primeiro render
    const measureRenderTime = () => {
      const renderTime = performance.now() - startTimeRef.current;
      const loadTime = performance.now() - mountTimeRef.current;
      
      // Obter uso de memória se disponível
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || undefined;

      const newMetrics: PerformanceMetrics = {
        renderTime,
        loadTime,
        memoryUsage
      };

      setMetrics(newMetrics);

      // Log para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance Monitor] ${componentName}:`, newMetrics);
      }
    };

    // Usar requestIdleCallback se disponível, senão setTimeout
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(measureRenderTime);
    } else {
      setTimeout(measureRenderTime, 0);
    }

    return () => {
      // Cleanup se necessário
    };
  }, [componentName]);

  // Função para marcar interações do usuário
  const markInteraction = (interactionName: string) => {
    const interactionTime = performance.now() - startTimeRef.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance Monitor] ${componentName} - ${interactionName}:`, {
        interactionTime: `${interactionTime.toFixed(2)}ms`
      });
    }

    setMetrics(prev => prev ? {
      ...prev,
      interactionTime
    } : null);
  };

  return {
    metrics,
    markInteraction
  };
};

export default usePerformanceMonitor;
