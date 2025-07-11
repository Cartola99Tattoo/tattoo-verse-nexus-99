
import React, { memo, Suspense, lazy } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LazyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
  </div>
);

/**
 * Modal otimizado com lazy loading e identidade visual 99Tattoo
 */
export const LazyModal = memo<LazyModalProps>(({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`
          max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-auto 
          bg-gradient-to-br from-white to-red-50 border-red-200
          ${className}
        `}
      >
        <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-4 rounded-lg -mx-6 -mt-6 mb-6">
          <DialogTitle className="text-xl font-black">{title}</DialogTitle>
        </DialogHeader>
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </DialogContent>
    </Dialog>
  );
});

LazyModal.displayName = 'LazyModal';

export default LazyModal;
