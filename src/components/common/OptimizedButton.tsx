
import React, { memo } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OptimizedButtonProps extends ButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
}

/**
 * Botão otimizado com identidade visual 99Tattoo
 */
export const OptimizedButton = memo<OptimizedButtonProps>(({ 
  children, 
  loading = false,
  icon,
  className,
  variant = "tattoo",
  disabled,
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      disabled={disabled || loading}
      className={cn(
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "before:transform before:-skew-x-12 before:translate-x-[-100%]",
        "hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        "shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105",
        loading && "animate-pulse",
        className
      )}
      {...props}
    >
      <div className="relative z-10 flex items-center gap-2">
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : icon}
        {children}
      </div>
    </Button>
  );
});

OptimizedButton.displayName = 'OptimizedButton';

export default OptimizedButton;
