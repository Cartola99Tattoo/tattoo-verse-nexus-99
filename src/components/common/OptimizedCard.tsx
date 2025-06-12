
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OptimizedCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "tattoo" | "tattooRed";
  headerVariant?: "default" | "red";
  loading?: boolean;
}

/**
 * Card otimizado com memoização e identidade visual 99Tattoo
 */
export const OptimizedCard = memo<OptimizedCardProps>(({ 
  title, 
  children, 
  className, 
  variant = "tattoo",
  headerVariant = "red",
  loading = false 
}) => {
  if (loading) {
    return (
      <Card variant={variant} className={cn("animate-pulse", className)}>
        <CardHeader variant={headerVariant}>
          <div className="h-6 bg-red-200 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      variant={variant} 
      className={cn(
        "transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
        "bg-gradient-to-br from-white to-red-50 border-red-200",
        className
      )}
    >
      {title && (
        <CardHeader variant={headerVariant}>
          <CardTitle className="text-red-800 font-black">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

export default OptimizedCard;
