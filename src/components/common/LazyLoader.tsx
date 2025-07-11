
import { Suspense, ComponentType, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LazyLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const DefaultFallback = () => (
  <Card className="animate-pulse">
    <CardContent className="p-6">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </CardContent>
  </Card>
);

export const LazyLoader = ({ children, fallback }: LazyLoaderProps) => {
  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      {children}
    </Suspense>
  );
};

// HOC para componentes lazy
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  customFallback?: ReactNode
) {
  return function LazyComponent(props: T) {
    return (
      <LazyLoader fallback={customFallback}>
        <Component {...props} />
      </LazyLoader>
    );
  };
}

export default LazyLoader;
